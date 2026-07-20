import { supabase } from "@/lib/supabase";
import type { Staff, StaffFormData } from "@/types/staff";

export async function getStaff(): Promise<Staff[]> {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .order("staffid", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getStaffById(id: number): Promise<Staff> {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("staffid", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createStaff(staffData: StaffFormData): Promise<Staff> {
  const { data, error } = await supabase
    .from("staff")
    .insert([staffData])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateStaff(
  id: number,
  staffData: Partial<StaffFormData>
): Promise<Staff> {
  const { data, error } = await supabase
    .from("staff")
    .update(staffData)
    .eq("staffid", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteStaff(id: number): Promise<void> {
  const { error } = await supabase.from("staff").delete().eq("staffid", id);

  if (error) throw error;
}
