import { supabase } from "@/lib/supabase";
import type { Sale, SaleFormData } from "@/types/sales";

export async function getSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      *,
      cars!inner(make, model),
      customers!inner(firstname, lastname),
      staff!inner(firstname, lastname)
    `
    )
    .order("saleid", { ascending: false });

  if (error) throw error;

  // Transform joined data to flat structure
  const transformed = (data || []).map((sale: any) => ({
    saleid: sale.saleid,
    carid: sale.carid,
    customerid: sale.customerid,
    staffid: sale.staffid,
    saledate: sale.saledate,
    saleprice: sale.saleprice,
    paymentmethod: sale.paymentmethod,
    car_make: sale.cars?.make,
    car_model: sale.cars?.model,
    customer_firstname: sale.customers?.firstname,
    customer_lastname: sale.customers?.lastname,
    staff_firstname: sale.staff?.firstname,
    staff_lastname: sale.staff?.lastname,
  }));

  return transformed;
}

export async function getSaleById(id: number): Promise<Sale> {
  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      *,
      cars!inner(make, model),
      customers!inner(firstname, lastname),
      staff!inner(firstname, lastname)
    `
    )
    .eq("saleid", id)
    .single();

  if (error) throw error;

  return {
    saleid: data.saleid,
    carid: data.carid,
    customerid: data.customerid,
    staffid: data.staffid,
    saledate: data.saledate,
    saleprice: data.saleprice,
    paymentmethod: data.paymentmethod,
    car_make: data.cars?.make,
    car_model: data.cars?.model,
    customer_firstname: data.customers?.firstname,
    customer_lastname: data.customers?.lastname,
    staff_firstname: data.staff?.firstname,
    staff_lastname: data.staff?.lastname,
  };
}

export async function createSale(saleData: SaleFormData): Promise<Sale> {
  const { data, error } = await supabase
    .from("sales")
    .insert([saleData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateSale(
  id: number,
  saleData: Partial<SaleFormData>
): Promise<Sale> {
  const { data, error } = await supabase
    .from("sales")
    .update(saleData)
    .eq("saleid", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteSale(id: number): Promise<void> {
  const { error } = await supabase.from("sales").delete().eq("saleid", id);

  if (error) throw error;
}
