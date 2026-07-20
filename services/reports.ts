import { supabase } from "@/lib/supabase";

export interface SalesByStaffReport {
  staff_name: string;
  total_sales: number;
  total_revenue: number;
}

export interface TopSellingCarsReport {
  car_make: string;
  car_model: string;
  times_sold: number;
  total_revenue: number;
}

export interface ServiceRevenueReport {
  car_make: string;
  car_model: string;
  total_services: number;
  total_cost: number;
}

export interface CustomerPurchaseReport {
  customer_name: string;
  email: string;
  car: string;
  sale_price: number;
  sale_date: string;
}

export interface MonthlySalesReport {
  month: string;
  total_sales: number;
  total_revenue: number;
}

export async function getSalesByStaff(): Promise<SalesByStaffReport[]> {
  const { data: sales, error } = await supabase
    .from("sales")
    .select(
      `
      saleprice,
      staff!inner(staffid, firstname, lastname)
    `
    );

  if (error) throw error;
  if (!sales || sales.length === 0) return [];

  // Group by staff
  const grouped: Record<string, SalesByStaffReport> = sales.reduce(
    (acc: Record<string, SalesByStaffReport>, sale: any) => {
      const staffId = sale.staff.staffid;
      if (!acc[staffId]) {
        acc[staffId] = {
          staff_name: `${sale.staff.firstname} ${sale.staff.lastname}`,
          total_sales: 0,
          total_revenue: 0,
        };
      }
      acc[staffId].total_sales += 1;
      acc[staffId].total_revenue += sale.saleprice;
      return acc;
    },
    {}
  );

  return Object.values(grouped);
}

export async function getTopSellingCars(): Promise<TopSellingCarsReport[]> {
  const { data: sales, error } = await supabase
    .from("sales")
    .select(
      `
      saleprice,
      cars!inner(make, model)
    `
    );

  if (error) throw error;
  if (!sales || sales.length === 0) return [];

  // Group by car make/model
  const grouped: Record<string, TopSellingCarsReport> = sales.reduce(
    (acc: Record<string, TopSellingCarsReport>, sale: any) => {
      const key = `${sale.cars.make}-${sale.cars.model}`;
      if (!acc[key]) {
        acc[key] = {
          car_make: sale.cars.make,
          car_model: sale.cars.model,
          times_sold: 0,
          total_revenue: 0,
        };
      }
      acc[key].times_sold += 1;
      acc[key].total_revenue += sale.saleprice;
      return acc;
    },
    {}
  );

  return Object.values(grouped).sort(
    (a, b) => b.times_sold - a.times_sold
  );
}

export async function getServiceRevenue(): Promise<ServiceRevenueReport[]> {
  const { data: services, error } = await supabase
    .from("services")
    .select(
      `
      servicecost,
      cars!inner(make, model)
    `
    );

  if (error) throw error;
  if (!services || services.length === 0) return [];

  // Group by car
  const grouped: Record<string, ServiceRevenueReport> = services.reduce(
    (acc: Record<string, ServiceRevenueReport>, service: any) => {
      const key = `${service.cars.make}-${service.cars.model}`;
      if (!acc[key]) {
        acc[key] = {
          car_make: service.cars.make,
          car_model: service.cars.model,
          total_services: 0,
          total_cost: 0,
        };
      }
      acc[key].total_services += 1;
      acc[key].total_cost += service.servicecost;
      return acc;
    },
    {}
  );

  return Object.values(grouped).sort(
    (a, b) => b.total_cost - a.total_cost
  );
}

export async function getCustomerPurchases(): Promise<
  CustomerPurchaseReport[]
> {
  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      saleprice,
      saledate,
      customers!inner(firstname, lastname, email),
      cars!inner(make, model)
    `
    )
    .order("saledate", { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  return data.map((sale: any) => ({
    customer_name: `${sale.customers.firstname} ${sale.customers.lastname}`,
    email: sale.customers.email,
    car: `${sale.cars.make} ${sale.cars.model}`,
    sale_price: sale.saleprice,
    sale_date: sale.saledate,
  }));
}

export async function getMonthlySales(): Promise<MonthlySalesReport[]> {
  const { data: sales, error } = await supabase
    .from("sales")
    .select("saledate, saleprice")
    .order("saledate", { ascending: false });

  if (error) throw error;
  if (!sales || sales.length === 0) return [];

  // Group by year-month
  const grouped: Record<string, MonthlySalesReport> = sales.reduce(
    (acc: Record<string, MonthlySalesReport>, sale: any) => {
      const date = new Date(sale.saledate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthLabel,
          total_sales: 0,
          total_revenue: 0,
        };
      }
      acc[monthKey].total_sales += 1;
      acc[monthKey].total_revenue += sale.saleprice;
      return acc;
    },
    {}
  );

  return Object.values(grouped);
}
