"use client";

import type { AuthUser, LoginRequest, LogoutRequest, RegisterRequest } from "@repo/shared-types";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    getMyProfile,
    loginCustomer,
    logoutCustomer,
    registerCustomer,
} from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";

type RegisterCustomerPayload = Omit<RegisterRequest, "role">;

type AuthContextValue = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (payload: LoginRequest) => Promise<void>;
    register: (payload: RegisterCustomerPayload) => Promise<void>;
    logout: (payload?: LogoutRequest) => Promise<void>;
    refreshProfile: () => Promise<AuthUser | null>;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function resolveCurrentUser(): Promise<AuthUser | null> {
    try {
        return await getMyProfile();
    } catch (error) {
        if (isApiRequestError(error) && error.statusCode === 401) {
            return null;
        }

        throw error;
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        let isActive = true;

        const initializeAuthState = async () => {
            try {
                const profile = await resolveCurrentUser();
                if (isActive) {
                    setUser(profile);
                }
            } catch {
                if (isActive) {
                    setUser(null);
                }
            } finally {
                if (isActive) {
                    setIsInitializing(false);
                }
            }
        };

        void initializeAuthState();

        return () => {
            isActive = false;
        };
    }, []);

    const refreshProfile = useCallback(async () => {
        const profile = await resolveCurrentUser();
        setUser(profile);
        return profile;
    }, []);

    const login = useCallback(async (payload: LoginRequest) => {
        const response = await loginCustomer(payload);
        setUser(response.user);
    }, []);

    const register = useCallback(async (payload: RegisterCustomerPayload) => {
        await registerCustomer(payload);
        setUser(null);
    }, []);

    const logout = useCallback(async (payload?: LogoutRequest) => {
        await logoutCustomer(payload);
        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            isInitializing,
            login,
            register,
            logout,
            refreshProfile,
        }),
        [isInitializing, login, logout, refreshProfile, register, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
