import { EventTable } from "@/components/events/event-table";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Events
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the events.
          </p>
        </div>
      </div>

      <EventTable />
    </div>
  );
}