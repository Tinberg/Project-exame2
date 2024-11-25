import React from "react";
import { Modal, Table, Button, Alert } from "react-bootstrap";
import { Venue } from "../../../schemas/venue";
import dayjs from "dayjs";

interface VenueBookingsModalProps {
  show: boolean;
  handleClose: () => void;
  venue: Venue;
}

const VenueBookingsModal: React.FC<VenueBookingsModalProps> = ({
  show,
  handleClose,
  venue,
}) => {
  const bookings = venue.bookings || [];

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Bookings for {venue.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {bookings.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Date From</th>
                <th>Date To</th>
                <th>Guests</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.customer?.name || "N/A"}</td>
                  <td>{dayjs(booking.dateFrom).format("YYYY-MM-DD")}</td>
                  <td>{dayjs(booking.dateTo).format("YYYY-MM-DD")}</td>
                  <td>{booking.guests}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">No bookings for this venue.</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VenueBookingsModal;
