type ApiErrorResponse = {
    success?: boolean;
    message?: string;
    data?: unknown;
    errors?: Record<string, string[]>;
};

type AxiosLikeError = {
    response?: {
        data?: ApiErrorResponse;
    };
    message?: string;
};

export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong."
): string {

    /*
     * Axios/API response
     */
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {

        const apiError =
            error as AxiosLikeError;

        const data =
            apiError.response?.data;


        /*
         * Validation errors
         *
         * Example:
         *
         * {
         *   success: false,
         *   message: "Validation failed.",
         *   errors: {
         *     WorkerId: [
         *       "Worker is already assigned to this shift role."
         *     ]
         *   }
         * }
         */
        if (data?.errors) {

            const firstError =
                Object.values(data.errors)
                    .flat()
                    .find(
                        (message) =>
                            !!message
                    );

            if (firstError) {
                return firstError;
            }
        }


        /*
         * NotFound and other API errors
         *
         * Example:
         *
         * {
         *   success: false,
         *   message: "Booking not found."
         * }
         */
        if (data?.message) {
            return data.message;
        }
    }


    /*
     * Normal JavaScript / Axios error
     */
    if (
        error instanceof Error &&
        error.message
    ) {
        return error.message;
    }


    /*
     * Unknown error
     */
    return fallback;
}
