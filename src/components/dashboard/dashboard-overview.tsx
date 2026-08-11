import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
  Wallet,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Active Events",
    value: "24",
    description: "+12% from last month",
    icon: CalendarDays,
  },
  {
    label: "Upcoming Shifts",
    value: "18",
    description: "Next 7 days",
    icon: Clock3,
  },
  {
    label: "Workers Assigned",
    value: "42",
    description: "86% of available workers",
    icon: Users,
  },
  {
    label: "Payroll This Week",
    value: "₱184,500",
    description: "+8.2% from last week",
    icon: Wallet,
  },
];

const upcomingEvents = [
  {
    name: "Corporate Gala",
    client: "ABC Corporation",
    date: "Today · 6:00 PM",
    workers: 18,
    status: "Fully Staffed",
  },
  {
    name: "Wedding Reception",
    client: "Grand Ballroom",
    date: "Tomorrow · 4:00 PM",
    workers: 12,
    status: "Fully Staffed",
  },
  {
    name: "Hotel Conference",
    client: "Grand Hotel",
    date: "Aug 14 · 8:00 AM",
    workers: 8,
    status: "2 workers needed",
  },
];

const recentBookings = [
  {
    client: "Marriott Hotel",
    event: "VIP Dinner",
    workers: 12,
    status: "Confirmed",
  },
  {
    client: "ABC Events",
    event: "Product Launch",
    workers: 8,
    status: "Confirmed",
  },
  {
    client: "XYZ Corporation",
    event: "Annual Meeting",
    workers: 5,
    status: "Pending",
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Good morning, Carlo 👋
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your staffing operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>

                <div className="rounded-lg bg-muted p-2">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Upcoming events */}
        <div className="rounded-xl border bg-card xl:col-span-2">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h3 className="font-semibold">
                Upcoming Events
              </h3>

              <p className="text-sm text-muted-foreground">
                Events requiring staffing
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="divide-y">
            {upcomingEvents.map((event) => (
              <div
                key={event.name}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {event.name}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.client}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {event.date}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium">
                    {event.workers} workers
                  </p>

                  <p
                    className={
                      event.status === "Fully Staffed"
                        ? "mt-1 text-xs text-green-600"
                        : "mt-1 text-xs text-amber-600"
                    }
                  >
                    {event.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance */}
        <div className="rounded-xl border bg-card">
          <div className="border-b p-5">
            <h3 className="font-semibold">
              Today's Attendance
            </h3>

            <p className="text-sm text-muted-foreground">
              Current staffing status
            </p>
          </div>

          <div className="space-y-5 p-5">
            <AttendanceRow
              icon={<CheckCircle2 className="size-4" />}
              label="Checked In"
              value="32"
            />

            <AttendanceRow
              icon={<Clock3 className="size-4" />}
              label="Expected"
              value="4"
            />

            <AttendanceRow
              icon={<AlertCircle className="size-4" />}
              label="Missing"
              value="2"
            />
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent bookings */}
        <div className="rounded-xl border bg-card">
          <div className="border-b p-5">
            <h3 className="font-semibold">
              Recent Bookings
            </h3>

            <p className="text-sm text-muted-foreground">
              Latest staffing requests
            </p>
          </div>

          <div className="divide-y">
            {recentBookings.map((booking) => (
              <div
                key={booking.event}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-medium">
                    {booking.client}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {booking.event}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">
                    {booking.workers} workers
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staffing status */}
        <div className="rounded-xl border bg-card">
          <div className="border-b p-5">
            <h3 className="font-semibold">
              Staffing Status
            </h3>

            <p className="text-sm text-muted-foreground">
              Current event fulfillment
            </p>
          </div>

          <div className="space-y-6 p-5">
            <StaffingProgress
              label="Corporate Gala"
              value={92}
            />

            <StaffingProgress
              label="Wedding Reception"
              value={81}
            />

            <StaffingProgress
              label="Hotel Conference"
              value={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted p-2">
          {icon}
        </div>

        <span className="text-sm">
          {label}
        </span>
      </div>

      <span className="text-lg font-semibold">
        {value}
      </span>
    </div>
  );
}

function StaffingProgress({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">
          {label}
        </span>

        <span className="text-sm text-muted-foreground">
          {value}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}