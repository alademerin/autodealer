import { z } from "zod";

export interface Service {
  serviceid: number;
  carid: number;
  staffid: number;
  servicedate: string;
  servicetype: string;
  servicecost: number;
  notes: string;
  // Joined fields
  car_make?: string;
  car_model?: string;
  staff_firstname?: string;
  staff_lastname?: string;
}

export const serviceFormSchema = z.object({
  carid: z.number().min(1, "Vehicle is required"),
  staffid: z.number().min(1, "Technician is required"),
  servicedate: z.string().min(1, "Service date is required"),
  servicetype: z.string().min(1, "Service type is required"),
  servicecost: z.number().min(0, "Service cost must be 0 or greater"),
  notes: z.string().optional(),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
