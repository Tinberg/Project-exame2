import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import {
  useUpdateVenue,
  useDeleteVenue,
} from "../../../hooks/apiHooks/useVenues";
import { useGeocode } from "../../../hooks/apiHooks/useGeocoding";
import { Venue, VenueCreationData } from "../../../schemas/venue";

import { useMessage } from "../../../hooks/generalHooks/useMessage";
import MessageComponent from "../../../components/message/message";
import {
  FaImage,
  FaWifi,
  FaParking,
  FaUtensils,
  FaDog,
  FaStar,
} from "react-icons/fa";
import StarRating from "../../../components/starRating/StarRating";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import createVenueSchema from "../venueSchema";
import "../venueModal.scss";

interface EditVenueModalProps {
  show: boolean;
  handleClose: () => void;
  venue: Venue | null;
  onVenueDeleted: (deletedVenueId: string) => void;
}

const EditVenueModal: React.FC<EditVenueModalProps> = ({
  show,
  handleClose,
  venue,
  onVenueDeleted,
}) => {
  //-- Navigation, message and API setup --//
  const updateVenueMutation = useUpdateVenue(venue?.id || "");
  const deleteVenueMutation = useDeleteVenue(venue?.id || "");
  const { message, showMessage, clearMessage } = useMessage();
  const [geocodeRequested, setGeocodeRequested] = useState(false);
  const [locationValid, setLocationValid] = useState(true);

  //-- Form setup with react-hook-form and validation schema --//
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<VenueCreationData>({
    resolver: yupResolver(createVenueSchema),
    defaultValues: {
      name: "",
      description: "",
      price: null,
      maxGuests: null,
      media: [{ url: "", alt: "" }],
      rating: 0,
      meta: {},
      location: {
        address: "",
        city: "",
        zip: "",
        country: "",
        continent: "",
        lat: undefined,
        lng: undefined,
      },
    },
  });

  //-- Update form with venue data when `venue` changes --//
  useEffect(() => {
    if (venue) {
      reset({
        name: venue.name || "",
        description: venue.description || "",
        price: venue.price || null,
        maxGuests: venue.maxGuests || null,
        media:
          venue.media && venue.media.length > 0
            ? venue.media.map((mediaItem) => ({
                url: mediaItem.url || "",
                alt: mediaItem.alt || "",
              }))
            : [{ url: "", alt: "" }],
        rating: venue.rating || 0,
        meta: venue.meta || {},
        location: {
          address: venue.location?.address || "",
          city: venue.location?.city || "",
          zip: venue.location?.zip || "",
          country: venue.location?.country || "",
          continent: venue.location?.continent || "",
          lat: venue.location?.lat || undefined,
          lng: venue.location?.lng || undefined,
        },
      });
      setShowDeleteAlert(false);
      resetGeocodingState(); // Reset geocoding state when venue changes
    }
  }, [venue, reset]);

  //-- Function to reset geocoding state --//
  const resetGeocodingState = () => {
    setGeocodeRequested(false);
    setLocationValid(true);
    setGeocodeLocation({});
  };

  //-- Reset geocoding state when modal is closed --//
  useEffect(() => {
    if (!show) {
      resetGeocodingState();
    }
  }, [show]);

  //-- Media field array setup for dynamic inputs --//
  const { fields, append, remove } = useFieldArray({
    control,
    name: "media",
  });

  //-- Manage geocoding: watch location, fetch lat/lng, update form, and handle venue submission --//
  const locationValues = watch("location");
  const [geocodeLocation, setGeocodeLocation] = useState({});
  const {
    data: latLng,
    error: geocodeError,
    isError: isGeocodeError,
    isLoading: isGeocoding,
  } = useGeocode(geocodeLocation);

  useEffect(() => {
    if (latLng) {
      setValue("location.lat", latLng.lat);
      setValue("location.lng", latLng.lng);
      setLocationValid(true);
    } else if (!isGeocoding && geocodeRequested) {
      setValue("location.lat", undefined);
      setValue("location.lng", undefined);
      setLocationValid(false);
    }
  }, [latLng, isGeocoding, geocodeRequested, setValue]);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const onSubmit = (data: VenueCreationData) => {
    if (!locationValid) {
      showMessage(
        "danger",
        "Please provide a valid location before submitting."
      );
      return;
    }

    updateVenueMutation.mutate(data, {
      onSuccess: () => {
        handleClose();
      },
      onError: () => {
        showMessage("danger", "Failed to update the venue. Please try again.");
      },
    });
  };

  const getLocationCopy = () => ({ ...locationValues });

  const handleDelete = () => {
    deleteVenueMutation.mutate(undefined, {
      onSuccess: () => {
        handleClose();
        if (venue?.id) {
          onVenueDeleted(venue.id);
        }
      },
      onError: () => {
        showMessage("danger", "Failed to delete the venue. Please try again.");
      },
    });
  };

  return (
    <Modal
      className="ps-0"
      show={show}
      onHide={handleClose}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Venue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display message if there is one */}
        {message && (
          <MessageComponent message={message} onClose={clearMessage} />
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Venue Image Section */}
          <div className="text-center mb-4">
            <p className="fw-bold mb-4">Venue Image</p>
            <div className="imageContainer d-flex align-items-center justify-content-center m-auto border">
              <FaImage size={50} color="#ccc" />
            </div>
            <small className="text-muted">Recommended ratio 1:1</small>
          </div>

          {/* Media Inputs */}
          {fields.map((item, index) => (
            <div key={item.id} className="text-center mt-3">
              <p className="fw-bold">Image {index + 1}</p>
              <Form.Group controlId={`mediaUrl${index}`}>
                <Form.Label className="visually-hidden">Image URL</Form.Label>
                <Form.Control
                  className="mb-3"
                  type="text"
                  placeholder="Enter image URL"
                  {...register(`media.${index}.url` as const)}
                  isInvalid={!!errors.media?.[index]?.url}
                />
                {errors.media?.[index]?.url && (
                  <Form.Control.Feedback type="invalid">
                    {errors.media[index]?.url?.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group controlId={`mediaAlt${index}`} className="mt-2">
                <Form.Label className="visually-hidden">
                  Image Description
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter media description"
                  {...register(`media.${index}.alt` as const)}
                  isInvalid={!!errors.media?.[index]?.alt}
                />
                {errors.media?.[index]?.alt && (
                  <Form.Control.Feedback type="invalid">
                    {errors.media[index]?.alt?.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              {index > 0 && (
                <Button
                  variant="danger"
                  className="mt-2"
                  onClick={() => remove(index)}
                >
                  Remove Image
                </Button>
              )}
            </div>
          ))}

          <div className="text-center">
            <Button
              variant="primary"
              className="mt-3"
              onClick={() => append({ url: "", alt: "" })}
            >
              Add Another Image
            </Button>
          </div>

          {/* Venue Name */}
          <Form.Group
            controlId="name"
            className="mt-4 pt-4 text-center border-top border-2"
          >
            <Form.Label className="fw-bold mb-4">Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter venue name"
              {...register("name")}
              isInvalid={!!errors.name}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid">
                {errors.name.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Venue Details */}
          <Form.Group
            controlId="description"
            className="mt-4 pt-4 text-center border-top border-2"
          >
            <Form.Label className="fw-bold mb-4">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter venue description"
              {...register("description")}
              isInvalid={!!errors.description}
            />
            {errors.description && (
              <Form.Control.Feedback type="invalid">
                {errors.description.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Price per Night */}
          <Form.Group
            controlId="price"
            className="mt-4 pt-4 text-center border-top border-2"
          >
            <Form.Label className="fw-bold mb-4">Price per Night</Form.Label>
            <Form.Control
              type="number"
              placeholder="Price"
              {...register("price")}
              isInvalid={!!errors.price}
            />
            {errors.price && (
              <Form.Control.Feedback type="invalid">
                {errors.price.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Max Guests */}
          <Form.Group
            controlId="maxGuests"
            className="mt-4 pt-4 text-center border-top border-2"
          >
            <Form.Label className="fw-bold mb-4">Max Guests</Form.Label>
            <Form.Control
              type="number"
              min={1}
              placeholder="Guests"
              {...register("maxGuests")}
              isInvalid={!!errors.maxGuests}
            />
            {errors.maxGuests && (
              <Form.Control.Feedback type="invalid">
                {errors.maxGuests.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Facilities */}
          <Form.Group className="mt-4 pt-4 text-center border-top border-2">
            <Form.Label className="fw-bold mb-4">Facilities</Form.Label>
            <div className="facility-list d-flex flex-column align-items-center">
              {/* Facility Toggles */}
              {(["breakfast", "parking", "pets", "wifi"] as const).map(
                (key) => {
                  const labelMap = {
                    breakfast: "Breakfast",
                    parking: "Parking",
                    pets: "Pets Allowed",
                    wifi: "WiFi",
                  };
                  const iconMap = {
                    breakfast: <FaUtensils />,
                    parking: <FaParking />,
                    pets: <FaDog />,
                    wifi: <FaWifi />,
                  };

                  return (
                    <div
                      key={key}
                      className="facility-item d-flex align-items-center justify-content-between w-100 mb-3"
                    >
                      <div className="d-flex align-items-center">
                        <span className="facility-icon me-2">
                          {iconMap[key]}
                        </span>
                        <span className="facility-label">
                          {labelMap[key]}
                        </span>
                      </div>
                      <Form.Check
                        className="fs-4"
                        type="switch"
                        label=""
                        {...register(`meta.${key}` as const)}
                      />
                    </div>
                  );
                }
              )}
              {/* Star Rating */}
              <div className="facility-item d-flex align-items-center justify-content-between w-100 mb-3">
                <div className="d-flex align-items-center">
                  <FaStar className="facility-icon me-2" />
                  <span className="facility-label">Rating</span>
                </div>
                <div className="d-flex align-items-center">
                  <Controller
                    control={control}
                    name="rating"
                    render={({ field }) => (
                      <StarRating
                        rating={field.value || 0}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.rating && (
                    <div className="text-danger">{errors.rating.message}</div>
                  )}
                </div>
              </div>
            </div>
          </Form.Group>

          {/* Venue Location */}
          <Form.Group className="mt-4 pt-4 text-center border-top border-2">
            <Form.Label className="fw-bold mb-4">Venue Location</Form.Label>
            <Row className="justify-content-center">
              <Col xs={12} sm={6} md={4} className="mb-2">
                <Form.Group controlId="location.city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="New York"
                    {...register("location.city")}
                    isInvalid={!!errors.location?.city}
                  />
                  {errors.location?.city && (
                    <Form.Control.Feedback type="invalid">
                      {errors.location.city.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} className="mb-2">
                <Form.Group controlId="location.zip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="10001"
                    {...register("location.zip")}
                    isInvalid={!!errors.location?.zip}
                  />
                  {errors.location?.zip && (
                    <Form.Control.Feedback type="invalid">
                      {errors.location.zip.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col xs={12} sm={6} md={4} className="mb-2">
                <Form.Group controlId="location.country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="United States"
                    {...register("location.country")}
                    isInvalid={!!errors.location?.country}
                  />
                  {errors.location?.country && (
                    <Form.Control.Feedback type="invalid">
                      {errors.location.country.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} className="mb-2">
                <Form.Group controlId="location.continent">
                  <Form.Label>Continent</Form.Label>
                  <Form.Select
                    {...register("location.continent")}
                    isInvalid={!!errors.location?.continent}
                  >
                    <option value="">Select Continent</option>
                    <option value="Africa">Africa</option>
                    <option value="Antarctica">Antarctica</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="Australia">Australia</option>
                    <option value="South America">South America</option>
                  </Form.Select>
                  {errors.location?.continent && (
                    <Form.Control.Feedback type="invalid">
                      {errors.location.continent.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col xs={12} sm={12} md={8} className="mb-2">
                <Form.Group controlId="location.address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123 Main St, Apt 4B"
                    {...register("location.address")}
                    isInvalid={!!errors.location?.address}
                  />
                  {errors.location?.address && (
                    <Form.Control.Feedback type="invalid">
                      {errors.location.address.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Find Location Button */}
            <div className="text-center mt-3">
              <Button
                variant="primary"
                onClick={() => {
                  setGeocodeLocation(getLocationCopy());
                  setGeocodeRequested(true);
                }}
              >
                Find Location
              </Button>
            </div>

            {/* Display Map and Lat/Lng */}
            {geocodeRequested && isGeocoding && (
              <Alert variant="info" className="mt-3">
                Geocoding location...
              </Alert>
            )}
            {geocodeRequested && isGeocodeError && (
              <Alert variant="danger" className="mt-3">
                {geocodeError?.message ||
                  "Position not found, please enter a valid address."}
              </Alert>
            )}
            {latLng && (
              <>
                <Alert variant="success" className="mt-3">
                  <strong>Position Found!</strong> Please verify that the
                  location on the map matches the address details and ensure
                  all information is correct.
                </Alert>
                <div className="mt-3 d-flex justify-content-center">
                  <p className="me-4">Lat: {latLng.lat}</p>
                  <p>Lng: {latLng.lng}</p>
                </div>
                <div className="rounded">
                  <iframe
                    title="Venue Location"
                    className="w-100 border rounded"
                    height="400"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${latLng.lat},${latLng.lng}&z=12&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </>
            )}
          </Form.Group>
          <div className="text-center border-top border-2 mt-5">
            {/* Delete Venue Button */}
            <div className="text-center mt-3">
              {showDeleteAlert && (
                <Alert variant="danger" className="mb-3">
                  Are you sure you want to delete this venue? This action
                  cannot be undone. Click "Delete" again to confirm.
                </Alert>
              )}

              <Button
                variant="danger"
                onClick={() => {
                  if (showDeleteAlert) {
                    handleDelete();
                  } else {
                    setShowDeleteAlert(true);
                  }
                }}
                disabled={deleteVenueMutation.status === "pending"}
              >
                {deleteVenueMutation.status === "pending"
                  ? "Deleting Venue..."
                  : showDeleteAlert
                  ? "Confirm Delete"
                  : "Delete Venue"}
              </Button>
            </div>
            <Button
              variant="primary"
              type="submit"
              className="mt-4 px-4"
              disabled={updateVenueMutation.status === "pending"}
            >
              {updateVenueMutation.status === "pending"
                ? "Updating Venue..."
                : "Update Venue"}
            </Button>
            {/* Display warning message if there is one */}
            {message && (
              <MessageComponent message={message} onClose={clearMessage} />
            )}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="ms-auto">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditVenueModal;
