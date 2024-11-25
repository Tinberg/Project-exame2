import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Alert } from "react-bootstrap";
import {
  useProfileByName,
  useVenuesByProfile,
} from "../../hooks/apiHooks/useProfiles";
import VenueListCard from "../../components/cards/venueListCard/VenueListCard";
import "./profile.scss";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  if (!username) {
    return (
      <Alert className="text-center mt-5" variant="danger">
        No username provided.
      </Alert>
    );
  }

  // Fetch profile and venues data
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfileByName(username);
  const {
    data: venues,
    isLoading: isVenuesLoading,
    error: venuesError,
  } = useVenuesByProfile(username);

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
      <section>
        {profile.banner?.url && (
          <Image
            src={profile.banner.url}
            alt={profile.banner.alt || "Banner"}
            className="w-100 mb-4 profile-banner rounded"
          />
        )}
      </section>

      {/* Profile Info Section */}
      <section>
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
                : "This user hasn't added a bio yet."}
            </p>
          </Col>
        </Row>
      </section>

      {/* Venues Section */}
      <section className=" mt-5">
        <Row>
          <Col>
            <h2 className="text-center border-bottom pb-2 mb-4">
              {profile.name}'s Venues
            </h2>
            {isVenuesLoading ? (
              <Alert variant="info" className="text-center mt-4">
                Loading venues...
              </Alert>
            ) : venuesError ? (
              <Alert variant="danger" className="mt-4">
                Failed to load venues.
              </Alert>
            ) : venues && venues.length > 0 ? (
              <Row className="mt-4">
                {venues.map((venue) => (
                  <Col lg={6} xl={4} key={venue.id} className="mb-4">
                    <VenueListCard
                      venue={venue}
                      buttonTypes={["view"]}
                      onClick={(action, venueId) => {
                        if (action === "view") {
                          navigate(`/venueDetails/${venueId}`);
                        }
                      }}
                      showCapacity={true}
                      showPrice={true}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info" className="mt-4 text-center">
                This user has no venues.
              </Alert>
            )}
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default Profile;
