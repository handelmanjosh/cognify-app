

type WrapperProps = {
    children: React.ReactNode;
};
export default function Wrapper({ children }: WrapperProps) {
    return (
        <div className="flex flex-col w-full h-[98vh] gap-2 md:gap-4 p-2">
            {children}
        </div>
    );
}