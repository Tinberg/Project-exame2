
// import { useParams } from "react-router-dom";
// import { useVenueById } from "../../hooks/useVenues";
// import { Alert, Container, Row, Col, Image } from "react-bootstrap";
// import "./venueDetails.scss";

// function VenueDetails() {
//   const { id } = useParams<{ id: string }>(); // Get the venue ID from the URL params

//   // Early return if id is undefined
//   if (!id) {
//     return (
//       <Alert variant="warning" className="text-center">
//         Invalid venue ID.
//       </Alert>
//     );
//   }

//   // Use the hook to fetch the venue data
//   const { data: venue, error, isLoading } = useVenueById(id);

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
//         We’re having trouble loading venue details right now. Please try again later.
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

//   // Now we have the venue data, display it
//   return (
//     <Container className="venue-details-container">
//       <Row>
//         <Col>
//           <h1>{venue.name}</h1>
//           <p>{venue.description}</p>

//           {/* Display media images */}
//           {venue.media && venue.media.length > 0 ? (
//             <Row className="media-gallery">
//               {venue.media.map((mediaItem, index) => (
//                 <Col key={index} md={4} className="mb-3">
//                   <Image src={mediaItem.url} alt={mediaItem.alt} fluid rounded />
//                 </Col>
//               ))}
//             </Row>
//           ) : (
//             <p>No images available.</p>
//           )}

//           {/* Display other details */}
//           <h3>Details</h3>
//           <p><strong>Price per night:</strong> ${venue.price}</p>
//           <p><strong>Max Guests:</strong> {venue.maxGuests}</p>
//           <p><strong>Rating:</strong> {venue.rating}</p>

//           {/* Display amenities */}
//           <h3>Amenities</h3>
//           <ul>
//             <li>Wifi: {venue.meta?.wifi ? "Yes" : "No"}</li>
//             <li>Parking: {venue.meta?.parking ? "Yes" : "No"}</li>
//             <li>Breakfast: {venue.meta?.breakfast ? "Yes" : "No"}</li>
//             <li>Pets allowed: {venue.meta?.pets ? "Yes" : "No"}</li>
//           </ul>

//           {/* Display location */}
//           <h3>Location</h3>
//           <p><strong>Address:</strong> {venue.location?.address}</p>
//           <p><strong>City:</strong> {venue.location?.city}</p>
//           <p><strong>Zip:</strong> {venue.location?.zip}</p>
//           <p><strong>Country:</strong> {venue.location?.country}</p>
//           <p><strong>Continent:</strong> {venue.location?.continent}</p>

//           {/* Optionally display map if lat/lng are available */}
//           {venue.location?.lat && venue.location?.lng && (
//             <div className="map-placeholder">
//               {/* You can integrate Google Maps or any map component here */}
//               <p>Map location: ({venue.location.lat}, {venue.location.lng})</p>
//             </div>
//           )}

//           {/* Display creation and update timestamps */}
//           <p><strong>Created:</strong> {new Date(venue.created).toLocaleString()}</p>
//           <p><strong>Last Updated:</strong> {new Date(venue.updated).toLocaleString()}</p>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default VenueDetails;


import { useParams } from "react-router-dom";
import { useVenueById } from "../../hooks/useVenues";
import { Alert, Container, Row, Col, Image, Tab, Nav, ListGroup, Form, Button } from "react-bootstrap";
import { useEffect, useRef } from "react";
import "./venueDetails.scss";

function VenueDetails() {
  const { id } = useParams<{ id: string }>(); // Get the venue ID from the URL params

  // Refs for scrolling to specific sections
  const detailsRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Smooth scroll function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100, // Adjust for fixed nav if needed
        behavior: "smooth",
      });
    }
  };

  // Early return if id is undefined
  if (!id) {
    return (
      <Alert variant="warning" className="text-center">
        Invalid venue ID.
      </Alert>
    );
  }

  // Use the hook to fetch the venue data
  const { data: venue, error, isLoading } = useVenueById(id);

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
        We’re having trouble loading venue details right now. Please try again later.
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

  return (
    <Container className="venue-details-container my-5">
      <Row>
        {/* Venue information on the left */}
        <Col lg={8}>
          <h1>{venue.name}</h1>
          <p>{venue.location.city}, {venue.location.country}</p>

          {/* Main image */}
          {venue.media && venue.media.length > 0 ? (
            <Image src={venue.media[0].url} alt={venue.media[0].alt} fluid rounded className="mb-4" />
          ) : (
            <p>No images available.</p>
          )}

          {/* Tab navigation */}
          <Nav variant="tabs" defaultActiveKey="details" className="mb-3">
            <Nav.Item>
              <Nav.Link onClick={() => scrollToSection(detailsRef)}>Venue Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => scrollToSection(bookRef)}>Book Now</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => scrollToSection(locationRef)}>Location</Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Venue Details Section */}
          <div ref={detailsRef}>
            <h3>Details</h3>
            <p>{venue.description}</p>
            <p><strong>Price per night:</strong> ${venue.price}</p>
            <p><strong>Max Guests:</strong> {venue.maxGuests}</p>
            <p><strong>Rating:</strong> {venue.rating}</p>
          </div>

          {/* Book Now Section */}
          <div ref={bookRef} className="my-5">
            <h3>Book Now</h3>
            <Form>
              <Row>
                <Col md={4}>
                  <Form.Group controlId="fromDate">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="toDate">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="numGuests">
                    <Form.Label>Number of Guests (max {venue.maxGuests})</Form.Label>
                    <Form.Control type="number" max={venue.maxGuests} />
                  </Form.Group>
                </Col>
              </Row>
              <p className="mt-3"><strong>Total Price: $</strong>{venue.price * 3}</p>
              <Button variant="primary">Book Now</Button>
              <p className="mt-2"><small>The price may change until the booking is confirmed.</small></p>
            </Form>
          </div>

          {/* Location Section */}
          <div ref={locationRef} className="my-5">
            <h3>Location</h3>
            <p><strong>Address:</strong> {venue.location.address}</p>
            <p><strong>City:</strong> {venue.location.city}</p>
            <p><strong>Zip:</strong> {venue.location.zip}</p>
            <p><strong>Country:</strong> {venue.location.country}</p>
            <p><strong>Continent:</strong> {venue.location.continent}</p>

            {/* Map placeholder (Google Maps or another map service can be integrated here) */}
            <div className="map-placeholder">
              <iframe
                width="100%"
                height="350"
                src={`https://www.google.com/maps?q=${venue.location.lat},${venue.location.lng}&hl=es;z=14&output=embed`}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>

            {/* Optional Weather Widget */}
            <div className="weather-widget mt-3">
              <p><strong>Current Weather:</strong> 25°C</p>
            </div>
          </div>
        </Col>

        {/* Venue owner and venue facts on the right */}
        <Col lg={4}>
          <h3 className="text-center">Meet The Owner</h3>
          {venue.owner && (
            <div className="text-center mb-4">
              <Image
                src={venue.owner.avatar || "https://via.placeholder.com/150"}
                roundedCircle
                className="mb-2"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <p><strong>{venue.owner.name}</strong></p>
              <p>{venue.owner.bio || "No bio available"}</p>
            </div>
          )}

          <h3 className="text-center">Venue Facts</h3>
          <ListGroup className="text-center">
            <ListGroup.Item>
              <strong>Rating:</strong> {venue.rating}/10
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Breakfast:</strong> {venue.meta?.breakfast ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Parking:</strong> {venue.meta?.parking ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Pets Allowed:</strong> {venue.meta?.pets ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>WiFi:</strong> {venue.meta?.wifi ? "Yes" : "No"}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default VenueDetails;
