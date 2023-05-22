import { useRouter } from "next/router";

type BackBarProps = {
    target: string;
    height: string;
};
export default function BackBar({ target, height }: BackBarProps) {
    const router = useRouter();
    return (
        <>
            <div className={`flex flex-row justify-start items-center w-full ${height}`}>
                <p
                    className="flex flex-row justify-start items-center hover:cursor-pointer hover:font-black"
                    onClick={() => { router.push(target); }}
                >
                    {"\u2190"}
                </p>
            </div>
        </>
    );
}