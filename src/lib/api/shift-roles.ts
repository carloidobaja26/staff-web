import { apiClient } from "./client";

export type RateType = 1 | 2 | 3;

export type ShiftRole = {
    id: string;
    shiftId: string;
    name: string;
    requestedWorkers: number;
    rate: number;
    rateType: RateType;
    notes?: string | null;
    isActive: boolean;
};

export type CreateShiftRoleRequest = {
    tenantId: string;
    shiftId: string;
    name: string;
    requestedWorkers: number;
    rate: number;
    rateType: number;
    notes?: string | null;
};

export type UpdateShiftRoleRequest = {
    name: string;
    requestedWorkers: number;
    rate: number;
    rateType: number;
    notes?: string | null;
};

export async function getShiftRoles(
    shiftId: string
): Promise<ShiftRole[]> {
    const response = await apiClient.get(
        `api/shift/${shiftId}/shiftroles`
    );

    return response.data.data;
}

export async function createShiftRole(
    request: CreateShiftRoleRequest
): Promise<ShiftRole> {
    const response = await apiClient.post(
        "api/shiftrole",
        request
    );

    return response.data.data;
}

export async function updateShiftRole(
    id: string,
    request: UpdateShiftRoleRequest
): Promise<ShiftRole> {
    const response = await apiClient.put(
        `api/shiftrole/${id}`,
        request
    );

    return response.data.data;
}

export async function deleteShiftRole(
    id: string
): Promise<void> {
    await apiClient.delete(
        `api/shiftrole/${id}`
    );
}