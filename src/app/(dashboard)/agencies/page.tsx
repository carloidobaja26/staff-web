import {
    AgencyTable,
} from "@/components/agencies/agency-table";


export default function AgenciesPage() {

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Agencies
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your agencies and their
                    workers, clients, and events.
                </p>

            </div>


            <AgencyTable />

        </div>

    );

}