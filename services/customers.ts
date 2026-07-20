import { supabase } from "@/lib/supabase";
import type { Customer, CustomerFormData } from "@/types/customers";

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("customerid", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getCustomerById(id: number): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("customerid", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createCustomer(
  customerData: CustomerFormData
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert([customerData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCustomer(
  id: number,
  customerData: Partial<CustomerFormData>
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .update(customerData)
    .eq("customerid", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteCustomer(id: number): Promise<void> {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("customerid", id);

  if (error) throw error;
}
