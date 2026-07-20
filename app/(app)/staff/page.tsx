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
import { StaffForm } from "@/components/features/staff/StaffForm";
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "@/services/staff";
import type { Staff, StaffFormData } from "@/types/staff";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch staff
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStaff();
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch staff";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredStaff(staff);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = staff.filter(
      (member) =>
        member.firstname.toLowerCase().includes(query) ||
        member.lastname.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query) ||
        member.jobtitle.toLowerCase().includes(query)
    );
    setFilteredStaff(filtered);
  }, [searchQuery, staff]);

  // Add staff
  const handleAddStaff = async (data: StaffFormData) => {
    try {
      setIsSubmitting(true);
      await createStaff(data);
      toast.success("Staff member added successfully");
      setAddDialogOpen(false);
      await fetchStaff();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add staff member";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit staff
  const handleEditStaff = async (data: StaffFormData) => {
    if (!selectedStaff) return;

    try {
      setIsSubmitting(true);
      await updateStaff(selectedStaff.staffid, data);
      toast.success("Staff member updated successfully");
      setEditDialogOpen(false);
      setSelectedStaff(null);
      await fetchStaff();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update staff member";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete staff
  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    try {
      setIsDeleting(true);
      await deleteStaff(selectedStaff.staffid);
      toast.success("Staff member deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
      await fetchStaff();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete staff member";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns
  const columns = [
    {
      header: "Name",
      accessor: ((row: Staff) => `${row.firstname} ${row.lastname}`) as any,
    },
    { header: "Job Title", accessor: "jobtitle" as keyof Staff },
    { header: "Email", accessor: "email" as keyof Staff },
    { header: "Phone", accessor: "phone" as keyof Staff },
    {
      header: "Actions",
      accessor: ((row: Staff) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedStaff(row);
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
              setSelectedStaff(row);
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
        <PageHeader title="Staff" description="Manage your dealership team" />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Staff" description="Manage your dealership team" />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            onClick={fetchStaff}
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
        title="Staff"
        description="Manage your dealership team"
        action={
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, phone, or job title..."
        />
        <p className="text-sm text-muted-foreground">
          {filteredStaff.length}{" "}
          {filteredStaff.length === 1 ? "staff member" : "staff members"}
        </p>
      </div>

      {filteredStaff.length === 0 && !searchQuery ? (
        <EmptyState
          title="No staff members yet"
          description="Get started by adding your first team member to the system."
          action={
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          }
        />
      ) : filteredStaff.length === 0 && searchQuery ? (
        <EmptyState
          title="No results found"
          description={`No staff members match "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <DataTable data={filteredStaff} columns={columns} />
      )}

      {/* Add Staff Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <StaffForm
            onSubmit={handleAddStaff}
            onCancel={() => setAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <StaffForm
              initialData={selectedStaff}
              onSubmit={handleEditStaff}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedStaff(null);
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
        onConfirm={handleDeleteStaff}
        title="Delete Staff Member"
        description={
          selectedStaff
            ? `Are you sure you want to delete ${selectedStaff.firstname} ${selectedStaff.lastname}? This action cannot be undone.`
            : ""
        }
        isDeleting={isDeleting}
      />
    </div>
  );
}
