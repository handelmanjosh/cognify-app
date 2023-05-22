import { useEffect, useState } from 'react';
import BasicButton from './BasicButton';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from './authContext';
type NavBarProps = {
    user: any;
};
export default function NavBar({ user }: NavBarProps) {
    const router = useRouter();
    const [date, setDate] = useState<string>("");
    const [interval, set] = useState<any>(null);
    const { logout } = useAuth();
    const logIn = () => {
        router.push("/login"); //redirect user to login page
    };
    useEffect(() => {
        const date = dateProcessor(Date());
        setDate(date);
        const interval = setInterval(updateDate, 10000);
        set(interval);
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
        <div className="flex flex-row justify-between mt-1 items-center w-full h-[5%]">
            <div className="flex flex-row items-center gap-4 justify-start">
                <Link href="/">
                    <img
                        src="/cognify-logo.png"
                        alt="logo"
                        className="w-5 h-5"
                    />
                </Link>
            </div>
            <div className="flex flex-row items-center gap-4 justify-end">
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
        </div>
    );
}
