import { z } from "zod";

export interface Customer {
  customerid: number;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  postcode: string;
  phone: string;
  email: string;
}

export const customerFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Invalid UK phone number format"
    ),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
