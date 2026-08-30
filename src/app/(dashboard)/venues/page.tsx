import { VenueTable } from "@/components/venues/venue-table";

export default function VenuesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Venues
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the venues.
          </p>
        </div>
      </div>

      <VenueTable />
    </div>
  );
}