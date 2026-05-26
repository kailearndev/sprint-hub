import { PaginationQueryDto } from './pagination-query.dto';

export function getPagination(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip,
        take: limit,
    };
}

export function createPaginationMeta(params: {
    page: number;
    limit: number;
    total: number;
}) {
    const { page, limit, total } = params;
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}
