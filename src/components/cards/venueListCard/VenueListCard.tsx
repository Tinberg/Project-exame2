import { forwardRef, ReactNode } from "react";
import { Card, Button, Col } from "react-bootstrap";
import { Venue } from "../../../schemas/venue";
import defaultImage from "../../../assets/images/venueImage/noVenueImage.jpg";
import "./venueListCard.scss";

// Interface for VenueListCard
interface VenueListCardProps {
  venue: Venue;
  buttonTypes: string[];
  onClick: (action: string, venueId: string) => void;
  onHover?: (venue: Venue) => void;
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
  totalPrice?: number;
  showCapacity?: boolean;
  showPrice?: boolean;
  children?: ReactNode;
}

const VenueListCard = forwardRef<HTMLDivElement, VenueListCardProps>(
  (
    {
      venue,
      buttonTypes,
      onClick,
      onHover,
      dateFrom,
      dateTo,
      guests,
      totalPrice,
      showCapacity = true,
      showPrice = true,
    },
    ref
  ) => {
    const venueImage = venue.media?.[0]?.url || defaultImage;

    return (
      <Col
        xs={12}
        // md={6}
        xl={12}
        className="mb-3 d-flex align-items-stretch venue-card-col"
        ref={ref}
      >
        <Card
          className="h-100 w-100"
          onMouseEnter={onHover ? () => onHover(venue) : undefined} 
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
            <Card.Title className="fw-bolder text-truncate mb-0">
              {venue.name}
            </Card.Title>
            <p className="text-truncate city-country-p">
              {venue.location?.city && venue.location?.country
                ? `${venue.location.city}, ${venue.location.country}`
                : venue.location?.city || venue.location?.country}
            </p>

            {/* Booking-Specific Details */}
            {dateFrom && (
              <p>
                <span className="fw-bold">Date From:</span>{" "}
                {new Date(dateFrom).toLocaleDateString()}
              </p>
            )}
            {dateTo && (
              <p>
                <span className="fw-bold">Date To:</span>{" "}
                {new Date(dateTo).toLocaleDateString()}
              </p>
            )}
            {guests !== undefined && (
              <p>
                <span className="fw-bold">Guests:</span> {guests}
              </p>
            )}
            {totalPrice !== undefined && (
              <p>
                <span className="fw-bold">Total Price:</span> $
                {Number.isInteger(totalPrice)
                  ? totalPrice
                  : totalPrice.toFixed(2)}
              </p>
            )}

            {/* Capacity and Price */}
            {showCapacity && (
              <p>
                <span className="fw-bold">Capacity:</span> {venue.maxGuests}{" "}
                Guests
              </p>
            )}
            {showPrice && (
              <p>
                <span className="fw-bold">Price:</span> ${venue.price}
              </p>
            )}

            {/*  Buttons Based on buttonTypes */}
            {buttonTypes.map((type) => (
              <Button
                key={type}
                variant={
                  type === "cancel"
                    ? "danger"
                    : type === "edit"
                    ? "warning"
                    : "primary"
                }
                className="w-100 mb-2"
                onClick={() => onClick(type, venue.id)}
              >
                {type === "cancel"
                  ? "Cancel Booking"
                  : type === "edit"
                  ? "Edit Venue"
                  : "View Details"}
              </Button>
            ))}
          </Card.Body>
        </Card>
      </Col>
    );
  }
);

export default VenueListCard;
