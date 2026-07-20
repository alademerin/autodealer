import { z } from "zod";

export interface Sale {
  saleid: number;
  carid: number;
  customerid: number;
  staffid: number;
  saledate: string;
  saleprice: number;
  paymentmethod: string;
  // Joined fields
  car_make?: string;
  car_model?: string;
  customer_firstname?: string;
  customer_lastname?: string;
  staff_firstname?: string;
  staff_lastname?: string;
}

export const saleFormSchema = z.object({
  carid: z.number().min(1, "Vehicle is required"),
  customerid: z.number().min(1, "Customer is required"),
  staffid: z.number().min(1, "Salesperson is required"),
  saledate: z.string().min(1, "Sale date is required"),
  saleprice: z.number().min(0.01, "Sale price must be greater than 0"),
  paymentmethod: z.string().min(1, "Payment method is required"),
});

export type SaleFormData = z.infer<typeof saleFormSchema>;
