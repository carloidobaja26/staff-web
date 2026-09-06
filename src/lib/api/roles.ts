import { apiClient }  from "@/lib/api/client";
import { ApiResponse, PagedResponse, PaginationRequest } from "./types";

export type Role = {
    id: string;
    tenantId: string | null;
    name: string;
    description: string;
    isSystemRole: boolean;
    isActive: boolean;
    userCount: number;
};

export type CreateRoleRequest = {
    tenantId?: string | null;
    name: string;
    description: string;
    isSystemRole: boolean;
};

export type UpdateRoleRequest = {
    name: string;
    description: string;
    isSystemRole: boolean;
    isActive: boolean;
};

export async function getRoles(
    params: PaginationRequest
): Promise<PagedResponse<Role>> {
    const response = await apiClient.get<
        ApiResponse<PagedResponse<Role>>
    >("/api/role/overall/paged", {
        params: {
            PageNumber: params.pageNumber,
            PageSize: params.pageSize,
            Search: params.search || undefined,
        },
    });

    return response.data.data;
}

export async function getRole(
    roleId: string
): Promise<Role> {
    const response = await apiClient.get<ApiResponse<Role>>(
        `/api/role/${roleId}`
    );

    return response.data.data;
}

export async function createRole(
    request: CreateRoleRequest
): Promise<Role> {
    const response = await apiClient.post<ApiResponse<Role>>(
        "/api/role",
        request
    );

    return response.data.data;
}

export async function updateRole(
    roleId: string,
    request: UpdateRoleRequest
): Promise<Role> {
    const response = await apiClient.put<ApiResponse<Role>>(
        `/api/role/${roleId}`,
        request
    );

    return response.data.data;
}

export async function deleteRole(
    roleId: string
): Promise<void> {
    await apiClient.delete<ApiResponse<unknown>>(
        `/api/role/${roleId}`
    );
}
export type AssignRolesRequest = {
    roleIds: string[];
};

export async function assignRoles(
    userId: string,
    request: AssignRolesRequest
): Promise<void> {
    await apiClient.post(
        `/api/users/${userId}/roles`,
        request
    );
}

export async function removeRole(
    userId: string,
    roleId: string
): Promise<void> {
    await apiClient.delete(
        `/api/users/${userId}/roles/${roleId}`
    );
}