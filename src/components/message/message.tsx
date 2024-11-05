import React from "react";
import { Alert, Container, Row, Col } from "react-bootstrap";
import { MessageProps } from "../../types/message";

// displays a dismissible Bootstrap alert styled by message.type with message.content
const Message: React.FC<MessageProps> = ({ message, onClose }) => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <Alert
            variant={message.type === "error" ? "danger" : message.type}
            onClose={onClose}
            dismissible
            className="mt-3"
          >
            {message.content}
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default Message;
