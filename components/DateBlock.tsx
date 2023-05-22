import { useRouter } from "next/router";
import BasicButton from "./BasicButton";
import { useAuth } from "./authContext";
import { useEffect, useState } from "react";

type DateBlockProps = {
    user: any;
};
let ran: boolean = false;
export default function DateBlock({ user }: DateBlockProps) {
    const { logout } = useAuth();
    const [date, setDate] = useState<string>("");
    const [interval, set] = useState<any>(null);
    const router = useRouter();
    const logIn = () => {
        router.push("/login", undefined, { shallow: false });
    };
    useEffect(() => {
        if (ran) return;
        const date = dateProcessor(Date());
        setDate(date);
        const interval = setInterval(updateDate, 10000);
        set(interval);
        ran = true;
    }, []);
    const updateDate = () => {
        try {
            const date = dateProcessor(Date());
            setDate(date);
        } catch (e) {
            clearInterval(interval);
        }
    };
    const dateProcessor = (d: string): string => {
        let basic_date = d.trim().slice(4, 11);
        let time = d.trim().slice(16, 21);
        let hour = time.slice(0, 2);
        let minute = time.slice(3, 5);
        if (Number(hour) > 12) {
            return `${basic_date} ${padWithZeros(Number(hour) - 12)}:${minute} PM `;
        } else {
            return `${basic_date} ${hour}:${minute} AM`;
        }
    };
    const padWithZeros = (n: number): string => {
        if (n > 9) {
            return String(n);
        } else {
            return "0" + String(n);
        }
    };
    return (
        <div className="flex flex-row items-center gap-4 justify-center">
            {user ?
                <>
                    <div className="flex flex-col justify-center items-start gap-1 text-base">
                        <p className="lg:text-base md:text-sm text-xs">
                            {"Welcome "}
                            <a href={`/accounts/${user.email}`} className="font-extrabold hover:underline">
                                {user.email ?? "user"}
                            </a>
                        </p>
                        <p className="lg:text-base md:text-sm text-xs"> {date} </p>
                    </div>
                    <BasicButton text="Log Out" click={logout} />
                </>
                :
                <BasicButton text="Log In" click={logIn} />
            }
        </div>
    );
}