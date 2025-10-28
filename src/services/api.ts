const GATEWAY_URL = "https://zipp-bot-gateway.vercel.app/gateway";

const gatewayRequest = async (
  method: string,
  url: string,
  companyId: string,
  data?: any
) => {
  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    credentials: 'include',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId,
      method,
      url,
      data,
    }),
  });
  return response.json();
};

// Company API calls
export const companyAPI = {
  create: async (companyId: string, data: any) => {
    return gatewayRequest("POST", "companies", companyId, data);
  },

  getAll: async (companyId: string) => {
    return gatewayRequest("GET", "companies", companyId);
  },

  getByCompanyId: async (companyId: string) => {
    return gatewayRequest("GET", `companies/${companyId}`, companyId);
  },

  update: async (companyId: string, id: number, data: any) => {
    return gatewayRequest("PUT", `companies/${id}`, companyId, data);
  },

  delete: async (companyId: string, id: number) => {
    return gatewayRequest("DELETE", `companies/${id}`, companyId);
  },
};

// Departments API calls
export const departmentsAPI = {
  create: async (companyId: string, data: any) => {
    return gatewayRequest("POST", "departments", companyId, data);
  },

  getAll: async (companyId: string) => {
    return gatewayRequest("GET", "departments", companyId);
  },

  getById: async (companyId: string, id: number) => {
    return gatewayRequest("GET", `departments/${id}`, companyId);
  },

  getByCompany: async (
    companyId: string,
    page?: number,
    limit?: number
  ) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (limit !== undefined) params.append("limit", limit.toString());
    const queryString = params.toString();
    const url = `departments/company/${companyId}${queryString ? `?${queryString}` : ""}`;
    return gatewayRequest("GET", url, companyId);
  },

  update: async (companyId: string, id: number, data: any) => {
    return gatewayRequest("PUT", `departments/${id}`, companyId, data);
  },

  delete: async (companyId: string, id: number) => {
    return gatewayRequest("DELETE", `departments/${id}`, companyId);
  },
};

// Services API calls
export const servicesAPI = {
  create: async (companyId: string, data: any) => {
    return gatewayRequest("POST", "services", companyId, data);
  },

  getAll: async (companyId: string) => {
    return gatewayRequest("GET", "services", companyId);
  },

  getById: async (companyId: string, id: number) => {
    return gatewayRequest("GET", `services/${id}`, companyId);
  },

  getByDepartment: async (
    companyId: string,
    departmentId: number,
    page?: number,
    limit?: number
  ) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (limit !== undefined) params.append("limit", limit.toString());
    const queryString = params.toString();
    const url = `services/department/${departmentId}${queryString ? `?${queryString}` : ""}`;
    return gatewayRequest("GET", url, companyId);
  },

  update: async (companyId: string, id: number, data: any) => {
    return gatewayRequest("PUT", `services/${id}`, companyId, data);
  },

  delete: async (companyId: string, id: number) => {
    return gatewayRequest("DELETE", `services/${id}`, companyId);
  },
};

// Common Issues API calls
export const commonIssuesAPI = {
  create: async (companyId: string, data: any) => {
    return gatewayRequest("POST", "common-issues", companyId, data);
  },

  getAll: async (companyId: string) => {
    return gatewayRequest("GET", "common-issues", companyId);
  },

  getById: async (companyId: string, id: number) => {
    return gatewayRequest("GET", `common-issues/${id}`, companyId);
  },

  getByService: async (
    companyId: string,
    serviceId: number,
    page?: number,
    limit?: number
  ) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (limit !== undefined) params.append("limit", limit.toString());
    const queryString = params.toString();
    const url = `common-issues/service/${serviceId}${queryString ? `?${queryString}` : ""}`;
    return gatewayRequest("GET", url, companyId);
  },

  update: async (companyId: string, id: number, data: any) => {
    return gatewayRequest("PUT", `common-issues/${id}`, companyId, data);
  },

  delete: async (companyId: string, id: number) => {
    return gatewayRequest("DELETE", `common-issues/${id}`, companyId);
  },
};

// Search API calls
export const searchAPI = {
  search: async (companyId: string, query: string, topK: number = 10) => {
    return gatewayRequest("POST", "search", companyId, { query, topK });
  },
};