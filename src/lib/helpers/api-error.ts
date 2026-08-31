export type ApiValidationErrors =
    Record<string, string[]>;

export type ApiErrorResponse = {
    success?: boolean;
    message?: string;
    data?: unknown;
    errors?: ApiValidationErrors;
};

type ErrorWithResponse = {
    response?: {
        data?: ApiErrorResponse;
    };
};

export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong."
): string {

    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {

        const response =
            error as ErrorWithResponse;


        const data =
            response.response?.data;


        if (data?.errors) {

            const validationMessage =
                Object.values(
                    data.errors
                )
                    .flat()
                    .find(
                        (message) =>
                            Boolean(message)
                    );


            if (validationMessage) {
                return validationMessage;
            }
        }


        if (data?.message) {
            return data.message;
        }
    }


    if (error instanceof Error) {
        return error.message;
    }


    return fallback;

}
