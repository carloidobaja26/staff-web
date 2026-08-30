import { WorkerTable } from "@/components/workers/worker-table";

export default function WorkersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Worker
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the workers.
          </p>
        </div>
      </div>

      <WorkerTable />
    </div>
  );
}