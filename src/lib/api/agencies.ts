import { apiClient } from "@/lib/api/client";
import type {
    ApiResponse,
    PagedResponse,
    PaginationRequest,
} from "@/lib/api/types";

import type {
    Worker
} from "@/lib/api/workers";

import type {
    Client
} from "@/lib/api/clients";

import type { Event } from "./events";

export async function getAgencyWorkersPaginated(
    agencyId: string,
    params: PaginationRequest
): Promise<PagedResponse<Worker>> {

    const response =
        await apiClient.get<
            ApiResponse<
                PagedResponse<Worker>
            >
        >(
            `/api/agencies/${agencyId}/workers/paged`,
            {
                params,
            }
        );

    return response.data.data;
}

export async function getAgencyClientsPaginated(
    agencyId: string,
    params: PaginationRequest
): Promise<PagedResponse<Client>> {

    const response =
        await apiClient.get<
            ApiResponse<
                PagedResponse<Client>
            >
        >(
            `/api/agencies/${agencyId}/clients/paged`,
            {
                params,
            }
        );

    return response.data.data;
}

export type AgencyEvent = {
    id: string;
    name: string;
    eventNumber?: string | null;
    eventType: string;
    clientName?: string | null;
    clientId: string;
    startDateTime: string;
    endDateTime: string;
    status: string;
};

export async function getAgencyEventsPaginated(
    agencyId: string,
    params: PaginationRequest
): Promise<PagedResponse<Event>> {

    const response =
        await apiClient.get<
            ApiResponse<
                PagedResponse<Event>
            >
        >(
            `/api/agencies/${agencyId}/events/paged`,
            {
                params,
            }
        );

    return response.data.data;
}

export async function deleteAgencyEvent(
    eventId: string
) {
    const response = await apiClient.delete(
        `/api/events/${eventId}`
    );

    return response.data.data;
}
export type Agency = {
    id: string;

    tenantId: string;

    name: string;

    description?: string | null;

    email?: string | null;

    phoneNumber?: string | null;

    address?: string | null;

    isActive: boolean;

    managerUserId?: string | null;

    createdAt?: string;

    updatedAt?: string;
};

export type GetAgenciesParams = {
    pageNumber?: number;

    pageSize?: number;

    search?: string;
};


export async function getAgenciesPaginated(
    params: GetAgenciesParams = {}
): Promise<PagedResponse<Agency>> {

    const response = await apiClient.get(
        `/api/agencies/paginated`,
        {
            params: {
                pageNumber:
                    params.pageNumber ?? 1,

                pageSize:
                    params.pageSize ?? 10,

                ...(params.search
                    ? {
                        search:
                            params.search,
                    }
                    : {}),
            },
        }
    );

    return response.data.data;
}


export async function getAgency(
    id: string
): Promise<Agency> {

    const response = await apiClient.get(
        `/api/agency/${id}`
    );

    return response.data.data;
}


export type CreateAgencyRequest = {
    tenantId: string;

    name: string;

    description?: string;

    email?: string;

    phoneNumber?: string;

    address?: string;

    managerUserId?: string;
};


export async function createAgency(
    data: CreateAgencyRequest
): Promise<Agency> {

    const response = await apiClient.post(
        "/api/agency",
        data
    );

    return response.data.data;
}


export type UpdateAgencyRequest = {
    name: string;

    description?: string;

    email?: string;

    phoneNumber?: string;

    address?: string;

    isActive: boolean;

    managerUserId?: string | null;
};


export async function updateAgency(
    id: string,
    data: UpdateAgencyRequest
): Promise<Agency> {

    const response = await apiClient.put(
        `/api/agency/${id}`,
        data
    );

    return response.data.data;
}


export async function deleteAgency(
    id: string
): Promise<void> {

    await apiClient.delete(
        `/api/agency/${id}`
    );

}

export async function getAgenciesByTenant(
): Promise<Agency[]> {
    const response = await apiClient.get<
        ApiResponse<Agency[]>
    >(
        `/api/agencies`
    );

    return response.data.data;
}
