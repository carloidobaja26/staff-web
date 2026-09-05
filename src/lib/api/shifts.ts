import { apiClient } from "./client";
import { ApiResponse } from "./types";

export enum ShiftStatus {
    Open = 1,
    Filled = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5,
}

export type Shift = {
    id: string;
    tenantId: string;
    eventId: string;
    eventName: string;

    name: string;
    description: string | null;

    startDateTime: string;
    endDateTime: string;

    status: ShiftStatus;
    isActive: boolean;
};

export type PagedResult<T> = {
    pageNumber: number;
    pageSize: number;
    totalNumber: number;
    items: T[];
};

export type CreateShiftRequest = {
    tenantId: string;
    eventId: string;

    name: string;
    description?: string;

    startDateTime: string;
    endDateTime: string;
};

export type UpdateShiftRequest = {
    name: string;
    description?: string;

    startDateTime: string;
    endDateTime: string;

    status: ShiftStatus;
    isActive: boolean;
};


/*
 * List / Table
 */

export async function getShifts(
    pageNumber = 1,
    pageSize = 10,
    search = ""
): Promise<PagedResult<Shift>> {
    const response =
        await apiClient.get<
            ApiResponse<PagedResult<Shift>>
        >("/api/shift/paged", {
            params: {
                PageNumber: pageNumber,
                PageSize: pageSize,
                Search: search,
            },
        });

    return response.data.data;
}

export async function getEventShifts(
    eventId: string
): Promise<Shift[]> {
    const response = await apiClient.get<
        ApiResponse<Shift[]>
    >(
        `/api/event/${eventId}/shifts`
    );

    return response.data.data;
}

/*
 * Calendar
 */

export async function getShiftCalendar(
    tenantId: string,
    year: number,
    month: number,
    search = ""
): Promise<Shift[]> {
    const response =
        await apiClient.get<
            ApiResponse<Shift[]>
        >("/api/shift/calendar", {
            params: {
                tenantId,
                year,
                month,
                search,
            },
        });

    return response.data.data;
}


/*
 * Get single shift
 */

export async function getShift(
    id: string
): Promise<Shift> {
    const response =
        await apiClient.get<ApiResponse<Shift>>(
            `/api/shift/${id}`
        );

    return response.data.data;
}


/*
 * Get shifts by tenant
 */

export async function getShiftsByTenant(
    tenantId: string
): Promise<Shift[]> {
    const response =
        await apiClient.get<ApiResponse<Shift[]>>(
            `/api/shifts`
        );

    return response.data.data;
}


/*
 * Get shifts by event
 */

export async function getShiftsByEvent(
    eventId: string
): Promise<Shift[]> {
    const response =
        await apiClient.get<ApiResponse<Shift[]>>(
            `/api/event/${eventId}/shifts`
        );

    return response.data.data;
}


/*
 * Create
 */

export async function createShift(
    data: CreateShiftRequest
): Promise<Shift> {
    const response =
        await apiClient.post<ApiResponse<Shift>>(
            "/api/shift",
            data
        );

    return response.data.data;
}


/*
 * Update
 */

export async function updateShift(
    id: string,
    data: UpdateShiftRequest
): Promise<Shift> {
    const response =
        await apiClient.put<ApiResponse<Shift>>(
            `/api/shift/${id}`,
            data
        );

    return response.data.data;
}


/*
 * Delete
 */

export async function deleteShift(
    id: string
): Promise<void> {
    await apiClient.delete(
        `/api/shift/${id}`
    );
}

