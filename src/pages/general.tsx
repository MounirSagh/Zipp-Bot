import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { companyAPI, searchAPI, departmentsAPI } from "../services/api";

function General() {
  const { user } = useUser();
  const [company, setCompany] = useState<any>(null);
  const [departments, setDepartments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    field: "",
    description: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadCompanyInfo();
      loadDepartments();
    }
  }, [user]);

  const loadCompanyInfo = async () => {
    if (!user?.id) return;

    try {
      const data = await companyAPI.getByCompanyId(user.id);
      if (data && data.length > 0) {
        setCompany(data[0]);
        setCompanyForm({
          name: data[0].name,
          field: data[0].field,
          description: data[0].description,
        });
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

  const createOrUpdateCompany = async () => {
    if (!user?.id) return;

    try {
      if (company) {
        await companyAPI.update(company.id, companyForm);
      } else {
        await companyAPI.create({
          ...companyForm,
          companyId: user.id,
        });
      }
      setShowEditForm(false);
      loadCompanyInfo();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  const handleSearch = async () => {
    if (!user?.id || !searchQuery) return;

    setLoading(true);
    try {
      const data = await searchAPI.search(user.id, searchQuery);
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}
        >
          Company Dashboard
        </h1>

        {/* Company Info Section */}
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
            <h2 style={{ fontSize: "1.5rem" }}>Company Information</h2>
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {showEditForm
                ? "Cancel"
                : company
                ? "Edit Info"
                : "Setup Company"}
            </button>
          </div>

          {showEditForm ? (
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
                  placeholder="Company Name"
                  value={companyForm.name}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, name: e.target.value })
                  }
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
                <input
                  type="text"
                  placeholder="Business Field"
                  value={companyForm.field}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, field: e.target.value })
                  }
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Company Description"
                value={companyForm.description}
                onChange={(e) =>
                  setCompanyForm({
                    ...companyForm,
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
                onClick={createOrUpdateCompany}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#008CBA",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {company ? "Update" : "Create"}
              </button>
            </div>
          ) : company ? (
            <div
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "white",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0" }}>{company.name}</h3>
              <p style={{ margin: "0", color: "#666" }}>
                Field: {company.field}
              </p>
              <p style={{ margin: "0.5rem 0 0 0", color: "#888" }}>
                {company.description}
              </p>
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  color: "#888",
                  fontSize: "0.9rem",
                }}
              >
                Departments: {departments.length}
              </p>
            </div>
          ) : (
            <div
              style={{
                padding: "1rem",
                border: "2px dashed #ddd",
                borderRadius: "4px",
                textAlign: "center",
                color: "#666",
              }}
            >
              <p>
                No company information found. Click "Setup Company" to get
                started.
              </p>
            </div>
          )}
        </div>

        {/* Search Section */}
        {company && (
          <div
            style={{
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Search Knowledge Base
            </h2>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Enter search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  flex: "1",
                }}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: loading ? "#ccc" : "#FF9800",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div>
                <h3 style={{ marginBottom: "1rem" }}>
                  Search Results ({searchResults.length})
                </h3>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {searchResults.map((result: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        padding: "1rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span style={{ fontWeight: "bold", color: "#666" }}>
                          {result.metadata?.type?.toUpperCase()} - Score:{" "}
                          {(result.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <h4 style={{ margin: "0 0 0.5rem 0" }}>
                        {result.metadata?.name}
                      </h4>
                      <p style={{ margin: "0", color: "#666" }}>
                        {result.metadata?.description}
                      </p>
                      {result.metadata?.solutions && (
                        <p style={{ margin: "0.5rem 0 0 0", color: "#888" }}>
                          Solutions: {result.metadata.solutions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default General;
