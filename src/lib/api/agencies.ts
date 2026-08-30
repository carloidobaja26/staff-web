import { apiClient } from "./client";

export async function getAgenciesByTenant(
    tenantId: string
): Promise<Agency[]> {
    const response = await apiClient.get<
        ApiResponse<Agency[]>
    >(
        `/api/tenants/${tenantId}/agencies`
    );

    return response.data.data;
}

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Agency = {
  tenantId: string;
  name: string;
  description: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  isActive: boolean;
  managerUserId: string | null;
  id: string;
};