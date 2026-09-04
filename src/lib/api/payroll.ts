import { apiClient } from "./client";
import { ApiResponse, PagedResponse } from "./types";

export enum PayrollStatus {
    Pending = 1,
    Approved = 2,
    Paid = 3,
}

export enum RateType {
    Hourly = 1,
    Daily = 2,
    Fixed = 3,
}

export type Payroll = {
    id: string; tenantId: string;
    attendanceId: string;
    rate: number;
    rateType: RateType;
    hoursWorked: number;
    grossPay: number;
    deductions: number;
    netPay: number;
    status: PayrollStatus;
    approvedById?: string | null;
    approvedAt?: string | null;
};

export async function generatePayroll(request: {
    attendanceId: string;
}) {
    const response = await apiClient.post(
        "/api/Payroll",
        request
    );

    const result = response.data;

    if (!result.success) {
        const error = new Error(
            result.message ?? "Failed to generate payroll."
        );

        (error as any).response = {
            data: result,
        };

        throw error;
    }

    return result.data;
}

export async function getPayrollById
    (payrollId: string): Promise<Payroll> {
    const response = await apiClient.get<ApiResponse<Payroll>>(
        "/api/payroll/id", {
        params: {
            id: payrollId,

        },
    }); return response.data.data;
}

export type ApprovePayrollRequest = { approvedById: string; };

export async function approvePayroll
    (payrollId: string, request: ApprovePayrollRequest): Promise<Payroll> {
    const response = await apiClient.post<ApiResponse<Payroll>>(
        `/api/payroll/${payrollId}`, request); return response.data.data;
}

export type OverallPayroll = {
    agencyId: string;
    agencyName: string;
    workersCount: number;
    eventsCount: number;
    totalApprovedPayrollAmount: number;
    totalPendingPayrollAmount: number;
    totalPaidPayrollAmount: number;
    generatedPayrollCount: number;
};

export async function getOverallPayroll(
    pageNumber: number,
    pageSize: number,
    search?: string
): Promise<PagedResponse<OverallPayroll>> {
    const response = await apiClient.get<
        ApiResponse<PagedResponse<OverallPayroll>>
    >("/api/payroll/overall", {
        params: {
            PageNumber: pageNumber,
            PageSize: pageSize,
            ...(search ? { Search: search } : {}),
        },
    });

    return response.data.data;
}

export type AgencyPayrollRecord = {
    id: string;
    workerId: string;
    workerName: string;
    eventId: string;
    eventName: string;
    shiftId: string;
    shiftName: string;
    netPay: number;
    status: PayrollStatus;
};

export async function getAgencyPayrollPaged(
    agencyId: string,
    pageNumber: number,
    pageSize: number,
    search?: string
): Promise<PagedResponse<AgencyPayrollRecord>> {
    const response = await apiClient.get<ApiResponse<PagedResponse<AgencyPayrollRecord>>>
        (`/api/payroll/agency/${agencyId}`, {
                params:
                {
                    PageNumber: pageNumber, 
                    PageSize: pageSize,
                    ...(search ? { Search: search } : {}),
                },
            });
    return response.data.data;
}