import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { servicesAPI, departmentsAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { Plus, Trash2, Contact, Edit2, Filter } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<
    string | null
  >(null);
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

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const depts = await departmentsAPI.getByCompany(user.id);
      setDepartments(depts);

      if (depts.length === 0) {
        setLoading(false);
        return;
      }

      const deptsToFetch = selectedDepartmentFilter
        ? [{ id: parseInt(selectedDepartmentFilter) }]
        : depts;

      const servicePromises = deptsToFetch.map((dept: any) =>
        servicesAPI.getByDepartment(user.id, dept.id)
      );
      const servicesArrays = await Promise.all(servicePromises);
      const allServices = servicesArrays.flat();

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
  }, [user?.id, currentPage, selectedDepartmentFilter]);

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user, loadAllData]);

  const createService = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true)
    try {
      await servicesAPI.create(user.id, {
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
  }, [formData, user?.id, loadAllData]);

  const updateService = useCallback(async () => {
    if (!selectedService || !user?.id) return;
    setLoading(true)
    try {
      await servicesAPI.update(user.id, selectedService.id, {
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
  }, [selectedService, formData, user?.id, loadAllData]);

  const deleteService = useCallback(async () => {
    if (!selectedService || !user?.id) return;
    setLoading(true)
    try {
      await servicesAPI.delete(user.id, selectedService.id);
      setIsDeleteDialogOpen(false);
      setSelectedService(null);

      if (services.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      loadAllData();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  }, [selectedService, services.length, currentPage, user?.id, loadAllData]);

  const openEditDialog = useCallback((service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      contacts: service.contacts,
      departmentId: service.departmentId.toString(),
    });
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleAddDialogClose = useCallback(() => {
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      description: "",
      contacts: "",
      departmentId: "",
    });
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    setSelectedService(null);
    setFormData({
      name: "",
      description: "",
      contacts: "",
      departmentId: "",
    });
  }, []);

  const handleFormNameChange = useCallback((e: any) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  }, []);

  const handleFormDescriptionChange = useCallback((e: any) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  }, []);

  const handleFormContactsChange = useCallback((e: any) => {
    setFormData((prev) => ({ ...prev, contacts: e.target.value }));
  }, []);

  const handleFormDepartmentChange = useCallback((value: any) => {
    setFormData((prev) => ({ ...prev, departmentId: value }));
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

  const handleDepartmentFilterChange = useCallback((value: string) => {
    setSelectedDepartmentFilter(value === "all" ? null : value);
    setCurrentPage(1);
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

  const departmentMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    departments.forEach((dept: any) => {
      map[dept.id] = dept.name;
    });
    return map;
  }, [departments]);

  const getSelectedDepartmentName = useMemo(() => {
    if (!selectedDepartmentFilter) return "All Departments";
    return (
      departmentMap[parseInt(selectedDepartmentFilter)] || "All Departments"
    );
  }, [selectedDepartmentFilter, departmentMap]);

  if (!user || loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (departments.length === 0) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Services
            </h1>
            <p className="text-gray-600">
              Manage your organization's services and offerings
            </p>
          </div>

          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    No Departments Found
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Create departments first before adding services.
                  </p>
                  <Button
                    variant="outline"
                    asChild
                    className="mt-4 bg-white hover:bg-gray-50 border-gray-200 text-gray-900"
                  >
                    <a href="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/departments">
                      Create Departments
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
      <div className="w-full  space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Services
            </h1>
            <p className="text-gray-600">
              Manage your services and customer support offerings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 border-blue-800/20 text-white">
                  <Plus className="w-4 h-4" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">
                    Add New Service
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Create a new service for your organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="add-name"
                        className="text-sm font-medium text-gray-900"
                      >
                        Service Name
                      </Label>
                      <Input
                        id="add-name"
                        placeholder="e.g. Technical Support, Customer Service"
                        value={formData.name}
                        onChange={handleFormNameChange}
                        className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="add-department"
                        className="text-sm font-medium text-gray-900"
                      >
                        Department
                      </Label>
                      <Select
                        value={formData.departmentId}
                        onValueChange={handleFormDepartmentChange}
                      >
                        <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {departments.map((department: any) => (
                            <SelectItem
                              key={department.id}
                              value={department.id.toString()}
                              className="text-gray-900 hover:bg-gray-50"
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
                      className="text-sm font-medium text-gray-900"
                    >
                      Description
                    </Label>
                    <Input
                      id="add-description"
                      placeholder="Describe what this service offers"
                      value={formData.description}
                      onChange={handleFormDescriptionChange}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-contacts"
                      className="text-sm font-medium text-gray-900"
                    >
                      Contact Information
                    </Label>
                    <Input
                      id="add-contacts"
                      placeholder="e.g. support@company.com, +1-555-0123"
                      value={formData.contacts}
                      onChange={handleFormContactsChange}
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
                    onClick={createService}
                    className="bg-blue-900/60 hover:bg-blue-900/70 text-white"
                  >
                    Create Service
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Department Filter */}
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 border-blue-800/20 text-white">
                    <Filter className="w-4 h-4" />
                    {getSelectedDepartmentName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-gray-200 min-w-[200px]">
                  <DropdownMenuLabel className="text-gray-900">
                    Filter by Department
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuRadioGroup
                    value={selectedDepartmentFilter || "all"}
                    onValueChange={handleDepartmentFilterChange}
                  >
                    <DropdownMenuRadioItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                      All Departments
                    </DropdownMenuRadioItem>
                    {departments.map((department: any) => (
                      <DropdownMenuRadioItem
                        key={department.id}
                        value={department.id.toString()}
                        className="text-gray-900 hover:bg-gray-50 cursor-pointer"
                      >
                        {department.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="">
          <CardContent>
            {services.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    No Services Found
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create your first service to start managing customer support
                    offerings.
                  </p>
                </div>
              </div>
            ) : (
              <div className="">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 hover:bg-gray-50">
                      <TableHead className="text-gray-700">Name</TableHead>
                      <TableHead className="text-gray-700">
                        Department
                      </TableHead>
                      <TableHead className="text-gray-700">
                        Description
                      </TableHead>
                      <TableHead className="text-gray-700">Contact</TableHead>
                      <TableHead className="text-gray-700">Issues</TableHead>
                      <TableHead className="text-right text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow
                        key={service.id}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <TableCell className="font-medium text-gray-900">
                          {service.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-900/60 border-blue-900/5"
                          >
                            {departmentMap[service.departmentId]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">
                          {service.description}
                        </TableCell>
                        <TableCell className="text-gray-600">
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
                            className="bg-gray-50 text-gray-700 border-gray-200"
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
                              className="gap-2 bg-white hover:bg-gray-50 border-gray-200"
                            >
                              <Edit2 className="w-4 h-4 text-gray-900" />
                            </Button>
                            <Button
                              onClick={() => openDeleteDialog(service)}
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
              </div>
            )}

            {/* Pagination */}
            {services.length > 0 && totalPages > 1 && (
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
                          isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
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
          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Edit Service</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the service information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-name"
                    className="text-sm font-medium text-gray-900"
                  >
                    Service Name
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
                    htmlFor="edit-department"
                    className="text-sm font-medium text-gray-900"
                  >
                    Department
                  </Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={handleFormDepartmentChange}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {departments.map((department: any) => (
                        <SelectItem
                          key={department.id}
                          value={department.id.toString()}
                          className="text-gray-900 hover:bg-gray-50"
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
              <div className="space-y-2">
                <Label
                  htmlFor="edit-contacts"
                  className="text-sm font-medium text-gray-900"
                >
                  Contact Information
                </Label>
                <Input
                  id="edit-contacts"
                  value={formData.contacts}
                  onChange={handleFormContactsChange}
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
                onClick={updateService}
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
                Delete Service
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete "{selectedService?.name}"? This
                action cannot be undone and will also remove all associated
                common issues.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white hover:bg-gray-50 border-gray-200 text-gray-900">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteService}
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
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