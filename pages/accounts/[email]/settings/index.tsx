import NavBar from "@/components/NavBar";
import Wrapper from "@/components/Wrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/components/authContext";


type SelectType = "toggle" | "text";
type Setting = {
    text: string;
    type: SelectType;
    onChange: (event?: any) => any;
};
const settings: Setting[] =
    [
        { text: "test1", type: "toggle", onChange: () => null },
        { text: "test2", type: "text", onChange: () => null },
    ];
export default function UserSettings() {
    const { user } = useUser();
    const router = useRouter();
    const [text, setText] = useState<string>("");
    const [toggled, setToggled] = useState<boolean>(false);
    //userSettings will be used to read current user settings into and then write to based upon user input
    const [userSettings, setUserSettings] = useState<any>({});
    useEffect(() => {
        if (!user) router.push("/");
        const { email } = router.query;
        if (email !== user.email) router.push("/");
        const functions: ((event?: any) => any)[] =
            [
                () => {
                    setToggled(!toggled);
                    console.log(toggled);
                },
                (event: React.ChangeEvent<HTMLInputElement>) => {
                    setText(event.target.value);
                    console.log(text);
                }
            ];
        if (functions.length != settings.length) console.error("Some settings have undefined functions");
        for (let i = 0; i < functions.length; i++) {
            const f = functions[i];
            settings[i].onChange = f;
        }
    }, []);
    return (
        <>
            <Wrapper>
                <div className="flex flex-col justify-center items-center gap-12 md:gap-24 w-full h-full">
                    <NavBar user={user} />
                    <div className="flex flex-col w-[90%] md:w-[50%] h-full gap-4 justify-start items-center">
                        {settings.map((setting, i) => (
                            <SettingsRow key={i} text={setting.text} type={setting.type} onChange={setting.onChange} />
                        ))}
                    </div>
                </div>
            </Wrapper>
        </>

    );
}

function SettingsRow({ text, type, onChange }: Setting) {
    return (
        <div className="flex flex-row justify-center items-center w-full">
            <div className="flex flex-row justify-start items-center w-[75%]">
                <p className="text-xl text-center"> {text} </p>
            </div>
            <div className="flex flex-row justify-end items-center w-[25%]">
                {type == "toggle" ?
                    <Toggle onChange={onChange} />
                    :
                    <Text onChange={onChange} />
                }
            </div>
        </div>
    );
}

type SettingsChanger = {
    onChange: (event?: any) => any;
};
function Toggle({ onChange }: SettingsChanger) {
    const [toggled, setToggled] = useState<boolean>(false);
    useEffect(() => {
        onChange();
    }, [toggled]);
    return (
        <div
            className={`flex flex-row items-center border transition-all ${toggled ? "justify-end border-red-600" : "justify-start border-green-600"} rounded-full w-16 h-auto`}
            onClick={() => setToggled(!toggled)}
        >
            <div className={`rounded-full w-8 h-8 ${toggled ? "bg-red-600" : "bg-green-600"}`}></div>
        </div>
    );
}
function Text({ onChange }: SettingsChanger) {
    return (
        <input
            className="bg-black border-tertiary border-2 w-full rounded-md p-1 md:p-2"
            type="text"
            onChange={onChange}
        />
    );
}
