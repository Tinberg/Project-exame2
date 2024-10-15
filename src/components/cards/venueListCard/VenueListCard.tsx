import { forwardRef } from "react";
import { Card, Button, Col } from "react-bootstrap";
import { Venue } from "../../../schemas/venue";
import defaultImage from "../../../assets/images/venueImage/noVenueImage.jpg";
import "./venueListCard.scss";

// Interface for venueListCard
interface VenueListCardProps {
  venue: Venue;
  onHover: (venue: Venue) => void;
  onClick: (venueId: string) => void;
}

// Card component displays a venue's details. Triggers onHover and onClick actions when interacted with.
const VenueListCard = forwardRef<HTMLDivElement, VenueListCardProps>(
  ({ venue, onHover, onClick }, ref) => {
    const venueImage = venue.media?.[0]?.url || defaultImage;

    return (
      <Col md={12} className="mb-3 d-flex align-items-stretch" ref={ref}>
        <Card
          className="h-100 w-100 d-flex flex-row"
          onMouseEnter={() => onHover(venue)}
          onClick={() => onClick(venue.id)}
        >
          <Card.Img
            src={venueImage}
            alt={venue.media?.[0]?.alt || "Venue image"}
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
            className="venue-image w-50"
          />
          <Card.Body className="d-flex flex-column justify-content-between w-50">
            <Card.Title className="fw-bold">{venue.name}</Card.Title>
            <p>
              {venue.location?.city && venue.location?.country
                ? `${venue.location.city}, ${venue.location.country}`
                : venue.location?.city ||
                  venue.location?.country ||
                  "Location not available"}
            </p>

            <p>
              <span className="fw-bold">Capacity:</span> {venue.maxGuests}{" "}
              Guests
            </p>
            <p>
              <span className="fw-bold">Price:</span> ${venue.price}
            </p>
            <Button
              variant="primary"
              className="w-100"
              onClick={() => onClick(venue.id)}
            >
              View Details
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  }
);

export default VenueListCard;
