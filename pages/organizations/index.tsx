import LogOut from "@/components/LogOut";
import { useAuth, useData } from "@/components/authContext";
import { Key } from "react";


const Organizations = () => {
    const { user, organizations } = useData();
    return (
        <div className="flex flex-col justify-start items-center w-full h-[95vh]">
            <div className="flex flex-row justify-end items-center gap-6 w-full h-[5%]">
                <a className="hover:underline hover:font-bold" href={`/accounts/${user.email ?? ""}`}>My Account</a>
                <LogOut sessionId={user.sessionId ?? ""} />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-[90%]">
                {organizations.map((organization: any, i: any) => (
                    <OrgCard name={organization.name} key={i} />
                ))}
            </div>
        </div>
    );
};
type OrgCardProps = {
    name: string;
};
function OrgCard({ name }: OrgCardProps) {
    return (
        <a
            className="flex flex-row justify-center items-center w-auto h-auto py-10 px-20 bg-slate-800 rounded-xl hover:scale-125 transition-all duration-200"
            href={`/organizations/${name}`}
        >
            <p className="text-4xl text-center align-middle">{name}</p>
        </a>
    );
}
export default Organizations;