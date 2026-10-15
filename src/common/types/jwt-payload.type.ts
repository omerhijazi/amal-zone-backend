export interface JwtPayload {
    userId: number;
    role: string;
    isSellerApproved: boolean;
}