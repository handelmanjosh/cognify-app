import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
type AuthContextData = {
    sessionId: string;
    login: (username: string, password: string) => any;
    logout: () => any;
    viewCookies: () => any;
};
type UserContextData = {
    user: any;
    profile: any;
    preferences: any;
};
type OrganizationContextData = {
    organizations: any[];
};
type DataContextData = {
    user: any;
    profile: any;
    preferences: any;
    organizations: any[];
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const UserContext = createContext<UserContextData>({} as UserContextData);
const OrganizationContext = createContext<OrganizationContextData>({} as OrganizationContextData);
const DataContext = createContext<DataContextData>({} as DataContextData);

export function useAuth() {
    return useContext(AuthContext);
}
export function useUser() {
    return useContext(UserContext);
}
export function useOrganization() {
    return useContext(OrganizationContext);
}
export function useData() {
    return useContext(DataContext);
}

export function AuthProvider({ data, children }: { data: any, children: React.ReactNode; }) {
    const router = useRouter();
    const [sessionId, setSessionId] = useState<any>("");
    useEffect(() => {
        const cookies = new Cookies();
        const sessionId = cookies.get("cogtoken");
        setSessionId(sessionId);
    }, []);
    const login = async (username: string, password: string) => {
        fetch(`/api/login`,
            {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                }),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
            }
        ).then(response => {
            if (response.status == 200) {
                response.json().then(sessionId => {
                    if (sessionId !== "") {
                        const cookies = new Cookies();
                        cookies.set("cogtoken", sessionId, { path: "/" });
                        router.push("/dashboard");
                    } else {
                        //maybe set an error state here
                    }
                    setSessionId(sessionId);
                });
            } else {
                console.error("Unsuccessful login");
            }
        });

    };

    const logout = async () => {
        // Remove the cookie and clear user data
        const cookies = new Cookies();
        // console.log("From Context: ", sessionId);
        // const sessionId2 = cookies.get("cogtoken");
        // console.log("From cookie: ", sessionId2);
        cookies.remove("cogtoken", { path: "/" });
        fetch(`/api/logout`,
            {
                method: "POST",
                body: JSON.stringify({
                    sessionId,
                }),
                headers: { "Content-Type": "application/json" },
            }
        ).then(response => {
            if (response.status == 200) {
                setSessionId("");
                window.location.href = "/";
            } else {
                alert("Failed to logout, try again later");
            }
        }).catch(err => {
            alert("Failed to logout, try again later");
        });
    };
    const viewCookies = async () => {
        const cookies = new Cookies();
        const cook = cookies.get("cogtoken");
        console.log(cook);
    };

    const value = {
        sessionId,
        login,
        logout,
        viewCookies,
    };

    return (
        <DataContext.Provider value={{ user: data.user, profile: data.profile, preferences: data.preferences, organizations: data.organizations }}>
            <OrganizationContext.Provider value={data.organizations}>
                <UserContext.Provider value={{ user: data.user, profile: data.profile, preferences: data.preferences }}>
                    <AuthContext.Provider value={value}>
                        {children}
                    </AuthContext.Provider>
                </UserContext.Provider>
            </OrganizationContext.Provider>
        </DataContext.Provider>
    );
}