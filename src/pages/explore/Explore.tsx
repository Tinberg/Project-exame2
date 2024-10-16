import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { Venue } from "../../schemas/venue";
import VenueListCard from "../../components/cards/venueListCard/VenueListCard";
import VenueMapCard from "../../components/cards/venueMapCard/VenueMapCard";
import { Alert, Container, Row, Col, Form } from "react-bootstrap";
import { useVenues } from "../../hooks/useVenues";
import { useGeocode } from "../../hooks/useGeocoding";
import "./explore.scss";
import { sortOptions, continents, center, isValidCoordinate } from "./exploreUtils";

function Explore() {
  // State for sorting and filter
  const [selectedSortOption, setSelectedSortOption] = useState<string>(
    sortOptions[0].value
  );
  const [sortField, setSortField] = useState<string>(sortOptions[0].sortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    sortOptions[0].sortOrder
  );
  // Geocoded venue state from session storage
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

  // State for hovered venue details and geocoding
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
  const navigate = useNavigate();

  // Load Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  // Fetch venues based on sort
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

  // Memo venue list to optimize rendering
  const venues = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  // Filter venues based on selected continentFilter
  const filteredVenues = useMemo(() => {
    if (!continentFilter) {
      return venues;
    }
    return venues.filter(
      (venue) =>
        (venue.location?.continent?.toLowerCase() || "") ===
        continentFilter.toLowerCase()
    );
  }, [venues, continentFilter]);

  // Infinite scrolling load more venues
  const observer = useRef<IntersectionObserver>();
  const lastVenueElementRef = useCallback(
    (node: Element | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // ensure enough venues are loaded t match filter criteria
  const [fetchAttempted, setFetchAttempted] = useState(false);

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

  // Geocode the venue if needed
  const {
    data: latLng,
    isError: isGeocodeError,
    error: geocodeError,
  } = useGeocode(
    hoveredVenue && currentGeocodingVenueId === hoveredVenue.id
      ? {
          address: hoveredVenue.location?.address,
          city: hoveredVenue.location?.city,
          country: hoveredVenue.location?.country,
          continent: hoveredVenue.location?.continent,
        }
      : {}
  );

  // Update geocoded venues state and session storage
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

  // Handle venue hover to show its location on the map
  const handleVenueHover = (venue: Venue) => {
    if (window.innerWidth < 1200) {
      return;
    }

    setUserInteracted(true);
    setHoveredVenue(venue);

    if (geocodedVenues[venue.id]) {
      const cachedLatLng = geocodedVenues[venue.id];
      if (isValidCoordinate(cachedLatLng.lat, cachedLatLng.lng)) {
        setHoveredLatLng(cachedLatLng);
      } else {
        setHoveredLatLng(null);
      }
      setCurrentGeocodingVenueId(null);
    } else if (
      venue.location?.lat != null &&
      venue.location?.lng != null &&
      isValidCoordinate(venue.location.lat, venue.location.lng)
    ) {
      const latLng = { lat: venue.location.lat, lng: venue.location.lng };
      setHoveredLatLng(latLng);
      setGeocodedVenues((prev) => {
        const updatedVenues = { ...prev, [venue.id]: latLng };
        sessionStorage.setItem("geocodedVenues", JSON.stringify(updatedVenues));
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
  };

  // Navigate to venue details page
  const handleVenueClick = (venueId: string) => {
    navigate(`/venueDetails/${venueId}`);
  };

  // Handle sorting changes
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

  // Handle continent filter change
  const handleContinentFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setContinentFilter(e.target.value);
  };

  // Show loading or error messages
  if (!isLoaded) {
    return (
      <Alert variant="info" className="text-center">
        Loading Map...
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Alert variant="info" className="text-center">
        Loading Venues...
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        We’re having trouble loading venues right now. Please try again later.
      </Alert>
    );
  }

  return (
    <Container fluid className="explore-container pb-3">
      <Row>
        <Col>
          <h1 className="text-center mb-5">Explore Venues</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="sortBy">
            <Form.Label>Sort By</Form.Label>
            <Form.Select value={selectedSortOption} onChange={handleSortChange}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="continentFilter">
            <Form.Label>Filter by Continent</Form.Label>
            <Form.Select
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
      <Row>
        <Col
          xxl={4}
          xl={4}
          lg={12}
          className="venues-list overflow-auto left-card"
        >
          <Row>
            {filteredVenues.map((venue: Venue) => (
              <VenueListCard
                key={venue.id}
                venue={venue}
                onHover={handleVenueHover}
                onClick={handleVenueClick}
              />
            ))}
            {venues.length > 0 && (
              <div
                ref={lastVenueElementRef}
                className="infinite-scroll-sentinel"
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
        </Col>
        <Col
          xxl={8}
          xl={8}
          lg={8}
          className="map-container position-sticky d-none d-xl-block"
        >
          {isGeocodeError && (
            <Row>
              <Col>
                <Alert variant="warning" className="text-center">
                  We’re unable to find the exact location for this venue right
                  now.
                  {geocodeError && ` More details: ${geocodeError.message}`}
                </Alert>
              </Col>
            </Row>
          )}
          {!hoveredLatLng && !isGeocodeError && userInteracted && (
            <Row>
              <Col>
                <Alert variant="warning" className="text-center">
                  No valid location found for this venue. Displaying default
                  location.
                </Alert>
              </Col>
            </Row>
          )}
          <GoogleMap
            mapContainerClassName="w-100 h-100"
            zoom={12}
            center={hoveredLatLng ?? center}
          >
            {hoveredLatLng && <Marker position={hoveredLatLng} />}
          </GoogleMap>

          {hoveredVenue && hoveredLatLng && (
            <VenueMapCard
              venue={hoveredVenue}
              onViewDetails={handleVenueClick}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Explore;
