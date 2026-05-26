export interface CreateIncidentDto {
    title: string;
    description?: string;
    rawLogs: string;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
