import { apiClient } from "./client";
import { ApiResponse } from "./types";

export enum EventStatus {
    Draft = 1,
    Scheduled = 2,
    Ongoing = 3,
    Completed = 4,
    Cancelled = 5,
}

export enum EventType {
    Corporate = 1,
    Concert = 2,
    Festival = 3,
    Wedding = 4,
    Sports = 5,
    Exhibition = 6,
    TradeShow = 7,
    Private = 8,
    Other = 9,
}


export type Event = {
    id: string;

    tenantId: string;
    agencyId: string;

    clientId: string;
    venueId: string | null;
    agencyName: string | null;
    clientName: string | null;
    venueName: string | null;

    eventNumber: string;
    name: string;
    description: string | null;

    type: EventType;
    status: EventStatus;

    startDateTime: string;
    endDateTime: string;

    isActive: boolean;
};


export type PagedResult<T> = {
    pageNumber: number;
    pageSize: number;
    totalNumber: number;
    items: T[];
};

/*
 * Get paginated events
 */

export async function getEvents(
    pageNumber = 1,
    pageSize = 10,
    search = ""
): Promise<PagedResult<Event>> {
    const response =
        await apiClient.get<
            ApiResponse<PagedResult<Event>>
        >(
            "/api/event/paged",
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


/*
 * Get event by ID
 */

export async function getEvent(
    id: string
): Promise<Event> {
    const response =
        await apiClient.get<ApiResponse<Event>>(
            `/api/event/${id}`
        );

    return response.data.data;
}


/*
 * Get events by tenant
 */

export async function getEventsByTenant(
    tenantId: string
): Promise<Event[]> {
    const response =
        await apiClient.get<
            ApiResponse<Event[]>
        >(
            `/api/events`
        );

    return response.data.data;
}


/*
 * Get events by agency
 */

export async function getEventsByAgency(
    agencyId: string
): Promise<Event[]> {
    const response =
        await apiClient.get<
            ApiResponse<Event[]>
        >(
            `/api/agency/${agencyId}/events`
        );

    return response.data.data;
}


/*
 * Get events by client
 */

export async function getEventsByClient(
    clientId: string
): Promise<Event[]> {
    const response =
        await apiClient.get<
            ApiResponse<Event[]>
        >(
            `/api/clients/${clientId}/events`
        );

    return response.data.data;
}


/*
 * Create Event
 */

export type CreateEventRequest = {
    tenantId: string;
    agencyId: string;
    clientId: string;
    venueId?: string | null;

    eventNumber: string;
    name: string;
    description?: string;

    type: EventType;

    startDateTime: string;
    endDateTime: string;
};


export async function createEvent(
    data: CreateEventRequest
): Promise<Event> {
    const response =
        await apiClient.post<ApiResponse<Event>>(
            "/api/event",
            data
        );

    return response.data.data;
}


/*
 * Update Event
 */

export type UpdateEventRequest = {
    agencyId: string;
    clientId: string;
    venueId?: string | null;

    eventNumber: string;
    name: string;
    description?: string;

    type: EventType;

    startDateTime: string;
    endDateTime: string;

    status: EventStatus;
    isActive: boolean;
};


export async function updateEvent(
    id: string,
    data: UpdateEventRequest
): Promise<Event> {
    const response =
        await apiClient.put<ApiResponse<Event>>(
            `/api/event/${id}`,
            data
        );

    return response.data.data;
}


/*
 * Delete Event
 */

export async function deleteEvent(
    id: string
): Promise<void> {
    await apiClient.delete(
        `/api/event/${id}`
    );
}


/*
 * Calendar
 */

export type EventCalendarRequest = {
    year: number;
    month: number;
    search?: string;
};


export async function getEventCalendar(
    year: number,
    month: number,
    search = ""
): Promise<Event[]> {
    const response =
        await apiClient.get<ApiResponse<Event[]>>(
            "/api/event/calendar",
            {
                params: {
                    Year: year,
                    Month: month,
                    Search: search,
                },
            }
        );

    return response.data.data;
}

export async function getClientEvents(
    clientId: string,
    pageNumber = 1,
    pageSize = 10,
    search = ""
): Promise<PagedResult<Event>> {
    const response = await apiClient.get<
        ApiResponse<PagedResult<Event>>
    >(
        `/api/client/${clientId}/events/paged`,
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

export async function getClientEventsCalendar(
    clientId: string,
    year: number,
    month: number
): Promise<Event[]> {
    const response = await apiClient.get<
        ApiResponse<Event[]>
    >(
        `/api/client/${clientId}/events/calendar`,
        {
            params: {
                Year: year,
                Month: month,
            },
        }
    );

    return response.data.data;

}
