import { StudentDto } from "./studentDto";

export interface PaymentOrder {
    orderId: string;
    amount: number;
    razorpayKey: string;
    currency: string;
    student: StudentDto;
}

export interface Coupon {
    code: string;
    discount: number;
}

export interface CouponResponse {
    coupon: Coupon | null;
    success: boolean;
    message: string;
}