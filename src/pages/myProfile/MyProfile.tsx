import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Tabs,
  Tab,
  Alert,
} from "react-bootstrap";
import { Venue } from "../../schemas";
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
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import CreateVenueModal from "../../components/modals/createVenueModal/CreateVenueModal";
import EditProfileModal from "../../components/modals/editProfileModal/EditProfileModal";
import EditVenueModal from "../../components/modals/editVenueModal/EditVenueModal";
import newVenueImage from "../../assets/images/createNewVenue/newVenue.png";
import "./myProfile.scss";

const MyProfile: React.FC = () => {
  const userName = getUserName();
  const navigate = useNavigate();
  const location = useLocation();
  const { message: navigationMessage } = location.state || {};

  //-- Modal visibility states --//
  const [showCreateVenueModal, setShowCreateVenueModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showEditVenueModal, setShowEditVenueModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  // Message Component
  const { message, showMessage, clearMessage } = useMessage();

  //-- Display message if navigated from BookingSection --//
  useEffect(() => {
    if (navigationMessage) {
      showMessage("success", navigationMessage);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [navigationMessage, showMessage, navigate, location.pathname]);

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

  //-- Manage Bookings --//
  const [bookings, setBookings] = useState(initialBookings || []);

  useEffect(() => {
    if (initialBookings) {
      setBookings(initialBookings);
    }
  }, [initialBookings]);

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

  //-- Manage Venues --//
  const [venuesState, setVenuesState] = useState<Venue[]>(venues || []);

  useEffect(() => {
    if (venues) {
      setVenuesState(venues);
    }
  }, [venues]);

  const handleVenueDeleted = (deletedVenueId: string) => {
    setVenuesState((prevVenues) =>
      prevVenues.filter((venue) => venue.id !== deletedVenueId)
    );
    showMessage("success", "Venue deleted successfully.");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
    <Container className="my-profile-container">
      {/* Banner */}
      {profile.banner?.url && (
        <Image
          src={profile.banner.url}
          alt={profile.banner.alt || "Banner"}
          className="w-100 mb-4 profile-banner rounded"
        />
      )}

      {/* Avatar and User Info */}
      <Row className="align-items-center text-center text-md-start border-bottom border-secondary border-3 pb-5">
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
          <p className="bio-wrap">
            {profile.bio
              ? profile.bio
              : "You haven't added a bio yet. Write something about yourself!"}
          </p>
          <Button
            variant="primary"
            onClick={() => setShowEditProfileModal(true)}
          >
            Edit Profile
          </Button>
        </Col>
      </Row>

      {/* Messages */}
      {message && <Message message={message} onClose={clearMessage} />}

      {/* Tabs Section */}
      <Tabs
        defaultActiveKey="bookings"
        id="profile-tabs"
        className="mt-5 nav-justified flex-nowrap"
      >
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

                // Utility function to calculate total price
                const dateFrom = new Date(booking.dateFrom);
                const dateTo = new Date(booking.dateTo);
                const totalPrice = calculateTotalPrice(
                  dateFrom,
                  dateTo,
                  booking.venue.price
                );

                return (
                  /* List of Users Bookings */
                  <Col
                    lg={6}
                    xl={4}
                    key={booking.id}
                    className="mb-4 justify-content-center align-items-center d-flex"
                  >
                    <VenueListCard
                      venue={booking.venue}
                      buttonTypes={["cancel", "view"]}
                      onClick={(action) => {
                        if (!booking.venue) return;

                        if (action === "cancel") {
                          handleDeleteBooking(booking.id);
                        }
                        if (action === "view") {
                          navigate(`/venueDetails/${booking.venue.id}`);
                        }
                      }}
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
            <>
              {/* Create New Venue Section */}
              <Row className="mt-4 mb-4 justify-content-center border-bottom border-secondary border-3 py-5">
                <Col
                  md={6}
                  lg={4}
                  className="d-flex flex-column align-items-center newVenueContainer"
                  onClick={() => setShowCreateVenueModal(true)}
                >
                  {/* Image */}
                  <img
                    src={newVenueImage}
                    alt="Create New Venue"
                    className="mb-3 newVenueImage"
                  />
                  {/* Icon */}
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    size="3x"
                    className="mb-3"
                  />
                  {/* Title */}
                  <p className="text-center mb-3 fs-5">Create New Venue</p>
                </Col>
              </Row>

              {/* List of User's Venues */}
              <Row>
                {venuesState && venuesState.length > 0 ? (
                  venuesState.map((venue) => (
                    <Col lg={6} xl={4} key={venue.id} className="mb-4">
                      <VenueListCard
                        venue={venue}
                        buttonTypes={["edit", "view"]}
                        onClick={(action, venueId) => {
                          if (action === "edit") {
                            const venueToEdit = venuesState.find(
                              (v) => v.id === venueId
                            );
                            if (venueToEdit) {
                              setSelectedVenue(venueToEdit);
                              setShowEditVenueModal(true);
                            }
                          } else if (action === "view") {
                            navigate(`/venueDetails/${venueId}`);
                          }
                        }}
                        showCapacity={true}
                        showPrice={true}
                      />
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
            </>
          )}
        </Tab>
      </Tabs>

      {/* Create Venue Modal */}
      <CreateVenueModal
        show={showCreateVenueModal}
        handleClose={() => setShowCreateVenueModal(false)}
      />

      {/* Edit Venue Modal */}
      {selectedVenue && (
        <EditVenueModal
          show={showEditVenueModal}
          handleClose={() => setShowEditVenueModal(false)}
          venue={selectedVenue}
          onVenueDeleted={handleVenueDeleted}
        />
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        show={showEditProfileModal}
        handleClose={() => setShowEditProfileModal(false)}
      />
    </Container>
  );
};

export default MyProfile;
