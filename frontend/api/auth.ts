import { BASE_URL } from './api';

export interface OtpResponse {
    success: boolean;
    message: string;
    devMode?: boolean;
}

export interface VerifyOtpResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: number;
        phone: string;
        role?: string;
        name?: string;
    };
}

export const sendOtp = async (phone: string): Promise<OtpResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });

        const data = await response.json();
        return {
            ...data,
            success: response.ok
        };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, message: 'Failed to connect to server' };
    }
};

export const verifyOtp = async (phone: string, otp: string): Promise<VerifyOtpResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, otp })
        });

        const data = await response.json();
        return {
            ...data,
            success: response.ok
        };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: 'Failed to connect to server' };
    }
};
