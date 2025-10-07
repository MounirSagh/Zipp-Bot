import { Layout } from "@/components/Layout";
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
      loadCompany();
      loadServices();
      loadIssues();
    }
  }, [user]);

  const loadCompany = async () => {
    if (!user?.id) return;

    try {
      const data = await companyAPI.getByCompanyId(user.id);
      if (data && data.length > 0) {
        setCompany(data[0]);
      }
    } catch (error) {
      console.error("Error loading company:", error);
    }
  };

  const loadIssues = async () => {
    if (!user?.id) return;

    try {
      const companies = await companyAPI.getByCompanyId(user.id);
      if (companies && companies.length > 0) {
        const depts = await departmentsAPI.getByCompany(companies[0].id);
        const allIssues = [];
        for (const dept of depts) {
          const services = await servicesAPI.getByDepartment(dept.id);
          for (const service of services) {
            const issues = await commonIssuesAPI.getByService(service.id);
            allIssues.push(...issues);
          }
        }
        setIssues(allIssues);
      }
    } catch (error) {
      console.error("Error loading issues:", error);
    }
  };

  const loadServices = async () => {
    if (!user?.id) return;

    try {
      const companies = await companyAPI.getByCompanyId(user.id);
      if (companies && companies.length > 0) {
        const depts = await departmentsAPI.getByCompany(companies[0].id);
        const allServices = [];
        for (const dept of depts) {
          const deptServices = await servicesAPI.getByDepartment(dept.id);
          allServices.push(...deptServices);
        }
        setServices(allServices);
      }
    } catch (error) {
      console.error("Error loading services:", error);
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
      loadIssues();
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
      loadIssues();
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const deleteIssue = async (id: number) => {
    if (confirm("Are you sure you want to delete this issue?")) {
      try {
        await commonIssuesAPI.delete(id);
        loadIssues();
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

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!company || services.length === 0) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Common Issues</h1>
            <p className="text-muted-foreground">
              Manage frequently encountered problems and their solutions
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-16 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="space-y-3">
                  {!company ? (
                    <>
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No Company Profile Found
                      </h3>
                      <p className="text-sm text-muted-foreground/75 max-w-md mx-auto">
                        Please set up your company information first.
                      </p>
                      <Button variant="outline" asChild className="mt-4">
                        <a href="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/general">
                          Setup Company Profile
                        </a>
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No Services Found
                      </h3>
                      <p className="text-sm text-muted-foreground/75 max-w-md mx-auto">
                        Please set up your company, departments, and services
                        first before managing common issues.
                      </p>
                      <Button variant="outline" asChild className="mt-4">
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
          <h1 className="text-3xl font-bold tracking-tight">Common Issues</h1>
          <p className="text-muted-foreground">
            Manage {company.name}'s frequently encountered problems and their
            solutions
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Issue Overview
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Manage Issues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Issue Overview</CardTitle>
                <CardDescription>
                  View all common issues and their solutions across your
                  services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {issues.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No Common Issues Found
                      </h3>
                      <p className="text-sm text-muted-foreground/75">
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
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <AlertCircle className="w-5 h-5 text-orange-500" />
                                  <h3 className="text-xl font-semibold">
                                    {issue.name}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {issue.service?.name}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {issue.service?.department?.name}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {issue.description}
                            </p>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Solutions:
                              </h4>
                              <div className="bg-muted/50 p-4 rounded-lg">
                                <pre className="text-sm whitespace-pre-wrap text-foreground">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Manage Common Issues</CardTitle>
                  <CardDescription>
                    Create, edit, and delete common issues and their solutions
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  variant={showCreateForm ? "outline" : "default"}
                  size="sm"
                  className="gap-2"
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
                  <div className="space-y-6 p-6 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Issue Name
                        </label>
                        <Input
                          placeholder="e.g. Login Problems, Payment Failed"
                          value={newIssue.name}
                          onChange={(e) =>
                            setNewIssue({ ...newIssue, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Service</label>
                        <Select
                          value={newIssue.serviceId}
                          onValueChange={(value) =>
                            setNewIssue({ ...newIssue, serviceId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service: any) => (
                              <SelectItem
                                key={service.id}
                                value={service.id.toString()}
                              >
                                {service.name} ({service.department?.name})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        placeholder="Describe the common issue"
                        value={newIssue.description}
                        onChange={(e) =>
                          setNewIssue({
                            ...newIssue,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Solutions</label>
                      <Textarea
                        placeholder="Provide solutions (JSON format or plain text)"
                        value={newIssue.solutions}
                        onChange={(e) =>
                          setNewIssue({
                            ...newIssue,
                            solutions: e.target.value,
                          })
                        }
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button onClick={createIssue} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Issue
                    </Button>
                  </div>
                )}

                {issues.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No Common Issues Found
                      </h3>
                      <p className="text-sm text-muted-foreground/75">
                        Create your first common issue to get started.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {issues.map((issue: CommonIssue) => (
                      <Card key={issue.id} className="shadow-sm">
                        <CardContent className="pt-6">
                          {editingIssue && editingIssue.id === issue.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
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
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
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
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {services.map((service: any) => (
                                        <SelectItem
                                          key={service.id}
                                          value={service.id.toString()}
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
                                <label className="text-sm font-medium">
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
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
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
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={updateIssue} size="sm">
                                  Save Changes
                                </Button>
                                <Button
                                  onClick={cancelEdit}
                                  variant="outline"
                                  size="sm"
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
                                    <h3 className="text-xl font-semibold">
                                      {issue.name}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {issue.service?.name}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {issue.service?.department?.name}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                  {issue.description}
                                </p>
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Solutions:
                                  </h4>
                                  <div className="bg-muted/50 p-4 rounded-lg max-h-[150px] overflow-auto">
                                    <pre className="text-sm whitespace-pre-wrap text-foreground">
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
                                  className="gap-2"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="gap-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Common Issue
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "
                                        {issue.name}"? This action cannot be
                                        undone and will remove the issue and all
                                        its solutions.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteIssue(issue.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
