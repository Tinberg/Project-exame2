// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useVenueById } from "../../hooks/apiHooks/useVenues";

// import {
//   Alert,
//   Container,
//   Row,
//   Col,
//   Image,
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
// import BookingSection from "../../components/calendar/calendar";
// import "./venueDetails.scss";

// function VenueDetails() {
//   const { id } = useParams<{ id: string }>();

//   // -- Image Modal -- //
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

//   //-- Refs for scrolling to specific sections --//
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

//   const {
//     data: venue,
//     error,
//     isLoading,
//   } = useVenueById(id, { _owner: true, _bookings: true });

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
//       <section aria-labelledby="venue-name">
//         <Row>
//           {/* Venue Image and Name */}
//           <Col md={8} className="position-relative">
//             <h1 id="venue-name">{venue.name}</h1>
//             {venue.location.city && venue.location.country ? (
//               <p>
//                 {venue.location.city}, {venue.location.country}
//               </p>
//             ) : venue.location.city ? (
//               <p>{venue.location.city}</p>
//             ) : venue.location.country ? (
//               <p>{venue.location.country}</p>
//             ) : null}

//             {/* Main image */}
//             <Image
//               src={
//                 venue.media && venue.media.length > 0
//                   ? venue.media[0].url
//                   : defaultImage
//               }
//               alt={
//                 venue.media && venue.media.length > 0
//                   ? venue.media[0].alt
//                   : "Default venue image"
//               }
//               className="venue-image img-fluid rounded border"
//             />

//             {/* Overlay for image count */}
//             <div className="mb-2 me-4 position-absolute bottom-0 end-0 p-2 overlay-bg-transparent text-light rounded d-flex align-items-center">
//               <FontAwesomeIcon icon={faImages} className="me-2" />
//               <Button
//                 variant="link"
//                 className="text-white p-0"
//                 onClick={handleShowImagesModal}
//                 aria-label="Show All Images"
//               >
//                 {`Show Images (${imageCount})`}
//               </Button>
//             </div>
//           </Col>

//           {/* Meet The Owner section */}
//           <Col
//             md={4}
//             className="d-none d-md-flex align-items-start justify-content-center"
//           >
//             <div className="owner-section-big ms-2">
//               <h2 className="mb-3">Meet The Owner</h2>
//               {venue.owner && (
//                 <>
//                   <div className="d-flex align-items-center my-4">
//                     <Image
//                       src={
//                         venue.owner.avatar?.url ||
//                         "../../assets/images/profileImagee/noProfileImage.png"
//                       }
//                       roundedCircle
//                       className="owner-avatar"
//                     />
//                     <div className="ms-3">
//                       <p>
//                         <span className="fw-bolder">{venue.owner.name}</span>
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <p>
//                       <span className="fw-bolder">Bio:</span>
//                     </p>
//                     <p>{venue.owner.bio || "No bio available"}</p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </Col>
//         </Row>
//       </section>
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
//               aria-label="Previous Image"
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
//               aria-label="Next Image"
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
//       <div
//         className="my-3 page-navigation"
//         role="navigation"
//         aria-label="In-Page Section Navigation"
//       >
//         <div className="navigation-buttons border-bottom border-secondary border-3">
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
//       </div>

//       {/* Venue Details and Venue Facts Section */}
//       <section
//         ref={detailsRef}
//         className="my-5 border-bottom border-3 border-secondary"
//         aria-labelledby="venue-details"
//       >
//         <Row>
//           <Col md={8}>
//             <h2 id="venue-details" className="mb-4">
//               Venue Overview:
//             </h2>
//             <dl className="d-flex flex-column align-items-start mb-4">
//               <div className="mb-2">
//                 <dt>Description:</dt>
//                 <dd className="ms-0">{venue.description}</dd>{" "}
//               </div>
//               <div className="d-flex mb-1 ">
//                 <dt className="me-2">Price per night:</dt>
//                 <dd>${venue.price}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <dt className="me-2">Max Guests:</dt>
//                 <dd>{venue.maxGuests}</dd>
//               </div>
//             </dl>
//           </Col>

//           <Col
//             className="d-flex flex-column align-items-start align-items-md-center"
//             md={4}
//           >
//             <h2 className="mb-4">Venue Features:</h2>
//             <dl className="d-flex flex-column align-items-start">
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faStar} className="me-2" />
//                 <dt className="ms-1">Rating:</dt>
//                 <dd className="ms-2">{venue.rating}/5</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faCoffee} className="me-2" />
//                 <dt className="ms-1">Breakfast:</dt>
//                 <dd className="ms-2">{venue.meta?.breakfast ? "Yes" : "No"}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faCar} className="me-2" />
//                 <dt className="ms-1">Parking:</dt>
//                 <dd className="ms-2">{venue.meta?.parking ? "Yes" : "No"}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faPaw} className="me-2" />
//                 <dt className="ms-1">Pets Allowed:</dt>
//                 <dd className="ms-2">{venue.meta?.pets ? "Yes" : "No"}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faWifi} className="me-2" />
//                 <dt className="ms-1">WiFi:</dt>
//                 <dd className="ms-2">{venue.meta?.wifi ? "Yes" : "No"}</dd>
//               </div>
//             </dl>
//           </Col>
//         </Row>
//       </section>
//       {/* Book Now Section/Calendar */}
//       <div ref={bookRef} className="my-5">
//         <BookingSection venue={venue} />
//       </div>

//       {/* Location Section */}
//       <section ref={locationRef} className="my-5 border-top border-3 border-secondary" aria-labelledby="location">
//         <h2 id="location" className="mb-4 mt-5">
//           Location
//         </h2>
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
//       </section>

//       {/* Meet The Owner section (at bottom in smaller screens) */}
//       <section
//         className="d-block d-md-none my-5"
//         aria-labelledby="meet-the-owner-mobile"
//       >
//         <h2 id="meet-the-owner-mobile">Meet The Owner</h2>
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
//       </section>
//     </Container>
//   );
// }

// export default VenueDetails;

// import { useState, useEffect, useRef } from "react";
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// import { useGeocode } from "../../hooks/apiHooks/useGeocoding";
// import { useVenueById } from "../../hooks/apiHooks/useVenues";
// import { useParams } from "react-router-dom";
// import {
//   Alert,
//   Container,
//   Row,
//   Col,
//   Image,
//   Button,
//   Modal,
// } from "react-bootstrap";
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
// import BookingSection from "../../components/calendar/calendar";
// import "./venueDetails.scss";

// function VenueDetails() {
//   const { id } = useParams<{ id: string }>();

//   // -- Image Modal -- //
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

//   //-- Refs for scrolling to specific sections --//
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
//   } const { data: venue, error, isLoading } = useVenueById(id, { _owner: true, _bookings: true });

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
//   });

//   const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

//   const {
//     data: geocodedData,
//     isError: isGeocodeError,
//     error: geocodeError,
//   } = useGeocode(
//     venue
//       ? {
//           address: venue.location?.address,
//           city: venue.location?.city,
//           country: venue.location?.country,
//           continent: venue.location?.continent,
//         }
//       : {}
//   );

//   useEffect(() => {
//     if (geocodedData) {
//       setLatLng(geocodedData);
//     }
//   }, [geocodedData]);

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
//       <section aria-labelledby="venue-name">
//         <Row>
//           {/* Venue Image and Name */}
//           <Col md={8} className="position-relative">
//             <h1 id="venue-name">{venue.name}</h1>
//             {venue.location.city && venue.location.country ? (
//               <p>
//                 {venue.location.city}, {venue.location.country}
//               </p>
//             ) : venue.location.city ? (
//               <p>{venue.location.city}</p>
//             ) : venue.location.country ? (
//               <p>{venue.location.country}</p>
//             ) : null}

//             {/* Main image */}
//             <Image
//               src={
//                 venue.media && venue.media.length > 0
//                   ? venue.media[0].url
//                   : defaultImage
//               }
//               alt={
//                 venue.media && venue.media.length > 0
//                   ? venue.media[0].alt
//                   : "Default venue image"
//               }
//               className="venue-image img-fluid rounded border"
//             />

//             {/* Overlay for image count */}
//             <div className="mb-2 me-4 position-absolute bottom-0 end-0 p-2 overlay-bg-transparent text-light rounded d-flex align-items-center">
//               <FontAwesomeIcon icon={faImages} className="me-2" />
//               <Button
//                 variant="link"
//                 className="text-white p-0"
//                 onClick={handleShowImagesModal}
//                 aria-label="Show All Images"
//               >
//                 {`Show Images (${imageCount})`}
//               </Button>
//             </div>
//           </Col>

//           {/* Meet The Owner section */}
//           <Col
//             md={4}
//             className="d-none d-md-flex align-items-start justify-content-center"
//           >
//             <div className="owner-section-big ms-2">
//               <h2 className="mb-3">Meet The Owner</h2>
//               {venue.owner && (
//                 <>
//                   <div className="d-flex align-items-center my-4">
//                     <Image
//                       src={
//                         venue.owner.avatar?.url ||
//                         "../../assets/images/profileImagee/noProfileImage.png"
//                       }
//                       roundedCircle
//                       className="owner-avatar"
//                     />
//                     <div className="ms-3">
//                       <p>
//                         <span className="fw-bolder">{venue.owner.name}</span>
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <p>
//                       <span className="fw-bolder">Bio:</span>
//                     </p>
//                     <p>{venue.owner.bio || "No bio available"}</p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </Col>
//         </Row>
//       </section>
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
//               aria-label="Previous Image"
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
//               aria-label="Next Image"
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
//       <div
//         className="my-3 page-navigation"
//         role="navigation"
//         aria-label="In-Page Section Navigation"
//       >
//         <div className="navigation-buttons border-bottom border-secondary border-3">
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
//       </div>

//       {/* Venue Details and Venue Facts Section */}
//       <section
//         ref={detailsRef}
//         className="my-5 border-bottom border-3 border-secondary"
//         aria-labelledby="venue-details"
//       >
//         <Row>
//           <Col md={8}>
//             <h2 id="venue-details" className="mb-4">
//               Venue Overview:
//             </h2>
//             <dl className="d-flex flex-column align-items-start mb-4">
//               <div className="mb-2">
//                 <dt>Description:</dt>
//                 <dd className="ms-0">{venue.description}</dd>{" "}
//               </div>
//               <div className="d-flex mb-1 ">
//                 <dt className="me-2">Price per night:</dt>
//                 <dd>${venue.price}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <dt className="me-2">Max Guests:</dt>
//                 <dd>{venue.maxGuests}</dd>
//               </div>
//             </dl>
//           </Col>

//           <Col
//             className="d-flex flex-column align-items-start align-items-md-center"
//             md={4}
//           >
//             <h2 className="mb-4">Venue Features:</h2>
//             <dl className="d-flex flex-column align-items-start">
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faStar} className="me-2" />
//                 <dt className="ms-1">Rating:</dt>
//                 <dd className="ms-2">{venue.rating}/5</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faCoffee} className="me-2" />
//                 <dt className="ms-1">Breakfast:</dt>
//                 <dd className="ms-2">{venue.meta?.breakfast ? "Yes" : "No"}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faCar} className="me-2" />
//                 <dt className="ms-1">Parking:</dt>
//                 <dd className="ms-2">{venue.meta?.parking ? "Yes" : "No"}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faPaw} className="me-2" />
//                 <dt className="ms-1">Pets Allowed:</dt>
//                 <dd className="ms-2">{venue.meta?.pets ? "Yes" : "No"}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faWifi} className="me-2" />
//                 <dt className="ms-1">WiFi:</dt>
//                 <dd className="ms-2">{venue.meta?.wifi ? "Yes" : "No"}</dd>
//               </div>
//             </dl>
//           </Col>
//         </Row>
//       </section>
//       {/* Book Now Section/Calendar */}
//       <div ref={bookRef} className="my-5">
//         <BookingSection venue={venue} />
//       </div>
//       {/* Location Section */}
//       <section
//         ref={locationRef}
//         className="my-5 border-top border-3 border-secondary"
//         aria-labelledby="location"
//       >
//         <h2 id="location" className="mb-4 mt-5">
//           Location
//         </h2>
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

//         {/* Check for geocode error, map loading, and missing location */}
//         {isGeocodeError ? (
//           <Alert variant="warning" className="text-center">Unable to retrieve geolocation data: {geocodeError?.message}</Alert>
//         ) : latLng && isLoaded ? (
//           <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} zoom={12} center={latLng}>
//             <Marker position={latLng} />
//           </GoogleMap>
//         ) : (
//           <Alert variant="warning" className="text-center">Location information is not available for this venue.</Alert>
//         )}
//       </section>

//       {/* Meet The Owner section (at bottom in smaller screens) */}
//       <section
//         className="d-block d-md-none my-5"
//         aria-labelledby="meet-the-owner-mobile"
//       >
//         <h2 id="meet-the-owner-mobile">Meet The Owner</h2>
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
//       </section>
//     </Container>
//   );
// }

// export default VenueDetails;

// import { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useVenueById } from "../../hooks/apiHooks/useVenues";
// import { useGeocode } from "../../hooks/apiHooks/useGeocoding";
// import {
//   Alert,
//   Container,
//   Row,
//   Col,
//   Image,
//   Button,
//   Modal,
// } from "react-bootstrap";
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
// import BookingSection from "../../components/calendar/calendar";
// import "./venueDetails.scss";

// function VenueDetails() {
//   const { id } = useParams<{ id: string }>();

//   // -- Image Modal -- //
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

//   //-- Refs for scrolling to specific sections --//
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

//   const {
//     data: venue,
//     error,
//     isLoading,
//   } = useVenueById(id, { _owner: true, _bookings: true });

//   // Call geocoding hook if lat and lng are missing or set to `0`
//   const {
//     data: geocodeData,
//     isLoading: isGeocoding,
//     error: geocodeError,
//   } = useGeocode({
//     address: venue?.location.address,
//     city: venue?.location.city,
//     country: venue?.location.country,
//     continent: venue?.location.continent,
//   });

//   const coordinates =
//     venue?.location.lat && venue?.location.lng
//       ? { lat: venue.location.lat, lng: venue.location.lng }
//       : geocodeData;

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
//       <section aria-labelledby="venue-name">
//         <Row>
//           {/* Venue Image and Name */}
//           <Col md={8} className="position-relative">
//             <h1 id="venue-name">{venue.name}</h1>
//             {venue.location.city && venue.location.country ? (
//               <p>
//                 {venue.location.city}, {venue.location.country}
//               </p>
//             ) : venue.location.city ? (
//               <p>{venue.location.city}</p>
//             ) : venue.location.country ? (
//               <p>{venue.location.country}</p>
//             ) : null}

//             {/* Main image */}
//             <Image
//               src={
//                 venue.media && venue.media.length > 0
//                   ? venue.media[0].url
//                   : defaultImage
//               }
//               alt={
//                 venue.media && venue.media.length > 0
//                   ? venue.media[0].alt
//                   : "Default venue image"
//               }
//               className="venue-image img-fluid rounded border"
//             />

//             {/* Overlay for image count */}
//             <div className="mb-2 me-4 position-absolute bottom-0 end-0 p-2 overlay-bg-transparent text-light rounded d-flex align-items-center">
//               <FontAwesomeIcon icon={faImages} className="me-2" />
//               <Button
//                 variant="link"
//                 className="text-white p-0"
//                 onClick={handleShowImagesModal}
//                 aria-label="Show All Images"
//               >
//                 {`Show Images (${imageCount})`}
//               </Button>
//             </div>
//           </Col>

//           {/* Meet The Owner section */}
//           <Col
//             md={4}
//             className="d-none d-md-flex align-items-start justify-content-center"
//           >
//             <div className="owner-section-big ms-2">
//               <h2 className="mb-3">Meet The Owner</h2>
//               {venue.owner && (
//                 <>
//                   <div className="d-flex align-items-center my-4">
//                     <Image
//                       src={
//                         venue.owner.avatar?.url ||
//                         "../../assets/images/profileImagee/noProfileImage.png"
//                       }
//                       roundedCircle
//                       className="owner-avatar"
//                     />
//                     <div className="ms-3">
//                       <p>
//                         <span className="fw-bolder">{venue.owner.name}</span>
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <p>
//                       <span className="fw-bolder">Bio:</span>
//                     </p>
//                     <p>{venue.owner.bio || "No bio available"}</p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </Col>
//         </Row>
//       </section>
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
//               aria-label="Previous Image"
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
//               aria-label="Next Image"
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
//       <div
//         className="my-3 page-navigation"
//         role="navigation"
//         aria-label="In-Page Section Navigation"
//       >
//         <div className="navigation-buttons border-bottom border-secondary border-3">
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
//       </div>

//       {/* Venue Details and Venue Facts Section */}
//       <section
//         ref={detailsRef}
//         className="my-5 border-bottom border-3 border-secondary"
//         aria-labelledby="venue-details"
//       >
//         <Row>
//           <Col md={8}>
//             <h2 id="venue-details" className="mb-4">
//               Venue Overview:
//             </h2>
//             <dl className="d-flex flex-column align-items-start mb-4">
//               <div className="mb-2">
//                 <dt>Description:</dt>
//                 <dd className="ms-0">{venue.description}</dd>{" "}
//               </div>
//               <div className="d-flex mb-1 ">
//                 <dt className="me-2">Price per night:</dt>
//                 <dd>${venue.price}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <dt className="me-2">Max Guests:</dt>
//                 <dd>{venue.maxGuests}</dd>
//               </div>
//             </dl>
//           </Col>

//           <Col
//             className="d-flex flex-column align-items-start align-items-md-center"
//             md={4}
//           >
//             <h2 className="mb-4">Venue Features:</h2>
//             <dl className="d-flex flex-column align-items-start">
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faStar} className="me-2" />
//                 <dt className="ms-1">Rating:</dt>
//                 <dd className="ms-2">{venue.rating}/5</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faCoffee} className="me-2" />
//                 <dt className="ms-1">Breakfast:</dt>
//                 <dd className="ms-2">{venue.meta?.breakfast ? "Yes" : "No"}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faCar} className="me-2" />
//                 <dt className="ms-1">Parking:</dt>
//                 <dd className="ms-2">{venue.meta?.parking ? "Yes" : "No"}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faPaw} className="me-2" />
//                 <dt className="ms-1">Pets Allowed:</dt>
//                 <dd className="ms-2">{venue.meta?.pets ? "Yes" : "No"}</dd>
//               </div>
//               <div className="d-flex mb-2">
//                 <FontAwesomeIcon icon={faWifi} className="me-2" />
//                 <dt className="ms-1">WiFi:</dt>
//                 <dd className="ms-2">{venue.meta?.wifi ? "Yes" : "No"}</dd>
//               </div>
//             </dl>
//           </Col>
//         </Row>
//       </section>
//       {/* Book Now Section/Calendar */}
//       <div ref={bookRef} className="my-5">
//         <BookingSection venue={venue} />
//       </div>

//       {/* Location Section */}
//       <section
//         ref={locationRef}
//         className="my-5 border-top border-3 border-secondary"
//         aria-labelledby="location"
//       >
//         <Row className="mt-5">
//           <Col md={4} className="d-flex flex-column justify-content-around">
//             <h2 id="location" className="mb-4">
//               Location
//             </h2>
//             <p>
//               <span className="fw-bold">Address:</span> {venue.location.address}
//             </p>
//             <p>
//               <span className="fw-bold">City:</span> {venue.location.city}
//             </p>
//             <p>
//               <span className="fw-bold">Zip:</span> {venue.location.zip}
//             </p>
//             <p>
//               <span className="fw-bold">Country:</span> {venue.location.country}
//             </p>
//             <p>
//               <span className="fw-bold">Continent:</span>{" "}
//               {venue.location.continent}
//             </p>
//             <div className="weather-widget my-0 my-lg-5">
//               <p>
//                 <span className="fw-bold">Current Weather:</span> 25°C
//               </p>
//             </div>
//           </Col>
//           <Col md={8}>
//             <div className="map-placeholder ">
//               {coordinates ? (
//                 <iframe
//                   className="w-100 border rounded "
//                   src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=es;z=14&output=embed`}
//                   allowFullScreen
//                   loading="lazy"
//                 ></iframe>
//               ) : isGeocoding ? (
//                 <Alert variant="info" className="text-center my-3">
//                   Loading map...
//                 </Alert>
//               ) : geocodeError ? (
//                 <Alert variant="danger" className="text-center my-3">
//                   Unable to load map for this location.
//                 </Alert>
//               ) : (
//                 <Alert variant="warning" className="text-center my-3">
//                   Map information unavailable.
//                 </Alert>
//               )}
//             </div>
//           </Col>
//         </Row>
//       </section>

//       {/* Meet The Owner section (at bottom in smaller screens) */}
//       <section
//         className="d-block d-md-none my-5 pt-5 border-top border-3 border-secondary"
//         aria-labelledby="meet-the-owner-mobile"
//       >
//         <h2 id="meet-the-owner-mobile">Meet The Owner</h2>
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
//       </section>
//     </Container>
//   );
// }

// export default VenueDetails;

import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVenueById } from "../../hooks/apiHooks/useVenues";
import { useGeocode } from "../../hooks/apiHooks/useGeocoding";
import { useWeather } from "../../hooks/generalHooks/useWeather";
import {
  Alert,
  Container,
  Row,
  Col,
  Image,
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
import BookingSection from "../../components/calendar/calendar";
import "./venueDetails.scss";

function VenueDetails() {
  const { id } = useParams<{ id: string }>();

  // -- Image Modal -- //
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
  //  keyboard arrow navigation when FullsizeImagemodal is open
  useEffect(() => {
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

  //-- Refs for scrolling to specific sections --//
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

  const {
    data: venue,
    error,
    isLoading,
  } = useVenueById(id, { _owner: true, _bookings: true });

  //-- Call geocoding hook if lat and lng are missing or 0 --//
  const {
    data: geocodeData,
    isLoading: isGeocoding,
    error: geocodeError,
  } = useGeocode({
    address: venue?.location.address,
    city: venue?.location.city,
    country: venue?.location.country,
    continent: venue?.location.continent,
  });

  const coordinates =
    venue?.location.lat && venue?.location.lng
      ? { lat: venue.location.lat, lng: venue.location.lng }
      : geocodeData;

  //-- Fetch weather data using coordinates --//
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useWeather(coordinates?.lat ?? null, coordinates?.lng ?? null);

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
  return (
    <Container className="venue-details-container mt-5">
      <section aria-labelledby="venue-name">
        <Row>
          {/* Venue Image and Name */}
          <Col md={8} className="position-relative">
            <h1 id="venue-name">{venue.name}</h1>
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
      </section>
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
              aria-label="Previous Image"
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
              aria-label="Next Image"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </Modal.Body>

          {/* Image counter */}
          <div className="text-center mt-3">
            <p>
              Image {selectedImageIndex !== null ? selectedImageIndex + 1 : 0}{" "}
              of {imageCount}
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
      <div
        className="my-3 page-navigation"
        role="navigation"
        aria-label="In-Page Section Navigation"
      >
        <div className="navigation-buttons border-bottom border-secondary border-3">
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
      </div>

      {/* Venue Details and Venue Facts Section */}
      <section
        ref={detailsRef}
        className="my-5 border-bottom border-3 border-secondary"
        aria-labelledby="venue-details"
      >
        <Row>
          <Col md={8}>
            <h2 id="venue-details" className="mb-4">
              Venue Overview:
            </h2>
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
      </section>
      {/* Book Now Section/Calendar */}
      <div ref={bookRef} className="my-5">
        <BookingSection venue={venue} />
      </div>

      {/* Location Section */}
      <section
        ref={locationRef}
        className="my-5 border-top border-3 border-secondary"
        aria-labelledby="location"
      >
        <Row className="mt-5">
          <Col md={4} className="d-flex flex-column justify-content-around">
            <h2 id="location" className="mb-4">
              Location
            </h2>
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
              <span className="fw-bold">Continent:</span>{" "}
              {venue.location.continent}
            </p>
            {/* Weather information */}
            <div className="weather-widget my-0 my-lg-5">
              {isWeatherLoading ? (
                <Alert variant="info" className="text-center my-3">
                  Loading weather...
                </Alert>
              ) : weatherError ? (
                <Alert variant="warning" className="text-center my-3">
                  Unable to fetch weather data.
                </Alert>
              ) : (
                <p>
                  <span className="fw-bold">Current Weather:</span>{" "}
                  {weatherData?.temperature}°C, {weatherData?.weathercode}
                </p>
              )}
            </div>
          </Col>
          <Col md={8}>
            <div className="map-placeholder ">
              {coordinates ? (
                <iframe
                  className="w-100 border rounded "
                  src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=es;z=14&output=embed`}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              ) : isGeocoding ? (
                <Alert variant="info" className="text-center my-3">
                  Loading map...
                </Alert>
              ) : geocodeError ? (
                <Alert variant="danger" className="text-center my-3">
                  Unable to load map for this location.
                </Alert>
              ) : (
                <Alert variant="warning" className="text-center my-3">
                  Map information unavailable.
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </section>

      {/* Meet The Owner section (at bottom in smaller screens) */}
      <section
        className="d-block d-md-none my-5 pt-5 border-top border-3 border-secondary"
        aria-labelledby="meet-the-owner-mobile"
      >
        <h2 id="meet-the-owner-mobile">Meet The Owner</h2>
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
      </section>
    </Container>
  );
}

export default VenueDetails;
