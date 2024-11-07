// EditProfileModal.tsx

import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  useUpdateProfile,
  useProfileByName,
} from "../../../hooks/apiHooks/useProfiles";
import { getUserName } from "../../../services/api/authService";
import "./editProfileModal.scss";

interface EditProfileModalProps {
  show: boolean;
  handleClose: () => void;
}

interface EditProfileFormData {
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  venueManager: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  handleClose,
}) => {
  const userName = getUserName();

  if (!userName) {
    return null;
  }

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"success" | "danger" | null>(
    null
  );

  const { data: profile, isLoading, error } = useProfileByName(userName);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EditProfileFormData>({
    defaultValues: {
      bio: "",
      avatarUrl: "",
      bannerUrl: "",
      venueManager: false,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio || "",
        avatarUrl: profile.avatar?.url || "",
        bannerUrl: profile.banner?.url || "",
        venueManager: profile.venueManager || false,
      });
    }
  }, [profile, reset]);

  const updateProfileMutation = useUpdateProfile(userName);

  const onSubmit = (data: EditProfileFormData) => {
    setAlertMessage(null);
    setAlertVariant(null);

    const updatedData = {
      bio: data.bio,
      avatar: { url: data.avatarUrl, alt: "" },
      banner: { url: data.bannerUrl, alt: "" },
      venueManager: data.venueManager,
    };

    updateProfileMutation.mutate(updatedData, {
      onSuccess: () => {
        setAlertMessage("Profile updated successfully!");
        setAlertVariant("success");
        handleClose();
      },
      onError: (error: any) => {
        setAlertMessage(error.message || "Failed to update profile.");
        setAlertVariant("danger");
      },
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertMessage && (
          <Alert
            variant={alertVariant || "info"}
            onClose={() => setAlertMessage(null)}
            dismissible
          >
            {alertMessage}
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center mt-4">
            <p>Loading profile...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="mt-4">
            Failed to load profile.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Bio */}
            <Form.Group controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your bio"
                {...register("bio")}
              />
            </Form.Group>

            {/* Avatar URL */}
            <Form.Group controlId="avatarUrl" className="mt-3">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter avatar image URL"
                {...register("avatarUrl")}
              />
            </Form.Group>

            {/* Banner URL */}
            <Form.Group controlId="bannerUrl" className="mt-3">
              <Form.Label>Banner URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter banner image URL"
                {...register("bannerUrl")}
              />
            </Form.Group>

            {/* Venue Manager */}
            <Form.Group controlId="venueManager" className="mt-3">
              <Form.Check
                type="checkbox"
                label="Are you a venue manager?"
                {...register("venueManager")}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4">
              {isSubmitting ? <> Updating...</> : "Update Profile"}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
