import { useAuth, useUser } from "@/components/authContext";
import { useRouter } from "next/router";
import { useState } from "react";


const Create = () => {
    const [name, setName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const router = useRouter();
    const { user } = useUser();
    const create = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/create`,
            {
                method: "POST",
                body: JSON.stringify({
                    sessionId: user.sessionId,
                    name,
                }),
                headers: { "Content-Type": "application/json" }
            }
        )
            .then(response => {
                if (response.status == 200) {
                    router.push("/");
                } else {
                    setErrorMessage("Error creating organization");
                }
            })
            .catch(err => console.error(err));
    };
    return (
        <div className="flex flex-col justify-start items-center w-full h-[100vh]">
            <div className="flex flex-col justify-center items-center h-[60%]">
                <form className="w-auto max-w-[90%] h-auto p-20 rounded-lg flex flex-col gap-10 justify-center items-center bg-gradient-to-br from-primary via-black to-black" onSubmit={create}>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="flex flex-row justify-start items-center w-full">
                            <p className="text-center align-middle text-lg">Organization name: </p>
                        </div>
                        <input
                            type="text"
                            className="outline-none p-4 bg-black border border-white w-56 focus:border-2 rounded-xl"
                            value={name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                            placeholder="Enter organization name"
                            required
                        />
                        {errorMessage !== "" ?
                            <div className="flex flex-row justify-start items-center w-full">
                                <p className="text-red-600 text-center align-middle text-sm"> {errorMessage} </p>
                            </div>
                            :
                            <></>
                        }
                    </div>
                    <button type="submit" className="bg-primary px-8 py-4 rounded-xl"> Create </button>
                </form>
            </div>
        </div>
    );
};

export default Create;