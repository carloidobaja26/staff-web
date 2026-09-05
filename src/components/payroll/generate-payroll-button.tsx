"use client";

import { useState } from "react";
import { Loader2, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generatePayroll } from "@/lib/api/payroll";
import { getApiErrorMessage } from "@/lib/helpers/api-error";

type GeneratePayrollButtonProps = {
    attendanceId: string;
    onSuccess?: () => void;
};

export function GeneratePayrollButton({
    attendanceId,
    onSuccess,
}: GeneratePayrollButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        null
    );
    const [successMessage, setSuccessMessage] = useState<string | null>(
        null
    );

    const handleGenerate = async () => {
        setIsGenerating(true);
        setErrorMessage(null);

        try {
            await generatePayroll({
                attendanceId,
            });

            onSuccess?.();
        } 
        catch (error: any) {
            setErrorMessage(
                getApiErrorMessage(
                    error,
                    "Failed to generate payroll."
                )
            );
        }
        finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        Generate Payroll
                    </>
                )}
            </Button>

            {errorMessage && (
                <p className="text-xs text-destructive">
                    {errorMessage}
                </p>
            )}

            {successMessage && (
                <p className="text-xs text-green-600 dark:text-green-400">
                    {successMessage}
                </p>
            )}
        </div>
    );
}