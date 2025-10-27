import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { departmentsAPI, companyAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  const [company, setCompany] = useState<any>(null);
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

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user, currentPage]);

  const loadAllData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get company data
      const companies = await companyAPI.getByCompanyId(user.id);
      if (!companies || companies.length === 0) {
        setLoading(false);
        return;
      }

      const companyData = companies[0];
      setCompany(companyData);

      // Get departments with pagination
      const response = await departmentsAPI.getByCompany(
        user?.id,
        currentPage,
        itemsPerPage
      );
      console.log(response);

      // Handle response format - backend should return { data, total, page, limit }
      if (response.data) {
        setDepartments(response.data);
        setTotalItems(response.total || 0);
        setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
      } else {
        // Fallback if backend doesn't support pagination yet
        setDepartments(response);
        setTotalItems(response.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async () => {
    if (!company) return;

    try {
      await departmentsAPI.create({
        ...formData,
        companyId: company.id,
      });
      setFormData({ name: "", description: "" });
      setIsAddDialogOpen(false);
      setCurrentPage(1);
      loadAllData();
    } catch (error) {
      console.error("Error creating department:", error);
    }
  };

  const updateDepartment = async () => {
    if (!selectedDepartment) return;

    try {
      await departmentsAPI.update(selectedDepartment.id, {
        name: formData.name,
        description: formData.description,
        companyId: selectedDepartment.companyId,
      });
      setIsEditDialogOpen(false);
      setSelectedDepartment(null);
      setFormData({ name: "", description: "" });
      loadAllData();
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const deleteDepartment = async () => {
    if (!selectedDepartment) return;

    try {
      await departmentsAPI.delete(selectedDepartment.id);
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
      // If current page becomes empty after deletion, go to previous page
      if (departments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      loadAllData();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const openEditDialog = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setFormData({ name: "", description: "" });
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedDepartment(null);
    setFormData({ name: "", description: "" });
  };

  if (!user || loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Departments
            </h1>
            <p className="text-gray-400">
              Manage your organization's departments and structure
            </p>
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="pt-6">
              <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-400">
                    No Company Profile Found
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Please set up your company information first before managing
                    departments.
                  </p>
                  <Button
                    variant="outline"
                    asChild
                    className="mt-4 bg-white/5 hover:bg-white/10 border-white/20 text-white"
                  >
                    <a href="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/general">
                      Setup Company Profile
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Departments
            </h1>
            <p className="text-gray-400">
              Manage {company.name}'s organizational structure and departments
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Add New Department
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new department for your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="add-name"
                    className="text-sm font-medium text-white"
                  >
                    Department Name
                  </Label>
                  <Input
                    id="add-name"
                    placeholder="e.g. Customer Support, Sales, Engineering"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="add-description"
                    className="text-sm font-medium text-white"
                  >
                    Description
                  </Label>
                  <Input
                    id="add-description"
                    placeholder="Describe the department's role and responsibilities"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleAddDialogClose}
                  className="bg-white/5 hover:bg-white/10 border-white/20 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createDepartment}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Create Department
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">All Departments</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage all departments in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {departments.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-400">
                    No Departments Found
                  </h3>
                  <p className="text-sm text-gray-500">
                    Create your first department to get started with organizing
                    your company structure.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">
                        Description
                      </TableHead>
                      <TableHead className="text-gray-400">Services</TableHead>
                      <TableHead className="text-right text-gray-400">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((department) => (
                      <TableRow
                        key={department.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="font-medium text-white">
                          {department.name}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {department.description}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-white/10 text-white border-white/20"
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
                              className="gap-2 bg-white/5 hover:bg-white/10 border-white/20 text-white"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteDialog(department)}
                              variant="destructive"
                              size="sm"
                              className="gap-2 bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {departments.length > 0 && totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        className={`cursor-pointer bg-white/5 hover:bg-white/10 border-white/20 text-white ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className={`cursor-pointer ${
                              currentPage === page
                                ? "bg-white/20 text-white"
                                : "bg-white/5 hover:bg-white/10 text-gray-400"
                            } border-white/20`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        className={`cursor-pointer bg-white/5 hover:bg-white/10 border-white/20 text-white ${
                          currentPage === totalPages
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
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Department</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update the department information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-name"
                  className="text-sm font-medium text-white"
                >
                  Department Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-description"
                  className="text-sm font-medium text-white"
                >
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleEditDialogClose}
                className="bg-white/5 hover:bg-white/10 border-white/20 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={updateDepartment}
                className="bg-white/10 hover:bg-white/20 text-white"
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
          <AlertDialogContent className="bg-black/95 backdrop-blur-xl border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Delete Department
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete "{selectedDepartment?.name}"?
                This action cannot be undone and will also remove all associated
                services.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/20 text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteDepartment}
                className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
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
