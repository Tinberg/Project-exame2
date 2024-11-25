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
import { calculateTotalPrice } from "../../utils/priceCalculator";
import {
  useProfileByName,
  useBookingsByProfile,
  useVenuesByProfile,
} from "../../hooks/apiHooks/useProfiles";
import { useDeleteBooking } from "../../hooks/apiHooks/useBookings";
import { useMessage } from "../../hooks/generalHooks/useMessage";
import { getUserName } from "../../services/api/authService";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Message from "../../components/message/message";
import VenueListCard from "../../components/cards/venueListCard/VenueListCard";
import CreateVenueModal from "../../components/modals/createVenueModal/CreateVenueModal";
import EditProfileModal from "../../components/modals/editProfileModal/EditProfileModal";
import EditVenueModal from "../../components/modals/editVenueModal/EditVenueModal";
import VenueBookingsModal from "../../components/modals/venueBookingsModal/VenueBookingsModal";
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
  const [showVenueBookingsModal, setShowVenueBookingsModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedVenueBookings, setSelectedVenueBookings] =
    useState<Venue | null>(null);

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

  //-- If user is not logged in, display a message with links --//
  if (!userName) {
    return (
      <Container className="text-center my-5 py-3">
        <p className="fs-5">
          Please{" "}
          <Link to="/login" className="text-decoration-underline text-primary">
            log in
          </Link>{" "}
          or{" "}
          <Link
            to="/register"
            className="text-decoration-underline text-primary"
          >
            sign up
          </Link>{" "}
          to manage venues or see bookings.
        </p>
      </Container>
    );
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
  } = useVenuesByProfile(userName, {
    _bookings: true,
    _bookings_customer: true,
  });

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
    <Container>
      {/* Profile Banner Section */}
      <section id="profile-banner-section">
        {profile.banner?.url && (
          <Image
            src={profile.banner.url}
            alt={profile.banner.alt || "Banner"}
            className="w-100 mb-4 profile-banner rounded"
          />
        )}
      </section>

      {/* Avatar and User Info Section */}
      <section id="user-info-section">
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
      </section>

      {/* Messages Section */}
      <section id="messages-section">
        {message && <Message message={message} onClose={clearMessage} />}
      </section>

      {/* Tabs Section */}
      <section id="tabs-section">
        <Tabs
          defaultActiveKey="bookings"
          id="profile-tabs"
          className="mt-5 nav-justified flex-nowrap"
        >
          {/* Bookings Tab */}
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
                    /* List of User's Bookings */
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

          {/* Venues Tab */}
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
                <section id="create-venue-section">
                  <Row className="mt-4 mb-4 justify-content-center border-bottom border-secondary border-3 py-5">
                    <Col
                      md={6}
                      lg={4}
                      className={`d-flex flex-column align-items-center newVenueContainer ${
                        profile.venueManager
                          ? ""
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (profile.venueManager) setShowCreateVenueModal(true);
                      }}
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
                    {!profile.venueManager && (
                      <p className="text-center mt-3">
                        You are not a Venue Manager and cannot create or edit
                        venues. Enable it by clicking{" "}
                        <Button
                          variant="link"
                          onClick={() => setShowEditProfileModal(true)}
                          className="p-0 m-0 align-baseline"
                        >
                          Edit Profile
                        </Button>
                        .
                      </p>
                    )}
                  </Row>
                </section>

                {/* List of User's Venues Section */}
                <section id="user-venues-section">
                  <Row>
                    {venuesState && venuesState.length > 0 ? (
                      venuesState.map((venue) => (
                        <Col lg={6} xl={4} key={venue.id} className="mb-4">
                          <VenueListCard
                            venue={venue}
                            buttonTypes={
                              profile.venueManager
                                ? ["edit", "bookings", "view"]
                                : ["bookings", "view"]
                            }
                            onClick={(action, venueId) => {
                              if (action === "edit") {
                                if (!profile.venueManager) return;
                                const venueToEdit = venuesState.find(
                                  (v) => v.id === venueId
                                );
                                if (venueToEdit) {
                                  setSelectedVenue(venueToEdit);
                                  setShowEditVenueModal(true);
                                }
                              } else if (action === "view") {
                                navigate(`/venueDetails/${venueId}`);
                              } else if (action === "bookings") {
                                const venueToShowBookings = venuesState.find(
                                  (v) => v.id === venueId
                                );
                                if (venueToShowBookings) {
                                  setSelectedVenueBookings(venueToShowBookings);
                                  setShowVenueBookingsModal(true);
                                }
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
                </section>
              </>
            )}
          </Tab>
        </Tabs>
      </section>

      {/* Modals Section */}
      <section id="modals-section">
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

        {/* Venue Bookings Modal */}
        {selectedVenueBookings && (
          <VenueBookingsModal
            show={showVenueBookingsModal}
            handleClose={() => setShowVenueBookingsModal(false)}
            venue={selectedVenueBookings}
          />
        )}

        {/* Edit Profile Modal */}
        <EditProfileModal
          show={showEditProfileModal}
          handleClose={() => setShowEditProfileModal(false)}
        />
      </section>
    </Container>
  );
};

export default MyProfile;
