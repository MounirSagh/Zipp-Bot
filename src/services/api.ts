const GATEWAY_URL = "https://zipp-bot-gateway.vercel.app/gateway";
// "https://zipp-bot-gateway.vercel.app/gateway";

const gatewayRequest = async (
  method: string,
  url: string,
  companyId: string,
  data?: any
) => {
  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    credentials: "include",
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

  getByCompany: async (companyId: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (limit !== undefined) params.append("limit", limit.toString());
    const queryString = params.toString();
    const url = `departments/company/${companyId}${
      queryString ? `?${queryString}` : ""
    }`;
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
    const url = `services/department/${departmentId}${
      queryString ? `?${queryString}` : ""
    }`;
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
    const url = `common-issues/service/${serviceId}${
      queryString ? `?${queryString}` : ""
    }`;
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
    return gatewayRequest("POST", `search/${companyId}`, companyId, {
      query,
      topK,
    });
  },
};

// Customers API calls
export const customersAPI = {
  create: async (companyId: string, data: any) => {
    return gatewayRequest("POST", "customers", companyId, data);
  },

  getAll: async (
    companyId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      search?: string;
      country?: string;
      city?: string;
      email?: string;
    }
  ) => {
    const queryParams = new URLSearchParams();
    queryParams.append("companyId", companyId);
    if (params?.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params?.limit !== undefined)
      queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.country) queryParams.append("country", params.country);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.email) queryParams.append("email", params.email);
    const queryString = queryParams.toString();
    const url = `customers${queryString ? `?${queryString}` : ""}`;
    return gatewayRequest("GET", url, companyId);
  },

  getById: async (companyId: string, id: number) => {
    return gatewayRequest("GET", `customers/${id}`, companyId);
  },

  getByCountry: async (companyId: string, country: string) => {
    return gatewayRequest(
      "GET",
      `customers/country/${country}?companyId=${companyId}`,
      companyId
    );
  },

  getByCity: async (companyId: string, city: string) => {
    return gatewayRequest(
      "GET",
      `customers/city/${city}?companyId=${companyId}`,
      companyId
    );
  },

  update: async (companyId: string, id: number, data: any) => {
    return gatewayRequest("PUT", `customers/${id}`, companyId, data);
  },

  delete: async (companyId: string, id: number) => {
    return gatewayRequest("DELETE", `customers/${id}`, companyId);
  },
};

// Tickets API calls
export const ticketsAPI = {
  create: async (companyId: string, data: any) => {
    return gatewayRequest("POST", "tickets", companyId, data);
  },

  getAll: async (
    companyId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      customerId?: number;
      commonissueId?: number;
      hasIssue?: boolean;
      search?: string;
    }
  ) => {
    const queryParams = new URLSearchParams();
    queryParams.append("companyId", companyId);
    if (params?.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params?.limit !== undefined)
      queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params?.customerId !== undefined)
      queryParams.append("customerId", params.customerId.toString());
    if (params?.commonissueId !== undefined)
      queryParams.append("commonissueId", params.commonissueId.toString());
    if (params?.hasIssue !== undefined)
      queryParams.append("hasIssue", params.hasIssue.toString());
    if (params?.search) queryParams.append("search", params.search);
    const queryString = queryParams.toString();
    const url = `tickets${queryString ? `?${queryString}` : ""}`;
    return gatewayRequest("GET", url, companyId);
  },

  getById: async (companyId: string, id: number) => {
    return gatewayRequest("GET", `tickets/${id}`, companyId);
  },

  getByCustomer: async (companyId: string, customerId: number) => {
    return gatewayRequest("GET", `tickets/customer/${customerId}`, companyId);
  },

  getByCommonIssue: async (companyId: string, commonissueId: number) => {
    return gatewayRequest(
      "GET",
      `tickets/commonissue/${commonissueId}`,
      companyId
    );
  },

  update: async (companyId: string, id: number, data: any) => {
    return gatewayRequest("PUT", `tickets/${id}`, companyId, data);
  },

  delete: async (companyId: string, id: number) => {
    return gatewayRequest("DELETE", `tickets/${id}`, companyId);
  },
};

// Analytics API calls
export const analyticsAPI = {
  getDashboard: async (companyId: string) => {
    return gatewayRequest("GET", `analytics/dashboard/${companyId}`, companyId);
  },

  getCompanyStats: async (companyId: string) => {
    return gatewayRequest("GET", `analytics/company/${companyId}`, companyId);
  },

  getTicketAnalytics: async (companyId: string) => {
    return gatewayRequest("GET", "analytics/tickets", companyId);
  },

  getCustomerAnalytics: async (companyId: string) => {
    return gatewayRequest("GET", "analytics/customers", companyId);
  },
};
