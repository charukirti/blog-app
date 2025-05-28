// auth slice types

export interface User {
    $id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    isAuhenticated: boolean;
    isLoading: boolean;
}

