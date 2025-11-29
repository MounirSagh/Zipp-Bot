import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { departmentsAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface Department {
  id: number;
  name: string;
  description: string;
  companyId: number;
  company?: any;
  services?: any[];
}

function Departments() {
  const { user } = useUser();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await departmentsAPI.getByCompany(
        user.id,
        currentPage,
        itemsPerPage
      );
      console.log(response);

      if (response.data) {
        setDepartments(response.data);
        setTotalItems(response.total || 0);
        setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
      } else {
        setDepartments(response);
        setTotalItems(response.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, currentPage]);

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user, loadAllData]);

  const createDepartment = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true)
    try {
      await departmentsAPI.create(user.id, {
        ...formData,
        companyId: user.id,
      });
      setFormData({ name: "", description: "" });
      setIsAddDialogOpen(false);
      setCurrentPage(1);
      loadAllData();
    } catch (error) {
      console.error("Error creating department:", error);
    }
  }, [formData, user?.id, loadAllData]);

  const updateDepartment = useCallback(async () => {
    if (!selectedDepartment || !user?.id) return;
    setLoading(true)
    try {
      await departmentsAPI.update(user.id, selectedDepartment.id, {
        name: formData.name,
        description: formData.description,
        companyId: user.id,
      });
      setIsEditDialogOpen(false);
      setSelectedDepartment(null);
      setFormData({ name: "", description: "" });
      loadAllData();
    } catch (error) {
      console.error("Error updating department:", error);
    }
  }, [selectedDepartment, formData, user?.id, loadAllData]);

  const deleteDepartment = useCallback(async () => {
    if (!selectedDepartment || !user?.id) return;
    setLoading(true)
    try {
      await departmentsAPI.delete(user.id, selectedDepartment.id);
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
      if (departments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      loadAllData();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  }, [selectedDepartment, departments.length, currentPage, user?.id, loadAllData]);

  const openEditDialog = useCallback((department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
    });
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleAddDialogClose = useCallback(() => {
    setIsAddDialogOpen(false);
    setFormData({ name: "", description: "" });
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    setSelectedDepartment(null);
    setFormData({ name: "", description: "" });
  }, []);

  const handleFormNameChange = useCallback((e: any) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  }, []);

  const handleFormDescriptionChange = useCallback((e: any) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const isPreviousDisabled = useMemo(() => currentPage === 1, [currentPage]);

  const isNextDisabled = useMemo(
    () => currentPage === totalPages,
    [currentPage, totalPages]
  );

  if (!user || loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Departments
            </h1>
            <p className="text-gray-600">
              Manage your organizational structure and departments
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 border-blue-800/20 text-white">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900">
                  Add New Department
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Create a new department for your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="add-name"
                    className="text-sm font-medium text-gray-900"
                  >
                    Department Name
                  </Label>
                  <Input
                    id="add-name"
                    placeholder="e.g. Customer Support, Sales, Engineering"
                    value={formData.name}
                    onChange={handleFormNameChange}
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="add-description"
                    className="text-sm font-medium text-gray-900"
                  >
                    Description
                  </Label>
                  <Input
                    id="add-description"
                    placeholder="Describe the department's role and responsibilities"
                    value={formData.description}
                    onChange={handleFormDescriptionChange}
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleAddDialogClose}
                  className="bg-white hover:bg-gray-50 border-gray-200 text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createDepartment}
                  className="bg-blue-900/60 hover:bg-blue-900/70 text-white"
                >
                  Create Department
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-transparent border-gray-200">
          <CardContent>
            {departments.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    No Departments Found
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create your first department to get started with organizing
                    your company structure.
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-700">Name</TableHead>
                    <TableHead className="text-gray-700">Description</TableHead>
                    <TableHead className="text-gray-700">Services</TableHead>
                    <TableHead className="text-right text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow
                      key={department.id}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {department.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {department.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-900/60 border-blue-900/5"
                        >
                          {department.services?.length || 0} services
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => openEditDialog(department)}
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-white hover:bg-gray-50 border-gray-200"
                          >
                            <Edit2 className="w-4 h-4 text-gray-900" />
                          </Button>
                          <Button
                            onClick={() => openDeleteDialog(department)}
                            variant="destructive"
                            size="sm"
                            className="gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {departments.length > 0 && totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={handlePreviousPage}
                        className={`cursor-pointer bg-white hover:bg-gray-50 border-gray-200 text-gray-900 ${
                          isPreviousDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      />
                    </PaginationItem>

                    {paginationPages.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className={`cursor-pointer ${
                            currentPage === page
                              ? "bg-blue-900/60 text-white"
                              : "bg-white hover:bg-gray-50 text-gray-700"
                          } border-gray-200`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={handleNextPage}
                        className={`cursor-pointer bg-white hover:bg-gray-50 border-gray-200 text-gray-900 ${
                          isNextDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Edit Department</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the department information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-name"
                  className="text-sm font-medium text-gray-900"
                >
                  Department Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={handleFormNameChange}
                  className="bg-white border-gray-200 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-description"
                  className="text-sm font-medium text-gray-900"
                >
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={handleFormDescriptionChange}
                  className="bg-white border-gray-200 text-gray-900"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleEditDialogClose}
                className="bg-white hover:bg-gray-50 border-gray-200 text-gray-900"
              >
                Cancel
              </Button>
              <Button
                onClick={updateDepartment}
                className="bg-blue-900/60 hover:bg-blue-900/70 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Alert Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="bg-white border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">
                Delete Department
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete "{selectedDepartment?.name}"?
                This action cannot be undone and will also remove all associated
                services.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white hover:bg-gray-50 border-gray-200 text-gray-900">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteDepartment}
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
              >
                Delete Department
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

export default Departments;