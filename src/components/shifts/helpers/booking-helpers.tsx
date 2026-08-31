import React from "react";

export function formatDateTime(
    value?: string | null
) {

    if (!value) {
        return "—";
    }


    return new Date(
        value
    ).toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    );

}

export function getBookingStatusLabel(
    status: number
) {

    switch (status) {

        case 1:
            return "Pending";

        case 2:
            return "Confirmed";

        case 3:
            return "Cancelled";

        default:
            return "Unknown";

    }

}

export function BookingStatusBadge({
    status,
}: {
    status: number;
}) {

    const label =
        getBookingStatusLabel(
            status
        );


    let className =
        "bg-muted text-muted-foreground";


    switch (status) {

        case 1:
            className =
                "bg-primary/10 text-primary";
            break;

        case 2:
            className =
                "bg-primary/10 text-primary";
            break;

        case 3:
            className =
                "bg-destructive/10 text-destructive";
            break;

    }


    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
        >
            {label}
        </span>
    );

}
