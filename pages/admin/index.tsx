import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/components/authContext";


let adminForm: AdminFormProps[] = [];
const userData = { username: "", password: "", code: "", reset: () => { userData.username = ""; userData.password = ""; userData.code = ""; } };
const orgData = { orgName: "", orgUser: "", reset: () => { orgData.orgName = ""; orgData.orgUser = ""; } };
const adminData = { username: "", password: "", reset: () => { adminData.username = ""; adminData.password = ""; } };
const addUserData = { username: "", organization: "", reset: () => { addUserData.username = ""; addUserData.organization = ""; } };
const getFileData = { name: "" };
const Admin = () => {
    const router = useRouter();
    const { user, profile, preferences } = useUser();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    useEffect(() => {
        console.log({ user, preferences, profile });
        //if (!user || user.role !== "ADMIN") router.push("/");
        adminForm = [
            {
                inputProps: [
                    { type: "text", placeholder: "username", change: (event: React.ChangeEvent<HTMLInputElement>) => userData.username = event.target.value },
                    { type: "text", placeholder: "password", change: (event: React.ChangeEvent<HTMLInputElement>) => userData.password = event.target.value },
                    { type: "text", placeholder: "code", change: (event: React.ChangeEvent<HTMLInputElement>) => userData.code = event.target.value }
                ],
                submitText: "Create User",
                submit: addUser
            },
            {
                inputProps: [
                    { type: "text", placeholder: "Org name", change: (event: React.ChangeEvent<HTMLInputElement>) => orgData.orgName = event.target.value },
                    { type: "text", placeholder: "Org admin", change: (event: React.ChangeEvent<HTMLInputElement>) => orgData.orgUser = event.target.value }
                ],
                submitText: "Create Organization",
                submit: addOrganization,
            },
            {
                inputProps: [
                    { type: "text", placeholder: "username", change: (event: React.ChangeEvent<HTMLInputElement>) => adminData.username = event.target.value },
                    { type: "text", placeholder: "password", change: (event: React.ChangeEvent<HTMLInputElement>) => adminData.password = event.target.value },
                ],
                submitText: "Create Admin",
                submit: addAdmin,
            },
            {
                inputProps: [
                    { type: "text", placeholder: "username", change: (event: React.ChangeEvent<HTMLInputElement>) => addUserData.username = event.target.value },
                    { type: "text", placeholder: "organization", change: (event: React.ChangeEvent<HTMLInputElement>) => addUserData.organization = event.target.value },
                ],
                submitText: "Add user to organization",
                submit: addUserToOrganization,
            },
        ];
        setLoaded(true);
    }, []);
    const addUserToOrganization = async () => {
        const { username, organization } = addUserData;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/organizations`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username,
                        organization,
                    }),
                });
            console.log(response.status);
        } catch (e) {
            console.error(e);
        }
    };
    const addAdmin = async () => {
        const { username, password } = adminData;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username,
                        password,
                        sessionId: user?.sessionId ?? null,
                    })
                }
            );
            console.log(response.status);
        } catch (e) {
            console.error(e);
        }

    };
    const addUser = async () => {
        const { username, password, code } = userData;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                });
            console.log(response.status);
            console.log(await response.json());
        } catch (e) {
            console.error(e);
        }
    };
    const addOrganization = async () => {
        const { orgName } = orgData;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/organizations`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: orgName,
                        sessionId: user.sessionId,
                    })
                }
            );
            console.log(response.status);
        } catch (e) {
            console.error(e);
        }
    };
    const makeQuery = async () => {
        const sql = query;
        console.log({ sql });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/run`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sql,
                    })
                }
            );
            console.log(response.status);
            try {
                console.log(await response.json());
            } catch (e) {

            }
        } catch (e) {
            console.error(e);
        } finally {
            setQuery("");
        }
    };
    return (
        <div className="flex flex-col gap-6 justify-center items-center">
            <p className="text-7xl mb-4"> Cognify admin page </p>
            {loaded ?
                <div className="flex flex-col gap-8 justify-center items-center">
                    {adminForm.map((data, i) => (
                        <AdminForm key={i} inputProps={data.inputProps} submitText={data.submitText} submit={data.submit} />
                    ))}
                </div>
                :
                <></>
            }
            <p>Shitty fucking command line terminal</p>
            <div className="flex flex-col justify-center items-center gap-2">
                <textarea
                    className="bg-black border border-white rounded-md p-4 w-[600px] h-[300px]"
                    value={query}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(event.target.value)}
                />
                <button className="bg-red-600 hover:scale-105 transition-all duration-300 rounded-lg p-4" onClick={makeQuery}>Make Query</button>
            </div>
        </div>
    );
};

export default Admin;

type AdminButtonProps = {
    text: string;
    click: () => any;
};
function AdminButton({ text, click }: AdminButtonProps) {
    return (
        <button
            onClick={click}
            className="w-auto flex justify-center items-center rounded-md hover:scale-105 transition-all h-4 p-4 bg-blue-600 text-white"
        >
            {text}
        </button>
    );
}

type AdminFormProps = {
    inputProps: InputProps[];
    submitText: string;
    submit: () => any;
};
function AdminForm({ inputProps, submitText, submit }: AdminFormProps) {
    return (
        <form
            className="flex flex-row justify-center items-center gap-2 border border-white rounded-md p-4"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                submit();
            }}
        >
            {inputProps.map((input, i) => (
                <Input key={i} type={input.type} placeholder={input.placeholder} change={input.change} />
            ))}
            <button type="submit" className="bg-blue-600 w-auto flex justify-center items-center rounded-md transition-all p-4 hover:scale-105">
                {submitText}
            </button>
        </form>
    );
}
type InputProps = {
    type: string;
    placeholder: string;
    change: (e?: any) => any;
};
function Input({ type, placeholder, change }: InputProps) {
    return (
        <input
            className=" bg-black p-2 border-white border rounded-md"
            type={type}
            onChange={change}
            placeholder={placeholder}
            required
        />
    );
}   