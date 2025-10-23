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
  const [loading, setLoading] = useState(true);
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
      loadAllData();
    }
  }, [user]);

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

      // Get departments
      const depts = await departmentsAPI.getByCompany(companyData.id);
      setDepartments(depts);
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
        ...newDepartment,
        companyId: company.id,
      });
      setNewDepartment({ name: "", description: "" });
      setShowCreateForm(false);
      loadAllData();
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
      loadAllData();
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const deleteDepartment = async (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await departmentsAPI.delete(id);
        loadAllData();
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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Departments
          </h1>
          <p className="text-gray-400">
            Manage {company.name}'s organizational structure and departments
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-xl border border-white/10">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              Department Overview
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="flex items-center gap-2 data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              Manage Departments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Department Overview
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View all departments in your organization
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
                        className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold text-white">
                                  {department.name}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-white/10 text-white border-white/20"
                                >
                                  {department.services?.length || 0} services
                                </Badge>
                              </div>
                              <p className="text-gray-400 leading-relaxed">
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
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-white">
                    Manage Departments
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Create, edit, and delete departments in your organization
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
                      New Department
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {showCreateForm && (
                  <div className="space-y-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
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
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
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
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={createDepartment}
                      className="gap-2 bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Plus className="w-4 h-4" />
                      Create Department
                    </Button>
                  </div>
                )}

                {departments.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-400">
                        No Departments Found
                      </h3>
                      <p className="text-sm text-gray-500">
                        Create your first department to get started.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {departments.map((department: any) => (
                      <Card
                        key={department.id}
                        className="bg-white/5 backdrop-blur-sm border-white/10"
                      >
                        <CardContent className="pt-6">
                          {editingDepartment &&
                          editingDepartment.id === department.id ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-white">
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
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-white">
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
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={updateDepartment}
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
                              <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-xl font-semibold text-white">
                                    {department.name}
                                  </h3>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-white/10 text-white border-white/20"
                                  >
                                    {department.services?.length || 0} services
                                  </Badge>
                                </div>
                                <p className="text-gray-400 leading-relaxed">
                                  {department.description}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  onClick={() => startEdit(department)}
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
                                        Delete Department
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-gray-400">
                                        Are you sure you want to delete "
                                        {department.name}"? This action cannot
                                        be undone and will also remove all
                                        associated services.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/20 text-white">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          deleteDepartment(department.id)
                                        }
                                        className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
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
