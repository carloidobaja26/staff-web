import { apiClient } from "./client";
import {
    CURRENT_TENANT_ID,
    CURRENT_AGENCY_ID,
    CURRENT_USER_ID,
} from "@/constants/tenant";

export type BookingStatus =
    | 1
    | 2
    | 3;

export type Booking = {
    id: string;
    tenantId: string;
    shiftRoleId: string;
    workerId: string;
    workerName: string;
    assignedName: string;
    assignedById: string;
    assignedAt: string;
    status: BookingStatus;
};


export type CreateBookingRequest = {
    tenantId: string;
    shiftRoleId: string;
    workerId: string;
    assignedById: string;
};


export type UpdateBookingRequest = {
    status: BookingStatus;
};


export async function getBookingsByShiftRole(
    shiftRoleId: string
): Promise<Booking[]> {

    const response = await apiClient.get(
        `/api/shiftroles/${shiftRoleId}/bookings`
    );

    return response.data.data;
}

export async function getBookingsByShiftRoleConfirm(
    shiftRoleId: string
): Promise<Booking[]> {

    const response = await apiClient.get(
        `/api/shiftrolesconfirm/${shiftRoleId}/bookings`
    );

    return response.data.data;
}

export async function createBooking(
    request: CreateBookingRequest
): Promise<Booking> {
    request.tenantId = CURRENT_TENANT_ID;
    request.assignedById = CURRENT_USER_ID;
    const response = await apiClient.post(
        "/api/booking",
        request
    );

    return response.data.data;
}


export async function updateBooking(
    id: string,
    request: UpdateBookingRequest
): Promise<Booking> {

    const response = await apiClient.put(
        `/api/booking/${id}`,
        request
    );

    return response.data.data;
}


export async function deleteBooking(
    id: string
): Promise<void> {

    await apiClient.delete(
        `/api/booking/${id}`
    );
}