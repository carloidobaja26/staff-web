import { getAttendanceStatusClassName, getAttendanceStatusLabel } from "./attendance-helpers";

export function AttendanceStatusBadge({
    status,
}: {
    status: number;
}) {
    const label =
        getAttendanceStatusLabel(status);

    const className =
        getAttendanceStatusClassName(status);

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
        >
            {label}
        </span>
    );
}