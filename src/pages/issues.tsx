import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  commonIssuesAPI,
  servicesAPI,
  departmentsAPI,
  companyAPI,
} from "../services/api";

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
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!company || services.length === 0) {
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
            Common Issues Management
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
              Please set up your company, departments, and services first before
              managing common issues.
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
          Common Issues Management - {company.name}
        </h1>

        {/* Create Issue Section */}
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
            <h2 style={{ fontSize: "1.5rem" }}>Common Issues</h2>
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
              {showCreateForm ? "Cancel" : "Create Issue"}
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
                  placeholder="Issue Name"
                  value={newIssue.name}
                  onChange={(e) =>
                    setNewIssue({ ...newIssue, name: e.target.value })
                  }
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
                <select
                  value={newIssue.serviceId}
                  onChange={(e) =>
                    setNewIssue({ ...newIssue, serviceId: e.target.value })
                  }
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value="">Select Service</option>
                  {services.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.department?.name})
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Description"
                value={newIssue.description}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, description: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              />
              <textarea
                placeholder="Solutions (JSON format or plain text)"
                value={newIssue.solutions}
                onChange={(e) =>
                  setNewIssue({ ...newIssue, solutions: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  minHeight: "100px",
                }}
              />
              <button
                onClick={createIssue}
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

          {/* Issues List */}
          <div style={{ display: "grid", gap: "1rem" }}>
            {issues.map((issue: CommonIssue) => (
              <div
                key={issue.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "white",
                }}
              >
                {editingIssue && editingIssue.id === issue.id ? (
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
                        value={editingIssue.name}
                        onChange={(e) =>
                          setEditingIssue({
                            ...editingIssue,
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
                        value={editingIssue.serviceId.toString()}
                        onChange={(e) =>
                          setEditingIssue({
                            ...editingIssue,
                            serviceId: parseInt(e.target.value),
                          })
                        }
                        style={{
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      >
                        {services.map((service: any) => (
                          <option key={service.id} value={service.id}>
                            {service.name} ({service.department?.name})
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      value={editingIssue.description}
                      onChange={(e) =>
                        setEditingIssue({
                          ...editingIssue,
                          description: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        marginBottom: "1rem",
                      }}
                    />
                    <textarea
                      value={editingIssue.solutions as string}
                      onChange={(e) =>
                        setEditingIssue({
                          ...editingIssue,
                          solutions: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        marginBottom: "1rem",
                        minHeight: "100px",
                      }}
                    />
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        onClick={updateIssue}
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
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 0.5rem 0" }}>{issue.name}</h3>
                      <p style={{ margin: "0", color: "#666" }}>
                        Service: {issue.service?.name} (
                        {issue.service?.department?.name})
                      </p>
                      <p style={{ margin: "0.5rem 0 0 0", color: "#888" }}>
                        {issue.description}
                      </p>
                      <div style={{ margin: "0.5rem 0 0 0", color: "#888" }}>
                        <strong>Solutions:</strong>
                        <pre
                          style={{
                            backgroundColor: "#f5f5f5",
                            padding: "0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            maxHeight: "150px",
                            overflow: "auto",
                            marginTop: "0.5rem",
                          }}
                        >
                          {typeof issue.solutions === "object"
                            ? JSON.stringify(issue.solutions, null, 2)
                            : issue.solutions}
                        </pre>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginLeft: "1rem",
                      }}
                    >
                      <button
                        onClick={() => startEdit(issue)}
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
                        onClick={() => deleteIssue(issue.id)}
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

export default Issues;
