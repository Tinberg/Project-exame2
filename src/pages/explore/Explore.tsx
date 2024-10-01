// import { useState, useEffect } from "react";
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// import { getVenues } from "../../services/api";
// import { useNavigate } from "react-router-dom";
// import { Venue } from "../../schemas";
// import { Card, Button, Container, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import "./explore.scss";

// const mapContainerStyle = {
//   width: "100%",
//   height: "100%",
// };

// const center = {
//   lat: 59.911491,
//   lng: 10.757933,
// };

// const getLatLngFromGeocoding = async (location: Partial<{ address: string; city: string; country: string; continent: string }>) => {
//   let locationQuery = "";
//   if (location.address) locationQuery = location.address;
//   if (location.city) locationQuery += location.address ? `, ${location.city}` : location.city;
//   if (location.country) locationQuery += location.city || location.address ? `, ${location.country}` : location.country;
//   if (location.continent) locationQuery += location.country || location.city || location.address ? `, ${location.continent}` : location.continent;

//   if (!locationQuery) return null;

//   try {
//     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
//       params: { address: locationQuery, key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY },
//     });
//     if (response.data.results.length > 0) {
//       const { lat, lng } = response.data.results[0].geometry.location;
//       return { lat, lng };
//     }
//     throw new Error("No location found");
//   } catch (error) {
//     console.error("Geocoding error:", error);
//     return null;
//   }
// };

// function Explore() {
//   const [venues, setVenues] = useState<Venue[]>([]);
//   const [hoveredVenue, setHoveredVenue] = useState<Venue | null>(null);
//   const navigate = useNavigate();

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
//   });

//   useEffect(() => {
//     const fetchVenues = async () => {
//       const data = await getVenues();
//       setVenues(data);
//     };
//     fetchVenues();
//   }, []);

//   const handleVenueHover = async (venue: Venue) => {
//     if (venue.location && venue.location.lat !== null && venue.location.lng !== null) {
//       setHoveredVenue(venue);
//     } else {
//       const latLng = await getLatLngFromGeocoding({
//         address: venue.location.address,
//         city: venue.location.city,
//         country: venue.location.country,
//         continent: venue.location.continent,
//       });

//       if (latLng) {
//         const venueWithLatLng = {
//           ...venue,
//           location: { ...venue.location, lat: latLng.lat, lng: latLng.lng },
//         };
//         setHoveredVenue(venueWithLatLng);
//       }
//     }
//   };

//   const handleVenueClick = (venueId: string) => {
//     navigate(`/venue/${venueId}`);
//   };

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <Container fluid className="explore-container">
//       <Row>
//         <Col>
//           <h1>Explore Venues</h1>
//         </Col>
//       </Row>
//       <Row>
//         <Col md={6} className="venues-list">
//           <Row>
//             {venues.map((venue) => (
//               <Col md={6} key={venue.id} className="mb-3">
//                 <Card className="venue-card" onMouseEnter={() => handleVenueHover(venue)} onClick={() => handleVenueClick(venue.id)}>
//                   {venue.media && venue.media[0] && (
//                     <Card.Img
//                       variant="top"
//                       src={venue.media[0].url}
//                       alt={venue.media[0].alt}
//                     />
//                   )}
//                   <Card.Body>
//                     <Card.Title className="venue-name">{venue.name}</Card.Title>
//                     <p className="venue-location">
//                       {venue.location.city && venue.location.country
//                         ? `${venue.location.city}, ${venue.location.country}`
//                         : venue.location.city || venue.location.country || "Location not available"}
//                     </p>
//                     <div className="venue-details">
//                       <p><strong>Capacity:</strong> {venue.maxGuests} Guests</p>
//                       <p><strong>Price:</strong> ${venue.price}</p>
//                     </div>
//                     <Button variant="primary" className="w-100">View Details</Button>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </Col>
//         <Col md={6} className="map-container">
//           <GoogleMap
//             mapContainerStyle={mapContainerStyle}
//             zoom={12}
//             center={
//               hoveredVenue?.location?.lat && hoveredVenue?.location?.lng
//                 ? { lat: hoveredVenue.location.lat, lng: hoveredVenue.location.lng }
//                 : center
//             }
//           >
//             {hoveredVenue?.location?.lat && hoveredVenue?.location?.lng && (
//               <Marker position={{ lat: hoveredVenue.location.lat, lng: hoveredVenue.location.lng }} />
//             )}
//           </GoogleMap>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

//Make scroll loading and error handling. also move the function to another page if used somewhere else

import { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { getVenues } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Venue } from "../../schemas";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import "./explore.scss";

const center = {
  lat: 59.911491,
  lng: 10.757933,
};

// Function to get latitude and longitude from the Google Geocoding API
const getLatLngFromGeocoding = async (
  location: Partial<{
    address: string;
    city: string;
    country: string;
    continent: string;
  }>
) => {
  let locationQuery = "";

  if (location.address) locationQuery += location.address;
  if (location.city)
    locationQuery += locationQuery ? `, ${location.city}` : location.city;
  if (location.country)
    locationQuery += locationQuery ? `, ${location.country}` : location.country;
  if (location.continent)
    locationQuery += locationQuery
      ? `, ${location.continent}`
      : location.continent;

  if (!locationQuery) return null;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: locationQuery,
          key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        },
      }
    );
    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    }
    console.error("No location found for:", locationQuery);
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

function Explore() {
  const [geocodedVenues, setGeocodedVenues] = useState<{
    [venueId: string]: { lat: number; lng: number };
  }>(() => {
    const cached = sessionStorage.getItem("geocodedVenues");
    try {
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const [venues, setVenues] = useState<Venue[]>([]);
  const [hoveredVenue, setHoveredVenue] = useState<Venue | null>(null);
  const [hoveredLatLng, setHoveredLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const handleVenueHover = async (venue: Venue) => {
    // No hover logic on smaller screens
    if (window.innerWidth < 1200) {
      return;
    }

    // Check if the venue's location is already cached
    if (geocodedVenues[venue.id]) {
      setHoveredVenue(venue);
      setHoveredLatLng(geocodedVenues[venue.id]);
      return;
    }

    // Use the venue's existing location if available
    if (venue.location?.lat != null && venue.location?.lng != null) {
      const latLng = {
        lat: venue.location.lat,
        lng: venue.location.lng,
      };
      setHoveredVenue(venue);
      setHoveredLatLng(latLng);
      setGeocodedVenues((prev) => {
        const updatedVenues = { ...prev, [venue.id]: latLng };
        sessionStorage.setItem("geocodedVenues", JSON.stringify(updatedVenues));
        return updatedVenues;
      });
    } else {
      // Use geocoding to get location if not there
      const latLng = await getLatLngFromGeocoding({
        address: venue.location?.address,
        city: venue.location?.city,
        country: venue.location?.country,
        continent: venue.location?.continent,
      });

      if (latLng) {
        // Update the venue with the new location
        const venueWithLatLng = {
          ...venue,
          location: {
            ...venue.location,
            lat: latLng.lat,
            lng: latLng.lng,
          },
        };
        setHoveredVenue(venueWithLatLng);
        setHoveredLatLng(latLng);
        setGeocodedVenues((prev) => {
          const updatedVenues = { ...prev, [venue.id]: latLng };
          sessionStorage.setItem(
            "geocodedVenues",
            JSON.stringify(updatedVenues)
          );
          return updatedVenues;
        });
      } else {
        console.error("Could not geocode venue:", venue.name);
      }
    }
  };

  const handleVenueClick = (venueId: string) => {
    navigate(`/venueDetails/${venueId}`);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Container fluid className="explore-container py-3">
      <Row>
        <Col>
          <h1 className="text-center">Explore Venues</h1>
        </Col>
      </Row>
      <Row>
        <Col xxl={4} xl={4} lg={12} className="venues-list overflow-auto">
          <Row>
            {venues.map((venue) => (
              <Col
                md={12}
                key={venue.id}
                className="mb-3 d-flex align-items-stretch"
              >
                <Card
                  className="h-100 w-100 d-flex flex-row"
                  onMouseEnter={() => handleVenueHover(venue)}
                  onClick={() => handleVenueClick(venue.id)}
                >
                  {venue.media?.[0]?.url && (
                    <Card.Img
                      variant="left"
                      src={venue.media[0].url}
                      alt={venue.media[0].alt || "Venue image"}
                      className="venue-image w-50"
                    />
                  )}
                  <Card.Body className="d-flex flex-column justify-content-between w-50">
                    <Card.Title className="fw-bold">{venue.name}</Card.Title>
                    <p>
                      {venue.location?.city && venue.location?.country
                        ? `${venue.location.city}, ${venue.location.country}`
                        : "Location not available"}
                    </p>
                    <p>
                      <span className="fw-bold">Capacity:</span>{" "}
                      {venue.maxGuests} Guests
                    </p>
                    <p>
                      <span className="fw-bold">Price:</span> ${venue.price}
                    </p>
                    <div className="mt-auto">
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => handleVenueClick(venue.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col
          xxl={8}
          xl={8}
          lg={8}
          className="map-container position-sticky d-none d-xl-block"
        >
          <GoogleMap
            mapContainerClassName="w-100 h-100"
            zoom={12}
            center={hoveredLatLng ?? center}
          >
            {hoveredLatLng && <Marker position={hoveredLatLng} />}
          </GoogleMap>

          {hoveredVenue && hoveredLatLng && (
            <div className="small-venue-card position-absolute">
              <Card>
                {hoveredVenue.media?.[0]?.url && (
                  <Card.Img
                    variant="top"
                    className="small-card-img"
                    src={hoveredVenue.media[0].url}
                    alt={hoveredVenue.media[0].alt || "Venue image"}
                  />
                )}
                <Card.Body>
                  <Card.Title>{hoveredVenue.name}</Card.Title>
                  <p>
                    {hoveredVenue.location?.city &&
                    hoveredVenue.location?.country
                      ? `${hoveredVenue.location.city}, ${hoveredVenue.location.country}`
                      : "Location not available"}
                  </p>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleVenueClick(hoveredVenue.id)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Explore;
