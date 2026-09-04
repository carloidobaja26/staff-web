"use client";

import { PayrollTable } from "@/components/payroll/payroll-table";

export default function PayrollPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Payroll
                </h1>

                <p className="text-sm text-muted-foreground">
                    Overview of payroll by agency
                </p>
            </div>

            <PayrollTable />
        </div>
    );
}
