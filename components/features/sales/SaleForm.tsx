"use client";

import { useState, useEffect } from "react";
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
import { saleFormSchema, type SaleFormData, type Sale } from "@/types/sales";
import { getCars } from "@/services/cars";
import { getCustomers } from "@/services/customers";
import { getStaff } from "@/services/staff";
import type { Car } from "@/types/cars";
import type { Customer } from "@/types/customers";
import type { Staff } from "@/types/staff";

interface SaleFormProps {
  initialData?: Sale;
  onSubmit: (data: SaleFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SaleForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SaleFormProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: initialData
      ? {
          carid: initialData.carid,
          customerid: initialData.customerid,
          staffid: initialData.staffid,
          saledate: initialData.saledate,
          saleprice: initialData.saleprice,
          paymentmethod: initialData.paymentmethod,
        }
      : {
          saledate: new Date().toISOString().split("T")[0],
        },
  });

  const caridValue = watch("carid");
  const customeridValue = watch("customerid");
  const staffidValue = watch("staffid");
  const paymentmethodValue = watch("paymentmethod");

  // Load dropdown data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [carsData, customersData, staffData] = await Promise.all([
          getCars(),
          getCustomers(),
          getStaff(),
        ]);
        setCars(carsData);
        setCustomers(customersData);
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
  const selectedCustomer = customers.find(
    (customer) => customer.customerid === customeridValue
  );
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
                  ? `${selectedCar.make} ${selectedCar.model} (${selectedCar.year}) - £${selectedCar.price.toLocaleString()}`
                  : "Select vehicle"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {cars
                .filter((car) => car.status === "Available")
                .map((car) => (
                  <SelectItem key={car.carid} value={car.carid.toString()}>
                    {car.make} {car.model} ({car.year}) - £
                    {car.price.toLocaleString()}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.carid && (
            <p className="text-sm text-destructive">{errors.carid.message}</p>
          )}
        </div>

        {/* Customer */}
        <div className="space-y-2">
          <Label htmlFor="customerid">Customer</Label>
          <Select
            value={customeridValue?.toString() || ""}
            onValueChange={(value) =>
              value && setValue("customerid", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer">
                {selectedCustomer
                  ? `${selectedCustomer.firstname} ${selectedCustomer.lastname} (${selectedCustomer.email})`
                  : "Select customer"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem
                  key={customer.customerid}
                  value={customer.customerid.toString()}
                >
                  {customer.firstname} {customer.lastname} ({customer.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.customerid && (
            <p className="text-sm text-destructive">
              {errors.customerid.message}
            </p>
          )}
        </div>

        {/* Salesperson */}
        <div className="space-y-2">
          <Label htmlFor="staffid">Salesperson</Label>
          <Select
            value={staffidValue?.toString() || ""}
            onValueChange={(value) =>
              value && setValue("staffid", parseInt(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select salesperson">
                {selectedStaff
                  ? `${selectedStaff.firstname} ${selectedStaff.lastname} (${selectedStaff.jobtitle})`
                  : "Select salesperson"}
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

        {/* Sale Date */}
        <div className="space-y-2">
          <Label htmlFor="saledate">Sale Date</Label>
          <Input id="saledate" type="date" {...register("saledate")} />
          {errors.saledate && (
            <p className="text-sm text-destructive">
              {errors.saledate.message}
            </p>
          )}
        </div>

        {/* Sale Price */}
        <div className="space-y-2">
          <Label htmlFor="saleprice">Sale Price (£)</Label>
          <Input
            id="saleprice"
            type="number"
            step="0.01"
            {...register("saleprice", { valueAsNumber: true })}
          />
          {errors.saleprice && (
            <p className="text-sm text-destructive">
              {errors.saleprice.message}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label htmlFor="paymentmethod">Payment Method</Label>
          <Select
            value={paymentmethodValue || ""}
            onValueChange={(value) => value && setValue("paymentmethod", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="Debit Card">Debit Card</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentmethod && (
            <p className="text-sm text-destructive">
              {errors.paymentmethod.message}
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
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Sale"
            : "Record Sale"}
        </Button>
      </div>
    </form>
  );
}
