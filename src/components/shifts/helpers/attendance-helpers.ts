import type { Attendance } from "@/lib/api/attendance";

export function formatAttendanceDateTime(
    value?: string | null
): string {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    );
}

export function getAttendanceStatusLabel(
    status: number
): string {
    switch (status) {
        case 1:
            return "Pending";

        case 2:
            return "Present";

        case 3:
            return "Late";

        case 4:
            return "Absent";

        case 5:
            return "Half Day";

        default:
            return "Unknown";
    }
}

export function getAttendanceStatusClassName(
    status: number
): string {
    switch (status) {
        case 2:
            return "bg-primary/10 text-primary";

        case 3:
            return "bg-primary/10 text-primary";

        case 4:
            return "bg-destructive/10 text-destructive";

        case 5:
            return "bg-muted text-muted-foreground";

        default:
            return "bg-muted text-muted-foreground";
    }
}

export function canCheckIn(
    attendance?: Attendance | null
): boolean {
    if (!attendance) {
        return true;
    }

    return attendance.status === 1;
}

export function canCheckOut(
    attendance: Attendance | null
): boolean {
    if (!attendance) {
        return false;
    }

    return (
        !!attendance.checkInTime &&
        !attendance.checkOutTime &&
        attendance.status !== 4
    );
}

export function canMarkAbsent(
    attendance?: Attendance | null
): boolean {
    if (!attendance) {
        return true;
    }

    return attendance.status === 1;
}