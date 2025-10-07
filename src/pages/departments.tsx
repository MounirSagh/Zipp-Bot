import { Layout } from "@/components/Layout";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Edit3, Trash2, Users, Settings } from "lucide-react";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadCompany();
      loadDepartments();
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

  const loadDepartments = async () => {
    if (!user?.id) return;

    try {
      const companies = await companyAPI.getByCompanyId(user.id);
      if (companies && companies.length > 0) {
        const data = await departmentsAPI.getByCompany(companies[0].id);
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const createDepartment = async () => {
    if (!company) return;

    try {
      await departmentsAPI.create({
        ...newDepartment,
        companyId: company.id,
      });
      setNewDepartment({ name: "", description: "" });
      setShowCreateForm(false);
      loadDepartments();
    } catch (error) {
      console.error("Error creating department:", error);
    }
  };

  const updateDepartment = async () => {
    if (!editingDepartment) return;

    try {
      await departmentsAPI.update(editingDepartment.id, {
        name: editingDepartment.name,
        description: editingDepartment.description,
        companyId: editingDepartment.companyId,
      });
      setEditingDepartment(null);
      loadDepartments();
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const deleteDepartment = async (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await departmentsAPI.delete(id);
        loadDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  const startEdit = (department: Department) => {
    setEditingDepartment({ ...department });
  };

  const cancelEdit = () => {
    setEditingDepartment(null);
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

  if (!company) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground">
              Manage your organization's departments and structure
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-16 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-muted-foreground">
                    No Company Profile Found
                  </h3>
                  <p className="text-sm text-muted-foreground/75 max-w-md mx-auto">
                    Please set up your company information first before managing
                    departments.
                  </p>
                  <Button variant="outline" asChild className="mt-4">
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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage {company.name}'s organizational structure and departments
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Department Overview
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Manage Departments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>
                  View all departments in your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {departments.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No Departments Found
                      </h3>
                      <p className="text-sm text-muted-foreground/75">
                        Create your first department to get started with
                        organizing your company structure.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {departments.map((department: any) => (
                      <Card
                        key={department.id}
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold">
                                  {department.name}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {department.services?.length || 0} services
                                </Badge>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">
                                {department.description}
                              </p>
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
                  <CardTitle>Manage Departments</CardTitle>
                  <CardDescription>
                    Create, edit, and delete departments in your organization
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
                      New Department
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {showCreateForm && (
                  <div className="space-y-6 p-6 bg-muted/30 rounded-lg">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Department Name
                        </label>
                        <Input
                          placeholder="e.g. Customer Support, Sales, Engineering"
                          value={newDepartment.name}
                          onChange={(e) =>
                            setNewDepartment({
                              ...newDepartment,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Description
                        </label>
                        <Input
                          placeholder="Describe the department's role and responsibilities"
                          value={newDepartment.description}
                          onChange={(e) =>
                            setNewDepartment({
                              ...newDepartment,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button onClick={createDepartment} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Department
                    </Button>
                  </div>
                )}

                {departments.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No Departments Found
                      </h3>
                      <p className="text-sm text-muted-foreground/75">
                        Create your first department to get started.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {departments.map((department: any) => (
                      <Card key={department.id} className="shadow-sm">
                        <CardContent className="pt-6">
                          {editingDepartment &&
                          editingDepartment.id === department.id ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Department Name
                                </label>
                                <Input
                                  value={editingDepartment.name}
                                  onChange={(e) =>
                                    setEditingDepartment({
                                      ...editingDepartment,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Description
                                </label>
                                <Input
                                  value={editingDepartment.description}
                                  onChange={(e) =>
                                    setEditingDepartment({
                                      ...editingDepartment,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={updateDepartment} size="sm">
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
                              <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-xl font-semibold">
                                    {department.name}
                                  </h3>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {department.services?.length || 0} services
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                  {department.description}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  onClick={() => startEdit(department)}
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
                                        Delete Department
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "
                                        {department.name}"? This action cannot
                                        be undone and will also remove all
                                        associated services.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          deleteDepartment(department.id)
                                        }
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete Department
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

export default Departments;
