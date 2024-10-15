import React from "react";
import { Card, Button } from "react-bootstrap";
import { Venue } from "../../../schemas/venue";
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
  return (
    <div className="small-venue-card position-absolute">
      <Card>
        {venue.media?.[0]?.url && (
          <Card.Img
            variant="top"
            className="small-card-img"
            src={venue.media[0].url}
            alt={venue.media[0].alt || "Venue image"}
          />
        )}
        <Card.Body>
          <Card.Title>{venue.name}</Card.Title>
          <p>
            {venue.location?.city || venue.location?.country
              ? `${venue.location.city ? venue.location.city : ""}${
                  venue.location.city && venue.location.country ? ", " : ""
                }${venue.location.country ? venue.location.country : ""}`
              : "Location not available"}
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
