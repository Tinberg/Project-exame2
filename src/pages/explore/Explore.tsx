// components/Explore.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { Venue } from "../../schemas/venue";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import "./explore.scss";
import { useVenues } from "../../hooks/useVenues";
import { useGeocode } from "../../hooks/useGeocoding";
import { useDebounce } from "use-debounce";

// Map center default
const center = {
  lat: 59.911491,
  lng: 10.757933,
};

// Function to validate coordinates
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    lat !== 0 &&
    lng !== 0 &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

function Explore() {
  // State for cached geocoded venues
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

  const [hoveredVenue, setHoveredVenue] = useState<Venue | null>(null);
  const [hoveredLatLng, setHoveredLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [currentGeocodingVenueId, setCurrentGeocodingVenueId] = useState<
    string | null
  >(null);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [continentFilter, setContinentFilter] = useState<string>("");
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [debouncedContinentFilter] = useDebounce(continentFilter, 500);

  const {
    data, // InfiniteData<VenuesResponse> | undefined
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useVenues({
    sort: sortField,
    sortOrder,
    continent: debouncedContinentFilter || undefined,
  });

  const venues = data?.pages.flatMap((page) => page.data) ?? [];

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

  // Update geocoded venues when latLng changes
  useEffect(() => {
    if (hoveredVenue && currentGeocodingVenueId === hoveredVenue.id) {
      if (latLng) {
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
      } else {
        // Geocoding failed, set hoveredLatLng to null
        setHoveredLatLng(null);
      }
      setCurrentGeocodingVenueId(null);
    }
  }, [latLng, hoveredVenue, currentGeocodingVenueId]);

  // Handle venue hover
  const handleVenueHover = (venue: Venue) => {
    if (window.innerWidth < 1200) {
      return;
    }

    setHoveredVenue(venue); // Always set the hovered venue

    if (geocodedVenues[venue.id]) {
      console.log(`Using cached location for venue ${venue.id}`);
      setHoveredLatLng(geocodedVenues[venue.id]);
      setCurrentGeocodingVenueId(null);
    } else if (
      venue.location?.lat != null &&
      venue.location?.lng != null &&
      isValidCoordinate(venue.location.lat, venue.location.lng)
    ) {
      const latLng = { lat: venue.location.lat, lng: venue.location.lng };
      console.log(`Using existing location for venue ${venue.id}`);
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
      console.log(`Calling Geocoding API for venue ${venue.id}`);
      setCurrentGeocodingVenueId(venue.id);
    } else {
      // Venue has no valid location data; remove the marker
      console.log(`No valid location data for venue ${venue.id}`);
      setHoveredLatLng(null);
      setCurrentGeocodingVenueId(null);
    }
  };

  // Handle venue click
  const handleVenueClick = (venueId: string) => {
    navigate(`/venueDetails/${venueId}`);
  };

  // Infinite scrolling
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

  // Handle sort field changes (for the <select>)
  const handleSortFieldChange = (e: React.ChangeEvent<any>) => {
    setSortField((e.target as HTMLSelectElement).value);
  };

  // Handle sort order changes (for the <select>)
  const handleSortOrderChange = (e: React.ChangeEvent<any>) => {
    setSortOrder((e.target as HTMLSelectElement).value as "asc" | "desc");
  };

  // Handle continent filter changes (for the <input>)
  const handleContinentFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContinentFilter(e.target.value);
  };

  // Loading and error states
  if (!isLoaded) return <div>Loading Map...</div>;
  if (isLoading) return <div>Loading Venues...</div>;
  if (error) return <div>Error loading venues: {error.message}</div>;
  if (isGeocodeError)
    return <div>Error fetching location: {geocodeError.message}</div>;

  return (
    <Container fluid className="explore-container py-3">
      <Row>
        <Col>
          <h1 className="text-center">Explore Venues</h1>
        </Col>
      </Row>
      {/* Sort and Filter Controls */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="sortField">
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              value={sortField}
              onChange={handleSortFieldChange}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="maxGuests">Max Guests</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="sortOrder">
            <Form.Label>Sort Order</Form.Label>
            <Form.Control
              as="select"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="continentFilter">
            <Form.Label>Filter by Continent</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter continent"
              onChange={handleContinentFilterChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xxl={4} xl={4} lg={12} className="venues-list overflow-auto">
          <Row>
            {venues.map((venue: Venue, index: number) => {
              if (venues.length === index + 1) {
                return (
                  <Col
                    md={12}
                    key={venue.id}
                    className="mb-3 d-flex align-items-stretch"
                    ref={lastVenueElementRef}
                  >
                    <Card
                      className="h-100 w-100 d-flex flex-row"
                      onMouseEnter={() => handleVenueHover(venue)}
                      onClick={() => handleVenueClick(venue.id)}
                    >
                      {venue.media?.[0]?.url && (
                        <Card.Img
                          variant="left"
                          src={venue.media[0].url}
                          alt={venue.media[0].alt || "Venue image"}
                          className="venue-image w-50"
                        />
                      )}
                      <Card.Body className="d-flex flex-column justify-content-between w-50">
                        <Card.Title className="fw-bold">
                          {venue.name}
                        </Card.Title>
                        <p>
                          {venue.location?.country
                            ? `${
                                venue.location.city
                                  ? venue.location.city + ", "
                                  : ""
                              }${venue.location.country}`
                            : "Location not available"}
                        </p>
                        <p>
                          <span className="fw-bold">Capacity:</span>{" "}
                          {venue.maxGuests} Guests
                        </p>
                        <p>
                          <span className="fw-bold">Price:</span> ${venue.price}
                        </p>
                        <div className="mt-auto">
                          <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => handleVenueClick(venue.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              } else {
                return (
                  <Col
                    md={12}
                    key={venue.id}
                    className="mb-3 d-flex align-items-stretch"
                  >
                    <Card
                      className="h-100 w-100 d-flex flex-row"
                      onMouseEnter={() => handleVenueHover(venue)}
                      onClick={() => handleVenueClick(venue.id)}
                    >
                      {venue.media?.[0]?.url && (
                        <Card.Img
                          variant="left"
                          src={venue.media[0].url}
                          alt={venue.media[0].alt || "Venue image"}
                          className="venue-image w-50"
                        />
                      )}
                      <Card.Body className="d-flex flex-column justify-content-between w-50">
                        <Card.Title className="fw-bold">
                          {venue.name}
                        </Card.Title>
                        <p>
                          {venue.location?.city || venue.location?.country
                            ? `${
                                venue.location.city ? venue.location.city : ""
                              }${
                                venue.location.city && venue.location.country
                                  ? ", "
                                  : ""
                              }${
                                venue.location.country
                                  ? venue.location.country
                                  : ""
                              }`
                            : "Location not available"}
                        </p>
                        <p>
                          <span className="fw-bold">Capacity:</span>{" "}
                          {venue.maxGuests} Guests
                        </p>
                        <p>
                          <span className="fw-bold">Price:</span> ${venue.price}
                        </p>
                        <div className="mt-auto">
                          <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => handleVenueClick(venue.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              }
            })}
            {isFetchingNextPage && (
              <div className="text-center my-3">Loading more venues...</div>
            )}
          </Row>
        </Col>

        <Col
          xxl={8}
          xl={8}
          lg={8}
          className="map-container position-sticky d-none d-xl-block"
        >
          <GoogleMap
            mapContainerClassName="w-100 h-100"
            zoom={12}
            center={hoveredLatLng ?? center}
          >
            {hoveredLatLng && <Marker position={hoveredLatLng} />}
          </GoogleMap>

          {hoveredVenue && hoveredLatLng && (
            <div className="small-venue-card position-absolute">
              <Card>
                {hoveredVenue.media?.[0]?.url && (
                  <Card.Img
                    variant="top"
                    className="small-card-img"
                    src={hoveredVenue.media[0].url}
                    alt={hoveredVenue.media[0].alt || "Venue image"}
                  />
                )}
                <Card.Body>
                  <Card.Title>{hoveredVenue.name}</Card.Title>
                  <p>
                    {hoveredVenue.location?.city ||
                    hoveredVenue.location?.country
                      ? `${
                          hoveredVenue.location.city
                            ? hoveredVenue.location.city
                            : ""
                        }${
                          hoveredVenue.location.city &&
                          hoveredVenue.location.country
                            ? ", "
                            : ""
                        }${
                          hoveredVenue.location.country
                            ? hoveredVenue.location.country
                            : ""
                        }`
                      : "Location not available"}
                  </p>

                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleVenueClick(hoveredVenue.id)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
export default Explore;



