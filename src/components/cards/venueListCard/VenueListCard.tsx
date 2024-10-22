import { forwardRef } from "react";
import { Card, Button, Col } from "react-bootstrap";
import { Venue } from "../../../schemas/venue";
import defaultImage from "../../../assets/images/venueImage/noVenueImage.jpg";
import "./venueListCard.scss";

// Interface for VenueListCard
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
      <Col
        xs={12}
        md={6}
        xl={12}
        className="mb-3 d-flex align-items-stretch venue-card-col"
        ref={ref}
      >
        <Card
          className="h-100 w-100"
          onMouseEnter={() => onHover(venue)}
          onClick={() => onClick(venue.id)}
        >
          <Card.Img
            variant="top"
            src={venueImage}
            alt={venue.media?.[0]?.alt || "Venue image"}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
            className="venue-image"
          />
          <Card.Body className="d-flex flex-column justify-content-between bg-secondary">
            <Card.Title className="fw-bolder text-truncate mb-0 ">
              {venue.name}
            </Card.Title>
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
