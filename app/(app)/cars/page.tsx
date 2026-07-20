"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { DataTable } from "@/components/shared/DataTable";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loading } from "@/components/shared/Loading";
import { CarForm } from "@/components/features/cars/CarForm";
import { getCars, createCar, updateCar, deleteCar } from "@/services/cars";
import type { Car, CarFormData } from "@/types/cars";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCars();
      setCars(data);
      setFilteredCars(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch cars";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCars(cars);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = cars.filter(
      (car) =>
        car.make.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query)
    );
    setFilteredCars(filtered);
  }, [searchQuery, cars]);

  // Add car
  const handleAddCar = async (data: CarFormData) => {
    try {
      setIsSubmitting(true);
      await createCar(data);
      toast.success("Car added successfully");
      setAddDialogOpen(false);
      await fetchCars();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add car";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit car
  const handleEditCar = async (data: CarFormData) => {
    if (!selectedCar) return;

    try {
      setIsSubmitting(true);
      await updateCar(selectedCar.carid, data);
      toast.success("Car updated successfully");
      setEditDialogOpen(false);
      setSelectedCar(null);
      await fetchCars();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update car";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete car
  const handleDeleteCar = async () => {
    if (!selectedCar) return;

    try {
      setIsDeleting(true);
      await deleteCar(selectedCar.carid);
      toast.success("Car deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedCar(null);
      await fetchCars();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete car";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns
  const columns = [
    { header: "Make", accessor: "make" as keyof Car },
    { header: "Model", accessor: "model" as keyof Car },
    { header: "Year", accessor: "year" as keyof Car },
    { header: "Colour", accessor: "colour" as keyof Car },
    {
      header: "Mileage",
      accessor: ((row: Car) => row.mileage.toLocaleString()) as any,
    },
    { header: "Fuel Type", accessor: "fueltype" as keyof Car },
    { header: "Transmission", accessor: "transmission" as keyof Car },
    {
      header: "Price",
      accessor: ((row: Car) => `£${row.price.toLocaleString()}`) as any,
    },
    {
      header: "Status",
      accessor: ((row: Car) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === "Available"
              ? "bg-green-100 text-green-800"
              : row.status === "Sold"
              ? "bg-gray-100 text-gray-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      )) as any,
    },
    {
      header: "Actions",
      accessor: ((row: Car) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedCar(row);
              setEditDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedCar(row);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )) as any,
      className: "w-[100px]",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Cars" description="Manage your vehicle inventory" />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Cars" description="Manage your vehicle inventory" />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button onClick={fetchCars} variant="outline" size="sm" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cars"
        description="Manage your vehicle inventory"
        action={
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Car
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by make or model..."
        />
        <p className="text-sm text-muted-foreground">
          {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"}
        </p>
      </div>

      {filteredCars.length === 0 && !searchQuery ? (
        <EmptyState
          title="No cars yet"
          description="Get started by adding your first vehicle to the inventory."
          action={
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Car
            </Button>
          }
        />
      ) : filteredCars.length === 0 && searchQuery ? (
        <EmptyState
          title="No results found"
          description={`No cars match "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <DataTable data={filteredCars} columns={columns} />
      )}

      {/* Add Car Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Car</DialogTitle>
          </DialogHeader>
          <CarForm
            onSubmit={handleAddCar}
            onCancel={() => setAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Car Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Car</DialogTitle>
          </DialogHeader>
          {selectedCar && (
            <CarForm
              initialData={selectedCar}
              onSubmit={handleEditCar}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedCar(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteCar}
        title="Delete Car"
        description={
          selectedCar
            ? `Are you sure you want to delete ${selectedCar.make} ${selectedCar.model}? This action cannot be undone.`
            : ""
        }
        isDeleting={isDeleting}
      />
    </div>
  );
}
