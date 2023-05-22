import Link from "next/link";
import DateBlock from "../DateBlock";
import Hamburger from "../Hamburger";

type ChatNavBarProps = {
    user: any;
    onClick: () => any;
};
export default function ChatNavBar({ user, onClick }: ChatNavBarProps) {
    return (
        <div className="flex flex-row justify-between items-center w-full h-auto border-b-2 border-black p-2">
            <div className="flex flex-row items-center gap-4 justify-center">
                <Hamburger onClick={onClick} classes="w-6 h-6 hover:scale-105 md:hidden" />
                <Link href="/">
                    <img
                        src="/cognify-logo.png"
                        alt="logo"
                        className="w-5 h-5"
                    />
                </Link>
            </div>
            <DateBlock user={user} />
        </div>
    );
}