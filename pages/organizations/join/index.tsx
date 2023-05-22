import { useUser } from "@/components/authContext";
import { useRouter } from "next/router";
import { useState } from "react";


const Join = () => {
    const [orgCode, setOrgCode] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { user } = useUser();
    const router = useRouter();
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

    return (
        <div className="flex flex-col justify-center items-center w-full h-[100vh]">
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
        </div>
    );
};
export default Join;