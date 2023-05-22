import { useEffect } from "react";
import { useAuth, useData } from "@/components/authContext";




export default function Test() {
    const { user, profile, preferences, organizations } = useData();
    const { logout, viewCookies, login } = useAuth();
    useEffect(() => {
        console.log({ user, profile, preferences, organizations });
    });
    const printUser = () => {
        console.log(user);
    };
    return (
        <div className="flex flex-row gap-2 w-full justify-center items-center">
            <button onClick={() => login("", "")} className="p-4 bg-blue-600">Login</button>
            <button onClick={viewCookies} className="p-4 bg-blue-600">View</button>
            <button onClick={logout} className="p-4 bg-blue-600">Logout</button>
            <button onClick={printUser} className="p-4 bg-blue-600">print user</button>
        </div>
    );
}