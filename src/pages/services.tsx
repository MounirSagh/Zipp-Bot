import { Layout } from "@/components/Layout";
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
      loadCompany();
      loadDepartments();
      loadServices();
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
      loadServices();
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
      loadServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const deleteService = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await servicesAPI.delete(id);
        loadServices();
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

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!company || departments.length === 0) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground">
              Manage your organization's services and offerings
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
                        No Departments Found
                      </h3>
                      <p className="text-sm text-muted-foreground/75 max-w-md mx-auto">
                        Create departments first before adding services.
                      </p>
                      <Button variant="outline" asChild className="mt-4">
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
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage {company.name}'s services and customer support offerings
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Service Overview
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Manage Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Overview</CardTitle>
                <CardDescription>
                  View all services across your organization's departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No Services Found
                      </h3>
                      <p className="text-sm text-muted-foreground/75">
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
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold">
                                  {service.name}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {service.department?.name}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">
                                {service.description}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Contact className="w-4 h-4" />
                                <span>{service.contacts}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Manage Services</CardTitle>
                  <CardDescription>
                    Create, edit, and delete services in your organization
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
                      New Service
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
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department: any) => (
                              <SelectItem
                                key={department.id}
                                value={department.id.toString()}
                              >
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        placeholder="Describe what this service offers"
                        value={newService.description}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
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
                      />
                    </div>
                    <Button onClick={createService} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Service
                    </Button>
                  </div>
                )}

                {services.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No Services Found
                      </h3>
                      <p className="text-sm text-muted-foreground/75">
                        Create your first service to get started.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {services.map((service: Service) => (
                      <Card key={service.id} className="shadow-sm">
                        <CardContent className="pt-6">
                          {editingService &&
                          editingService.id === service.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
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
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
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
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {departments.map((department: any) => (
                                        <SelectItem
                                          key={department.id}
                                          value={department.id.toString()}
                                        >
                                          {department.name}
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
                                  value={editingService.description}
                                  onChange={(e) =>
                                    setEditingService({
                                      ...editingService,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
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
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={updateService} size="sm">
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
                                    {service.name}
                                  </h3>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {service.department?.name}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                  {service.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Contact className="w-4 h-4" />
                                  <span>{service.contacts}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
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
                                        Delete Service
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "
                                        {service.name}"? This action cannot be
                                        undone and will also remove all
                                        associated common issues.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          deleteService(service.id)
                                        }
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
