import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileSchema, EditProfileFormData } from "./editProfileSchema";
import { ProfileUpdateData } from "../../../schemas";
import {
  useUpdateProfile,
  useProfileByName,
} from "../../../hooks/apiHooks/useProfiles";
import { getUserName } from "../../../services/api/authService";
import { useMessage } from "../../../hooks/generalHooks/useMessage";
import Message from "../../../components/message/message";
import "./editProfileModal.scss"

//-- Default image URLs --//
const defaultAvatarUrl =
  "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500";
const defaultBannerUrl =
  "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500";

interface EditProfileModalProps {
  show: boolean;
  handleClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  handleClose,
}) => {
  const userName = getUserName();

  if (!userName) {
    return null;
  }
  //-- Fetch profile data --//
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useProfileByName(userName);
  const { message, showMessage, clearMessage } = useMessage();

  //-- Form setup --//
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<EditProfileFormData>({
    resolver: yupResolver(editProfileSchema),
    defaultValues: {
      bio: "",
      avatar: {
        url: defaultAvatarUrl,
        alt: "Avatar Image",
      },
      banner: {
        url: defaultBannerUrl,
        alt: "Banner Image",
      },
      venueManager: false,
    },
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(defaultAvatarUrl);
  const [bannerPreview, setBannerPreview] = useState<string>(defaultBannerUrl);

  //-- Reset form when profile loads --//
  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio || "",
        avatar: {
          url: profile.avatar?.url || defaultAvatarUrl,
          alt: profile.avatar?.alt || "Avatar Image",
        },
        banner: {
          url: profile.banner?.url || defaultBannerUrl,
          alt: profile.banner?.alt || "Banner Image",
        },
        venueManager: profile.venueManager || false,
      });
      setAvatarPreview(profile.avatar?.url || defaultAvatarUrl);
      setBannerPreview(profile.banner?.url || defaultBannerUrl);
    }
  }, [profile, reset]);

  const avatarUrlValue = watch("avatar.url");
  const bannerUrlValue = watch("banner.url");

  //-- Update avatar --//
  useEffect(() => {
    setAvatarPreview(avatarUrlValue || defaultAvatarUrl);
  }, [avatarUrlValue]);

  //-- Update banner --//
  useEffect(() => {
    setBannerPreview(bannerUrlValue || defaultBannerUrl);
  }, [bannerUrlValue]);

  //-- profile update --//

  const updateProfileMutation = useUpdateProfile(userName);
  const onSubmit = (data: EditProfileFormData) => {
    const payload: ProfileUpdateData = {
      bio: data.bio,
      venueManager: data.venueManager,
      avatar: {
        url: data.avatar?.url?.trim() || defaultAvatarUrl,
        alt: data.avatar?.alt || "Avatar Image",
      },
      banner: {
        url: data.banner?.url?.trim() || defaultBannerUrl,
        alt: data.banner?.alt || "Banner Image",
      },
    };

    console.log("Payload being sent to API:", payload);

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        refetch();
        handleClose();
      },
      onError: (error: any) => {
        console.error("API Error:", error);
        showMessage(
          "danger",
          error.response?.data?.message ||
            "Something went wrong. Please verify your image URLs and try again."
        );
      },
    });
  };

  return (
    <Modal className="ps-0" show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center mt-4">
            <p>Loading profile...</p>
          </div>
        ) : error ? (
          <Message
            message={{ type: "danger", content: "Failed to load profile." }}
            onClose={clearMessage}
          />
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Avatar Image Section */}
            <div className="text-center mb-4">
              <p className="fw-bold mb-4">Avatar Image</p>
              <div className="avatar-image-container d-flex align-items-center justify-content-center m-auto border rounded-circle overflow-hidden">
                <Image
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="img-fluid avatar-image w-100 h-100"
                />
              </div>
              <small className="text-muted">Recommended ratio 1:1</small>
            </div>

            {/* Avatar URL Input */}
            <Form.Group controlId="avatarUrl" className="text-center">
              <Form.Label>Avatar Image URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter avatar image URL"
                {...register("avatar.url")}
                isInvalid={!!errors.avatar?.url}
              />
              {errors.avatar?.url && (
                <Form.Control.Feedback type="invalid">
                  {errors.avatar.url.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Avatar Alt Text Input */}
            <Form.Group controlId="avatarAlt" className="text-center mt-2">
              <Form.Label>Avatar Image Alt Text</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter avatar image description"
                {...register("avatar.alt")}
                isInvalid={!!errors.avatar?.alt}
              />
              {errors.avatar?.alt && (
                <Form.Control.Feedback type="invalid">
                  {errors.avatar.alt.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Banner Image Section */}
            <div className="text-center my-4 pt-4 text-center border-top border-">
              <p className="fw-bold mb-4">Banner Image</p>
              <div className="banner-image-container d-flex align-items-center justify-content-center m-auto border overflow-hidden w-100">
                <Image
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="img-fluid banner-image w-100 h-100"
                />
              </div>
              <small className="text-muted">Recommended ratio 5:1</small>
            </div>

            {/* Banner URL Input */}
            <Form.Group controlId="bannerUrl" className="text-center">
              <Form.Label>Banner Image URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter banner image URL"
                {...register("banner.url")}
                isInvalid={!!errors.banner?.url}
              />
              {errors.banner?.url && (
                <Form.Control.Feedback type="invalid">
                  {errors.banner.url.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Banner Alt Text Input */}
            <Form.Group controlId="bannerAlt" className="text-center mt-2">
              <Form.Label>Banner Image Alt Text</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter banner description"
                {...register("banner.alt")}
                isInvalid={!!errors.banner?.alt}
              />
              {errors.banner?.alt && (
                <Form.Control.Feedback type="invalid">
                  {errors.banner.alt.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Bio */}
            <Form.Group
              controlId="bio"
              className="mt-4 pt-4 text-center border-top border-2"
            >
              <Form.Label className="fw-bold mb-4">Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your bio"
                {...register("bio")}
                isInvalid={!!errors.bio}
              />
              {errors.bio && (
                <Form.Control.Feedback type="invalid">
                  {errors.bio.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Venue Manager */}
            <Form.Group
              controlId="venueManager"
              className="mt-4 pt-4 text-center border-top border-2"
            >
              <Form.Label className="fw-bold mb-4 d-block text-center">
                Venue Manager
              </Form.Label>
              <p>Grant Venue Manager Privileges</p>
              <div className="d-flex justify-content-center fs-4 my-3">
                <Form.Check
                  type="switch"
                  label=""
                  {...register("venueManager")}
                />
              </div>
            </Form.Group>
            <div className="text-center border-top border-2">
              {/* Display warning message if there is one */}
              {message && message.type === "danger" && (
                <Message message={message} onClose={clearMessage} />
              )}
              <Button
                variant="primary"
                type="submit"
                className="mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="ms-auto">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
