import { apiClient } from "@/lib/api/client";

export type Attendance = {
    id: string;
    tenantId: string;

    bookingId: string;

    checkInTime?: string | null;
    checkOutTime?: string | null;

    status: number;

    remarks?: string | null;

    checkedInById?: string | null;
    checkedInByName?: string | null;

    checkedOutById?: string | null;
    checkedOutByName?: string | null;

    workerId: string;
    workerName?: string | null;

    shiftRoleId: string;
    shiftRoleName?: string | null;
};

export type CheckInAttendanceRequest = {
    bookingId: string;
    checkedInById: string;
    remarks?: string;
};

export type CheckOutAttendanceRequest = {
    bookingId: string;
    checkedOutById: string;
    remarks?: string;
};

export type MarkAbsentAttendanceRequest = {
    bookingId: string;
    markedAbsentById: string;
    remarks?: string;
};


/**
 * Get attendance records for a shift role.
 */
export async function getAttendanceByShiftRole(
    shiftRoleId: string
): Promise<Attendance[]> {

    const response =
        await apiClient.get(
            `/api/shiftrolesconfirm/${shiftRoleId}/attendance`
        );

    return response.data.data;
}


/**
 * Get attendance for a booking.
 */
export async function getAttendanceByBooking(
    bookingId: string
): Promise<Attendance | null> {

    const response =
        await apiClient.get(
            `/api/bookings/${bookingId}/attendance`
        );

    return response.data.data;
}


/**
 * Check in a worker.
 */
export async function checkInAttendance(
    request: CheckInAttendanceRequest
): Promise<Attendance> {

    const response =
        await apiClient.post(
            "/api/attendance/checkin",
            request
        );

    return response.data.data;
}


/**
 * Check out a worker.
 */
export async function checkOutAttendance(
    request: CheckOutAttendanceRequest
): Promise<Attendance> {

    const response =
        await apiClient.post(
            "/api/attendance/checkout",
            request
        );

    return response.data.data;
}


/**
 * Mark a worker as absent.
 */
export async function markAbsentAttendance(
    request: MarkAbsentAttendanceRequest
): Promise<Attendance> {

    const response =
        await apiClient.post(
            "/api/attendance/absent",
            request
        );

    return response.data.data;
}