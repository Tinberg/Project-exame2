import * as yup from "yup";
import { VenueCreationData } from "../../schemas/venue";

const createVenueSchema: yup.ObjectSchema<VenueCreationData> = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .nullable()
    .typeError("Price must be a number")
    .min(1, "Price cannot be negative")
    .max(10000, "Price cannot be over 10.000")
    .required("Price is required"),
  maxGuests: yup
    .number()
    .nullable()
    .typeError("Max guests must be a number")
    .min(1, "At least one guest is required")
    .max(100, "Guests cannot be over 100")
    .required("Max guests is required"),
  media: yup
    .array()
    .of(
      yup.object({
        url: yup.string().url("Invalid URL").required("Image URL is required"),
        alt: yup.string().required("Image description is required"),
      })
    )
    .required("At least one media item is required")
    .min(1, "At least one media item is required"),
  rating: yup
    .number()
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),
  meta: yup.object({
    breakfast: yup.boolean().optional(),
    parking: yup.boolean().optional(),
    pets: yup.boolean().optional(),
    wifi: yup.boolean().optional(),
  }),
  location: yup.object({
    address: yup.string().optional(),
    city: yup.string().optional(),
    zip: yup.string().optional(),
    country: yup.string().optional(),
    continent: yup
    .string()
    .oneOf(
      ["Africa", "Antarctica", "Asia", "Europe", "North America", "Australia", "South America"],
      "Continent is required."
    )
    .required("Continent is required"),
  }),
});

export default createVenueSchema;
