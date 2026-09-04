import { create } from "zustand";
import { persist } from "zustand/middleware";

type AgencyStore = {
    agencyId: string | null;
    setAgencyId: (agencyId: string | null) => void;
    clearAgency: () => void;
};

export const useAgencyStore = create<AgencyStore>()(
    persist(
        (set) => ({
            agencyId: null,

            setAgencyId: (agencyId) => {
                set({ agencyId });
            },

            clearAgency: () => {
                set({ agencyId: null });
            },
        }),
        {
            name: "staff-agency-store",
        }
    )
);