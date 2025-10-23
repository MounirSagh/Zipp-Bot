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
import { Plus, Edit3, Trash2, Settings, List, Contact } from "lucide-react";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    contacts: "",
    departmentId: "",
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
      setDepartments(depts);

      // Step 3: Get all services in parallel (not sequential!)
      if (depts.length > 0) {
        const servicePromises = depts.map((dept: any) =>
          servicesAPI.getByDepartment(dept.id)
        );
        const servicesArrays = await Promise.all(servicePromises);
        const allServices = servicesArrays.flat();
        setServices(allServices);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createService = async () => {
    try {
      await servicesAPI.create({
        ...newService,
        departmentId: parseInt(newService.departmentId),
      });
      setNewService({
        name: "",
        description: "",
        contacts: "",
        departmentId: "",
      });
      setShowCreateForm(false);
      loadAllData();
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const updateService = async () => {
    if (!editingService) return;

    try {
      await servicesAPI.update(editingService.id, {
        name: editingService.name,
        description: editingService.description,
        contacts: editingService.contacts,
        departmentId: editingService.departmentId,
      });
      setEditingService(null);
      loadAllData();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const deleteService = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await servicesAPI.delete(id);
        loadAllData();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const startEdit = (service: Service) => {
    setEditingService({ ...service });
  };

  const cancelEdit = () => {
    setEditingService(null);
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Services
          </h1>
          <p className="text-gray-400">
            Manage {company.name}'s services and customer support offerings
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-xl border border-white/10">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white"
            >
              <List className="w-4 h-4" />
              Service Overview
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="flex items-center gap-2 data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              Manage Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Service Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  View all services across your organization's departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-400">
                        No Services Found
                      </h3>
                      <p className="text-sm text-gray-500">
                        Create your first service to start managing customer
                        support offerings.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {services.map((service: Service) => (
                      <Card
                        key={service.id}
                        className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold text-white">
                                  {service.name}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-white/10 text-white border-white/20"
                                >
                                  {service.department?.name}
                                </Badge>
                              </div>
                              <p className="text-gray-400 leading-relaxed">
                                {service.description}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Contact className="w-4 h-4" />
                                <span>{service.contacts}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-white/10 text-white border-white/20"
                                >
                                  {service.commonIssues?.length || 0} common
                                  issues
                                </Badge>
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
                  <CardTitle className="text-white">Manage Services</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create, edit, and delete services in your organization
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
                      New Service
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
                          Service Name
                        </label>
                        <Input
                          placeholder="e.g. Technical Support, Customer Service"
                          value={newService.name}
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              name: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
                          Department
                        </label>
                        <Select
                          value={newService.departmentId}
                          onValueChange={(value) =>
                            setNewService({
                              ...newService,
                              departmentId: value,
                            })
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
                      <label className="text-sm font-medium text-white">
                        Description
                      </label>
                      <Input
                        placeholder="Describe what this service offers"
                        value={newService.description}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            description: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Contact Information
                      </label>
                      <Input
                        placeholder="e.g. support@company.com, +1-555-0123"
                        value={newService.contacts}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            contacts: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <Button
                      onClick={createService}
                      className="gap-2 bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Plus className="w-4 h-4" />
                      Create Service
                    </Button>
                  </div>
                )}

                {services.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-400">
                        No Services Found
                      </h3>
                      <p className="text-sm text-gray-500">
                        Create your first service to get started.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {services.map((service: Service) => (
                      <Card
                        key={service.id}
                        className="bg-white/5 backdrop-blur-sm border-white/10"
                      >
                        <CardContent className="pt-6">
                          {editingService &&
                          editingService.id === service.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-white">
                                    Service Name
                                  </label>
                                  <Input
                                    value={editingService.name}
                                    onChange={(e) =>
                                      setEditingService({
                                        ...editingService,
                                        name: e.target.value,
                                      })
                                    }
                                    className="bg-white/5 border-white/10 text-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-white">
                                    Department
                                  </label>
                                  <Select
                                    value={editingService.departmentId.toString()}
                                    onValueChange={(value) =>
                                      setEditingService({
                                        ...editingService,
                                        departmentId: parseInt(value),
                                      })
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
                                <label className="text-sm font-medium text-white">
                                  Description
                                </label>
                                <Input
                                  value={editingService.description}
                                  onChange={(e) =>
                                    setEditingService({
                                      ...editingService,
                                      description: e.target.value,
                                    })
                                  }
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-white">
                                  Contact Information
                                </label>
                                <Input
                                  value={editingService.contacts}
                                  onChange={(e) =>
                                    setEditingService({
                                      ...editingService,
                                      contacts: e.target.value,
                                    })
                                  }
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={updateService}
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
                                    {service.name}
                                  </h3>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-white/10 text-white border-white/20"
                                  >
                                    {service.department?.name}
                                  </Badge>
                                </div>
                                <p className="text-gray-400 leading-relaxed">
                                  {service.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <Contact className="w-4 h-4" />
                                  <span>{service.contacts}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-white/10 text-white border-white/20"
                                  >
                                    {service.commonIssues?.length || 0} common
                                    issues
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  onClick={() => startEdit(service)}
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
                                        Delete Service
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-gray-400">
                                        Are you sure you want to delete "
                                        {service.name}"? This action cannot be
                                        undone and will also remove all
                                        associated common issues.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/20 text-white">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          deleteService(service.id)
                                        }
                                        className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
                                      >
                                        Delete Service
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

export default Services;
