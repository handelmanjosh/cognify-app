import { useState } from "react";
import { PencilSquare, X } from "./Icons";

export type EditableStatProps = {
    data: string;
    defaultData: string;
    large?: boolean;
    change: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => any;
    reset: () => any;
    setDefault: () => any;
};
export default function EditableStat({ data, defaultData, large, change, reset, setDefault }: EditableStatProps) {
    const [active, setActive] = useState<boolean>(false);
    return (
        <div className={`flex flex-row justify-center ${large ? "items-start" : "items-center"} w-full h-full gap-2`}>
            {active ?
                <>
                    {large ?
                        <textarea
                            value={data}
                            className="bg-black rounded-lg border focus:border-2 resize-none border-white p-2 outline-none w-[90%] h-full"
                            onChange={change}
                        />
                        :
                        <input
                            value={data}
                            className="bg-black rounded-lg border focus:border-2  border-white w-[90%] outline-none p-1"
                            onChange={change}
                        />
                    }
                    <div
                        className={`"w-6 h-6 hover:cursor-pointer hover:scale-105 transition-all duration-100 ${large ? "translate-y-[3px]" : ""}`}
                        onClick={() => {
                            setActive(false);
                            if (data === "") {
                                setDefault();
                            }
                        }}
                    >
                        <X width="w-5" height="h-5" />
                    </div>
                </>
                :
                <>
                    <p className={`text-base align-center w-[90%] p-1 ${data === defaultData ? "italic" : ""}`}>{data}</p>
                    <div className={`w-6 h-6 hover:cursor-pointer hover:scale-105 transition-all duration-100 ${large ? "translate-y-[3px]" : ""}`} onClick={() => { reset(); setActive(true); }}>
                        <PencilSquare width="w-5" height="h-5" />
                    </div>
                </>
            }
        </div>
    );
}

