import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { servicesAPI, departmentsAPI, companyAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Trash2, Contact, Edit2 } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  contacts: string;
  departmentId: number;
  department?: any;
  commonIssues?: any[];
}

function Services() {
  const { user } = useUser();
  const [services, setServices] = useState<Service[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contacts: "",
    departmentId: "",
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

      const companies = await companyAPI.getByCompanyId(user.id);
      if (!companies || companies.length === 0) {
        setLoading(false);
        return;
      }

      const companyData = companies[0];
      setCompany(companyData);

      const depts = await departmentsAPI.getByCompany(user?.id);
      setDepartments(depts);

      if (depts.length === 0) {
        setLoading(false);
        return;
      }

      const servicePromises = depts.map((dept: any) =>
        servicesAPI.getByDepartment(dept.id)
      );
      const servicesArrays = await Promise.all(servicePromises);
      const allServices = servicesArrays.flat();

      // Calculate pagination on the aggregated results
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedServices = allServices.slice(startIndex, endIndex);

      setServices(paginatedServices);
      console.log(paginatedServices);
      setTotalItems(allServices.length);
      setTotalPages(Math.ceil(allServices.length / itemsPerPage));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createService = async () => {
    try {
      await servicesAPI.create({
        ...formData,
        departmentId: parseInt(formData.departmentId),
      });
      setFormData({
        name: "",
        description: "",
        contacts: "",
        departmentId: "",
      });
      setIsAddDialogOpen(false);
      setCurrentPage(1);
      loadAllData();
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const updateService = async () => {
    if (!selectedService) return;

    try {
      await servicesAPI.update(selectedService.id, {
        name: formData.name,
        description: formData.description,
        contacts: formData.contacts,
        departmentId: parseInt(formData.departmentId),
      });
      setIsEditDialogOpen(false);
      setSelectedService(null);
      setFormData({
        name: "",
        description: "",
        contacts: "",
        departmentId: "",
      });
      loadAllData();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const deleteService = async () => {
    if (!selectedService) return;

    try {
      await servicesAPI.delete(selectedService.id);
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
      // If current page becomes empty after deletion, go to previous page
      if (services.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      loadAllData();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      contacts: service.contacts,
      departmentId: service.departmentId.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      description: "",
      contacts: "",
      departmentId: "",
    });
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedService(null);
    setFormData({
      name: "",
      description: "",
      contacts: "",
      departmentId: "",
    });
  };

  if (!user || loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!company || departments.length === 0) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Services
            </h1>
            <p className="text-gray-400">
              Manage your organization's services and offerings
            </p>
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="pt-6">
              <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-lg">
                <div className="space-y-3">
                  {!company ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-400">
                        No Company Profile Found
                      </h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Please set up your company information first.
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
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-400">
                        No Departments Found
                      </h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Create departments first before adding services.
                      </p>
                      <Button
                        variant="outline"
                        asChild
                        className="mt-4 bg-white/5 hover:bg-white/10 border-white/20 text-white"
                      >
                        <a href="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/departments">
                          Create Departments
                        </a>
                      </Button>
                    </>
                  )}
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
      <div className="w-full  space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Services
            </h1>
            <p className="text-gray-400">
              Manage {company.name}'s services and customer support offerings
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white">
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 backdrop-blur-xl border-white/10 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Add New Service
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new service for your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-name"
                      className="text-sm font-medium text-white"
                    >
                      Service Name
                    </Label>
                    <Input
                      id="add-name"
                      placeholder="e.g. Technical Support, Customer Service"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-department"
                      className="text-sm font-medium text-white"
                    >
                      Department
                    </Label>
                    <Select
                      value={formData.departmentId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, departmentId: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                        {departments.map((department: any) => (
                          <SelectItem
                            key={department.id}
                            value={department.id.toString()}
                            className="text-white hover:bg-white/10"
                          >
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                    placeholder="Describe what this service offers"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="add-contacts"
                    className="text-sm font-medium text-white"
                  >
                    Contact Information
                  </Label>
                  <Input
                    id="add-contacts"
                    placeholder="e.g. support@company.com, +1-555-0123"
                    value={formData.contacts}
                    onChange={(e) =>
                      setFormData({ ...formData, contacts: e.target.value })
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
                  onClick={createService}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Create Service
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="">
          <CardContent>
            {services.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-400">
                    No Services Found
                  </h3>
                  <p className="text-sm text-gray-500">
                    Create your first service to start managing customer support
                    offerings.
                  </p>
                </div>
              </div>
            ) : (
              <div className="">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">
                        Department
                      </TableHead>
                      <TableHead className="text-gray-400">
                        Description
                      </TableHead>
                      <TableHead className="text-gray-400">Contact</TableHead>
                      <TableHead className="text-gray-400">Issues</TableHead>
                      <TableHead className="text-right text-gray-400">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow
                        key={service.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="font-medium text-white">
                          {service.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-white/10 text-white border-white/20"
                          >
                            {service.department?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 max-w-xs truncate">
                          {service.description}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          <div className="flex items-center gap-2">
                            <Contact className="w-4 h-4" />
                            <span className="truncate max-w-[150px]">
                              {service.contacts}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-white/10 text-white border-white/20"
                          >
                            {service.commonIssues?.length || 0} issues
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openEditDialog(service)}
                              variant="outline"
                              size="sm"
                              className="gap-2 bg-white/5 hover:bg-white/10 border-white/20 text-white"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteDialog(service)}
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
            {services.length > 0 && totalPages > 1 && (
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
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-neutral-900 backdrop-blur-xl border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Service</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update the service information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-name"
                    className="text-sm font-medium text-white"
                  >
                    Service Name
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
                    htmlFor="edit-department"
                    className="text-sm font-medium text-white"
                  >
                    Department
                  </Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, departmentId: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                      {departments.map((department: any) => (
                        <SelectItem
                          key={department.id}
                          value={department.id.toString()}
                          className="text-white hover:bg-white/10"
                        >
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              <div className="space-y-2">
                <Label
                  htmlFor="edit-contacts"
                  className="text-sm font-medium text-white"
                >
                  Contact Information
                </Label>
                <Input
                  id="edit-contacts"
                  value={formData.contacts}
                  onChange={(e) =>
                    setFormData({ ...formData, contacts: e.target.value })
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
                onClick={updateService}
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
          <AlertDialogContent className="bg-neutral-900 backdrop-blur-xl border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Delete Service
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete "{selectedService?.name}"? This
                action cannot be undone and will also remove all associated
                common issues.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/20 text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteService}
                className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
              >
                Delete Service
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

export default Services;
