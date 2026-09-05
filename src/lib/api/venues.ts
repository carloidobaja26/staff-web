import { apiClient } from "./client";
import { ApiResponse } from "./types";

export type Venue = {
    id: string;
    tenantId: string;
    name: string;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    contactPerson?: string | null;
    contactNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    notes?: string | null;
    isActive: boolean;
};

export async function getVenuesByTenant(
    tenantId: string
): Promise<Venue[]> {
    const response = await apiClient.get<
        ApiResponse<Venue[]>
    >(
        `/api/venues`
    );

    return response.data.data;
}

export type PagedResult<T> = {
    pageNumber: number;
    pageSize: number;
    totalNumber: number;
    items: T[];
};


/* =========================
   Get Paged Venues
========================= */

export async function getVenues(
    pageNumber = 1,
    pageSize = 10,
    search = ""
): Promise<PagedResult<Venue>> {
    const response = await apiClient.get<
        ApiResponse<PagedResult<Venue>>
    >("/api/venue/paged", {
        params: {
            PageNumber: pageNumber,
            PageSize: pageSize,
            Search: search,
        },
    });

    return response.data.data;
}


/* =========================
   Get Venue
========================= */

export async function getVenue(
    id: string
): Promise<Venue> {
    const response = await apiClient.get<
        ApiResponse<Venue>
    >(`/api/venue/${id}`);

    return response.data.data;
}


/* =========================
   Create Venue
========================= */

export type CreateVenueRequest = {
    tenantId: string;
    name: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    contactPerson?: string;
    contactNumber?: string;
    latitude?: number | null;
    longitude?: number | null;
    notes?: string;
};

export async function createVenue(
    data: CreateVenueRequest
): Promise<Venue> {
    const response = await apiClient.post<
        ApiResponse<Venue>
    >("/api/venue", data);

    return response.data.data;
}


/* =========================
   Update Venue
========================= */

export type UpdateVenueRequest = {
    name: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    contactPerson?: string;
    contactNumber?: string;
    latitude?: number | null;
    longitude?: number | null;
    notes?: string;
    isActive: boolean;
};

export async function updateVenue(
    id: string,
    data: UpdateVenueRequest
): Promise<Venue> {
    const response = await apiClient.put<
        ApiResponse<Venue>
    >(`/api/venue/${id}`, data);

    return response.data.data;
}


/* =========================
   Delete Venue
========================= */

export async function deleteVenue(
    id: string
): Promise<void> {
    await apiClient.delete(`/api/venue/${id}`);
}

