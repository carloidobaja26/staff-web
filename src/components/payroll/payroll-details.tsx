"use client";

import { ArrowLeft, Calendar, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Payroll,
    PayrollStatus,
    RateType,
} from "@/lib/api/payroll";

import { PayrollStatusBadge } from "./payroll-status-badge";
import { ApprovePayrollButton } from "./approve-payroll-button";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/helpers/format-currency";

type PayrollDetailsProps = {
    payroll: Payroll;
};


function getRateTypeLabel(rateType: RateType) {
    switch (rateType) {
        case RateType.Hourly:
            return "Hourly";

        case RateType.Daily:
            return "Daily";

        case RateType.Fixed:
            return "Fixed";

        default:
            return "Unknown";
    }
}

function formatDateTime(value?: string | null) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString();
}

export function PayrollDetails({
    payroll,
}: PayrollDetailsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Payroll
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Payroll details and payment information
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <PayrollStatusBadge status={payroll.status} />

                    {payroll.status === PayrollStatus.Pending && (
                        <ApprovePayrollButton
                            payrollId={payroll.id}
                            onSuccess={async () => {
                                await queryClient.invalidateQueries({
                                    queryKey: ["payroll", payroll.id],
                                });
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Earnings */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Gross Pay
                        </CardTitle>

                        <DollarSign className="size-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(payroll.grossPay)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Deductions
                        </CardTitle>

                        <DollarSign className="size-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(payroll.deductions)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Net Pay
                        </CardTitle>

                        <DollarSign className="size-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(payroll.netPay)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payroll Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Payroll Information</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Rate
                            </p>

                            <p className="mt-1 font-medium">
                                {formatCurrency(payroll.rate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Rate Type
                            </p>

                            <p className="mt-1 font-medium">
                                {getRateTypeLabel(
                                    payroll.rateType
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Hours Worked
                            </p>

                            <p className="mt-1 font-medium">
                                {payroll.hoursWorked}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Status
                            </p>

                            <div className="mt-1">
                                <PayrollStatusBadge
                                    status={payroll.status}
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Approved At
                            </p>

                            <p className="mt-1 font-medium">
                                {formatDateTime(
                                    payroll.approvedAt
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Attendance ID
                            </p>

                            <p className="mt-1 break-all font-mono text-sm">
                                {payroll.attendanceId}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
