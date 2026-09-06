import { UserTable } from "@/components/users/user-table";

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    User Management
                </h1>

                <p className="text-sm text-muted-foreground">
                    Manage users and their account status.
                </p>
            </div>

            <UserTable />
        </div>
    );
}