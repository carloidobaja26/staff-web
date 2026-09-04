import { apiClient } from "@/lib/api/client";
import { ApiResponse, PagedResponse, PaginationRequest } from "./types";

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

    shiftName?: string | null;
    shiftRoleName?: string | null;

    workerId: string;
    workerName?: string | null;
    payrollId?: string | null;

    shiftRoleId: string;
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

export enum AttendanceStatus {
    Pending = 1,
    Present = 2,
    Late = 3,
    Absent = 4,
    HalfDay = 5,
}

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

export async function getWorkerAttendancePaginated(
    workerId: string,
    params: PaginationRequest
): Promise<PagedResponse<Attendance>> {
    const response = await apiClient.get<
        ApiResponse<PagedResponse<Attendance>>
    >(`/api/worker/${workerId}/attendance`, {
        params: {
            PageNumber: params.pageNumber,
            PageSize: params.pageSize,
            Search: params.search || undefined,
        },
    });

    return response.data.data;
}