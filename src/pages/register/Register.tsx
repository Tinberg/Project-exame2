import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useMessage } from "../../hooks/generalHooks/useMessage";
import Message from "../../components/message/message";
import { useRegisterUser } from "../../hooks/apiHooks/useAuth";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../schemas/auth";
import { FaQuestionCircle } from "react-icons/fa";
import "./register.scss";

// Yup Schema for validation
const registrationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
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

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [venueManager, setVenueManager] = useState<boolean>(false);
  const navigate = useNavigate();

  // Custom hook for managing messages (errors, success)
  const { message, showMessage, clearMessage } = useMessage();

  // Register API call
  const { mutate: registerUser, status } = useRegisterUser();
  const isLoading = status === "pending";

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessage();

    const formData = { username, email, password, venueManager };

    try {
      // Validate form data with Yup
      await registrationSchema.validate(formData, { abortEarly: false });

      registerUser(
        {
          name: username,
          email,
          password,
          venueManager,
        },
        {
          onSuccess: () => {
            // Show success message and navigate to login page
            navigate("/login", {
              state: {
                successMessage: "Registration successful! Please log in.",
              },
            });
          },
          onError: (error) => {
            const axiosError = error as AxiosError<ErrorResponse>;
            showMessage(
              "error",
              axiosError?.response?.data?.message ||
                "Registration failed. Please try again."
            );
          },
        }
      );
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        showMessage("error", err.errors.join(", "));
      } else {
        showMessage(
          "error",
          "Registration failed: Server error. Please try again later."
        );
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 registerBackground"
    >
      <Row className="w-100">
        <Col xs={12} md="auto" className="mx-auto">
          <Card className="shadow transparent-card">
            <Card.Body className="py-4 px-md-4 ">
              <h2 className="text-center mb-4">Register to Holidaze</h2>
              <p className="text-center">
                Join Holidaze! Sign up to book stunning venues or list and
                manage your own rental spaces.
              </p>
              <Form onSubmit={handleRegister}>
                {/* Username Field */}
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

                {/* Email Field */}
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

                {/* Password Field */}
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

                {/* Venue Manager Toggle */}
                <Form.Group controlId="venueManager" className="mt-3">
                  <div className="d-flex align-items-center">
                    <Form.Label className="mb-0 me-2">Venue Manager</Form.Label>
                    {/* Venue Manager Tooltip */}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip
                          id="tooltip-venueManager"
                          className="custom-tooltip"
                        >
                          Venue Managers can create and manage rental venues.
                          You can change this setting later in your profile.
                        </Tooltip>
                      }
                    >
                      <span>
                        <FaQuestionCircle
                          style={{ cursor: "pointer" }}
                          aria-label="Venue Manager Info"
                        />
                      </span>
                    </OverlayTrigger>
                  </div>
                  <div className="d-flex align-items-center mt-2">
                    <Form.Check
                      type="switch"
                      id="venueManagerSwitch"
                      label=""
                      checked={venueManager}
                      onChange={(e) => setVenueManager(e.target.checked)}
                      className="me-2"
                    />
                    {/* Dynamic Text Next to the Toggle */}
                    <Form.Text className="text-muted">
                      {venueManager
                        ? "You are a venue manager."
                        : "You are not a venue manager."}
                    </Form.Text>
                  </div>
                </Form.Group>

                {/* Display Messages */}
                {message && (
                  <Message message={message} onClose={clearMessage} />
                )}

                {/* Submit Button */}
                <div className="d-grid mt-3">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </div>
              </Form>

              <div className="mt-3 text-center">
                <p>
                  Already have an account?{" "}
                  <Link className="text-decoration-underline" to="/login">
                    Log in here.
                  </Link>
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
