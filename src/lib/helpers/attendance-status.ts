import { AttendanceStatus } from "@/lib/api/attendance";

export function getAttendanceStatusConfig(
    status: AttendanceStatus
) {
    switch (status) {
        case AttendanceStatus.Present:
            return {
                label: "Present",
                className:
                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            };

        case AttendanceStatus.Late:
            return {
                label: "Late",
                className:
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            };

        case AttendanceStatus.Absent:
            return {
                label: "Absent",
                className:
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            };

        case AttendanceStatus.HalfDay:
            return {
                label: "Half Day",
                className:
                    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            };

        case AttendanceStatus.Pending:
        default:
            return {
                label: "Pending",
                className:
                    "bg-muted text-muted-foreground",
            };
    }
}