import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useVenueById } from "../../hooks/apiHooks/useVenues";
import { useGeocode } from "../../hooks/apiHooks/useGeocoding";
import { useWeather } from "../../hooks/generalHooks/useWeather";
import { getWeatherIcon } from "./venueUtils";
import { getUserName } from "../../services/api/authService";
import { Alert, Container, Row, Col, Image, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCoffee,
  faCar,
  faPaw,
  faWifi,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import defaultImage from "../../assets/images/venueImage/noVenueImage.jpg";
import BookingSection from "../../components/calendar/calendar";
import ImageGalleryModal from "../../components/modals/imageGalleryModal/ImageGalleryModal";
import "./venueDetails.scss";

function VenueDetails() {
  const { id } = useParams<{ id: string }>();

  //-- Fetch Venue Data --//
  if (!id) {
    return (
      <Alert variant="warning" className="text-center">
        Invalid venue ID.
      </Alert>
    );
  }

  const {
    data: venue,
    error,
    isLoading,
  } = useVenueById(id, { _owner: true, _bookings: true });

  //-- Fetch Geocoding Data --//
  const {
    data: geocodeData,
    isLoading: isGeocoding,
    error: geocodeError,
  } = useGeocode({
    address: venue?.location.address,
    city: venue?.location.city,
    country: venue?.location.country,
    continent: venue?.location.continent,
  });
  const coordinates =
    venue?.location.lat && venue?.location.lng
      ? { lat: venue.location.lat, lng: venue.location.lng }
      : geocodeData;

  //-- Fetch Weather Data --//
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useWeather(coordinates?.lat ?? null, coordinates?.lng ?? null);
  const weatherIconData =
    weatherData?.weathercode !== undefined
      ? getWeatherIcon(weatherData.weathercode)
      : null;

  //-- Image Modal State --//
  const [showImagesModal, setShowImagesModal] = useState(false);

  const handleShowImagesModal = () => setShowImagesModal(true);
  const handleCloseImagesModal = () => setShowImagesModal(false);

  //-- Refs for Section Scrolling --//
  const detailsRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  //-- Display Helper Function --//
  const displayLocationDetail = (detail?: string) => (
    <span className={detail ? "" : "text-muted"}>
      {detail || "Not available"}
    </span>
  );

  //-- Loading and Error Handling --//
  if (isLoading) {
    return (
      <Alert variant="info" className="text-center">
        Loading Venue Details...
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        We’re having trouble loading venue details right now. Please try again
        later.
      </Alert>
    );
  }

  if (!venue) {
    return (
      <Alert variant="warning" className="text-center">
        Venue not found.
      </Alert>
    );
  }

  return (
    <Container className="venue-details-container mt-5">
      <section aria-labelledby="venue-name">
        <Row>
          {/* Venue Image and Name */}
          <Col md={8} className="position-relative">
            <h1 className="text-break" id="venue-name">
              {venue.name}
            </h1>
            {venue.location.city && venue.location.country ? (
              <p>
                {venue.location.city}, {venue.location.country}
              </p>
            ) : venue.location.city ? (
              <p>{venue.location.city}</p>
            ) : venue.location.country ? (
              <p>{venue.location.country}</p>
            ) : null}

            {/* Main image */}
            <Image
              src={
                venue.media && venue.media.length > 0
                  ? venue.media[0].url
                  : defaultImage
              }
              alt={
                venue.media && venue.media.length > 0
                  ? venue.media[0].alt
                  : "Default venue image"
              }
              className="venue-image img-fluid rounded border"
            />

            {/* Overlay for image count */}
            <div className="mb-2 me-4 position-absolute bottom-0 end-0 p-2 overlay-bg-transparent text-light rounded d-flex align-items-center">
              <FontAwesomeIcon icon={faImages} className="me-2" />
              <Button
                variant="link"
                className="text-white p-0"
                onClick={handleShowImagesModal}
                aria-label="Show All Images"
              >
                {`Show Images (${venue.media.length})`}
              </Button>
            </div>
          </Col>

          {/* Meet The Owner section */}
          <Col
            md={4}
            className="d-none d-md-flex align-items-start justify-content-center"
          >
            <div className="owner-section-big ms-2">
              <h2 className="mb-3">Meet The Owner</h2>
              {venue.owner && (
                <>
                  <Link
                    to={
                      venue.owner.name === getUserName()
                        ? "/myProfile"
                        : `/profile/${venue.owner.name}`
                    }
                  >
                    <div className="d-flex align-items-center my-4">
                      <Image
                        src={
                          venue.owner.avatar?.url ||
                          "../../assets/images/profileImagee/noProfileImage.png"
                        }
                        roundedCircle
                        className="owner-avatar"
                      />
                      <div className="ms-3">
                        <p>
                          <span className="fw-bolder text-break">
                            {venue.owner.name}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="mb-4">
                    <p>
                      <span className="fw-bolder">Bio:</span>
                    </p>
                    <p className="text-break">
                      {venue.owner.bio || "No bio available"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>
      </section>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={venue.media}
        show={showImagesModal}
        onClose={handleCloseImagesModal}
      />

      {/* Page navigation */}
      <div
        className="my-3 page-navigation"
        role="navigation"
        aria-label="In-Page Section Navigation"
      >
        <div className="navigation-buttons border-bottom border-secondary border-3">
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => scrollToSection(detailsRef)}
            aria-label="Scroll to Venue Details"
          >
            Venue Details
          </button>
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => scrollToSection(bookRef)}
            aria-label="Scroll to Booking Section"
          >
            Book Now
          </button>
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => scrollToSection(locationRef)}
            aria-label="Scroll to Location Section"
          >
            Location
          </button>
        </div>
      </div>

      {/* Venue Details and Venue Facts Section */}
      <section
        ref={detailsRef}
        className="my-5 border-bottom border-3 border-secondary"
        aria-labelledby="venue-details"
      >
        <Row>
          <Col md={8}>
            <h2 id="venue-details" className="mb-4">
              Venue Overview:
            </h2>
            <dl className="d-flex flex-column align-items-start mb-4">
              <div className="mb-2">
                <dt>Description:</dt>
                <dd className="ms-0 text-break">{venue.description}</dd>{" "}
              </div>
              <div className="d-flex mb-1 ">
                <dt className="me-2">Price per night:</dt>
                <dd>${venue.price}</dd>
              </div>
              <div className="d-flex mb-2">
                <dt className="me-2">Max Guests:</dt>
                <dd>{venue.maxGuests}</dd>
              </div>
            </dl>
          </Col>

          <Col
            className="d-flex flex-column align-items-start align-items-md-center"
            md={4}
          >
            <h2 className="mb-4">Venue Features:</h2>
            <dl className="d-flex flex-column align-items-start">
              <div className="d-flex mb-2">
                <FontAwesomeIcon icon={faStar} className="me-2" />
                <dt className="ms-1">Rating:</dt>
                <dd className="ms-2">{venue.rating}/5</dd>
              </div>
              <div className="d-flex mb-2">
                <FontAwesomeIcon icon={faCoffee} className="me-2" />
                <dt className="ms-1">Breakfast:</dt>
                <dd className="ms-2">{venue.meta?.breakfast ? "Yes" : "No"}</dd>
              </div>
              <div className="d-flex mb-2">
                <FontAwesomeIcon icon={faCar} className="me-2" />
                <dt className="ms-1">Parking:</dt>
                <dd className="ms-2">{venue.meta?.parking ? "Yes" : "No"}</dd>
              </div>
              <div className="d-flex mb-2">
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                <dt className="ms-1">Pets Allowed:</dt>
                <dd className="ms-2">{venue.meta?.pets ? "Yes" : "No"}</dd>
              </div>
              <div className="d-flex mb-2">
                <FontAwesomeIcon icon={faWifi} className="me-2" />
                <dt className="ms-1">WiFi:</dt>
                <dd className="ms-2">{venue.meta?.wifi ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </Col>
        </Row>
      </section>
      {/* Book Now Section/Calendar */}
      <div ref={bookRef} className="my-5">
        {venue.owner?.name === getUserName() ? (
          <div className="text-center opacity-50">
            <Alert variant="warning">
              As the owner of this venue, you cannot make a booking for your own
              property.
            </Alert>
          </div>
        ) : (
          <BookingSection venue={venue} />
        )}
      </div>

      {/* Location Section */}
      <section
        ref={locationRef}
        className="my-5 border-top border-3 border-secondary"
        aria-labelledby="location"
      >
        <Row className="mt-5">
          <Col md={4} className="d-flex flex-column justify-content-around">
            <h2 id="location" className="mb-4">
              Location
            </h2>
            <p>
              <span className="fw-bold">Address:</span>{" "}
              {displayLocationDetail(venue.location.address)}
            </p>
            <p>
              <span className="fw-bold">City:</span>{" "}
              {displayLocationDetail(venue.location.city)}
            </p>
            <p>
              <span className="fw-bold">Zip:</span>{" "}
              {displayLocationDetail(venue.location.zip)}
            </p>
            <p>
              <span className="fw-bold">Country:</span>{" "}
              {displayLocationDetail(venue.location.country)}
            </p>
            <p>
              <span className="fw-bold">Continent:</span>{" "}
              {displayLocationDetail(venue.location.continent)}
            </p>
            {/* Weather information */}
            <div className="weather-widget my-0 my-lg-5">
              <p className="fw-bold fs-5 mb-1">Current Weather:</p>
              {coordinates === null ? (
                <Alert variant="warning" className="text-center my-3">
                  Weather information unavailable.
                </Alert>
              ) : isWeatherLoading ? (
                <Alert variant="info" className="text-center my-3">
                  Loading weather...
                </Alert>
              ) : weatherError ? (
                <Alert variant="danger" className="text-center my-3">
                  {weatherError.message || "Unable to fetch weather data."}
                </Alert>
              ) : weatherData ? (
                <div className="d-flex mb-md-0 mb-3">
                  {weatherIconData && (
                    <span
                      className={`weather-icon ${weatherIconData.className}`}
                    >
                      {React.createElement(weatherIconData.icon)}
                    </span>
                  )}
                  <p className="temp-paragraph fs-3 ms-4 align-items-center d-flex">
                    {weatherData?.temperature}°C
                  </p>
                </div>
              ) : (
                <Alert variant="warning" className="text-center my-3">
                  Weather information unavailable.
                </Alert>
              )}
            </div>
          </Col>
          <Col md={8}>
            <div className="map-placeholder">
              {coordinates ? (
                <iframe
                  className="w-100 border rounded"
                  src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=es;z=14&output=embed`}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              ) : isGeocoding ? (
                <Alert variant="info" className="text-center my-3">
                  Loading map...
                </Alert>
              ) : (
                <Alert variant="warning" className="text-center my-3">
                  {geocodeError
                    ? "Unable to load map for this location."
                    : "Map information unavailable."}
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </section>

      {/* Meet The Owner section (at bottom in smaller screens) */}
      <section
        className="d-block d-md-none my-5 pt-5 border-top border-3 border-secondary"
        aria-labelledby="meet-the-owner-mobile"
      >
        <h2 id="meet-the-owner-mobile">Meet The Owner</h2>
        {venue.owner && (
          <>
            {" "}
            <Link
              to={
                venue.owner.name === getUserName()
                  ? "/myProfile"
                  : `/profile/${venue.owner.name}`
              }
              className="text-decoration-none text-dark"
            >
              <div className="d-flex align-items-center my-4">
                <Image
                  src={
                    venue.owner.avatar?.url ||
                    "../../assets/images/profileImagee/noProfileImage.png"
                  }
                  roundedCircle
                  className="owner-avatar"
                />
                <div className="ms-3">
                  <p>
                    <span className="fw-bold">{venue.owner.name}</span>
                  </p>
                </div>
              </div>{" "}
            </Link>
            <div className="mb-4">
              <p>
                <span className="fw-bold">Bio:</span>
              </p>
              <p>{venue.owner.bio || "No bio available"}</p>
            </div>
          </>
        )}
      </section>
    </Container>
  );
}

export default VenueDetails;
