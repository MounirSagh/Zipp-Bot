import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { commonIssuesAPI, servicesAPI, departmentsAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Trash2, AlertCircle, Edit2, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface CommonIssue {
  id: number;
  name: string;
  description: string;
  solutions: any;
  serviceId: number;
  service?: any;
}

function Issues() {
  const { user } = useUser();
  const [issues, setIssues] = useState<CommonIssue[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<CommonIssue | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    solutions: "",
    serviceId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<
    string | null
  >(null);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<
    string | null
  >(null);
  const [departments, setDepartments] = useState<any[]>([]);

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const depts = await departmentsAPI.getByCompany(user.id);
      setDepartments(depts);

      if (depts.length === 0) {
        setIssues([]);
        setServices([]);
        setTotalItems(0);
        setTotalPages(1);
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

      setServices(allServices);

      if (allServices.length === 0) {
        setIssues([]);
        setTotalItems(0);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const servicesToFetch = selectedServiceFilter
        ? [{ id: parseInt(selectedServiceFilter) }]
        : allServices;

      const issuePromises = servicesToFetch.map((service: any) =>
        commonIssuesAPI.getByService(user.id, service.id)
      );
      const issuesArrays = await Promise.all(issuePromises);
      const allIssues = issuesArrays.flat();

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedIssues = allIssues.slice(startIndex, endIndex);

      setIssues(paginatedIssues);
      setTotalItems(allIssues.length);
      setTotalPages(Math.ceil(allIssues.length / itemsPerPage));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    user?.id,
    currentPage,
    itemsPerPage,
    selectedDepartmentFilter,
    selectedServiceFilter,
  ]);

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user?.id, loadAllData]);

  const parseSolutions = useCallback((solutionsData: any) => {
    try {
      return typeof solutionsData === "string"
        ? JSON.parse(solutionsData)
        : solutionsData;
    } catch {
      return { description: solutionsData };
    }
  }, []);

  const createIssue = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const solutionsData = parseSolutions(formData.solutions);
      await commonIssuesAPI.create(user.id, {
        name: formData.name,
        description: formData.description,
        solutions: solutionsData,
        serviceId: parseInt(formData.serviceId),
      });
      setFormData({ name: "", description: "", solutions: "", serviceId: "" });
      setIsAddDialogOpen(false);
      setCurrentPage(1);
      loadAllData();
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  }, [formData, parseSolutions, user?.id, loadAllData]);

  const updateIssue = useCallback(async () => {
    if (!selectedIssue || !user?.id) return;
    setLoading(true);
    try {
      const solutionsData = parseSolutions(formData.solutions);
      await commonIssuesAPI.update(user.id, selectedIssue.id, {
        name: formData.name,
        description: formData.description,
        solutions: solutionsData,
        serviceId: parseInt(formData.serviceId),
      });
      setIsEditDialogOpen(false);
      setSelectedIssue(null);
      setFormData({ name: "", description: "", solutions: "", serviceId: "" });
      loadAllData();
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  }, [selectedIssue, formData, parseSolutions, user?.id, loadAllData]);

  const deleteIssue = useCallback(async () => {
    if (!selectedIssue || !user?.id) return;
    setLoading(true);
    try {
      await commonIssuesAPI.delete(user.id, selectedIssue.id);
      setIsDeleteDialogOpen(false);
      setSelectedIssue(null);
      if (issues.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      loadAllData();
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  }, [selectedIssue, issues.length, currentPage, user?.id, loadAllData]);

  const openEditDialog = useCallback((issue: CommonIssue) => {
    setSelectedIssue(issue);
    setFormData({
      name: issue.name,
      description: issue.description,
      solutions:
        typeof issue.solutions === "object"
          ? JSON.stringify(issue.solutions, null, 2)
          : issue.solutions,
      serviceId: issue.serviceId.toString(),
    });
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((issue: CommonIssue) => {
    setSelectedIssue(issue);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleAddDialogClose = useCallback(() => {
    setIsAddDialogOpen(false);
    setFormData({ name: "", description: "", solutions: "", serviceId: "" });
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    setSelectedIssue(null);
    setFormData({ name: "", description: "", solutions: "", serviceId: "" });
  }, []);

  const handleFormNameChange = useCallback((e: any) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  }, []);
  const handleFormDescriptionChange = useCallback((e: any) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  }, []);
  const handleFormSolutionsChange = useCallback((e: any) => {
    setFormData((prev) => ({ ...prev, solutions: e.target.value }));
  }, []);
  const handleFormServiceChange = useCallback((value: any) => {
    setFormData((prev) => ({ ...prev, serviceId: value }));
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
    setSelectedServiceFilter(null);
    setCurrentPage(1);
  }, []);

  const handleServiceFilterChange = useCallback((value: string) => {
    setSelectedServiceFilter(value === "all" ? null : value);
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

  const serviceMap = useMemo(() => {
    const map: { [key: number]: { name: string; department: string } } = {};
    services.forEach((service: any) => {
      map[service.id] = {
        name: service.name,
        department: service.department?.name || "Unknown",
      };
    });
    return map;
  }, [services]);

  const getSelectedDepartmentName = useMemo(() => {
    if (!selectedDepartmentFilter) return "All Departments";
    return (
      departmentMap[parseInt(selectedDepartmentFilter)] || "All Departments"
    );
  }, [selectedDepartmentFilter, departmentMap]);

  const getSelectedServiceName = useMemo(() => {
    if (!selectedServiceFilter) return "All Services";
    const s = serviceMap[parseInt(selectedServiceFilter)];
    return s?.name ?? "All Services";
  }, [selectedServiceFilter, serviceMap]);

  if (!user || loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (services.length === 0) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Common Issues
            </h1>
            <p className="text-gray-600">
              Manage frequently encountered problems and their solutions
            </p>
          </div>

          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    No Services Found
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Please set up your company, departments, and services first
                    before managing common issues.
                  </p>
                  <Button
                    variant="outline"
                    asChild
                    className="mt-4 bg-white hover:bg-gray-50 border-gray-200 text-gray-900"
                  >
                    <a href="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/services">
                      Setup Services
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
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Common Issues
            </h1>
            <p className="text-gray-600">
              Manage your frequently encountered problems and their solutions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 text-white">
                  <Plus className="w-4 h-4" />
                  Add Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">
                    Add New Common Issue
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Create a new common issue and its solutions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="add-name"
                        className="text-sm font-medium text-gray-900"
                      >
                        Issue Name
                      </Label>
                      <Input
                        id="add-name"
                        placeholder="e.g. Login Problems, Payment Failed"
                        value={formData.name}
                        onChange={handleFormNameChange}
                        className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="add-service"
                        className="text-sm font-medium text-gray-900"
                      >
                        Service
                      </Label>
                      <Select
                        value={formData.serviceId}
                        onValueChange={handleFormServiceChange}
                      >
                        <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {services.map((service: any) => (
                            <SelectItem
                              key={service.id}
                              value={service.id.toString()}
                              className="text-gray-900 hover:bg-gray-50"
                            >
                              {service.name} ({service.department?.name})
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
                      placeholder="Describe the common issue"
                      value={formData.description}
                      onChange={handleFormDescriptionChange}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-solutions"
                      className="text-sm font-medium text-gray-900"
                    >
                      Solutions
                    </Label>
                    <Textarea
                      id="add-solutions"
                      placeholder="Provide solutions (JSON format or plain text)"
                      value={formData.solutions}
                      onChange={handleFormSolutionsChange}
                      className="min-h-[120px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
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
                    onClick={createIssue}
                    className="bg-blue-900/60 hover:bg-blue-900/70 text-white"
                    disabled={!formData.serviceId}
                  >
                    Create Issue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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

            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2 bg-blue-900/60 hover:bg-blue-900/70 border-blue-800/20 text-white">
                    <Filter className="w-4 h-4" />
                    {getSelectedServiceName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-gray-200 min-w-[200px]">
                  <DropdownMenuLabel className="text-gray-900">
                    Filter by Service
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuRadioGroup
                    value={selectedServiceFilter || "all"}
                    onValueChange={handleServiceFilterChange}
                  >
                    <DropdownMenuRadioItem
                      value="all"
                      className="text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                      All Services
                    </DropdownMenuRadioItem>
                    {services.map((service: any) => (
                      <DropdownMenuRadioItem
                        key={service.id}
                        value={service.id.toString()}
                        className="text-gray-900 hover:bg-gray-50 cursor-pointer"
                      >
                        {service.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div>
          <CardContent>
            {issues.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    No Common Issues Found
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create your first common issue to help streamline customer
                    support.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 hover:bg-gray-50">
                      <TableHead className="text-gray-700">Issue</TableHead>
                      <TableHead className="text-gray-700">Service</TableHead>
                      <TableHead className="text-gray-700">
                        Description
                      </TableHead>
                      <TableHead className="text-right text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow
                        key={issue.id}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span>{issue.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-blue-900/5 text-blue-900/60 border-blue-900/5"
                          >
                            {serviceMap[issue.serviceId]?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">
                          {issue.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openEditDialog(issue)}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteDialog(issue)}
                              variant="destructive"
                              size="sm"
                              className="gap-2 bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-600"
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

            {issues.length > 0 && totalPages > 1 && (
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
                          className={`cursor-pointer border-gray-200 ${
                            currentPage === page
                              ? "bg-blue-900/60 text-white"
                              : "bg-white hover:bg-gray-50 text-gray-700"
                          }`}
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900">
                Edit Common Issue
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the issue information and solutions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-name"
                    className="text-sm font-medium text-gray-900"
                  >
                    Issue Name
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
                    htmlFor="edit-service"
                    className="text-sm font-medium text-gray-900"
                  >
                    Service
                  </Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={handleFormServiceChange}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {services.map((service: any) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                          className="text-gray-900 hover:bg-gray-50"
                        >
                          {service.name} ({service.department?.name})
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
                  htmlFor="edit-solutions"
                  className="text-sm font-medium text-gray-900"
                >
                  Solutions
                </Label>
                <Textarea
                  id="edit-solutions"
                  value={formData.solutions}
                  onChange={handleFormSolutionsChange}
                  className="min-h-[120px] bg-white border-gray-200 text-gray-900"
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
                onClick={updateIssue}
                className="bg-blue-900/60 hover:bg-blue-900/70 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="bg-white border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">
                Delete Common Issue
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete "{selectedIssue?.name}"? This
                action cannot be undone and will remove the issue and all its
                solutions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white hover:bg-gray-50 border-gray-200 text-gray-900">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteIssue}
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
              >
                Delete Issue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

export default Issues;
