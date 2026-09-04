import { AttendanceStatus } from "@/lib/api/attendance";
import { getAttendanceStatusConfig } from "@/lib/helpers/attendance-status";

export function AttendanceStatusBadge({
    status,
}: {
    status: AttendanceStatus;
}) {
    const config = getAttendanceStatusConfig(status);

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
}