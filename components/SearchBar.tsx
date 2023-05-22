import { useState } from "react";
import { SUBTEXT_COLOR } from "@/constants";
import { useRouter } from "next/router";

export default function SearchBar() {
    const [text, setText] = useState("");
    const router = useRouter();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (text === "") return;
        console.log(text);
        setText("");
        //router.push("/chat/")
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    return (
        <div className={`w-full flex flex-row items-start justify-start bg-default rounded-lg md:rounded-2xl px-4 py-4 md:px-[4.5rem] md:py-[5.5rem] h-full`}>
            <div className="w-full md:w-[70%] h-full flex flex-col justify-center">
                <form onSubmit={handleSubmit}>
                    <label>
                        <div className="flex flex-col gap-1 md:gap-3 h-full">
                            <strong className="text-xl md:text-5xl"> CognifyAI </strong>
                            <p className="text-sm md:text-lg text-tertiary"> Your internal knowledge database </p>
                            <div className="flex flex-row rounded-lg md:rounded-2xl p-2 md:p-4 bg-black w-full">
                                <input
                                    type="text"
                                    value={text}
                                    onChange={handleInputChange}
                                    className={`border-none bg-transparent outline-none w-[80%] text-[${SUBTEXT_COLOR}]`}
                                    placeholder="Ask a question..."
                                />
                                <div className="flex flex-row items-center justify-end w-[20%]">
                                    <button type="submit" className=" flex flex-row justify-center items-center group bg-[#061b1e] hover:bg-[#308a8d] border-2 border-[#308a8d] rounded-full w-auto h-auto px-8 py-2">
                                        <div className=""> Enter </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </label>
                </form>
                <div className="flex flex-row items-center justify-end gap-2 md:gap-4 mt-2">
                    <strong className="md:text-base text-xs text-center"> Suggestions: </strong>
                    {/* normally these would be iterated over given server data */}
                    <Suggestion text="placeholder" />
                    <Suggestion text="placeholder2" />
                </div>
            </div>
        </div>
    );
}
type SuggestionProps = {
    text: string;
};
function Suggestion({ text }: SuggestionProps) {
    return (
        <div className="border-2 border-tertiary hover:bg-tertiary group rounded-md md:rounded-xl px-1 md:px-2 hover:cursor-pointer">
            <p className="text-tertiary group-hover:text-white md:text-base text-xs">
                {text}
            </p>
        </div>
    );
}