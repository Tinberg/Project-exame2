import React, { useState } from "react";
import { loginUser } from "../../services/api/endpoints/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
import { setAccessToken, setUserName } from "../../services/api/tokenService";
import { ErrorResponse } from "../../schemas/auth";

// Yup Schema for validation
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .matches(
      /@stud\.noroff\.no$/,
      "Email must be a valid stud.noroff.no address"
    )
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // state from navigation on success register
  const successMessage = location.state?.successMessage;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = { email, password };

    try {
      await loginSchema.validate(formData, { abortEarly: false });

      setLoading(true);

      const loginResponse = await loginUser(formData);

      const { accessToken, name } = loginResponse.data;

      setAccessToken(accessToken);
      setUserName(name);

      console.log("Login successful:", loginResponse);

      // Navigate to myProfile
      navigate("/myProfile");
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors.join(", "));
      } else if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || "Login error occurred");
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
              <h2 className="text-center mb-4">Log in to Holidaze</h2>
              <p className="text-center">
                Log in to book stunning venues or manage your rental spaces.
              </p>

              <Form onSubmit={handleLogin}>
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
                {successMessage && (
                  <Alert variant="success" className="mt-3">
                    {successMessage}
                  </Alert>
                )}
                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}

                <div className="d-grid mt-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                  </Button>
                </div>
              </Form>
              <div className="mt-3 text-center">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">Sign up here.</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
