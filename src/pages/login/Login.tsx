import React, { useState, useContext } from "react";
import "./login.scss"
import { loginUser } from "../../services/api/endpoints/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import * as Yup from "yup";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { ErrorResponse } from "../../schemas/auth";
import { useMessage } from "../../hooks/useMessage";
import Message from "../../components/message/message";
import { UserContext } from "../../contexts/UserContext"; 

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

// Handles user login, validates form, submits to API, and redirects to profile on success.
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // success message from register (state)
  const successMessage = location.state?.successMessage;
  // Custom hook for managing messages (errors, success)
  const { message, showMessage, clearMessage } = useMessage();

  // Get setUser from UserContext
  const { setUser } = useContext(UserContext)!;

  React.useEffect(() => {
    if (successMessage) {
      showMessage("success", successMessage);
    }
    navigate(location.pathname, { replace: true });
  }, [successMessage]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();

    const formData = { email, password };

    try {
      await loginSchema.validate(formData, { abortEarly: false });

      setLoading(true);

      const loginResponse = await loginUser(formData);

      const { accessToken, name, avatar } = loginResponse.data;
      const avatarUrl = avatar?.url || "";

      // Update user state in UserContext
      setUser({
        accessToken,
        userName: name,
        avatarUrl,
      });

      console.log("Login successful:", loginResponse);

      // Navigate to myProfile
      navigate("/myProfile");
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        showMessage("error", err.errors.join(", "));
      } else if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        showMessage(
          "error",
          axiosError.response?.data?.message ||
            "Login failed: Incorrect email or password. Please try again."
        );
      } else {
        showMessage(
          "error",
          "Login failed: Server error. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 loginBackground"
    >
      <Row className="w-100">
        <Col xs={12} md="auto" className="mx-auto">
          <Card className="shadow transparent-card">
            <Card.Body className="py-4 px-md-4">
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
                {message && (
                  <Message message={message} onClose={clearMessage} />
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
