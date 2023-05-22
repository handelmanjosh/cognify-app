import { useEffect, useState } from "react";
import Container from "./metrics-props/Container";
import ItemTitle from "./metrics-props/ItemTitle";


export default function Recent() {
    const [recents, setRecents] = useState<string[]>([]);
    const [topics, setTopics] = useState<string[]>([]);
    useEffect(() => {
        /* ACTUAL CODE
        const recents: string[] = []; // api query;
        setRecents(recents);
        */

        //TEST CODE
        setRecents(["recent query 1", "recent query 2", "recent query 3"]);
        setTopics(["topic 1", "topic 2", "topic 3"]);
    }, []);
    return (
        <Container>
            <ItemTitle text="Recent" />
            <div className="flex flex-col justify-center gap-2 md:gap-4 items-center w-full h-[65%]">
                {recents.map((recentText, index) => (
                    <RecentItem key={index} text={recentText} />
                ))}
            </div>
            <div className="flex flex-row justify-end gap-1 md:gap-2 items-center w-full h-[20%]">
                {topics.map((topicText, index) => (
                    <TopicItem key={index} text={topicText} />
                ))}
            </div>
        </Container>
    );
}
type ItemProps = {
    text: string;
};
function RecentItem({ text }: ItemProps) {
    const makeQuery = () => {
        // make api call with 'text'
        console.log("recent query made");
    };
    return (
        <div
            className="w-full flex flex-row items-center justify-center border-b border-tertiary group hover:cursor-pointer"
            onClick={makeQuery}
        >
            {/*do cool bouncy effect on hover */}
            <div className="w-[75%] flex flex-row items-center justify-start text-xxs md:text-xs xl:text-sm">
                {text}
            </div>
            <div className="w-[25%] text-tertiary flex flex-row items-center justify-end text-sm md:text-xl lg:text-2xl transition-all duration-300 group-hover:-translate-x-4 group-hover:text-white">
                {"\u2192"}
            </div>
        </div>
    );
}
function TopicItem({ text }: ItemProps) {
    const makeQuery = () => {
        //not really sure what should happen here
        console.log("topic query made");
    };
    return (
        <div
            className="md:rounded-full rounded-2xl hover:cursor-pointer w-[33%] h-auto flex flex-row items-center justify-center text-tertiary hover:bg-tertiary hover:text-white border-2 border-tertiary"
            onClick={makeQuery}
        >
            <p className="md:text-sm text-xxxs px-1 whitespace-nowrap">{text}</p>
        </div>
    );
}