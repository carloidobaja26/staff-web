"use client";

import { useState } from "react";
import {
CalendarDays,
List,
Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Client } from "@/lib/api/clients";

import { EventDialog } from "@/components/events/event-dialog";
import { ClientEventsTable } from "./client-events-table";
import { ClientEventsCalendar } from "./client-events-calendar";

type ViewMode = "table" | "calendar";

type ClientEventsProps = {
client: Client;
};

export function ClientEvents({
client,
}: ClientEventsProps) {
const [viewMode, setViewMode] =
useState<ViewMode>("table");

const [refreshKey, setRefreshKey] =
    useState(0);

return (
    <div className="rounded-xl border bg-card">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
                <h2 className="text-lg font-semibold">
                    Events
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage events for {client.name}.
                </p>
            </div>

            <div className="flex items-center gap-2">

                {/* View Toggle */}
                <div className="flex rounded-md border p-1">

                    <Button
                        type="button"
                        size="sm"
                        variant={
                            viewMode === "table"
                                ? "secondary"
                                : "ghost"
                        }
                        onClick={() =>
                            setViewMode("table")
                        }
                    >
                        <List className="mr-2 size-4" />
                        List
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        variant={
                            viewMode === "calendar"
                                ? "secondary"
                                : "ghost"
                        }
                        onClick={() =>
                            setViewMode("calendar")
                        }
                    >
                        <CalendarDays className="mr-2 size-4" />
                        Calendar
                    </Button>

                </div>

                {/* Create Event */}
                <EventDialog
                    clientId={client.id}
                    onSuccess={() => {
                        setRefreshKey(
                            (key) => key + 1
                        );
                    }}
                />

            </div>

        </div>

        {/* Content */}
        <div className="p-6">

            {viewMode === "table" ? (
                <ClientEventsTable
                    key={`table-${refreshKey}`}
                    clientId={client.id}
                />
            ) : (
                <ClientEventsCalendar
                    key={`calendar-${refreshKey}`}
                    clientId={client.id}
                />
            )}

        </div>

    </div>
);

}
