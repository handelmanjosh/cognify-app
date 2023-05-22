import { PRIMARY_BG_COLOR } from "@/constants";

type ContainerProps = {
    color?: string;
    children: React.ReactNode;
};
export default function Container({ color, children }: ContainerProps) {
    return (
        <div
            className={`w-[50%] md:w-[25%] h-full py-2 px-4 md:py-4 md:px-8 rounded-md md:rounded-xl flex flex-col gap-1 md:gap-2 justify-center items-center`}
            style={{ backgroundColor: color ?? `${PRIMARY_BG_COLOR}` }}
        >
            {children}
        </div>
    );
}