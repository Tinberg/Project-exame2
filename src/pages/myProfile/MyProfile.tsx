import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Tabs,
  Tab,
  Card,
  Alert,
} from "react-bootstrap";
import VenueListCard from "../../components/cards/venueListCard/VenueListCard";
import Message from "../../components/message/message";
import { calculateTotalPrice } from "../../utils/priceCalculator";
import {
  useProfileByName,
  useBookingsByProfile,
  useVenuesByProfile,
} from "../../hooks/apiHooks/useProfiles";
import { useDeleteBooking } from "../../hooks/apiHooks/useBookings";
import { useMessage } from "../../hooks/generalHooks/useMessage";
import { getUserName } from "../../services/api/authService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import CreateVenueModal from "../../components/createVenueModal/CreateVenueModal";
import EditProfileModal from "../../components/editProfileModal/EditProfileModal";
import "./myProfile.scss";

const MyProfile: React.FC = () => {
  const userName = getUserName();
  const navigate = useNavigate();

  //-- Modal visibility states --//
  const [showCreateVenueModal, setShowCreateVenueModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Message Component
  const { message, showMessage, clearMessage } = useMessage();

  if (!userName) {
    navigate("/login");
    return null;
  }

  //-- Fetch profile and booking data --//
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfileByName(userName, { _bookings: true, _venues: true });
  const {
    data: initialBookings,
    isLoading: isBookingsLoading,
    error: bookingsError,
  } = useBookingsByProfile(userName, { _venue: true });
  const {
    data: venues,
    isLoading: isVenuesLoading,
    error: venuesError,
  } = useVenuesByProfile(userName, { _bookings: true });

  //-- Cancel Booking --//
  useEffect(() => {
    if (initialBookings) {
      setBookings(initialBookings);
    }
  }, [initialBookings]);

  const [bookings, setBookings] = useState(initialBookings || []);
  const deleteBookingMutation = useDeleteBooking();
  const handleDeleteBooking = (bookingId: string) => {
    deleteBookingMutation.mutate(bookingId, {
      onSuccess: () => {
        showMessage("success", "Booking deleted successfully");

        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== bookingId)
        );
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
      onError: () => {
        showMessage(
          "error",
          "We couldn’t cancel your booking at this time. Please check your connection or try again later"
        );
      },
    });
  };

  //-- Error messages --//
  if (isProfileLoading) {
    return (
      <Alert className="text-center mt-5" variant="info">
        Loading profile...
      </Alert>
    );
  }

  if (profileError) {
    return (
      <Alert className="text-center mt-5" variant="danger">
        Failed to load profile.
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Alert className="text-center mt-5" variant="warning">
        Profile not found.
      </Alert>
    );
  }

  return (
    <Container className="my-profile-container mt-5">
      {/* Banner */}
      {profile.banner?.url && (
        <Image
          src={profile.banner.url}
          alt={profile.banner.alt || "Banner"}
          className="w-100 mb-4 profile-banner"
        />
      )}

      {/* Avatar and User Info */}
      <Row className="align-items-center mb-5">
        <Col md={4} className="text-center">
          <Image
            src={
              profile.avatar?.url ||
              "../../assets/images/profileImagee/noProfileImage.png"
            }
            alt={profile.avatar?.alt || "Avatar"}
            roundedCircle
            className="avatar-image mb-3"
          />
        </Col>
        <Col md={8}>
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
          {profile.bio && <p>{profile.bio}</p>}
          <Button
            variant="primary"
            onClick={() => setShowEditProfileModal(true)}
          >
            Edit Profile
          </Button>
        </Col>
      </Row>
      {message && <Message message={message} onClose={clearMessage} />}
      {/* Tabs Section */}
      <Tabs defaultActiveKey="bookings" id="profile-tabs" className="mt-5">
        <Tab eventKey="bookings" title="View and Manage Bookings">
          {isBookingsLoading ? (
            <Alert variant="info" className="text-center mt-4">
              <p>Loading bookings...</p>
            </Alert>
          ) : bookingsError ? (
            <Alert variant="danger" className="mt-4">
              Failed to load bookings.
            </Alert>
          ) : bookings && bookings.length > 0 ? (
            <Row className="mt-4">
              {bookings.map((booking) => {
                if (!booking.venue) return null;

                // Use the utility function to calculate total price
                const dateFrom = new Date(booking.dateFrom);
                const dateTo = new Date(booking.dateTo);
                const totalPrice = calculateTotalPrice(
                  dateFrom,
                  dateTo,
                  booking.venue.price
                );

                return (
                  <Col md={4} key={booking.id} className="mb-4">
                    <VenueListCard
                      venue={booking.venue}
                      buttonType="cancel"
                      onClick={() => handleDeleteBooking(booking.id)}
                      dateFrom={booking.dateFrom}
                      dateTo={booking.dateTo}
                      guests={booking.guests}
                      totalPrice={totalPrice}
                      showCapacity={false}
                      showPrice={false}
                    />
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Alert variant="info" className="mt-4 text-center">
              You have no bookings.
            </Alert>
          )}
        </Tab>
        <Tab eventKey="venues" title="Manage/Add Venues">
          {isVenuesLoading ? (
            <Alert variant="info" className="text-center mt-4">
              <p>Loading venues...</p>
            </Alert>
          ) : venuesError ? (
            <Alert variant="danger" className="mt-4">
              Failed to load venues.
            </Alert>
          ) : (
            <Row className="mt-4">
              {/* Create New Venue Card */}
              <Col md={4} className="mb-4">
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <Button
                      variant="outline-primary"
                      className="mb-3"
                      onClick={() => setShowCreateVenueModal(true)}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} size="3x" />
                    </Button>
                    <Card.Title>Create New Venue</Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              {/* User's Venues */}
              {venues && venues.length > 0 ? (
                venues.map((venue) => (
                  <Col md={4} key={venue.id} className="mb-4">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={
                          venue.media && venue.media.length > 0
                            ? venue.media[0].url
                            : "defaultImage"
                        }
                        alt={
                          venue.media && venue.media.length > 0
                            ? venue.media[0].alt
                            : "Venue Image"
                        }
                      />
                      <Card.Body>
                        <Card.Title>{venue.name}</Card.Title>
                        <Card.Text>
                          {venue.location.city}, {venue.location.country}
                        </Card.Text>
                        <Card.Text>Capacity: {venue.maxGuests}</Card.Text>
                        <Card.Text>Price: ${venue.price}</Card.Text>
                        <Button
                          variant="primary"
                          onClick={() => navigate(`/edit-venue/${venue.id}`)}
                        >
                          Edit Venue
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <Alert variant="info" className="mt-4 text-center">
                    You have no venues.
                  </Alert>
                </Col>
              )}
            </Row>
          )}
        </Tab>
      </Tabs>

      {/* Create Venue Modal */}
      <CreateVenueModal
        show={showCreateVenueModal}
        handleClose={() => setShowCreateVenueModal(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        show={showEditProfileModal}
        handleClose={() => setShowEditProfileModal(false)}
      />
    </Container>
  );
};

export default MyProfile;
