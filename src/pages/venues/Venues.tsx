

function Venues() {
    return (
      <div className="register-container">
        <h1>Sign Up</h1>
      </div>
    );
  }
  
  export default Venues;
  

//   import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Form } from "react-bootstrap";
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// import { getVenues } from '../../../services/api/endpoints/venues';  // Importing the service

// function Venues() {
//   const [venues, setVenues] = useState([]);

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your actual API key
//   });

//   // Fetch venues from the service
//   useEffect(() => {
//     const fetchVenues = async () => {
//       try {
//         const data = await getVenues(); // Calling the getVenues function from services
//         setVenues(data); // Set venues in the state
//       } catch (error) {
//         console.error("Error fetching venues:", error);
//       }
//     };

//     fetchVenues();
//   }, []);

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <Container fluid>
//       <Row>
//         {/* Left column for venue cards */}
//         <Col md={4} className="overflow-auto" style={{ height: "100vh" }}>
//           <h2>Venues</h2>
//           <Form.Group controlId="filterBy">
//             <Form.Label>Filter By</Form.Label>
//             <Form.Control as="select">
//               <option>Capacity</option>
//               <option>Price</option>
//             </Form.Control>
//           </Form.Group>

//           <Form.Group controlId="sortBy">
//             <Form.Label>Sort By</Form.Label>
//             <Form.Control as="select">
//               <option>Newest</option>
//               <option>Price</option>
//             </Form.Control>
//           </Form.Group>

//           {venues.map((venue) => (
//             <Card key={venue.id} className="mb-3">
//               <Card.Img variant="top" src={venue.media[0]?.url || "default.jpg"} />
//               <Card.Body>
//                 <Card.Title>{venue.name}</Card.Title>
//                 <Card.Text>
//                   Capacity: {venue.maxGuests} guests
//                   <br />
//                   Price: ${venue.price}
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           ))}
//         </Col>

//         {/* Right column for Google Map */}
//         <Col md={8} style={{ height: "100vh" }}>
//           <GoogleMap
//             center={{ lat: venues[0]?.location.lat || 0, lng: venues[0]?.location.lng || 0 }}
//             zoom={12}
//             mapContainerStyle={{ width: "100%", height: "100%" }}
//           >
//             {venues.map((venue) => (
//               <Marker
//                 key={venue.id}
//                 position={{ lat: venue.location.lat, lng: venue.location.lng }}
//               />
//             ))}
//           </GoogleMap>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Venues;
