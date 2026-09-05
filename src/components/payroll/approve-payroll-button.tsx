"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { approvePayroll } from "@/lib/api/payroll";
import { CURRENT_USER_ID } from "@/constants/tenant";
import { getApiErrorMessage } from "@/lib/helpers/api-error";

type ApprovePayrollButtonProps = {
    payrollId: string;
    onSuccess?: () => Promise<void> | void;
};

export function ApprovePayrollButton({
    payrollId,
    onSuccess,
}: ApprovePayrollButtonProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        null
    );

    const handleApprove = async () => {
        setIsApproving(true);
        setErrorMessage(null);

        try {
            await approvePayroll(payrollId, {
                approvedById: CURRENT_USER_ID,
            });

            await onSuccess?.();
        } 
        catch (error: any) {
            setErrorMessage(
                getApiErrorMessage(
                    error,
                    "Failed to approve payroll."
                )
            );
        }
        
        finally {
            setIsApproving(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <Button
                type="button"
                size="sm"
                onClick={handleApprove}
                disabled={isApproving}
            >
                {isApproving ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Approving...
                    </>
                ) : (
                    <>
                        <Check className="mr-2 size-4" />
                        Approve Payroll
                    </>
                )}
            </Button>

            {errorMessage && (
                <p className="text-xs text-destructive">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
