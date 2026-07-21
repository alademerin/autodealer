"use client";

import { useState, useEffect } from "react";
import {
  Car,
  CheckCircle2,
  DollarSign,
  Users,
  UserCog,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Loading } from "@/components/shared/Loading";
import { getCars } from "@/services/cars";
import { getCustomers } from "@/services/customers";
import { getStaff } from "@/services/staff";
import { getSales } from "@/services/sales";
import { getServices } from "@/services/services";
import type { Car as CarType } from "@/types/cars";
import type { Customer } from "@/types/customers";
import type { Staff } from "@/types/staff";
import type { Sale } from "@/types/sales";
import type { Service } from "@/types/services";

interface DashboardStats {
  totalCars: number;
  availableCars: number;
  soldCars: number;
  totalCustomers: number;
  totalStaff: number;
  totalSales: number;
  totalServices: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    availableCars: 0,
    soldCars: 0,
    totalCustomers: 0,
    totalStaff: 0,
    totalSales: 0,
    totalServices: 0,
  });
  const [latestSales, setLatestSales] = useState<Sale[]>([]);
  const [latestServices, setLatestServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [cars, customers, staff, sales, services] = await Promise.all([
          getCars(),
          getCustomers(),
          getStaff(),
          getSales(),
          getServices(),
        ]);

        // Calculate stats
        const availableCars = cars.filter(
          (car) => car.status === "Available"
        ).length;
        const soldCars = cars.filter((car) => car.status === "Sold").length;

        setStats({
          totalCars: cars.length,
          availableCars,
          soldCars,
          totalCustomers: customers.length,
          totalStaff: staff.length,
          totalSales: sales.length,
          totalServices: services.length,
        });

        // Get latest 5 sales and services
        setLatestSales(sales.slice(0, 5));
        setLatestServices(services.slice(0, 5));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome to DriveSmart Motors Management System"
        />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome to DriveSmart Motors Management System"
        />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to DriveSmart Motors Management System"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Cars"
          value={stats.totalCars}
          icon={Car}
          subtitle="In inventory"
        />
        <StatCard
          title="Available Cars"
          value={stats.availableCars}
          icon={CheckCircle2}
          subtitle="Ready for sale"
        />
        <StatCard
          title="Sold Cars"
          value={stats.soldCars}
          icon={ShoppingCart}
          subtitle="Completed sales"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          subtitle="Customer base"
        />
        <StatCard
          title="Total Staff"
          value={stats.totalStaff}
          icon={UserCog}
          subtitle="Team members"
        />
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          icon={DollarSign}
          subtitle="All time"
        />
        <StatCard
          title="Total Services"
          value={stats.totalServices}
          icon={Wrench}
          subtitle="Service records"
        />
      </div>

      {/* Latest Sales */}
      {latestSales.length > 0 && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Latest Sales</h2>
          <div className="space-y-4">
            {latestSales.map((sale) => (
              <div
                key={sale.saleid}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {sale.car_make} {sale.car_model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Customer: {sale.customer_firstname} {sale.customer_lastname}{" "}
                    • Salesperson: {sale.staff_firstname}{" "}
                    {sale.staff_lastname}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    £{sale.saleprice.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sale.saledate).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Services */}
      {latestServices.length > 0 && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Latest Services</h2>
          <div className="space-y-4">
            {latestServices.map((service) => (
              <div
                key={service.serviceid}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{service.servicetype}</p>
                  <p className="text-sm text-muted-foreground">
                    Vehicle: {service.car_make} {service.car_model} •
                    Technician: {service.staff_firstname}{" "}
                    {service.staff_lastname}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    £{service.servicecost.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(service.servicedate).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
