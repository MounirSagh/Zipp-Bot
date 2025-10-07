const API_BASE_URL = "http://aivo-backend.vercel.app/api";

// Company API calls
export const companyAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/companies`);
    return response.json();
  },

  getByCompanyId: async (companyId: string) => {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`);
    return response.json();
  },

  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Departments API calls
export const departmentsAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/departments`);
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`);
    return response.json();
  },

  getByCompany: async (companyId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/departments/company/${companyId}`
    );
    return response.json();
  },

  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Services API calls
export const servicesAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/services`);
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);
    return response.json();
  },

  getByDepartment: async (departmentId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/services/department/${departmentId}`
    );
    return response.json();
  },

  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Common Issues API calls
export const commonIssuesAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/common-issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/common-issues`);
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/common-issues/${id}`);
    return response.json();
  },

  getByService: async (serviceId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/common-issues/service/${serviceId}`
    );
    return response.json();
  },

  update: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/common-issues/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/common-issues/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Search API calls
export const searchAPI = {
  search: async (companyId: string, query: string, topK: number = 10) => {
    const response = await fetch(`${API_BASE_URL}/search/${companyId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, topK }),
    });
    return response.json();
  },
};
