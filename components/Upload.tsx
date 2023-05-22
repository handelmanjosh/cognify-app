import { BG_COLOR_3, SUBTEXT_COLOR } from "@/constants";
import Container from "./metrics-props/Container";
import ItemTitle from "./metrics-props/ItemTitle";
import { useRef, useState } from "react";

export default function Upload({ user, orgId }: { user: any; orgId: string; }) {
    const [isError, setError] = useState<boolean>(false);
    const inputFile = useRef<HTMLInputElement | null>(null);
    const upload = () => {
        inputFile.current?.click();
    };
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files as FileList;
        let sizeInBytes = 0;
        for (let i = 0; i < files?.length; i++) {
            sizeInBytes += files[i].size;
        }
        const sizeInMb = sizeInBytes / (1024 * 1024);
        if (sizeInMb > 25) {
            setError(true);
        } else {
            const form = new FormData();
            form.append("sessionId", user.sessionId!);
            form.append("orgId", orgId);
            for (let i = 0; i < files.length; i++) {
                form.append("files", files[i]);
            }
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads`,
                {
                    method: "POST",
                    body: form
                }
            )
                .then(response => response.json())
                .then(json => console.log(json))
                .catch(err => console.error(err));
        }
    };
    return (
        <Container color={`${BG_COLOR_3}`}>
            <ItemTitle text="Upload" />
            <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
                <div className="h-[80%] flex justify-center items-center w-full">
                    <button
                        className={`border-2 border-dotted rounded-lg md:rounded-xl button-bounce-smaller-animate border-[${SUBTEXT_COLOR}] h-[60%] w-[90%] md:w-[75%]`}
                        onClick={upload}
                    >
                        <p className="text-lg md:text-2xl"> Browse </p>
                    </button>
                </div>
                {isError ?
                    <p className="text-center italic text-xxxs md:text-xs lg:text-sm xl:text-base -translate-y-3 md:-translate-y-2 underline">
                        {"Make sure your files are less than 25mb"}
                    </p>
                    :
                    <></>
                }
                <p className="flex justify-center items-center text-xxs md:text-xs lg:text-sm xl:text-base align-middle text-center -translate-y-3 md:-translate-y-0 h-[20%] w-full">
                    {"Upload your files to your company's database here"}
                </p>
            </div>
            <input
                type='file'
                id='file'
                ref={inputFile}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                multiple
            />
        </Container>
    );
}