"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staffFormSchema, type StaffFormData, type Staff } from "@/types/staff";

interface StaffFormProps {
  initialData?: Staff;
  onSubmit: (data: StaffFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function StaffForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: StaffFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: initialData
      ? {
          firstname: initialData.firstname,
          lastname: initialData.lastname,
          jobtitle: initialData.jobtitle,
          phone: initialData.phone,
          email: initialData.email,
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstname">First Name</Label>
          <Input id="firstname" {...register("firstname")} />
          {errors.firstname && (
            <p className="text-sm text-destructive">
              {errors.firstname.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastname">Last Name</Label>
          <Input id="lastname" {...register("lastname")} />
          {errors.lastname && (
            <p className="text-sm text-destructive">
              {errors.lastname.message}
            </p>
          )}
        </div>

        {/* Job Title */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="jobtitle">Job Title</Label>
          <Input
            id="jobtitle"
            placeholder="e.g. Sales Executive, Manager"
            {...register("jobtitle")}
          />
          {errors.jobtitle && (
            <p className="text-sm text-destructive">
              {errors.jobtitle.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="07123456789"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Staff Member"
            : "Add Staff Member"}
        </Button>
      </div>
    </form>
  );
}
