import React from "react";
import { Card, Button } from "react-bootstrap";
import { Venue } from "../../../schemas/venue";
import defaultImage from "../../../assets/images/venueImage/noVenueImage.jpg";
import "./venueMapCard.scss";

// interface for venueMapCard
interface VenueMapCardProps {
  venue: Venue;
  onViewDetails: (venueId: string) => void;
}

//  displays a small venue card on the map. Triggers onViewDetails when "View Details" is clicked.
const VenueMapCard: React.FC<VenueMapCardProps> = ({
  venue,
  onViewDetails,
}) => {
  const venueImage = venue.media?.[0]?.url || defaultImage;
  return (
    <div className="small-venue-card position-absolute">
      <Card>
        <Card.Img
          variant="top"
          className="small-card-img"
          src={venueImage}
          alt={venue.media?.[0]?.alt || "Venue image"}
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        <Card.Body className="bg-secondary">
          <Card.Title>{venue.name}</Card.Title>
          <p className="city-country-p">
            {venue.location?.city || venue.location?.country
              ? `${venue.location.city ? venue.location.city : ""}${
                  venue.location.city && venue.location.country ? ", " : ""
                }${venue.location.country ? venue.location.country : ""}`
              : ""}
          </p>
          <Button
            variant="primary"
            className="w-100"
            onClick={() => onViewDetails(venue.id)}
          >
            View Details
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VenueMapCard;