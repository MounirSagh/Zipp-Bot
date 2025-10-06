import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { departmentsAPI, companyAPI } from "../services/api";

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
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!company) {
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
            Departments Management
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
              Please set up your company information first in the Dashboard
              before managing departments.
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
          Departments Management - {company.name}
        </h1>

        {/* Create Department Section */}
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
            <h2 style={{ fontSize: "1.5rem" }}>Departments</h2>
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
              {showCreateForm ? "Cancel" : "Create Department"}
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
                  marginBottom: "1rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Department Name"
                  value={newDepartment.name}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Description"
                value={newDepartment.description}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
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
              <button
                onClick={createDepartment}
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

          {/* Departments List */}
          <div style={{ display: "grid", gap: "1rem" }}>
            {departments.map((department: any) => (
              <div
                key={department.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "white",
                }}
              >
                {editingDepartment && editingDepartment.id === department.id ? (
                  <div>
                    <div
                      style={{
                        marginBottom: "1rem",
                      }}
                    >
                      <input
                        type="text"
                        value={editingDepartment.name}
                        onChange={(e) =>
                          setEditingDepartment({
                            ...editingDepartment,
                            name: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={editingDepartment.description}
                      onChange={(e) =>
                        setEditingDepartment({
                          ...editingDepartment,
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
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        onClick={updateDepartment}
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
                      <h3 style={{ margin: "0 0 0.5rem 0" }}>
                        {department.name}
                      </h3>
                      <p style={{ margin: "0", color: "#666" }}>
                        Company: {department.company?.name}
                      </p>
                      <p style={{ margin: "0.5rem 0 0 0", color: "#888" }}>
                        {department.description}
                      </p>
                      <p
                        style={{
                          margin: "0.5rem 0 0 0",
                          color: "#888",
                          fontSize: "0.9rem",
                        }}
                      >
                        Services: {department.services?.length || 0}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => startEdit(department)}
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
                        onClick={() => deleteDepartment(department.id)}
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

export default Departments;
