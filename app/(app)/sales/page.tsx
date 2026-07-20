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
import { SaleForm } from "@/components/features/sales/SaleForm";
import {
  getSales,
  createSale,
  updateSale,
  deleteSale,
} from "@/services/sales";
import type { Sale, SaleFormData } from "@/types/sales";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch sales
  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSales();
      setSales(data);
      setFilteredSales(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch sales";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredSales(sales);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = sales.filter(
      (sale) =>
        // Customer name
        (sale.customer_firstname &&
          sale.customer_firstname.toLowerCase().includes(query)) ||
        (sale.customer_lastname &&
          sale.customer_lastname.toLowerCase().includes(query)) ||
        // Vehicle make/model
        (sale.car_make && sale.car_make.toLowerCase().includes(query)) ||
        (sale.car_model && sale.car_model.toLowerCase().includes(query)) ||
        // Salesperson name
        (sale.staff_firstname &&
          sale.staff_firstname.toLowerCase().includes(query)) ||
        (sale.staff_lastname &&
          sale.staff_lastname.toLowerCase().includes(query))
    );
    setFilteredSales(filtered);
  }, [searchQuery, sales]);

  // Add sale
  const handleAddSale = async (data: SaleFormData) => {
    try {
      setIsSubmitting(true);
      await createSale(data);
      toast.success("Sale recorded successfully");
      setAddDialogOpen(false);
      await fetchSales();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to record sale";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit sale
  const handleEditSale = async (data: SaleFormData) => {
    if (!selectedSale) return;

    try {
      setIsSubmitting(true);
      await updateSale(selectedSale.saleid, data);
      toast.success("Sale updated successfully");
      setEditDialogOpen(false);
      setSelectedSale(null);
      await fetchSales();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update sale";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete sale
  const handleDeleteSale = async () => {
    if (!selectedSale) return;

    try {
      setIsDeleting(true);
      await deleteSale(selectedSale.saleid);
      toast.success("Sale deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedSale(null);
      await fetchSales();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete sale";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns
  const columns = [
    {
      header: "Customer",
      accessor: ((row: Sale) =>
        `${row.customer_firstname || ""} ${
          row.customer_lastname || ""
        }`.trim()) as any,
    },
    {
      header: "Vehicle",
      accessor: ((row: Sale) =>
        `${row.car_make || ""} ${row.car_model || ""}`.trim()) as any,
    },
    {
      header: "Salesperson",
      accessor: ((row: Sale) =>
        `${row.staff_firstname || ""} ${row.staff_lastname || ""}`.trim()) as any,
    },
    {
      header: "Sale Date",
      accessor: ((row: Sale) =>
        new Date(row.saledate).toLocaleDateString("en-GB")) as any,
    },
    {
      header: "Sale Price",
      accessor: ((row: Sale) => `£${row.saleprice.toLocaleString()}`) as any,
    },
    {
      header: "Payment Method",
      accessor: "paymentmethod" as keyof Sale,
    },
    {
      header: "Actions",
      accessor: ((row: Sale) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedSale(row);
              setEditDialogOpen(true);
            }}
            aria-label="Edit sale"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedSale(row);
              setDeleteDialogOpen(true);
            }}
            aria-label="Delete sale"
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
        <PageHeader title="Sales" description="Track and manage vehicle sales" />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sales" description="Track and manage vehicle sales" />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            onClick={fetchSales}
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
        title="Sales"
        description="Track and manage vehicle sales"
        action={
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Sale
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by customer, vehicle, or salesperson..."
        />
        <p className="text-sm text-muted-foreground">
          {filteredSales.length} {filteredSales.length === 1 ? "sale" : "sales"}
        </p>
      </div>

      {filteredSales.length === 0 && !searchQuery ? (
        <EmptyState
          title="No sales yet"
          description="Get started by recording your first vehicle sale."
          action={
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Sale
            </Button>
          }
        />
      ) : filteredSales.length === 0 && searchQuery ? (
        <EmptyState
          title="No results found"
          description={`No sales match "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <DataTable data={filteredSales} columns={columns} />
      )}

      {/* Add Sale Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record New Sale</DialogTitle>
          </DialogHeader>
          <SaleForm
            onSubmit={handleAddSale}
            onCancel={() => setAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Sale Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <SaleForm
              initialData={selectedSale}
              onSubmit={handleEditSale}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedSale(null);
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
        onConfirm={handleDeleteSale}
        title="Delete Sale"
        description={
          selectedSale
            ? `Are you sure you want to delete this sale record? This action cannot be undone.`
            : ""
        }
        isDeleting={isDeleting}
      />
    </div>
  );
}
