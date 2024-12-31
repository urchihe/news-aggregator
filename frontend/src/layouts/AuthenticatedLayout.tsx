import React, { useMemo, ReactNode, useContext, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetUserQuery, useSetPreferenceMutation } from "../features/auth/authApi";
import { RootState } from "../app/store";
import { setUser, setPrefs } from "../features/auth/authSlice";

interface User {
    id: number;
    name: string;
    email: string;
    prefs: { pref_key: string; pref_value: string }[];
}

interface UserContextType {
    currentUser?: User;
    refetchUser: () => void;
    prefs: Record<string, string>;
    setPreference: (key: string, value: string) => void;
}

const defaultPrefs = Object.freeze({
    colorScheme: "light",
    accentColor: "red",
});

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within an AuthenticatedLayout");
    }
    return context;
};

interface AuthenticatedLayoutProps {
    children: ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const prefs = useSelector((state: RootState) => state.auth.prefs);

    const { data: userData, refetch: refetchUser } = useGetUserQuery(undefined, {
        skip: !!currentUser, // Skip query if user already exists in the Redux state
        onSuccess: (data) => {
            dispatch(setUser(data));
            const userPrefs = Object.fromEntries(data.prefs.map((p) => [p.pref_key, p.pref_value]));
            dispatch(setPrefs({ ...defaultPrefs, ...userPrefs }));
        },
    });

    const [setPreferenceApi] = useSetPreferenceMutation();

    const setPreference = (key: string, value: string) => {
        setPreferenceApi({ key, value })
            .unwrap()
            .then(() => {
                dispatch(setPrefs({ ...prefs, [key]: value }));
                refetchUser();
            })
            .catch((error) => {
                console.error("Error setting preference:", error);
            });
    };

    const contextValue = useMemo(
        () => ({
            currentUser: currentUser || userData,
            refetchUser,
            prefs: prefs || defaultPrefs,
            setPreference,
        }),
        [currentUser, userData, prefs, refetchUser, setPreference]
    );

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export default AuthenticatedLayout;
