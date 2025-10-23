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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit3, Trash2, Settings, List, AlertCircle } from "lucide-react";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState<CommonIssue | null>(null);
  const [newIssue, setNewIssue] = useState({
    name: "",
    description: "",
    solutions: "",
    serviceId: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user]);

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
      const depts = await departmentsAPI.getByCompany(companyData.id);

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

      // Step 4: Get all issues in parallel
      if (allServices.length > 0) {
        const issuePromises = allServices.map((service: any) =>
          commonIssuesAPI.getByService(service.id)
        );
        const issuesArrays = await Promise.all(issuePromises);
        const allIssues = issuesArrays.flat();
        setIssues(allIssues);
      }
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
        solutionsData = JSON.parse(newIssue.solutions);
      } catch {
        solutionsData = { description: newIssue.solutions };
      }

      await commonIssuesAPI.create({
        name: newIssue.name,
        description: newIssue.description,
        solutions: solutionsData,
        serviceId: parseInt(newIssue.serviceId),
      });
      setNewIssue({ name: "", description: "", solutions: "", serviceId: "" });
      setShowCreateForm(false);
      loadAllData();
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  };

  const updateIssue = async () => {
    if (!editingIssue) return;

    try {
      let solutionsData;
      try {
        solutionsData =
          typeof editingIssue.solutions === "string"
            ? JSON.parse(editingIssue.solutions)
            : editingIssue.solutions;
      } catch {
        solutionsData = { description: editingIssue.solutions };
      }

      await commonIssuesAPI.update(editingIssue.id, {
        name: editingIssue.name,
        description: editingIssue.description,
        solutions: solutionsData,
        serviceId: editingIssue.serviceId,
      });
      setEditingIssue(null);
      loadAllData();
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const deleteIssue = async (id: number) => {
    if (confirm("Are you sure you want to delete this issue?")) {
      try {
        await commonIssuesAPI.delete(id);
        loadAllData();
      } catch (error) {
        console.error("Error deleting issue:", error);
      }
    }
  };

  const startEdit = (issue: CommonIssue) => {
    setEditingIssue({
      ...issue,
      solutions:
        typeof issue.solutions === "object"
          ? JSON.stringify(issue.solutions, null, 2)
          : issue.solutions,
    });
  };

  const cancelEdit = () => {
    setEditingIssue(null);
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Common Issues
          </h1>
          <p className="text-gray-400">
            Manage {company.name}'s frequently encountered problems and their
            solutions
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-xl border border-white/10">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white"
            >
              <List className="w-4 h-4" />
              Issue Overview
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="flex items-center gap-2 data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              Manage Issues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Issue Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  View all common issues and their solutions across your
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
                        Create your first common issue to help streamline
                        customer support.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {issues.map((issue: CommonIssue) => (
                      <Card
                        key={issue.id}
                        className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <AlertCircle className="w-5 h-5 text-orange-500" />
                                  <h3 className="text-xl font-semibold text-white">
                                    {issue.name}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-white/10 text-white border-white/20"
                                  >
                                    {issue.service?.name}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-white/10 text-white border-white/20"
                                  >
                                    {issue.service?.department?.name}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                              {issue.description}
                            </p>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-400">
                                Solutions:
                              </h4>
                              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                                <pre className="text-sm whitespace-pre-wrap text-white">
                                  {typeof issue.solutions === "object"
                                    ? JSON.stringify(issue.solutions, null, 2)
                                    : issue.solutions}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-white">
                    Manage Common Issues
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Create, edit, and delete common issues and their solutions
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  variant={showCreateForm ? "outline" : "default"}
                  size="sm"
                  className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  {showCreateForm ? (
                    "Cancel"
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      New Issue
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {showCreateForm && (
                  <div className="space-y-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
                          Issue Name
                        </label>
                        <Input
                          placeholder="e.g. Login Problems, Payment Failed"
                          value={newIssue.name}
                          onChange={(e) =>
                            setNewIssue({ ...newIssue, name: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
                          Service
                        </label>
                        <Select
                          value={newIssue.serviceId}
                          onValueChange={(value) =>
                            setNewIssue({ ...newIssue, serviceId: value })
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
                      <label className="text-sm font-medium text-white">
                        Description
                      </label>
                      <Input
                        placeholder="Describe the common issue"
                        value={newIssue.description}
                        onChange={(e) =>
                          setNewIssue({
                            ...newIssue,
                            description: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Solutions
                      </label>
                      <Textarea
                        placeholder="Provide solutions (JSON format or plain text)"
                        value={newIssue.solutions}
                        onChange={(e) =>
                          setNewIssue({
                            ...newIssue,
                            solutions: e.target.value,
                          })
                        }
                        className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <Button
                      onClick={createIssue}
                      className="gap-2 bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Plus className="w-4 h-4" />
                      Create Issue
                    </Button>
                  </div>
                )}

                {issues.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-400">
                        No Common Issues Found
                      </h3>
                      <p className="text-sm text-gray-500">
                        Create your first common issue to get started.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {issues.map((issue: CommonIssue) => (
                      <Card
                        key={issue.id}
                        className="bg-white/5 backdrop-blur-sm border-white/10"
                      >
                        <CardContent className="pt-6">
                          {editingIssue && editingIssue.id === issue.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-white">
                                    Issue Name
                                  </label>
                                  <Input
                                    value={editingIssue.name}
                                    onChange={(e) =>
                                      setEditingIssue({
                                        ...editingIssue,
                                        name: e.target.value,
                                      })
                                    }
                                    className="bg-white/5 border-white/10 text-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-white">
                                    Service
                                  </label>
                                  <Select
                                    value={editingIssue.serviceId.toString()}
                                    onValueChange={(value) =>
                                      setEditingIssue({
                                        ...editingIssue,
                                        serviceId: parseInt(value),
                                      })
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
                                          {service.name} (
                                          {service.department?.name})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-white">
                                  Description
                                </label>
                                <Input
                                  value={editingIssue.description}
                                  onChange={(e) =>
                                    setEditingIssue({
                                      ...editingIssue,
                                      description: e.target.value,
                                    })
                                  }
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-white">
                                  Solutions
                                </label>
                                <Textarea
                                  value={editingIssue.solutions as string}
                                  onChange={(e) =>
                                    setEditingIssue({
                                      ...editingIssue,
                                      solutions: e.target.value,
                                    })
                                  }
                                  className="min-h-[100px] bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={updateIssue}
                                  size="sm"
                                  className="bg-white/10 hover:bg-white/20 text-white"
                                >
                                  Save Changes
                                </Button>
                                <Button
                                  onClick={cancelEdit}
                                  variant="outline"
                                  size="sm"
                                  className="bg-white/5 hover:bg-white/10 border-white/20 text-white"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="space-y-4 flex-1">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    <h3 className="text-xl font-semibold text-white">
                                      {issue.name}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-white/10 text-white border-white/20"
                                    >
                                      {issue.service?.name}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-white/10 text-white border-white/20"
                                    >
                                      {issue.service?.department?.name}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-gray-400 leading-relaxed">
                                  {issue.description}
                                </p>
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-400">
                                    Solutions:
                                  </h4>
                                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg max-h-[150px] overflow-auto">
                                    <pre className="text-sm whitespace-pre-wrap text-white">
                                      {typeof issue.solutions === "object"
                                        ? JSON.stringify(
                                            issue.solutions,
                                            null,
                                            2
                                          )
                                        : issue.solutions}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  onClick={() => startEdit(issue)}
                                  variant="outline"
                                  size="sm"
                                  className="gap-2 bg-white/5 hover:bg-white/10 border-white/20 text-white"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="gap-2 bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-black/95 backdrop-blur-xl border-white/10">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-white">
                                        Delete Common Issue
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-gray-400">
                                        Are you sure you want to delete "
                                        {issue.name}"? This action cannot be
                                        undone and will remove the issue and all
                                        its solutions.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/20 text-white">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteIssue(issue.id)}
                                        className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
                                      >
                                        Delete Issue
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default Issues;
