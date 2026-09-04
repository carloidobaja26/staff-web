"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { PayrollDetails } from "@/components/payroll/payroll-details";
import { getPayrollById } from "@/lib/api/payroll";

export default function PayrollDetailsPage() {
    const params = useParams();

    const payrollId = params.id as string;

    const {
        data: payroll,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["payroll", payrollId],
        queryFn: () => getPayrollById(payrollId),
        enabled: !!payrollId,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    Loading payroll...
                </p>
            </div>
        );
    }

    if (isError || !payroll) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                <p className="text-sm text-muted-foreground">
                    Failed to load payroll.
                </p>
            </div>
        );
    }

    return <PayrollDetails payroll={payroll} />;
}
