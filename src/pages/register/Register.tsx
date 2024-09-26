import React, { useState } from "react";
import { registerUser } from "../../services/api/endpoints/auth";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import * as Yup from "yup";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

// Yup Schema for validation
const registrationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .matches(/@stud.noroff.no$/, "Email must be a valid stud.noroff.no address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

// Handles user registration, validates form, submits to API, and redirects to login on success.
const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = { username, email, password };

    try {
      await registrationSchema.validate(formData, { abortEarly: false });

      const payload = {
        name: username,
        email,
        password,
        venueManager: false,
      };

      setLoading(true);

      const registerResponse = await registerUser(payload);
      console.log("Register response:", registerResponse);

      // Navigate to login with success state
      navigate("/login", { state: { successMessage: "Registration successful! Please log in." } });
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors.join(", "));
      } else if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message || "Registration error occurred"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <Row className="w-100">
        <Col xs={12} md="auto" className="mx-auto">
          <Card className="shadow">
            <Card.Body className="py-4 px-md-4 bg-secondary">
              <h2 className="text-center mb-4">Register to Holidaze</h2>
              <p className="text-center">
                Join Holidaze! Sign up to book stunning venues or list and
                manage your own rental spaces.
              </p>
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your student email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}

                <div className="d-grid mt-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </div>
              </Form>
              <div className="mt-3 text-center">
                <p>
                  Already have an account? <Link to="/login">Log in here.</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;


