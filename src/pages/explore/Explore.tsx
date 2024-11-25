import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { Venue } from "../../schemas/venue";
import VenueListCard from "../../components/cards/venueListCard/VenueListCard";
import VenueMapCard from "../../components/cards/venueMapCard/VenueMapCard";
import { Alert, Container, Row, Col, Form } from "react-bootstrap";
import { useVenues } from "../../hooks/apiHooks/useVenues";
import { useGeocode } from "../../hooks/apiHooks/useGeocoding";
import {
  sortOptions,
  continents,
  center,
  isValidCoordinate,
} from "./exploreUtils";
import "./explore.scss";

function Explore() {
  //-- State: Sorting Options --//
  const [selectedSortOption, setSelectedSortOption] = useState<string>(
    sortOptions[0].value
  );
  const [sortField, setSortField] = useState<string>(sortOptions[0].sortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    sortOptions[0].sortOrder
  );

  //-- State: Geocoded Venues (Session Storage) --//
  const [geocodedVenues, setGeocodedVenues] = useState<{
    [venueId: string]: { lat: number; lng: number };
  }>(() => {
    const cached = sessionStorage.getItem("geocodedVenues");
    try {
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  //-- State: Hovered Venue Details --//
  const [hoveredVenue, setHoveredVenue] = useState<Venue | null>(null);
  const [hoveredLatLng, setHoveredLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [currentGeocodingVenueId, setCurrentGeocodingVenueId] = useState<
    string | null
  >(null);
  const [continentFilter, setContinentFilter] = useState<string>("");
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const navigate = useNavigate();

  //-- Google Maps API Loading --//
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  //-- Fetch Venues Data based on Sort Options --//
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useVenues({
    sort: sortField,
    sortOrder,
  });

  //-- Memoize Venues for Optimized Rendering --//
  const venues = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  //-- Filter Venues based on Selected Continent --//
  const filteredVenues = useMemo(() => {
    if (!continentFilter) return venues;
    return venues.filter(
      (venue) =>
        (venue.location?.continent?.toLowerCase() || "") ===
        continentFilter.toLowerCase()
    );
  }, [venues, continentFilter]);

  //-- Infinite Scrolling for Venues (Load More) --//
  const observer = useRef<IntersectionObserver>();
  const lastVenueElementRef = useCallback(
    (node: Element | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  //-- Ensure Sufficient Venues for Filter Criteria --//
  useEffect(() => {
    if (
      filteredVenues.length < 20 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetching &&
      !fetchAttempted
    ) {
      fetchNextPage();
      setFetchAttempted(true);
    }
  }, [
    filteredVenues,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchAttempted,
    fetchNextPage,
  ]);

  //-- Geocode Hovered Venue Location if Needed --//
  const { data: latLng, isError: isGeocodeError } = useGeocode(
    hoveredVenue &&
      currentGeocodingVenueId === hoveredVenue.id &&
      (hoveredVenue.location?.address ||
        hoveredVenue.location?.city ||
        hoveredVenue.location?.country ||
        hoveredVenue.location?.continent)
      ? {
          address: hoveredVenue.location?.address,
          city: hoveredVenue.location?.city,
          country: hoveredVenue.location?.country,
          continent: hoveredVenue.location?.continent,
        }
      : null
  );

  //-- Update Geocoded Venues State and Session Storage --//
  useEffect(() => {
    if (hoveredVenue && currentGeocodingVenueId === hoveredVenue.id) {
      if (isGeocodeError) {
        setHoveredLatLng(null);
      } else if (latLng) {
        const updatedLatLng = { lat: latLng.lat, lng: latLng.lng };
        setHoveredLatLng(updatedLatLng);
        setGeocodedVenues((prev) => {
          const updatedVenues = { ...prev, [hoveredVenue.id]: updatedLatLng };
          sessionStorage.setItem(
            "geocodedVenues",
            JSON.stringify(updatedVenues)
          );
          return updatedVenues;
        });
        setCurrentGeocodingVenueId(null);
      }
    }
  }, [latLng, hoveredVenue, currentGeocodingVenueId, isGeocodeError]);

  //-- Handles venue hover to show the location on the map, using cached coordinates if available or fetching new data if the location has changed --//
  const handleVenueHover = (venue: Venue) => {
    if (window.innerWidth < 992) return;

    setUserInteracted(true);
    setHoveredVenue(venue);

    const cachedLatLng = geocodedVenues[venue.id];
    const locationHasChanged =
      !cachedLatLng ||
      venue.location?.lat !== cachedLatLng.lat ||
      venue.location?.lng !== cachedLatLng.lng;

    if (locationHasChanged) {
      if (
        venue.location?.lat != null &&
        venue.location?.lng != null &&
        isValidCoordinate(venue.location.lat, venue.location.lng)
      ) {
        const latLng = { lat: venue.location.lat, lng: venue.location.lng };
        setHoveredLatLng(latLng);
        setGeocodedVenues((prev) => {
          const updatedVenues = { ...prev, [venue.id]: latLng };
          sessionStorage.setItem(
            "geocodedVenues",
            JSON.stringify(updatedVenues)
          );
          return updatedVenues;
        });
        setCurrentGeocodingVenueId(null);
      } else if (
        venue.location?.address ||
        venue.location?.city ||
        venue.location?.country ||
        venue.location?.continent
      ) {
        setHoveredLatLng(null);
        setCurrentGeocodingVenueId(venue.id);
      } else {
        setHoveredLatLng(null);
        setCurrentGeocodingVenueId(null);
      }
    } else {
      setHoveredLatLng(
        isValidCoordinate(cachedLatLng.lat, cachedLatLng.lng)
          ? cachedLatLng
          : null
      );
      setCurrentGeocodingVenueId(null);
    }
  };

  //-- Navigate to Venue Details Page --//
  const handleVenueClick = (venueId: string) => {
    navigate(`/venueDetails/${venueId}`);
  };

  //-- Handle Sorting Changes --//
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedSortOption(selectedValue);
    const selectedOption = sortOptions.find(
      (option) => option.value === selectedValue
    );
    if (selectedOption) {
      setSortField(selectedOption.sortField);
      setSortOrder(selectedOption.sortOrder);
    }
  };

  //-- Handle Continent Filter Change --//
  const handleContinentFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setContinentFilter(e.target.value);
  };

  //-- Loading and Error Handling --//
  if (!isLoaded)
    return (
      <Alert variant="info" className="text-center">
        Loading Map...
      </Alert>
    );
  if (isLoading)
    return (
      <Alert variant="info" className="text-center">
        Loading Venues...
      </Alert>
    );
  if (error)
    return (
      <Alert variant="danger" className="text-center">
        We’re having trouble loading venues right now. Please try again later.
      </Alert>
    );

  return (
    <Container fluid className="explore-container pb-3 mt-5">
      {/* Main Heading Section */}
      <section aria-labelledby="explore-heading">
        <Row>
          <Col>
            <h1 id="explore-heading" className="text-center mb-5">
              Explore Venues
            </h1>
          </Col>
        </Row>
      </section>
      {/* Filter and Sort Section */}
      <section aria-labelledby="filter-section" className="mb-3">
        <Row>
          {/* Sort By Dropdown */}
          <Col md={6}>
            <Form.Group controlId="sortBy">
              <Form.Label id="sort-by-label">Sort By</Form.Label>
              <Form.Select
                aria-labelledby="sort-by-label"
                value={selectedSortOption}
                onChange={handleSortChange}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Filter by Continent Dropdown */}
          <Col md={6}>
            <Form.Group controlId="continentFilter">
              <Form.Label id="continent-filter-label">
                Filter by Continent
              </Form.Label>
              <Form.Select
                aria-labelledby="continent-filter-label"
                value={continentFilter}
                onChange={handleContinentFilterChange}
              >
                <option value="">All Continents</option>
                {continents.map((continent) => (
                  <option key={continent} value={continent}>
                    {continent}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </section>

      {/* Venues List Section and Map */}
      <section aria-label="List of venues">
        <div className="d-flex justify-content-center mt-4 mt-lg-3">
          <div className="venues-list overflow-y-auto">
            <Row className="w-100 m-0">
              {filteredVenues.map((venue: Venue) => (
                <Col className="ps-0 pe-0 " xs={12} key={venue.id}>
                  <VenueListCard
                    venue={venue}
                    buttonTypes={["view"]}
                    onHover={handleVenueHover}
                    onClick={() => handleVenueClick(venue.id)}
                    aria-label={`Venue ${venue.name}`}
                  />
                </Col>
              ))}
              {venues.length > 0 && (
                <div
                  ref={lastVenueElementRef}
                  className="infinite-scroll-sentinel"
                  aria-label="Loading more venues"
                />
              )}
              {isFetchingNextPage && (
                <Alert variant="info" className="text-center my-3">
                  Loading more venues...
                </Alert>
              )}
              {!hasNextPage &&
                !isFetchingNextPage &&
                filteredVenues.length > 0 && (
                  <Alert variant="info" className="text-center my-3">
                    No more venues to load.
                  </Alert>
                )}
              {filteredVenues.length === 0 && !isLoading && (
                <Alert variant="warning" className="text-center my-3">
                  No venues found for the selected continent.
                </Alert>
              )}
            </Row>
          </div>

          {/* Map Container */}
          <div
            className="map-container position-sticky d-none d-lg-block flex-grow-1 ms-3"
            aria-label="Map of venues"
          >
            {/* Invalid location (geocoding failed) */}
            {isGeocodeError && (
              <Row>
                <Col>
                  <Alert variant="warning" className="text-center mb-0">
                    We couldn’t find the exact location for this venue. Please
                    check the address details. Displaying the default location.
                  </Alert>
                </Col>
              </Row>
            )}

            {/* No location set */}
            {!hoveredLatLng && !isGeocodeError && userInteracted && (
              <Row>
                <Col>
                  <Alert variant="warning" className="text-center mb-0">
                    This venue does not have a location set. Displaying the
                    default location.
                  </Alert>
                </Col>
              </Row>
            )}

            {/* Render Google Map */}
            <GoogleMap
              mapContainerClassName="w-100 h-100"
              zoom={12}
              center={hoveredLatLng ?? center}
            >
              {hoveredLatLng && <Marker position={hoveredLatLng} />}
            </GoogleMap>

            {/* Venue details card */}
            {hoveredVenue && hoveredLatLng && (
              <VenueMapCard
                venue={hoveredVenue}
                onViewDetails={handleVenueClick}
              />
            )}
          </div>
        </div>
      </section>
    </Container>
  );
}

export default Explore;
