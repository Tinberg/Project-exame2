
// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useVenueById } from "../../hooks/apiHooks/useVenues";

// import {
//   Alert,
//   Container,
//   Row,
//   Col,
//   Image,
//   Form,
//   Button,
//   Modal,
// } from "react-bootstrap";
// import { useRef, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faStar,
//   faCoffee,
//   faCar,
//   faPaw,
//   faWifi,
//   faImages,
//   faArrowLeft,
//   faArrowRight,
// } from "@fortawesome/free-solid-svg-icons";
// import defaultImage from "../../assets/images/venueImage/noVenueImage.jpg";
// import "./venueDetails.scss";

// function VenueDetails() {
//   const { id } = useParams<{ id: string }>();

//   // State for modals
//   const [showImagesModal, setShowImagesModal] = useState(false);
//   const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
//     null
//   );

//   const handleShowImagesModal = () => setShowImagesModal(true);
//   const handleCloseImagesModal = () => {
//     setShowImagesModal(false);
//     setSelectedImageIndex(null);
//   };

//   const handleSelectImage = (index: number) => {
//     setSelectedImageIndex(index);
//     setShowImagesModal(false);
//   };

//   const handleCloseSelectedImage = () => setSelectedImageIndex(null);

//   // Navigate to the next image
//   const showNextImage = () => {
//     if (
//       selectedImageIndex !== null &&
//       selectedImageIndex < (venue?.media.length ?? 0) - 1
//     ) {
//       setSelectedImageIndex((prev) => (prev !== null ? prev + 1 : 0));
//     }
//   };

//   // Navigate to the previous image
//   const showPrevImage = () => {
//     if (selectedImageIndex !== null && selectedImageIndex > 0) {
//       setSelectedImageIndex((prev) => (prev !== null ? prev - 1 : 0));
//     }
//   };

//   //  keyboard arrow navigation when FullsizeImagemodal is open
//   useEffect(() => {
//     const handleKeydown = (event: KeyboardEvent) => {
//       if (event.key === "ArrowRight") {
//         showNextImage();
//       } else if (event.key === "ArrowLeft") {
//         showPrevImage();
//       }
//     };

//     if (selectedImageIndex !== null) {
//       window.addEventListener("keydown", handleKeydown);
//     }

//     return () => {
//       window.removeEventListener("keydown", handleKeydown);
//     };
//   }, [selectedImageIndex]);

//   // Refs for scrolling to specific sections
//   const detailsRef = useRef<HTMLDivElement>(null);
//   const bookRef = useRef<HTMLDivElement>(null);
//   const locationRef = useRef<HTMLDivElement>(null);

//   const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
//     if (ref.current) {
//       window.scrollTo({
//         top: ref.current.offsetTop - 100,
//         behavior: "smooth",
//       });
//     }
//   };

//   if (!id) {
//     return (
//       <Alert variant="warning" className="text-center">
//         Invalid venue ID.
//       </Alert>
//     );
//   }

//   const { data: venue, error, isLoading } = useVenueById(id, { _owner: true });

//   if (isLoading) {
//     return (
//       <Alert variant="info" className="text-center">
//         Loading Venue Details...
//       </Alert>
//     );
//   }

//   if (error) {
//     return (
//       <Alert variant="danger" className="text-center">
//         We’re having trouble loading venue details right now. Please try again
//         later.
//       </Alert>
//     );
//   }

//   if (!venue) {
//     return (
//       <Alert variant="warning" className="text-center">
//         Venue not found.
//       </Alert>
//     );
//   }

//   const imageCount = venue.media.length;
//   const selectedImage =
//     selectedImageIndex !== null ? venue.media[selectedImageIndex] : null;
//   return (
//     <Container className="venue-details-container mt-5">
//       <Row>
//         {/* Venue Image and Name */}
//         <Col md={8} className="position-relative">
//           <h1>{venue.name}</h1>
//           {venue.location.city && venue.location.country ? (
//             <p>
//               {venue.location.city}, {venue.location.country}
//             </p>
//           ) : venue.location.city ? (
//             <p>{venue.location.city}</p>
//           ) : venue.location.country ? (
//             <p>{venue.location.country}</p>
//           ) : null}

//           {/* Main image */}
//           <Image
//             src={
//               venue.media && venue.media.length > 0
//                 ? venue.media[0].url
//                 : defaultImage
//             }
//             alt={
//               venue.media && venue.media.length > 0
//                 ? venue.media[0].alt
//                 : "Default venue image"
//             }
//             className="venue-image img-fluid rounded border"
//           />

//           {/* Overlay for image count */}
//           <div className="mb-2 me-4 position-absolute bottom-0 end-0 p-2 overlay-bg-transparent text-light rounded d-flex align-items-center">
//             <FontAwesomeIcon icon={faImages} className="me-2" />
//             <Button
//               variant="link"
//               className="text-white p-0"
//               onClick={handleShowImagesModal}
//               aria-label="Show All Images"
//             >
//               {`Show Images (${imageCount})`}
//             </Button>
//           </div>
//         </Col>

//         {/* Meet The Owner section */}
//         <Col
//           md={4}
//           className="d-none d-md-flex align-items-start justify-content-center"
//         >
//           <div className="owner-section-big ms-2">
//             <h2 className="mb-3">Meet The Owner</h2>
//             {venue.owner && (
//               <>
//                 <div className="d-flex align-items-center my-4">
//                   <Image
//                     src={
//                       venue.owner.avatar?.url ||
//                       "../../assets/images/profileImagee/noProfileImage.png"
//                     }
//                     roundedCircle
//                     className="owner-avatar"
//                   />
//                   <div className="ms-3">
//                     <p>
//                       <span className="fw-bolder">{venue.owner.name}</span>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <p>
//                     <span className="fw-bolder">Bio:</span>
//                   </p>
//                   <p>{venue.owner.bio || "No bio available"}</p>
//                 </div>
//               </>
//             )}
//           </div>
//         </Col>
//       </Row>
//       {/* Modal for Image Gallery */}
//       <Modal
//         show={showImagesModal && selectedImageIndex === null}
//         onHide={handleCloseImagesModal}
//         size="xl"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Image Gallery</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             {venue.media.map((image, index) => (
//               <Col md={4} key={index} className="mb-3">
//                 <Image
//                   src={image.url}
//                   alt={image.alt}
//                   className="img-gallery-modal img-fluid rounded"
//                   onClick={() => handleSelectImage(index)}
//                 />
//               </Col>
//             ))}
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={handleCloseImagesModal}
//             aria-label="Close Image modal"
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal for Full-Size Image */}
//       {selectedImage && (
//         <Modal show={true} onHide={handleCloseSelectedImage} size="xl" centered>
//           <Modal.Header closeButton>
//             <Modal.Title>{selectedImage?.alt || "Image Details"}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="d-flex justify-content-center align-items-center position-relative">
//             {/* Left arrow */}
//             <Button
//               className="position-absolute start-0 top-50 translate-middle-y"
//               onClick={showPrevImage}
//               variant="light"
//               aria-label="Previous image"
//             >
//               <FontAwesomeIcon icon={faArrowLeft} />
//             </Button>

//             {/* Image */}
//             <Image
//               src={selectedImage.url}
//               alt={selectedImage.alt}
//               className="img-fluid rounded"
//             />

//             {/* Right arrow */}
//             <Button
//               className="position-absolute end-0 top-50 translate-middle-y"
//               onClick={showNextImage}
//               variant="light"
//             >
//               <FontAwesomeIcon icon={faArrowRight} />
//             </Button>
//           </Modal.Body>

//           {/* Image counter */}
//           <div className="text-center mt-3">
//             <p>
//               Image {selectedImageIndex !== null ? selectedImageIndex + 1 : 0}{" "}
//               of {imageCount}
//             </p>
//           </div>

//           <Modal.Footer>
//             <Button
//               className="border"
//               variant="secondary"
//               aria-label="Close Image modal"
//               onClick={() => {
//                 handleCloseSelectedImage();
//                 setShowImagesModal(true);
//               }}
//             >
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}

//       {/* Page navigation */}
//       <section className="my-3 page-navigation">
//         <div className="navigation-buttons border-bottom border-secondary border-2">
//           <button
//             className="btn btn-link text-decoration-none"
//             onClick={() => scrollToSection(detailsRef)}
//           >
//             Venue Details
//           </button>
//           <button
//             className="btn btn-link text-decoration-none"
//             onClick={() => scrollToSection(bookRef)}
//           >
//             Book Now
//           </button>
//           <button
//             className="btn btn-link text-decoration-none"
//             onClick={() => scrollToSection(locationRef)}
//           >
//             Location
//           </button>
//         </div>
//       </section>

//       {/* Venue Details and Venue Facts Section */}
//       <Row ref={detailsRef} className="my-5">
//         <Col md={8}>
//           <h2 className="mb-4">Venue Overview:</h2>
//           <dl className="d-flex flex-column align-items-start mb-4">
//             <div className="mb-2">
//               <dt>Description:</dt>
//               <dd className="ms-0">{venue.description}</dd>{" "}
//             </div>
//             <div className="d-flex mb-1 ">
//               <dt className="me-2">Price per night:</dt>
//               <dd>${venue.price}</dd>
//             </div>
//             <div className="d-flex mb-2">
//               <dt className="me-2">Max Guests:</dt>
//               <dd>{venue.maxGuests}</dd>
//             </div>
//           </dl>
//         </Col>

//         <Col
//           className="d-flex flex-column align-items-start align-items-md-center"
//           md={4}
//         >
//           <h2 className="mb-4">Venue Features:</h2>
//           <dl className="d-flex flex-column align-items-start">
//             <div className="d-flex mb-2">
//               <FontAwesomeIcon icon={faStar} className="me-2" />
//               <dt className="ms-1">Rating:</dt>
//               <dd className="ms-2">{venue.rating}/5</dd>
//             </div>
//             <div className="d-flex mb-2">
//               <FontAwesomeIcon icon={faCoffee} className="me-2" />
//               <dt className="ms-1">Breakfast:</dt>
//               <dd className="ms-2">{venue.meta?.breakfast ? "Yes" : "No"}</dd>
//             </div>
//             <div className="d-flex mb-2">
//               <FontAwesomeIcon icon={faCar} className="me-2" />
//               <dt className="ms-1">Parking:</dt>
//               <dd className="ms-2">{venue.meta?.parking ? "Yes" : "No"}</dd>
//             </div>
//             <div className="d-flex mb-2">
//               <FontAwesomeIcon icon={faPaw} className="me-2" />
//               <dt className="ms-1">Pets Allowed:</dt>
//               <dd className="ms-2">{venue.meta?.pets ? "Yes" : "No"}</dd>
//             </div>
//             <div className="d-flex mb-2">
//               <FontAwesomeIcon icon={faWifi} className="me-2" />
//               <dt className="ms-1">WiFi:</dt>
//               <dd className="ms-2">{venue.meta?.wifi ? "Yes" : "No"}</dd>
//             </div>
//           </dl>
//         </Col>
//       </Row>

//       {/* Book Now Section */}
//       <div ref={bookRef} className="my-5">
//         <h2 className="mb-4">Book Now</h2>
//         <Form>
//           <Row>
//             <Col md={4}>
//               <Form.Group controlId="fromDate">
//                 <Form.Label>From Date</Form.Label>
//                 <Form.Control type="date" />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group controlId="toDate">
//                 <Form.Label>To Date</Form.Label>
//                 <Form.Control type="date" />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group controlId="numGuests">
//                 <Form.Label>
//                   Number of Guests (max {venue.maxGuests})
//                 </Form.Label>
//                 <Form.Control type="number" max={venue.maxGuests} />
//               </Form.Group>
//             </Col>
//           </Row>
//           <p className="mt-3">
//             <span className="fw-bold">Total Price: $</span>
//           </p>
//           <Button aria-label="Book now" variant="primary">
//             Book Now
//           </Button>
//           <p className="mt-2">
//             <small>The price may change until the booking is confirmed.</small>
//           </p>
//         </Form>
//       </div>

//       {/* Location Section */}
//       <div ref={locationRef} className="my-5">
//         <h2 className="mb-4">Location</h2>
//         <p>
//           <span className="fw-bold">Address:</span> {venue.location.address}
//         </p>
//         <p>
//           <span className="fw-bold">City:</span> {venue.location.city}
//         </p>
//         <p>
//           <span className="fw-bold">Zip:</span> {venue.location.zip}
//         </p>
//         <p>
//           <span className="fw-bold">Country:</span> {venue.location.country}
//         </p>
//         <p>
//           <span className="fw-bold">Continent:</span> {venue.location.continent}
//         </p>
//         <div className="weather-widget mt-3">
//           <p>
//             <span className="fw-bold">Current Weather:</span> 25°C
//           </p>
//         </div>
//         <div className="map-placeholder">
//           <iframe
//             width="100%"
//             height="350"
//             src={`https://www.google.com/maps?q=${venue.location.lat},${venue.location.lng}&hl=es;z=14&output=embed`}
//             allowFullScreen
//             loading="lazy"
//           ></iframe>
//         </div>
//       </div>

//       {/* Meet The Owner section (at bottom in smaller screens) */}
//       <div className="d-block d-md-none my-5">
//         <h2>Meet The Owner</h2>
//         {venue.owner && (
//           <>
//             <div className="d-flex align-items-center my-4">
//               <Image
//                 src={
//                   venue.owner.avatar?.url ||
//                   "../../assets/images/profileImagee/noProfileImage.png"
//                 }
//                 roundedCircle
//                 className="owner-avatar"
//               />
//               <div className="ms-3">
//                 <p>
//                   <span className="fw-bold">{venue.owner.name}</span>
//                 </p>
//               </div>
//             </div>
//             <div className="mb-4">
//               <p>
//                 <span className="fw-bold">Bio:</span>
//               </p>
//               <p>{venue.owner.bio || "No bio available"}</p>
//             </div>
//           </>
//         )}
//       </div>
//     </Container>
//   );
// }

// export default VenueDetails;


import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useVenueById } from "../../hooks/apiHooks/useVenues";
import {
  Alert,
  Container,
  Row,
  Col,
  Image,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCoffee,
  faCar,
  faPaw,
  faWifi,
  faImages,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import defaultImage from "../../assets/images/venueImage/noVenueImage.jpg";
import "./venueDetails.scss";

// Import form and validation libraries
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Import booking hook
import { useCreateBooking } from "../../hooks/apiHooks/useBookings";
import { BookingCreationData } from "../../schemas/booking";

// Import authentication context
import { useAuthContext } from "../../contexts/AuthContext";

// Import date library
import dayjs from "dayjs";

function VenueDetails() {
  const { id } = useParams<{ id: string }>();

  // State for modals
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const handleShowImagesModal = () => setShowImagesModal(true);
  const handleCloseImagesModal = () => {
    setShowImagesModal(false);
    setSelectedImageIndex(null);
  };

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
    setShowImagesModal(false);
  };

  const handleCloseSelectedImage = () => setSelectedImageIndex(null);

  // Navigate to the next image
  const showNextImage = () => {
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < (venue?.media.length ?? 0) - 1
    ) {
      setSelectedImageIndex((prev) => (prev !== null ? prev + 1 : 0));
    }
  };

  // Navigate to the previous image
  const showPrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex((prev) => (prev !== null ? prev - 1 : 0));
    }
  };

  // Keyboard arrow navigation when Full-Size Image modal is open
  useRef(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        showNextImage();
      } else if (event.key === "ArrowLeft") {
        showPrevImage();
      }
    };

    if (selectedImageIndex !== null) {
      window.addEventListener("keydown", handleKeydown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [selectedImageIndex]);

  // Refs for scrolling to specific sections
  const detailsRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  if (!id) {
    return (
      <Alert variant="warning" className="text-center">
        Invalid venue ID.
      </Alert>
    );
  }

  const { data: venue, error, isLoading } = useVenueById(id, { _owner: true });

  if (isLoading) {
    return (
      <Alert variant="info" className="text-center">
        Loading Venue Details...
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        We’re having trouble loading venue details right now. Please try again
        later.
      </Alert>
    );
  }

  if (!venue) {
    return (
      <Alert variant="warning" className="text-center">
        Venue not found.
      </Alert>
    );
  }

  const imageCount = venue.media.length;
  const selectedImage =
    selectedImageIndex !== null ? venue.media[selectedImageIndex] : null;

  // Get user from AuthContext
  const { user } = useAuthContext();

  // Define validation schema for booking form
  const schema = yup.object().shape({
    dateFrom: yup
      .date()
      .required("From Date is required")
      .typeError("Invalid Date"),
    dateTo: yup
      .date()
      .required("To Date is required")
      .typeError("Invalid Date")
      .min(yup.ref("dateFrom"), "To Date cannot be before From Date"),
    guests: yup
      .number()
      .required("Number of guests is required")
      .typeError("Guests must be a number")
      .min(1, "At least one guest is required")
      .max(
        venue.maxGuests,
        `Number of guests cannot exceed ${venue.maxGuests}`
      ),
  });

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<BookingCreationData>({
    resolver: yupResolver(schema),
  });

  // Watch form values
  const dateFrom = watch("dateFrom");
  const dateTo = watch("dateTo");
  const guests = watch("guests");

  // Calculate total price
  const calculateTotalPrice = () => {
    if (dateFrom && dateTo) {
      const nights = dayjs(dateTo).diff(dayjs(dateFrom), "day");
      return nights > 0 ? nights * venue.price : 0;
    }
    return 0;
  };

  // Use createBooking hook
  const {
    mutate: createBooking,
    isLoading: isBooking,
    isSuccess,
    isError,
    error: bookingError,
  } = useCreateBooking();

  // Handle form submission
  const onSubmit = (data: BookingCreationData) => {
    const formattedData = {
      dateFrom: dayjs(data.dateFrom).toISOString(),
      dateTo: dayjs(data.dateTo).toISOString(),
      guests: data.guests,
      venueId: venue.id,
    };
    createBooking(formattedData, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Container className="venue-details-container mt-5">
      <Row>
        {/* Venue Image and Name */}
        <Col md={8} className="position-relative">
          <h1>{venue.name}</h1>
          {venue.location.city && venue.location.country ? (
            <p>
              {venue.location.city}, {venue.location.country}
            </p>
          ) : venue.location.city ? (
            <p>{venue.location.city}</p>
          ) : venue.location.country ? (
            <p>{venue.location.country}</p>
          ) : null}

          {/* Main image */}
          <Image
            src={
              venue.media && venue.media.length > 0
                ? venue.media[0].url
                : defaultImage
            }
            alt={
              venue.media && venue.media.length > 0
                ? venue.media[0].alt
                : "Default venue image"
            }
            className="venue-image img-fluid rounded border"
          />

          {/* Overlay for image count */}
          <div className="mb-2 me-4 position-absolute bottom-0 end-0 p-2 overlay-bg-transparent text-light rounded d-flex align-items-center">
            <FontAwesomeIcon icon={faImages} className="me-2" />
            <Button
              variant="link"
              className="text-white p-0"
              onClick={handleShowImagesModal}
              aria-label="Show All Images"
            >
              {`Show Images (${imageCount})`}
            </Button>
          </div>
        </Col>

        {/* Meet The Owner section */}
        <Col
          md={4}
          className="d-none d-md-flex align-items-start justify-content-center"
        >
          <div className="owner-section-big ms-2">
            <h2 className="mb-3">Meet The Owner</h2>
            {venue.owner && (
              <>
                <div className="d-flex align-items-center my-4">
                  <Image
                    src={
                      venue.owner.avatar?.url ||
                      "../../assets/images/profileImagee/noProfileImage.png"
                    }
                    roundedCircle
                    className="owner-avatar"
                  />
                  <div className="ms-3">
                    <p>
                      <span className="fw-bolder">{venue.owner.name}</span>
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <p>
                    <span className="fw-bolder">Bio:</span>
                  </p>
                  <p>{venue.owner.bio || "No bio available"}</p>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>

      {/* Modal for Image Gallery */}
      <Modal
        show={showImagesModal && selectedImageIndex === null}
        onHide={handleCloseImagesModal}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {venue.media.map((image, index) => (
              <Col md={4} key={index} className="mb-3">
                <Image
                  src={image.url}
                  alt={image.alt}
                  className="img-gallery-modal img-fluid rounded"
                  onClick={() => handleSelectImage(index)}
                />
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseImagesModal}
            aria-label="Close Image modal"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Full-Size Image */}
      {selectedImage && (
        <Modal show={true} onHide={handleCloseSelectedImage} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedImage?.alt || "Image Details"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center align-items-center position-relative">
            {/* Left arrow */}
            <Button
              className="position-absolute start-0 top-50 translate-middle-y"
              onClick={showPrevImage}
              variant="light"
              aria-label="Previous image"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>

            {/* Image */}
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="img-fluid rounded"
            />

            {/* Right arrow */}
            <Button
              className="position-absolute end-0 top-50 translate-middle-y"
              onClick={showNextImage}
              variant="light"
              aria-label="Next image"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </Modal.Body>

          {/* Image counter */}
          <div className="text-center mt-3">
            <p>
              Image {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} of{" "}
              {imageCount}
            </p>
          </div>

          <Modal.Footer>
            <Button
              className="border"
              variant="secondary"
              aria-label="Close Image modal"
              onClick={() => {
                handleCloseSelectedImage();
                setShowImagesModal(true);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Page navigation */}
      <section className="my-3 page-navigation">
        <div className="navigation-buttons border-bottom border-secondary border-2">
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => scrollToSection(detailsRef)}
          >
            Venue Details
          </button>
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => scrollToSection(bookRef)}
          >
            Book Now
          </button>
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => scrollToSection(locationRef)}
          >
            Location
          </button>
        </div>
      </section>

      {/* Venue Details and Venue Facts Section */}
      <Row ref={detailsRef} className="my-5">
        <Col md={8}>
          <h2 className="mb-4">Venue Overview:</h2>
          <dl className="d-flex flex-column align-items-start mb-4">
            <div className="mb-2">
              <dt>Description:</dt>
              <dd className="ms-0">{venue.description}</dd>{" "}
            </div>
            <div className="d-flex mb-1 ">
              <dt className="me-2">Price per night:</dt>
              <dd>${venue.price}</dd>
            </div>
            <div className="d-flex mb-2">
              <dt className="me-2">Max Guests:</dt>
              <dd>{venue.maxGuests}</dd>
            </div>
          </dl>
        </Col>

        <Col
          className="d-flex flex-column align-items-start align-items-md-center"
          md={4}
        >
          <h2 className="mb-4">Venue Features:</h2>
          <dl className="d-flex flex-column align-items-start">
            <div className="d-flex mb-2">
              <FontAwesomeIcon icon={faStar} className="me-2" />
              <dt className="ms-1">Rating:</dt>
              <dd className="ms-2">{venue.rating}/5</dd>
            </div>
            <div className="d-flex mb-2">
              <FontAwesomeIcon icon={faCoffee} className="me-2" />
              <dt className="ms-1">Breakfast:</dt>
              <dd className="ms-2">{venue.meta?.breakfast ? "Yes" : "No"}</dd>
            </div>
            <div className="d-flex mb-2">
              <FontAwesomeIcon icon={faCar} className="me-2" />
              <dt className="ms-1">Parking:</dt>
              <dd className="ms-2">{venue.meta?.parking ? "Yes" : "No"}</dd>
            </div>
            <div className="d-flex mb-2">
              <FontAwesomeIcon icon={faPaw} className="me-2" />
              <dt className="ms-1">Pets Allowed:</dt>
              <dd className="ms-2">{venue.meta?.pets ? "Yes" : "No"}</dd>
            </div>
            <div className="d-flex mb-2">
              <FontAwesomeIcon icon={faWifi} className="me-2" />
              <dt className="ms-1">WiFi:</dt>
              <dd className="ms-2">{venue.meta?.wifi ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </Col>
      </Row>

      {/* Book Now Section */}
      <div ref={bookRef} className="my-5">
        <h2 className="mb-4">Book Now</h2>
        {!user ? (
          <Alert variant="warning">
            Please <a href="/login">login</a> to make a booking.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={4}>
                <Form.Group controlId="dateFrom">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("dateFrom")}
                    isInvalid={!!errors.dateFrom}
                    min={dayjs().format("YYYY-MM-DD")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dateFrom?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="dateTo">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("dateTo")}
                    isInvalid={!!errors.dateTo}
                    min={dateFrom || dayjs().format("YYYY-MM-DD")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dateTo?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="guests">
                  <Form.Label>
                    Number of Guests (max {venue.maxGuests})
                  </Form.Label>
                  <Form.Control
                    type="number"
                    {...register("guests")}
                    isInvalid={!!errors.guests}
                    min={1}
                    max={venue.maxGuests}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.guests?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <p className="mt-3">
              <span className="fw-bold">Total Price: $</span>
              {calculateTotalPrice()}
            </p>
            <Button
              aria-label="Book now"
              variant="primary"
              type="submit"
              disabled={isBooking}
            >
              {isBooking ? "Booking..." : "Book Now"}
            </Button>
            <p className="mt-2">
              <small>The price may change until the booking is confirmed.</small>
            </p>

            {isSuccess && (
              <Alert variant="success" className="mt-3">
                Booking successful!
              </Alert>
            )}
            {isError && (
              <Alert variant="danger" className="mt-3">
                {bookingError?.message || "Booking failed. Please try again."}
              </Alert>
            )}
          </Form>
        )}
      </div>

      {/* Location Section */}
      <div ref={locationRef} className="my-5">
        <h2 className="mb-4">Location</h2>
        <p>
          <span className="fw-bold">Address:</span> {venue.location.address}
        </p>
        <p>
          <span className="fw-bold">City:</span> {venue.location.city}
        </p>
        <p>
          <span className="fw-bold">Zip:</span> {venue.location.zip}
        </p>
        <p>
          <span className="fw-bold">Country:</span> {venue.location.country}
        </p>
        <p>
          <span className="fw-bold">Continent:</span> {venue.location.continent}
        </p>
        <div className="weather-widget mt-3">
          <p>
            <span className="fw-bold">Current Weather:</span> 25°C
          </p>
        </div>
        <div className="map-placeholder">
          <iframe
            width="100%"
            height="350"
            src={`https://www.google.com/maps?q=${venue.location.lat},${venue.location.lng}&hl=es;z=14&output=embed`}
            allowFullScreen
            loading="lazy"
            title="Venue Location"
          ></iframe>
        </div>
      </div>

      {/* Meet The Owner section (at bottom in smaller screens) */}
      <div className="d-block d-md-none my-5">
        <h2>Meet The Owner</h2>
        {venue.owner && (
          <>
            <div className="d-flex align-items-center my-4">
              <Image
                src={
                  venue.owner.avatar?.url ||
                  "../../assets/images/profileImagee/noProfileImage.png"
                }
                roundedCircle
                className="owner-avatar"
              />
              <div className="ms-3">
                <p>
                  <span className="fw-bold">{venue.owner.name}</span>
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p>
                <span className="fw-bold">Bio:</span>
              </p>
              <p>{venue.owner.bio || "No bio available"}</p>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default VenueDetails;
