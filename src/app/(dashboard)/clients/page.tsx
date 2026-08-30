import { ClientTable } from "@/components/clients/client-table";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Clients
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the clients.
          </p>
        </div>
      </div>

      <ClientTable />
    </div>
  );
}