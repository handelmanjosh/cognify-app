


export default function SiteWrapper({ children }: { children: React.ReactNode; }) {
    return (
        <div className="relative bg-slate-800 flex w-full h-auto">
            {children}
        </div>
    );
}