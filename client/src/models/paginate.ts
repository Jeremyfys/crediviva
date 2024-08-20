export interface Paginate<T> {
    data: T[],
    limit: number,
    page: number,
    total: number,
}