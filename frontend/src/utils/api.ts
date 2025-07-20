// Base API URL - adjust this if your backend is running on a different address/port
export const API_BASE_URL = 'http://localhost:8000';

// --- TypeScript Type Definitions ---
export interface User {
    id: string; // UUID as string
    username: string;
    email: string;
    created_at: string; // ISO string
    updated_at: string; // ISO string
}

export interface Task {
    id: string; // UUID as string
    user_id: string; // UUID as string
    title: string;
    description: string;
    completed: boolean;
    due_date: string | null; // ISO string or null
    created_at: string; // ISO string
    updated_at: string; // ISO string
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface ErrorResponse {
    detail: string;
}

// Helper function to make API requests
export async function apiRequest<T>(
    method: string,
    path: string,
    data: object | null = null,
    token: string | null = null
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method: method,
        headers: headers,
        body: data ? JSON.stringify(data) : null,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${path}`, config);
        const responseData = await response.json();

        if (!response.ok) {
            // Handle specific HTTP errors from the backend
            const errorDetail = (responseData as ErrorResponse).detail || 'Something went wrong';
            throw new Error(errorDetail);
        }
        return responseData as T;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error; // Re-throw to be caught by the calling function
    }
}
