import { supabase } from "@/lib/supabase";
import type { Service, ServiceFormData } from "@/types/services";

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select(
      `
      *,
      cars!inner(make, model),
      staff!inner(firstname, lastname)
    `
    )
    .order("serviceid", { ascending: false });

  if (error) throw error;

  // Transform joined data to flat structure
  const transformed = (data || []).map((service: any) => ({
    serviceid: service.serviceid,
    carid: service.carid,
    staffid: service.staffid,
    servicedate: service.servicedate,
    servicetype: service.servicetype,
    servicecost: service.servicecost,
    notes: service.notes,
    car_make: service.cars?.make,
    car_model: service.cars?.model,
    staff_firstname: service.staff?.firstname,
    staff_lastname: service.staff?.lastname,
  }));

  return transformed;
}

export async function getServiceById(id: number): Promise<Service> {
  const { data, error } = await supabase
    .from("services")
    .select(
      `
      *,
      cars!inner(make, model),
      staff!inner(firstname, lastname)
    `
    )
    .eq("serviceid", id)
    .single();

  if (error) throw error;

  return {
    serviceid: data.serviceid,
    carid: data.carid,
    staffid: data.staffid,
    servicedate: data.servicedate,
    servicetype: data.servicetype,
    servicecost: data.servicecost,
    notes: data.notes,
    car_make: data.cars?.make,
    car_model: data.cars?.model,
    staff_firstname: data.staff?.firstname,
    staff_lastname: data.staff?.lastname,
  };
}

export async function createService(
  serviceData: ServiceFormData
): Promise<Service> {
  const { data, error } = await supabase
    .from("services")
    .insert([serviceData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateService(
  id: number,
  serviceData: Partial<ServiceFormData>
): Promise<Service> {
  const { data, error } = await supabase
    .from("services")
    .update(serviceData)
    .eq("serviceid", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteService(id: number): Promise<void> {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("serviceid", id);

  if (error) throw error;
}
