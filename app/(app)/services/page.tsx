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
import { ServiceForm } from "@/components/features/services/ServiceForm";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/services/services";
import type { Service, ServiceFormData } from "@/types/services";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServices();
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch services";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredServices(services);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = services.filter(
      (service) =>
        // Vehicle make/model
        (service.car_make && service.car_make.toLowerCase().includes(query)) ||
        (service.car_model &&
          service.car_model.toLowerCase().includes(query)) ||
        // Technician name
        (service.staff_firstname &&
          service.staff_firstname.toLowerCase().includes(query)) ||
        (service.staff_lastname &&
          service.staff_lastname.toLowerCase().includes(query)) ||
        // Service type
        (service.servicetype &&
          service.servicetype.toLowerCase().includes(query))
    );
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  // Add service
  const handleAddService = async (data: ServiceFormData) => {
    try {
      setIsSubmitting(true);
      await createService(data);
      toast.success("Service recorded successfully");
      setAddDialogOpen(false);
      await fetchServices();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to record service";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit service
  const handleEditService = async (data: ServiceFormData) => {
    if (!selectedService) return;

    try {
      setIsSubmitting(true);
      await updateService(selectedService.serviceid, data);
      toast.success("Service updated successfully");
      setEditDialogOpen(false);
      setSelectedService(null);
      await fetchServices();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update service";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete service
  const handleDeleteService = async () => {
    if (!selectedService) return;

    try {
      setIsDeleting(true);
      await deleteService(selectedService.serviceid);
      toast.success("Service deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedService(null);
      await fetchServices();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete service";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns
  const columns = [
    {
      header: "Vehicle",
      accessor: ((row: Service) =>
        `${row.car_make || ""} ${row.car_model || ""}`.trim()) as any,
    },
    {
      header: "Technician",
      accessor: ((row: Service) =>
        `${row.staff_firstname || ""} ${row.staff_lastname || ""}`.trim()) as any,
    },
    {
      header: "Service Date",
      accessor: ((row: Service) =>
        new Date(row.servicedate).toLocaleDateString("en-GB")) as any,
    },
    {
      header: "Service Type",
      accessor: "servicetype" as keyof Service,
    },
    {
      header: "Cost",
      accessor: ((row: Service) =>
        `£${row.servicecost.toLocaleString()}`) as any,
    },
    {
      header: "Notes",
      accessor: ((row: Service) =>
        row.notes ? (
          <span className="max-w-[200px] truncate block" title={row.notes}>
            {row.notes}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )) as any,
    },
    {
      header: "Actions",
      accessor: ((row: Service) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedService(row);
              setEditDialogOpen(true);
            }}
            aria-label="Edit service"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedService(row);
              setDeleteDialogOpen(true);
            }}
            aria-label="Delete service"
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
        <PageHeader
          title="Services"
          description="Track and manage vehicle services"
        />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Services"
          description="Track and manage vehicle services"
        />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            onClick={fetchServices}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Track and manage vehicle services"
        action={
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Service
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by vehicle, technician, or service type..."
        />
        <p className="text-sm text-muted-foreground">
          {filteredServices.length}{" "}
          {filteredServices.length === 1 ? "service" : "services"}
        </p>
      </div>

      {filteredServices.length === 0 && !searchQuery ? (
        <EmptyState
          title="No services yet"
          description="Get started by recording your first vehicle service."
          action={
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Service
            </Button>
          }
        />
      ) : filteredServices.length === 0 && searchQuery ? (
        <EmptyState
          title="No results found"
          description={`No services match "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <DataTable data={filteredServices} columns={columns} />
      )}

      {/* Add Service Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record New Service</DialogTitle>
          </DialogHeader>
          <ServiceForm
            onSubmit={handleAddService}
            onCancel={() => setAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <ServiceForm
              initialData={selectedService}
              onSubmit={handleEditService}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedService(null);
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
        onConfirm={handleDeleteService}
        title="Delete Service"
        description={
          selectedService
            ? `Are you sure you want to delete this service record? This action cannot be undone.`
            : ""
        }
        isDeleting={isDeleting}
      />
    </div>
  );
}
