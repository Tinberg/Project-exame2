import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";


interface Image {
  url: string;
  alt?: string;
}

interface ImageGalleryModalProps {
  images: Image[];
  show: boolean;
  onClose: () => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  show,
  onClose,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const selectedImage =
    selectedImageIndex !== null ? images[selectedImageIndex] : null;

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const showNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex((prev) => (prev !== null ? prev + 1 : 0));
    }
  };

  const showPrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex((prev) => (prev !== null ? prev - 1 : 0));
    }
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") showNextImage();
      else if (event.key === "ArrowLeft") showPrevImage();
    };

    if (selectedImageIndex !== null) {
      window.addEventListener("keydown", handleKeydown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [selectedImageIndex]);

  return (
    <>
      {/* Modal for Image Gallery */}
      <Modal
        show={show && selectedImageIndex === null}
        onHide={onClose}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {images.map((image, index) => (
              <Col md={4} key={index} className="mb-3">
                <Image
                  src={image.url}
                  alt={image.alt}
                  className="img-gallery-modal img-fluid rounded"
                  onClick={() => handleSelectImage(index)}
                />
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="border border-2"
            variant="secondary"
            onClick={onClose}
            aria-label="Close Image modal"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Full-Size Image */}
      {selectedImage && (
        <Modal
          show={true}
          onHide={() => setSelectedImageIndex(null)}
          size="xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedImage?.alt || "Image Details"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center align-items-center position-relative">
            {/* Left arrow */}
            <Button
              className="position-absolute start-0 top-50 translate-middle-y"
              onClick={showPrevImage}
              variant="light"
              aria-label="Previous Image"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>

            {/* Image */}
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="img-fluid rounded"
            />

            {/* Right arrow */}
            <Button
              className="position-absolute end-0 top-50 translate-middle-y"
              onClick={showNextImage}
              variant="light"
              aria-label="Next Image"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </Modal.Body>

          <div className="text-center mt-3">
            <p>
              Image {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} of{" "}
              {images.length}
            </p>
          </div>

          <Modal.Footer>
            <Button
              className="border border-2"
              variant="secondary"
              aria-label="Close Image modal"
              onClick={() => setSelectedImageIndex(null)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ImageGalleryModal;
