"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { carFormSchema, type CarFormData, type Car } from "@/types/cars";

interface CarFormProps {
  initialData?: Car;
  onSubmit: (data: CarFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CarForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CarFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: initialData
      ? {
          make: initialData.make,
          model: initialData.model,
          year: initialData.year,
          colour: initialData.colour,
          mileage: initialData.mileage,
          fueltype: initialData.fueltype,
          transmission: initialData.transmission,
          price: initialData.price,
          status: initialData.status,
          purchasedate: initialData.purchasedate,
        }
      : {
          status: "Available",
          purchasedate: new Date().toISOString().split("T")[0],
        },
  });

  const statusValue = watch("status");
  const fueltypeValue = watch("fueltype");
  const transmissionValue = watch("transmission");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Make */}
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input id="make" {...register("make")} />
          {errors.make && (
            <p className="text-sm text-destructive">{errors.make.message}</p>
          )}
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" {...register("model")} />
          {errors.model && (
            <p className="text-sm text-destructive">{errors.model.message}</p>
          )}
        </div>

        {/* Year */}
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" type="number" {...register("year", { valueAsNumber: true })} />
          {errors.year && (
            <p className="text-sm text-destructive">{errors.year.message}</p>
          )}
        </div>

        {/* Colour */}
        <div className="space-y-2">
          <Label htmlFor="colour">Colour</Label>
          <Input id="colour" {...register("colour")} />
          {errors.colour && (
            <p className="text-sm text-destructive">{errors.colour.message}</p>
          )}
        </div>

        {/* Mileage */}
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input id="mileage" type="number" {...register("mileage", { valueAsNumber: true })} />
          {errors.mileage && (
            <p className="text-sm text-destructive">{errors.mileage.message}</p>
          )}
        </div>

        {/* Fuel Type */}
        <div className="space-y-2">
          <Label htmlFor="fueltype">Fuel Type</Label>
          <Select
            value={fueltypeValue || ""}
            onValueChange={(value) => value && setValue("fueltype", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Petrol">Petrol</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          {errors.fueltype && (
            <p className="text-sm text-destructive">{errors.fueltype.message}</p>
          )}
        </div>

        {/* Transmission */}
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select
            value={transmissionValue || ""}
            onValueChange={(value) => value && setValue("transmission", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="Automatic">Automatic</SelectItem>
            </SelectContent>
          </Select>
          {errors.transmission && (
            <p className="text-sm text-destructive">
              {errors.transmission.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price (£)</Label>
          <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={statusValue || ""}
            onValueChange={(value) => value && setValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>

        {/* Purchase Date */}
        <div className="space-y-2">
          <Label htmlFor="purchasedate">Purchase Date</Label>
          <Input id="purchasedate" type="date" {...register("purchasedate")} />
          {errors.purchasedate && (
            <p className="text-sm text-destructive">
              {errors.purchasedate.message}
            </p>
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
          {isSubmitting ? "Saving..." : initialData ? "Update Car" : "Add Car"}
        </Button>
      </div>
    </form>
  );
}
