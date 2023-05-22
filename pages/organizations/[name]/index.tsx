import { Check, DoubleUp, X } from "@/components/Icons";
import { useAuth, useOrganization, useUser } from "@/components/authContext";
import MainUserImage from "@/components/profile-props/MainProfile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const OrganizationPage = () => {
    const router = useRouter();
    const [inOrg, setInOrg] = useState<boolean>(true);
    const [orgCode, setOrgCode] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
    const [orgList, setOrgList] = useState<any[]>([]);
    const [potential, setPotential] = useState<string[]>([]);
    const [admins, setAdmins] = useState<string[]>([]);
    const [members, setMembers] = useState<string[]>([]);
    const { user } = useUser();
    const { organizations } = useOrganization();
    useEffect(() => {
        const { name } = router.query;

        if (!organizations) {
            setInOrg(false);
        } else {
            let found = false;
            let index = 0;
            for (const organization of organizations) {
                if (organization.name == name) {
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/get`,
                        {
                            method: "POST",
                            body: JSON.stringify({
                                target: "OrganizationUsers",
                                sessionId: user.sessionId,
                                organizationId: organization.id
                            }),
                            headers: { "Content-Type": "application/json" }
                        }
                    )
                        .then(response => response.json())
                        .then(json => {
                            setAdmins(json.admins);
                            setMembers(json.members);
                            setPotential(json.potential);
                            setMembers(["billy", "bobby", "joey", "bill", "rob", "robert", "Maximus Dominus Alexander, King of Gaul"]);
                            setPotential(["Jeffrey", "jimmy", "jessica"]);
                        })
                        .catch(err => console.error(err));
                    found = true;
                    break;
                }
                index++;
            }
            if (!found) {
                router.push("/");
            }
            setInOrg(true);
            setSelectedOrg(organizations[index]);
            setOrgList(organizations);
        }
    }, []);
    const joinOrg = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (orgCode.length > 8) {
            setErrorMessage("Organization codes should be 8 characters");
            setOrgCode("");
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/join`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        sessionId: user.sessionId,
                        code: orgCode
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            );
            console.log(response.status);
            if (response.status == 200) {
                router.push("/");
            } else {
                setErrorMessage("Error finding organization");
            }
        }
    };
    const acceptPotential = (email: string) => {
        const copyPotential = [...potential];
        copyPotential.splice(copyPotential.indexOf(email), 1);
        const copyMembers = [...members];
        copyMembers.push(email);
        setPotential(copyPotential);
        setMembers(copyMembers);
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/update`,
            {
                method: "POST",
                body: JSON.stringify({
                    targets: ["AcceptPotential"],
                    sessionId: user.sessionId,
                    orgId: selectedOrg?.id,
                    email,
                }),
                headers: { "Content-Type": "application/json" }
            }
        )
            .then(response => console.log(response.status))
            .catch(err => console.error(err));
    };
    const promoteMember = (email: string) => {
        const copyMembers = [...members];
        copyMembers.splice(copyMembers.indexOf(email), 1);
        const copyAdmins = [...admins];
        copyAdmins.push(email);
        setMembers(copyMembers);
        setAdmins(copyAdmins);
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/update`,
            {
                method: "POST",
                body: JSON.stringify({
                    targets: ["PromoteMember"],
                    sessionId: user.sessionId,
                    orgId: selectedOrg?.id,
                    email,
                }),
                headers: { "Content-Type": "application/json" }
            }
        )
            .then(response => console.log(response.status))
            .catch(err => console.error(err));
    };
    const deleteMember = (email: string) => {
        const copyMembers = [...members];
        copyMembers.splice(copyMembers.indexOf(email), 1);
        setMembers(copyMembers);
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/update`,
            {
                method: "POST",
                body: JSON.stringify({
                    targets: ["RemoveMember"],
                    sessionId: user.sessionId,
                    orgId: selectedOrg?.id,
                    email,
                }),
                headers: { "Content-Type": "application/json" }
            }
        )
            .then(response => console.log(response.status))
            .catch(err => console.error(err));
    };
    const deletePotential = (email: string) => {
        const copyPotential = [...potential];
        copyPotential.splice(copyPotential.indexOf(email), 1);
        setPotential(copyPotential);
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/update`,
            {
                method: "POST",
                body: JSON.stringify({
                    targets: ["DeletePotential"],
                    sessionId: user.sessionId,
                    orgId: selectedOrg?.id,
                    email,
                }),
                headers: { "Content-Type": "application/json" }
            }
        )
            .then(response => console.log(response.status))
            .catch(err => console.error(err));
    };
    return (
        <div className="flex flex-col justify-start items-center h-[100vh] w-full">
            {!inOrg ?
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <div className="flex flex-col justify-between items-center w-full h-[30%]">
                        <p className="text-center align-middle text-xl">{"You aren't in an organization!"}</p>
                        <div className="flex flex-col justify-center gap-4 items-start">
                            <form className="flex flex-row justify-center items-center gap-5" onSubmit={joinOrg}>
                                <input
                                    type="text"
                                    className="p-4 border border-white focus:border-2 bg-black rounded-lg "
                                    value={orgCode}
                                    placeholder="Enter organization code"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOrgCode(event.target.value)}
                                    required
                                />
                                <button type="submit" className="rounded-xl bg-primary py-4 px-8"> Join </button>
                            </form>
                            {errorMessage !== "" ?
                                <p className="text-sm align-middle text-center text-red-600">{errorMessage}</p>
                                :
                                <></>
                            }
                        </div>
                    </div>
                </div>
                :
                <div className="flex flex-col justify-center items-center w-full h-full">
                    {selectedOrg ?
                        <div className="flex flex-col justify-start items-center w-full h-full">
                            <div className="flex flex-row justify-start items-center w-full  h-[5%]">
                                {orgList.map((org, i) => (
                                    <>
                                        {org.name == selectedOrg.name ?
                                            <p className={`p-4 underline font-black rounded-lg text-xl hover:cursor-default`} key={i}>{org.name}</p>
                                            :
                                            <a className={`p-4 hover:underline hover:font-bold rounded-lg text-xl ${org.name == selectedOrg.name ? "font-bold" : ""}`} href={`/organizations/${org.name}`} key={i}>{org.name}</a>
                                        }
                                    </>
                                ))}
                            </div>
                            <div className="flex flex-row justify-center items-start w-full h-[90%]">
                                <div className="flex flex-col gap-2 justify-start items-center w-[10%]">
                                    <MainUserImage src="not set yet" />
                                    <p className="text-2xl text-center align-middle">{selectedOrg.name}</p>
                                    <p className="text-3xl text-center align-middle">{selectedOrg.code}</p>
                                </div>
                                <div className="flex flex-col justify-start gap-6 items-center w-[90%] h-full">
                                    <div className="flex flex-row justify-center items-start gap-6 w-[90%] h-[70%]">
                                        <UserColumn
                                            title="Admins"
                                            comparison={user.email}
                                            users={admins}
                                            upgrade={(s: string) => s}
                                            downgrade={(s: string) => s}
                                        />
                                        <UserColumn
                                            title="Members"
                                            comparison={user.email}
                                            users={members}
                                            upgrade={promoteMember}
                                            downgrade={deleteMember}
                                        />
                                        <UserColumn
                                            title="Potential Users"
                                            comparison={user.email}
                                            users={potential}
                                            upgrade={acceptPotential}
                                            downgrade={deletePotential}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center items-center w-[85%] h-10 p-6 rounded-2xl bg-slate-800 shadow-xl hover:shadow-none shadow-slate-700">
                                        <div className="flex flex-row w-full justify-start items-center h-auto">
                                            <p className="text-3xl text-center align-middle">Files</p>
                                        </div>
                                        <div className="flex flex-col justify-start items-center">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <></>
                    }
                </div>

            }
        </div >
    );
};

export default OrganizationPage;

type UserColumnProps = {
    title: string;
    comparison: string;
    users: string[];
    upgrade: (s: string) => any;
    downgrade: (s: string) => any;
};
function UserColumn({ users, comparison, title, upgrade, downgrade }: UserColumnProps) {
    const genFunction = (s: string, f: (s: string) => any): (() => any) => {
        return () => f(s);
    };
    return (
        <div className="flex flex-col justify-start items-center p-6 gap-2 w-[30%] h-full rounded-2xl bg-slate-800 shadow-xl hover:shadow-none shadow-slate-700">
            <p className="text-3xl">{title}</p>
            <div className="flex flex-col justify-start items-center gap-4 w-full h-full pt-4 overflow-x-visible overflow-y-auto">
                {users.map((user, i) => (
                    <UserRow
                        user={user}
                        key={i}
                        comparison={title == "Admins" ? user : comparison}
                        check={title == "Admins" ? false : true}
                        arrow={title == "Members" ? true : false}
                        upgrade={genFunction(user, upgrade)}
                        downgrade={genFunction(user, downgrade)}
                    />
                ))}
            </div>
        </div>
    );
}
type UserRowProps = {
    arrow: boolean;
    check: boolean;
    comparison: string;
    user: string;
    upgrade: () => any;
    downgrade: () => any;
};
function UserRow({ user, comparison, check, arrow, upgrade, downgrade }: UserRowProps) {
    return (
        <div className="flex flex-row justify-between items-center w-full rounded-full bg-black p-4 hover:bg-primary hover:shadow-primary hover:shadow-lg hover:-translate-y-2 transition-all duration-200">
            {user == comparison ?
                <p>{user}</p>
                :
                <>
                    <p>{user}</p>
                    <div className="flex flex-row justify-end items-center gap-2">
                        {check ?
                            <div className="w-auto h-auto p-1 rounded-full hover:bg-green-600 hover:cursor-pointer" onClick={upgrade}>
                                {arrow ?
                                    <DoubleUp width="w-6" height="h-6" />
                                    :
                                    <Check width="w-6" height="h-6" />
                                }
                            </div>
                            :
                            <></>
                        }
                        <div className="w-auto h-auto p-1 rounded-full hover:bg-red-600 hover:cursor-pointer" onClick={downgrade}>
                            <X width="w-6" height="h-6" />
                        </div>
                    </div>
                </>
            }
        </div>
    );
};