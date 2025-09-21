export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export function toSafeError(e: unknown) {
    if (e instanceof ApiError) {
        return { status: e.status, message: e.message };
    }
    return { status: 500, message: "Internal server error" };
}