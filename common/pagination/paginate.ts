import { PaginationQueryDto } from "./pagination-query.dto";

export async function paginate(
    model: any,
    query: PaginationQueryDto,
    options?: {
        where?: any;
        select?: any;
    },
) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        model.findMany({
            where: options?.where,
            select: options?.select,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: order,
            },
        }),
        model.count({
            where: options?.where,
        }),
    ]);

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}