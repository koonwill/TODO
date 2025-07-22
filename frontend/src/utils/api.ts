export const API_BASE_URL = 'http://localhost:8000';
export interface User {
    id: string;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Task {
    task_id: string;
    user_id: string;
    title: string;
    description: string;
    completed: boolean;
    due_date: string | null;
    created_at: string;
    updated_at: string;
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
            const errorDetail = (responseData as ErrorResponse).detail || 'Something went wrong';
            throw new Error(errorDetail);
        }
        return responseData as T;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

import { jwtDecode } from 'jwt-decode';

export function decodeJWT(token: string): { username?: string; user_id?: string } | null {
    try {
        return jwtDecode<{ username?: string; user_id?: string }>(token);
    } catch (e) {
        console.error('Failed to decode JWT:', e);
        return null;
    }
}
