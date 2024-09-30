import React from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';
import { Message as MessageType } from '../../types/message';

interface MessageProps {
  message: MessageType;
  onClose: () => void;
}

const Message: React.FC<MessageProps> = ({ message, onClose }) => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <Alert
            variant={message.type === 'error' ? 'danger' : message.type}
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
