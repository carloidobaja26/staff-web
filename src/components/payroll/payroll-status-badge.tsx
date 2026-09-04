"use client";

import { Badge } from "@/components/ui/badge";
import { PayrollStatus } from "@/lib/api/payroll";

type PayrollStatusBadgeProps = {
    status: PayrollStatus;
};

export function PayrollStatusBadge({
    status,
}: PayrollStatusBadgeProps) {
    switch (status) {
        case PayrollStatus.Pending:
            return (
                <Badge className="bg-yellow-600 text-white hover:bg-yellow-600">
                    Pending
                </Badge>
            );

        case PayrollStatus.Approved:
            return (
                <Badge className="bg-green-600 text-white hover:bg-green-600">
                    Approved
                </Badge>
            );

        case PayrollStatus.Paid:
            return (
                <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                    Paid
                </Badge>
            );

        default:
            return (
                <Badge variant="secondary">
                    Unknown
                </Badge>
            );
    }
}
