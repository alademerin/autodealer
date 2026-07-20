import { z } from "zod";

export interface Car {
  carid: number;
  make: string;
  model: string;
  year: number;
  colour: string;
  mileage: number;
  fueltype: string;
  transmission: string;
  price: number;
  status: string;
  purchasedate: string;
}

export const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  colour: z.string().min(1, "Colour is required"),
  mileage: z.number().min(0, "Mileage must be 0 or greater"),
  fueltype: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  status: z.string().min(1, "Status is required"),
  purchasedate: z.string().min(1, "Purchase date is required"),
});

export type CarFormData = z.infer<typeof carFormSchema>;
