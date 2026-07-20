import { supabase } from "@/lib/supabase";
import type { Car, CarFormData } from "@/types/cars";

export async function getCars(): Promise<Car[]> {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("carid", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getCarById(id: number): Promise<Car> {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("carid", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createCar(carData: CarFormData): Promise<Car> {
  const { data, error } = await supabase
    .from("cars")
    .insert([carData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCar(
  id: number,
  carData: Partial<CarFormData>
): Promise<Car> {
  const { data, error } = await supabase
    .from("cars")
    .update(carData)
    .eq("carid", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteCar(id: number): Promise<void> {
  const { error } = await supabase.from("cars").delete().eq("carid", id);

  if (error) throw error;
}
