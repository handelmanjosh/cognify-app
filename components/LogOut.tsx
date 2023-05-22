import { useRouter } from "next/router";
import BasicButton from "./BasicButton";
import { useAuth } from "./authContext";


export default function LogOut({ sessionId }: { sessionId: string; }) {
    const router = useRouter();
    const { logout } = useAuth();
    return (
        <BasicButton text="Log Out" click={logout} />
    );
};