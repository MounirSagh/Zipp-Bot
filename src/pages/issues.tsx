import { Layout } from "@/components/Layout";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  commonIssuesAPI,
  servicesAPI,
  departmentsAPI,
  companyAPI,
} from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Trash2, AlertCircle, Edit2 } from "lucide-react";

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
  const [company, setCompany] = useState<any>(null);
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

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user, currentPage]);

  const loadAllData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Step 1: Get company (single call)
      const companies = await companyAPI.getByCompanyId(user.id);
      if (!companies || companies.length === 0) {
        setLoading(false);
        return;
      }

      const companyData = companies[0];
      setCompany(companyData);

      // Step 2: Get departments
      const depts = await departmentsAPI.getByCompany(user?.id);

      if (depts.length === 0) {
        setLoading(false);
        return;
      }

      // Step 3: Get all services in parallel
      const servicePromises = depts.map((dept: any) =>
        servicesAPI.getByDepartment(dept.id)
      );
      const servicesArrays = await Promise.all(servicePromises);
      const allServices = servicesArrays.flat();
      setServices(allServices);

      if (allServices.length === 0) {
        setLoading(false);
        return;
      }

      // Step 4: Get all issues with pagination
      const issuePromises = allServices.map((service: any) =>
        commonIssuesAPI.getByService(service.id)
      );
      const issuesArrays = await Promise.all(issuePromises);
      const allIssues = issuesArrays.flat();

      // Calculate pagination on the aggregated results
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
  };

  const createIssue = async () => {
    try {
      let solutionsData;
      try {
        solutionsData = JSON.parse(formData.solutions);
      } catch {
        solutionsData = { description: formData.solutions };
      }

      await commonIssuesAPI.create({
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
  };

  const updateIssue = async () => {
    if (!selectedIssue) return;

    try {
      let solutionsData;
      try {
        solutionsData =
          typeof formData.solutions === "string"
            ? JSON.parse(formData.solutions)
            : formData.solutions;
      } catch {
        solutionsData = { description: formData.solutions };
      }

      await commonIssuesAPI.update(selectedIssue.id, {
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
  };

  const deleteIssue = async () => {
    if (!selectedIssue) return;

    try {
      await commonIssuesAPI.delete(selectedIssue.id);
      setIsDeleteDialogOpen(false);
      setSelectedIssue(null);
      // If current page becomes empty after deletion, go to previous page
      if (issues.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      loadAllData();
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const openEditDialog = (issue: CommonIssue) => {
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
  };

  const openDeleteDialog = (issue: CommonIssue) => {
    setSelectedIssue(issue);
    setIsDeleteDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setFormData({ name: "", description: "", solutions: "", serviceId: "" });
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedIssue(null);
    setFormData({ name: "", description: "", solutions: "", serviceId: "" });
  };

  if (!user || loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!company || services.length === 0) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Common Issues
            </h1>
            <p className="text-gray-400">
              Manage frequently encountered problems and their solutions
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
                        No Services Found
                      </h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Please set up your company, departments, and services
                        first before managing common issues.
                      </p>
                      <Button
                        variant="outline"
                        asChild
                        className="mt-4 bg-white/5 hover:bg-white/10 border-white/20 text-white"
                      >
                        <a href="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/services">
                          Setup Services
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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Common Issues
            </h1>
            <p className="text-gray-400">
              Manage {company.name}'s frequently encountered problems and their
              solutions
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white">
                <Plus className="w-4 h-4" />
                Add Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Add New Common Issue
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new common issue and its solutions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-name"
                      className="text-sm font-medium text-white"
                    >
                      Issue Name
                    </Label>
                    <Input
                      id="add-name"
                      placeholder="e.g. Login Problems, Payment Failed"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-service"
                      className="text-sm font-medium text-white"
                    >
                      Service
                    </Label>
                    <Select
                      value={formData.serviceId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, serviceId: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                        {services.map((service: any) => (
                          <SelectItem
                            key={service.id}
                            value={service.id.toString()}
                            className="text-white hover:bg-white/10"
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
                    className="text-sm font-medium text-white"
                  >
                    Description
                  </Label>
                  <Input
                    id="add-description"
                    placeholder="Describe the common issue"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="add-solutions"
                    className="text-sm font-medium text-white"
                  >
                    Solutions
                  </Label>
                  <Textarea
                    id="add-solutions"
                    placeholder="Provide solutions (JSON format or plain text)"
                    value={formData.solutions}
                    onChange={(e) =>
                      setFormData({ ...formData, solutions: e.target.value })
                    }
                    className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-500"
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
                  onClick={createIssue}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Create Issue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">All Common Issues</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage all common issues and their solutions across your
              services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-400">
                    No Common Issues Found
                  </h3>
                  <p className="text-sm text-gray-500">
                    Create your first common issue to help streamline customer
                    support.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-gray-400">Issue</TableHead>
                      <TableHead className="text-gray-400">Service</TableHead>
                      <TableHead className="text-gray-400">
                        Description
                      </TableHead>
                      <TableHead className="text-right text-gray-400">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow
                        key={issue.id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span>{issue.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-white/10 text-white border-white/20"
                          >
                            {issue.service?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 max-w-xs truncate">
                          {issue.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openEditDialog(issue)}
                              variant="outline"
                              size="sm"
                              className="gap-2 bg-white/5 hover:bg-white/10 border-white/20 text-white"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteDialog(issue)}
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
            {issues.length > 0 && totalPages > 1 && (
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
          <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                Edit Common Issue
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Update the issue information and solutions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-name"
                    className="text-sm font-medium text-white"
                  >
                    Issue Name
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
                    htmlFor="edit-service"
                    className="text-sm font-medium text-white"
                  >
                    Service
                  </Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serviceId: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                      {services.map((service: any) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                          className="text-white hover:bg-white/10"
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
                  htmlFor="edit-solutions"
                  className="text-sm font-medium text-white"
                >
                  Solutions
                </Label>
                <Textarea
                  id="edit-solutions"
                  value={formData.solutions}
                  onChange={(e) =>
                    setFormData({ ...formData, solutions: e.target.value })
                  }
                  className="min-h-[120px] bg-white/5 border-white/10 text-white"
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
                onClick={updateIssue}
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
                Delete Common Issue
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete "{selectedIssue?.name}"? This
                action cannot be undone and will remove the issue and all its
                solutions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/20 text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteIssue}
                className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
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
