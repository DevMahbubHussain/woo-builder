export interface AuthFormProps{
    onSuccess?: (userData: any) => void;
    redirectUrl?: string;
}

export interface AuthResponse {
    token?: string;
    user_email?: string;
    user_nicename?: string;
    user_display_name?: string;
    message?: string;
    code?: string;
}