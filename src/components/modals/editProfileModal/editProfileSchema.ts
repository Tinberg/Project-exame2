import * as yup from 'yup';

export const editProfileSchema = yup.object({
  bio: yup.string().max(160, 'Bio must be at most 160 characters'),
  avatar: yup.object({
    url: yup.string().url('Invalid URL').notRequired(),
    alt: yup
      .string()
      .max(120, 'Alt text cannot be greater than 120 characters')
      .optional(),
  }).notRequired(),
  banner: yup.object({
    url: yup.string().url('Invalid URL').notRequired(),
    alt: yup
      .string()
      .max(120, 'Alt text cannot be greater than 120 characters')
      .optional(),
  }).notRequired(),
  venueManager: yup.boolean(),
});

export type EditProfileFormData = yup.InferType<typeof editProfileSchema>;
