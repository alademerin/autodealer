import { z } from "zod";

export interface Staff {
  staffid: number;
  firstname: string;
  lastname: string;
  jobtitle: string;
  phone: string;
  email: string;
}

export const staffFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  jobtitle: z.string().min(1, "Job title is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
      "Invalid UK phone number format"
    ),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

export type StaffFormData = z.infer<typeof staffFormSchema>;
