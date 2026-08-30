
import { apiClient } from "./client";

export type Worker = {
    id: string;
    tenantId: string;
    agencyId: string;

    userId: string | null;

    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;

    birthDate: string | null;
    workerNumber: string;

    isActive: boolean;
};

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export type CreateWorkerRequest = {
    tenantId: string;
    agencyId: string;

    firstName: string;
    lastName: string;
    email: string;

    phoneNumber?: string;
    birthDate?: string;

    workerNumber: string;
};

export type UpdateWorkerRequest = {
    tenantId: string;
    agencyId: string;

    firstName: string;
    lastName: string;
    email: string;

    phoneNumber?: string;
    birthDate?: string;

    workerNumber: string;
    isActive: boolean;
};

export async function getWorkers(): Promise<Worker[]> {
    const response = await apiClient.get<ApiResponse<Worker[]>>(
        "/api/worker"
    );

    return response.data.data;
}

export async function getWorker(
    id: string
): Promise<Worker> {
    const response = await apiClient.get<ApiResponse<Worker>>(
        `/api/worker/${id}`
    );

    return response.data.data;
}

export async function createWorker(
    data: CreateWorkerRequest
): Promise<Worker> {
    const response = await apiClient.post<ApiResponse<Worker>>(
        "/api/worker",
        data
    );

    return response.data.data;
}

export async function updateWorker(
    id: string,
    data: UpdateWorkerRequest
): Promise<Worker> {
    const response = await apiClient.put<ApiResponse<Worker>>(
        `/api/worker/${id}`,
        data
    );

    return response.data.data;
}

export async function deleteWorker(
    id: string
): Promise<void> {
    await apiClient.delete(`/api/worker/${id}`);
}

