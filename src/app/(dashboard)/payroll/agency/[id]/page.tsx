"use client";

import { useParams } from "next/navigation";

import { PayrollAgencyTable } from "@/components/payroll/payroll-agency-table";

export default function PayrollAgency() {
    const params = useParams();

    const agencyId = params.id as string;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Payroll
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Agency payroll records
                </p>
            </div>

            {/* Payroll Table */}
            <PayrollAgencyTable
                agencyId={agencyId}
            />

        </div>
    );
}
