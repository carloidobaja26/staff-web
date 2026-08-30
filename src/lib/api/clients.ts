import { apiClient } from "./client";

export type Client = {
  id: string;
  tenantId: string;
  agencyId: string | null;
  clientNumber: string;
  name: string;
  companyName: string;
  contactPerson: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
};

export type PagedResult<T> = {
  pageNumber: number;
  pageSize: number;
  totalNumber: number;
  items: T[];
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getClients(
  pageNumber = 1,
  pageSize = 10,
  search = ""
): Promise<PagedResult<Client>> {
  const response = await apiClient.get<ApiResponse<PagedResult<Client>>>(
    "/api/client/paged",
    {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        Search: search,
      },
    }
  );

  return response.data.data;
}

export type CreateClientRequest = {
  tenantId: string;
  agencyId?: string | null;
  clientNumber: string;
  name: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  notes?: string;
};

export async function createClient(
  data: CreateClientRequest
): Promise<Client> {
  const response = await apiClient.post<ApiResponse<Client>>(
    "/api/client",
    data
  );

  return response.data.data;
}

export type UpdateClientRequest = {
  tenantId: string;
  agencyId?: string | null;
  clientNumber: string;
  name: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  notes?: string;
};

export async function updateClient(
  id: string,
  data: UpdateClientRequest
): Promise<Client> {
  const response = await apiClient.put<ApiResponse<Client>>(
    `/api/client/${id}`,
    data
  );

  return response.data.data;
}

export async function getClient(id: string): Promise<Client> {
  const response = await apiClient.get<ApiResponse<Client>>(
    `/api/client/${id}`
  );

  return response.data.data;
}

export async function deleteClient(id: string): Promise<void> {
    await apiClient.delete(`/api/client/${id}`);
}