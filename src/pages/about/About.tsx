import { Container, Row, Col, Image, Button } from "react-bootstrap";
import aboutImage from "../../assets/images/aboutImage/about.jpg";

function About() {
  return (
    <Container className="about-container py-5">
      {/* Hero Section */}
      <section id="hero-section">
        <Row className="align-items-stretch">
          {/* Image Section */}
          <Col md={6} className="d-flex justify-content-center mb-4 mb-md-0">
            <Image
              src={aboutImage}
              alt="wing of a plane in the sky"
              fluid
              rounded
              className="shadow-lg about-image"
            />
          </Col>

          {/* Text Section */}
          <Col md={6} className="text-md-start text-center">
            <h1 className="display-5 fw-bold">Welcome to Holidaze</h1>
            <p className="lead mb-4">
              At Holidaze, we believe travel is about connection, discovery, and
              creating unforgettable moments. Whether you're seeking a serene
              retreat or vibrant city escape, Holidaze has something for everyone.
            </p>
            <p>
              Join our community of travelers and hosts to explore unique stays,
              experience extraordinary destinations, and share your own space with
              others looking for adventure. Together, we make every journey
              unforgettable.
            </p>
            <Button
              variant="primary"
              size="lg"
              className="mt-3 shadow-sm"
              onClick={() => (window.location.href = "/explore")}
            >
              Explore Venues
            </Button>
          </Col>
        </Row>
      </section>

      {/* Features Section */}
      <section id="features-section">
        {/* Card Section */}
        <Row className="text-center mt-4 gy-4">
          <Col md={4}>
            <div className="card-wrapper p-3 border rounded bg-light shadow-sm h-100 d-flex flex-column">
              <p className="fs-5 fw-bold">Unique Stays</p>
              <p className="flex-grow-1">
                Discover accommodations you won't find anywhere else – from
                charming cottages to modern lofts.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="card-wrapper p-3 border rounded bg-light shadow-sm h-100 d-flex flex-column">
              <p className="fs-5 fw-bold">Seamless Hosting</p>
              <p className="flex-grow-1">
                Effortlessly share your space with others and earn income while
                being part of our travel community.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="card-wrapper p-3 border rounded bg-light shadow-sm h-100 d-flex flex-column">
              <p className="fs-5 fw-bold">Trusted Community</p>
              <p className="flex-grow-1">
                Join millions of travelers and hosts who trust Holidaze to make
                their journeys memorable.
              </p>
            </div>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default About;
