export type PaginationRequest = {
    pageNumber: number;
    pageSize: number;
    search?: string;
};


export type PagedResponse<T> = {
    pageNumber: number;
    pageSize: number;
    totalNumber: number;
    items: T[];
};


export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};