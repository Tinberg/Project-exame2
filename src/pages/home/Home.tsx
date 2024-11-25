import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Image, Alert } from "react-bootstrap";
import { useVenues } from "../../hooks/apiHooks/useVenues";
import VenueListCard from "../../components/cards/venueListCard/VenueListCard";
import { FaSearch, FaUserCheck, FaCalendarCheck } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ImageGalleryModal from "../../components/modals/imageGalleryModal/ImageGalleryModal";

import { scrollPhotos, useScrollArrows, images } from "./homeUtils";
import "./home.scss";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const photoRowRef = useRef<HTMLDivElement>(null);
  const { showLeft, showRight } = useScrollArrows(photoRowRef);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openGallery = (index: number) => {
    setSelectedIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setSelectedIndex(null);
    setIsGalleryOpen(false);
  };

  const { data, isLoading, isError } = useVenues({
    sort: "created",
    sortOrder: "desc",
  });

  const venues = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Container fluid className="home-container p-0">
      {/* Hero Section */}
      <section className="hero-section text-white text-center d-flex align-items-center justify-content-center">
        <div className="text-center text-dark p-4 rounded bg-white bg-opacity-75">
          <h1 className="display-5 hero-text">Holidaze</h1>
          <p className="lead hero-text">
            Discover Unique Stays or Host Your Space
          </p>
          <div className="d-flex justify-content-around gap-2 mt-4">
            <Button variant="primary" onClick={() => navigate("/Explore")}>
              Find Venues
            </Button>
            <Button
              variant="outline-dark"
              className="custom-outline"
              onClick={() => navigate("/myProfile")}
            >
              Share Venues
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 my-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">How It Works</h2>
          <Row className="text-center">
            <Col md={4}>
              <FaSearch className="fs-1 mb-3 text-primary" />
              <p className="fw-bold fs-5">Explore and Find Venues</p>
              <p className="mb-4">
                Discover venues using a search feature. You could book a house,
                a camper van, or search by location.
              </p>
            </Col>
            <Col md={4}>
              <FaUserCheck className="fs-1 mb-3 text-primary" />
              <p className="fw-bold fs-5">Enable Venue Manager</p>
              <p className="mb-4">
                For users wanting to rent out, they enable the venue manager in
                their profile settings. An icon of profile settings can
                illustrate this.
              </p>
            </Col>
            <Col md={4}>
              <FaCalendarCheck className="fs-1 mb-3 text-primary" />
              <p className="fw-bold fs-5">Manage Your Bookings</p>
              <p className="mb-4">
                Users manage listings and bookings via their dashboard, making
                calendars or bookings hassle-free.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Top Venues Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Newest Venues to Explore</h2>
          {isLoading ? (
            <Alert variant="info" className="text-center">
              Loading venues...
            </Alert>
          ) : isError ? (
            <Alert variant="danger" className="text-center">
              Failed to load venues.
            </Alert>
          ) : venues.length > 0 ? (
            <Row className="g-4">
              {venues.slice(0, 3).map((venue: any) => (
                <Col md={4} key={venue.id}>
                  <VenueListCard
                    key={venue.id}
                    venue={venue}
                    buttonTypes={["view"]}
                    onClick={(action, venueId) => {
                      if (action === "view") {
                        window.location.href = `/venueDetails/${venueId}`;
                      }
                    }}
                    showCapacity={true}
                    showPrice={true}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info" className="text-center">
              No venues available.
            </Alert>
          )}
        </Container>
      </section>

      {/* Travel Photos Section */}
      <section className="py-5 my-5 px-1">
        <div className="container-fluid px-0">
          <h2 className="text-center mb-2 fw-bold">
            We Love Your Travel Photos!
          </h2>
          <p className="text-center mb-5">
            Tag @holidazetravel in your posts to show us your favorite vacation
            moments. We can’t wait to see your adventures!
          </p>
          <div className="position-relative">
            {showLeft && (
              <button
                className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                onClick={() => scrollPhotos(-1, photoRowRef.current)}
                aria-label="Scroll Left"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}

            <div
              className="photo-row d-flex flex-nowrap align-items-center justify-content-center gap-3"
              ref={photoRowRef}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  onClick={() => openGallery(index)}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    className="photo-item rounded"
                  />
                </div>
              ))}
            </div>

            {showRight && (
              <button
                className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                onClick={() => scrollPhotos(1, photoRowRef.current)}
                aria-label="Scroll Right"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Image Gallery Modal */}
      {isGalleryOpen && selectedIndex !== null && (
        <ImageGalleryModal
          images={images}
          show={isGalleryOpen}
          onClose={closeGallery}
        />
      )}
    </Container>
  );
};

export default Home;
