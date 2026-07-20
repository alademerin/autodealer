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
import { CustomerForm } from "@/components/features/customers/CustomerForm";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/services/customers";
import type { Customer, CustomerFormData } from "@/types/customers";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch customers";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCustomers(customers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.firstname.toLowerCase().includes(query) ||
        customer.lastname.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  // Add customer
  const handleAddCustomer = async (data: CustomerFormData) => {
    try {
      setIsSubmitting(true);
      await createCustomer(data);
      toast.success("Customer added successfully");
      setAddDialogOpen(false);
      await fetchCustomers();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add customer";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit customer
  const handleEditCustomer = async (data: CustomerFormData) => {
    if (!selectedCustomer) return;

    try {
      setIsSubmitting(true);
      await updateCustomer(selectedCustomer.customerid, data);
      toast.success("Customer updated successfully");
      setEditDialogOpen(false);
      setSelectedCustomer(null);
      await fetchCustomers();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update customer";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete customer
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      setIsDeleting(true);
      await deleteCustomer(selectedCustomer.customerid);
      toast.success("Customer deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
      await fetchCustomers();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete customer";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns
  const columns = [
    {
      header: "Name",
      accessor: ((row: Customer) =>
        `${row.firstname} ${row.lastname}`) as any,
    },
    { header: "Email", accessor: "email" as keyof Customer },
    { header: "Phone", accessor: "phone" as keyof Customer },
    { header: "City", accessor: "city" as keyof Customer },
    { header: "Postcode", accessor: "postcode" as keyof Customer },
    {
      header: "Actions",
      accessor: ((row: Customer) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedCustomer(row);
              setEditDialogOpen(true);
            }}
            aria-label={`Edit ${row.firstname} ${row.lastname}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedCustomer(row);
              setDeleteDialogOpen(true);
            }}
            aria-label={`Delete ${row.firstname} ${row.lastname}`}
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
          title="Customers"
          description="Manage your customer relationships"
        />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Customers"
          description="Manage your customer relationships"
        />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            onClick={fetchCustomers}
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
        title="Customers"
        description="Manage your customer relationships"
        action={
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, or phone..."
        />
        <p className="text-sm text-muted-foreground">
          {filteredCustomers.length}{" "}
          {filteredCustomers.length === 1 ? "customer" : "customers"}
        </p>
      </div>

      {filteredCustomers.length === 0 && !searchQuery ? (
        <EmptyState
          title="No customers yet"
          description="Get started by adding your first customer to the system."
          action={
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          }
        />
      ) : filteredCustomers.length === 0 && searchQuery ? (
        <EmptyState
          title="No results found"
          description={`No customers match "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <DataTable data={filteredCustomers} columns={columns} />
      )}

      {/* Add Customer Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSubmit={handleAddCustomer}
            onCancel={() => setAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <CustomerForm
              initialData={selectedCustomer}
              onSubmit={handleEditCustomer}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedCustomer(null);
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
        onConfirm={handleDeleteCustomer}
        title="Delete Customer"
        description={
          selectedCustomer
            ? `Are you sure you want to delete ${selectedCustomer.firstname} ${selectedCustomer.lastname}? This action cannot be undone.`
            : ""
        }
        isDeleting={isDeleting}
      />
    </div>
  );
}
