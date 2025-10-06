import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { servicesAPI, departmentsAPI, companyAPI } from "../services/api";

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
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!company || departments.length === 0) {
    return (
      <Layout>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "2rem",
            }}
          >
            Services Management
          </h1>
          <div
            style={{
              padding: "2rem",
              border: "2px dashed #ddd",
              borderRadius: "8px",
              textAlign: "center",
              color: "#666",
            }}
          >
            <p>
              Please set up your company and create departments first before
              managing services.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}
        >
          Services Management - {company.name}
        </h1>

        {/* Create Service Section */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem" }}>Services</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {showCreateForm ? "Cancel" : "Create Service"}
            </button>
          </div>

          {showCreateForm && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Service Name"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
                <select
                  value={newService.departmentId}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      departmentId: e.target.value,
                    })
                  }
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value="">Select Department</option>
                  {departments.map((department: any) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.company?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Description"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
                <input
                  type="text"
                  placeholder="Contacts"
                  value={newService.contacts}
                  onChange={(e) =>
                    setNewService({ ...newService, contacts: e.target.value })
                  }
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <button
                onClick={createService}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#008CBA",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Create
              </button>
            </div>
          )}

          {/* Services List */}
          <div style={{ display: "grid", gap: "1rem" }}>
            {services.map((service: Service) => (
              <div
                key={service.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "white",
                }}
              >
                {editingService && editingService.id === service.id ? (
                  <div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            name: e.target.value,
                          })
                        }
                        style={{
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                      <select
                        value={editingService.departmentId.toString()}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            departmentId: parseInt(e.target.value),
                          })
                        }
                        style={{
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      >
                        {departments.map((department: any) => (
                          <option key={department.id} value={department.id}>
                            {department.name} ({department.company?.name})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <input
                        type="text"
                        value={editingService.description}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            description: e.target.value,
                          })
                        }
                        style={{
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                      <input
                        type="text"
                        value={editingService.contacts}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            contacts: e.target.value,
                          })
                        }
                        style={{
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        onClick={updateService}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#008CBA",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#666",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0" }}>{service.name}</h3>
                      <p style={{ margin: "0", color: "#666" }}>
                        Department: {service.department?.name} (
                        {service.department?.company?.name})
                      </p>
                      <p style={{ margin: "0.5rem 0 0 0", color: "#888" }}>
                        {service.description}
                      </p>
                      <p style={{ margin: "0.5rem 0 0 0", color: "#888" }}>
                        Contacts: {service.contacts}
                      </p>
                      <p
                        style={{
                          margin: "0.5rem 0 0 0",
                          color: "#888",
                          fontSize: "0.9rem",
                        }}
                      >
                        Common Issues: {service.commonIssues?.length || 0}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => startEdit(service)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#FF9800",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Services;
