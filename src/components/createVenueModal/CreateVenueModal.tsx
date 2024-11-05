// CreateVenueModal.tsx

import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useCreateVenue } from "../../hooks/apiHooks/useVenues";
import { VenueCreationData } from "../../schemas/venue";
import { useNavigate } from "react-router-dom";

interface CreateVenueModalProps {
  show: boolean;
  handleClose: () => void;
}

const CreateVenueModal: React.FC<CreateVenueModalProps> = ({
  show,
  handleClose,
}) => {
  const [formData, setFormData] = useState<VenueCreationData>({
    name: "",
    description: "",
    price: 0,
    maxGuests: 1,
    media: [],
    meta: {},
    location: {},
  });

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"success" | "danger" | null>(
    null
  );
  const navigate = useNavigate();

  const createVenueMutation = useCreateVenue();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertMessage(null);
    setAlertVariant(null);

    createVenueMutation.mutate(formData, {
      onSuccess: (data) => {
        setAlertMessage("Venue created successfully!");
        setAlertVariant("success");
        handleClose();
        navigate(`/venues/${data.id}`);
      },
      onError: (error: any) => {
        setAlertMessage(error.message || "Failed to create venue.");
        setAlertVariant("danger");
      },
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Venue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertMessage && (
          <Alert
            variant={alertVariant || "info"}
            onClose={() => setAlertMessage(null)}
            dismissible
          >
            {alertMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          {/* Form fields for venue creation */}
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter venue name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter venue description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="price" className="mt-3">
            <Form.Label>Price per night</Form.Label>
            <Form.Control
              type="number"
              min={0}
              placeholder="Enter price"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="maxGuests" className="mt-3">
            <Form.Label>Max Guests</Form.Label>
            <Form.Control
              type="number"
              min={1}
              placeholder="Enter max guests"
              value={formData.maxGuests}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxGuests: Number(e.target.value),
                }))
              }
              required
            />
          </Form.Group>

          {/* Meta Information */}
          <Form.Group className="mt-3">
            <Form.Label>Facilities</Form.Label>
            <div className="d-flex flex-wrap">
              <Form.Check
                type="checkbox"
                label="WiFi"
                className="me-3"
                checked={formData.meta?.wifi || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, wifi: e.target.checked },
                  }))
                }
              />
              <Form.Check
                type="checkbox"
                label="Parking"
                className="me-3"
                checked={formData.meta?.parking || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, parking: e.target.checked },
                  }))
                }
              />
              <Form.Check
                type="checkbox"
                label="Breakfast"
                className="me-3"
                checked={formData.meta?.breakfast || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, breakfast: e.target.checked },
                  }))
                }
              />
              <Form.Check
                type="checkbox"
                label="Pets"
                className="me-3"
                checked={formData.meta?.pets || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, pets: e.target.checked },
                  }))
                }
              />
            </div>
          </Form.Group>

          {/* Media URLs */}
          <Form.Group controlId="media" className="mt-3">
            <Form.Label>Media URLs (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter media URLs"
              value={formData.media?.map((media) => media.url).join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  media: e.target.value
                    .split(",")
                    .map((url) => ({ url: url.trim(), alt: "Venue image" })),
                }))
              }
            />
          </Form.Group>

          {/* Location */}
          <Form.Group controlId="address" className="mt-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={formData.location?.address || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value },
                }))
              }
            />
          </Form.Group>

          <Form.Group controlId="city" className="mt-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={formData.location?.city || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, city: e.target.value },
                }))
              }
            />
          </Form.Group>

          <Form.Group controlId="country" className="mt-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              value={formData.location?.country || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, country: e.target.value },
                }))
              }
            />
          </Form.Group> 
          <Button variant="primary" type="submit" className="mt-4">
            Create Venue
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateVenueModal;
