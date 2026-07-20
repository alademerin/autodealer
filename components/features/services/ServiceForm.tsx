"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  serviceFormSchema,
  type ServiceFormData,
  type Service,
} from "@/types/services";
import { getCars } from "@/services/cars";
import { getStaff } from "@/services/staff";
import type { Car } from "@/types/cars";
import type { Staff } from "@/types/staff";

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ServiceForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ServiceFormProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialData
      ? {
          carid: initialData.carid,
          staffid: initialData.staffid,
          servicedate: initialData.servicedate,
          servicetype: initialData.servicetype,
          servicecost: initialData.servicecost,
          notes: initialData.notes,
        }
      : {
          servicedate: new Date().toISOString().split("T")[0],
        },
  });

  const caridValue = watch("carid");
  const staffidValue = watch("staffid");

  // Load dropdown data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [carsData, staffData] = await Promise.all([
          getCars(),
          getStaff(),
        ]);
        setCars(carsData);
        setStaff(staffData);
      } catch (error) {
        console.error("Failed to load form data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading form data...</p>
      </div>
    );
  }

  const selectedCar = cars.find((car) => car.carid === caridValue);
  const selectedStaff = staff.find((member) => member.staffid === staffidValue);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        {/* Vehicle */}
        <div className="space-y-2">
          <Label htmlFor="carid">Vehicle</Label>
          <Select
            value={caridValue?.toString() || ""}
            onValueChange={(value) =>
              value && setValue("carid", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle">
                {selectedCar
                  ? `${selectedCar.make} ${selectedCar.model} (${selectedCar.year})`
                  : "Select vehicle"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {cars.map((car) => (
                <SelectItem key={car.carid} value={car.carid.toString()}>
                  {car.make} {car.model} ({car.year})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.carid && (
            <p className="text-sm text-destructive">{errors.carid.message}</p>
          )}
        </div>

        {/* Technician */}
        <div className="space-y-2">
          <Label htmlFor="staffid">Technician</Label>
          <Select
            value={staffidValue?.toString() || ""}
            onValueChange={(value) =>
              value && setValue("staffid", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select technician">
                {selectedStaff
                  ? `${selectedStaff.firstname} ${selectedStaff.lastname} (${selectedStaff.jobtitle})`
                  : "Select technician"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {staff.map((member) => (
                <SelectItem
                  key={member.staffid}
                  value={member.staffid.toString()}
                >
                  {member.firstname} {member.lastname} ({member.jobtitle})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.staffid && (
            <p className="text-sm text-destructive">
              {errors.staffid.message}
            </p>
          )}
        </div>

        {/* Service Date */}
        <div className="space-y-2">
          <Label htmlFor="servicedate">Service Date</Label>
          <Input id="servicedate" type="date" {...register("servicedate")} />
          {errors.servicedate && (
            <p className="text-sm text-destructive">
              {errors.servicedate.message}
            </p>
          )}
        </div>

        {/* Service Type */}
        <div className="space-y-2">
          <Label htmlFor="servicetype">Service Type</Label>
          <Input
            id="servicetype"
            placeholder="e.g., Oil Change, Brake Service"
            {...register("servicetype")}
          />
          {errors.servicetype && (
            <p className="text-sm text-destructive">
              {errors.servicetype.message}
            </p>
          )}
        </div>

        {/* Service Cost */}
        <div className="space-y-2">
          <Label htmlFor="servicecost">Service Cost (£)</Label>
          <Input
            id="servicecost"
            type="number"
            step="0.01"
            {...register("servicecost", { valueAsNumber: true })}
          />
          {errors.servicecost && (
            <p className="text-sm text-destructive">
              {errors.servicecost.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional service notes..."
            rows={3}
            {...register("notes")}
          />
          {errors.notes && (
            <p className="text-sm text-destructive">{errors.notes.message}</p>
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
            ? "Update Service"
            : "Record Service"}
        </Button>
      </div>
    </form>
  );
}
