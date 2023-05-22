import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import { useData } from "@/components/authContext";
import ChatNavBar from "@/components/chat-props/ChatNavBar";
import { ChatIcon, Check, Plus, Trash, X } from "@/components/Icons";
import Loading from "@/components/Loading";
type PromptType = "user" | "text" | "file" | "loading";
type Prompt = [string, PromptType];
type PromptList = Prompt[];
type ChatMetadata = { title: string; id: string; };
export default function Chat() {
    const router = useRouter();
    const { user, organizations } = useData();
    const [loadingPage, setLoadingPage] = useState<boolean>(true);
    const [query, setQuery] = useState<string>("");
    const [history, setHistory] = useState<PromptList>([]);
    const [canQuery, setCanQuery] = useState<boolean>(true);
    const [orgId, setOrgId] = useState<string>("");
    const [viewChats, setViewChats] = useState<boolean>(false);
    const [allChatMetadata, setAllChatsMetadata] = useState<ChatMetadata[] | null>(null);
    const [selectedChatId, setSelectedChatId] = useState<string>("");
    const [selectedChatMetadata, setSelectedChatMetadata] = useState<ChatMetadata>();
    useEffect(() => {
        if (!organizations || !user) {
            router.push("/login");
        } else {
            setOrgId(organizations[0].id);
            getChats(organizations[0].id).then(chats => {
                setLoadingPage(false);
                setAllChatsMetadata(chats);
            });

        }
    }, [user, organizations]);
    useEffect(() => {
        if (allChatMetadata) {
            if (allChatMetadata.length == 0) {
                newChatWrapper();
            } else {
                setSelectedChatId(allChatMetadata[0].id);
                setSelectedChatMetadata(allChatMetadata[0]);
            }
        }
    }, [allChatMetadata]);
    useEffect(() => {
        if (selectedChatId) {
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/get`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        target: "SingleChat",
                        sessionId: user.sessionId,
                        orgId,
                        id: selectedChatId,
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            ).then(response => {
                if (response.status == 200) {
                    response.json().then(chat => {
                        console.log(chat);
                        setHistory(chat.history);
                        setSelectedChatMetadata(chat.metadata);
                    });
                }
            });
        }
    }, [selectedChatId]);
    useEffect(() => {
        const elem = document.getElementById("last-prompt");
        elem?.scrollIntoView();
    }, [history]);
    const timeFormat = (s: string): string => {
        return s.slice(0, s.length - 6) + " " + s.slice(s.length - 2, s.length);
    };
    const submitQuery = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (query == "" || !canQuery) return;
        let newHistory = [...history];
        newHistory.push([query, "user"]);
        newHistory.push(["", "loading"]);
        setHistory(newHistory);
        fetch(`/api/gpt`,
            {
                method: "POST",
                body: JSON.stringify({
                    sessionId: user.sessionId,
                    query,
                    history,
                    orgId,
                    id: selectedChatId,
                }),
                headers: { "Content-Type": "application/json" }
            }
        )
            .then(response => response.json())
            .then(json => {
                const response = json.response;
                newHistory.splice(newHistory.length - 1, 1);
                newHistory.push(response);
                setHistory(newHistory);
                setQuery("");
                setCanQuery(true);
            })
            .catch(err => {
                newHistory.splice(newHistory.length - 1, 1);
                console.error(err);
                setHistory(newHistory);
                setQuery("");
                setCanQuery(true);
            });
    };
    const changeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };
    const newChat = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/createChat`,
            {
                method: "POST",
                body: JSON.stringify({
                    sessionId: user.sessionId,
                    orgId,
                }),
                headers: { "Content-Type": "application/json" }
            }
        );
        // ).then(response => {
        //     if (response.status == 200) {
        //         response.json().then(data => {
        //             setSelectedChatId(data.id);
        //             setSelectedChatMetadata({ title: data.title, id: data.id });
        //         });
        //     }
        // });
        if (response.status == 200) {
            return await response.json();
        } else {
            console.error("Unable to create new chat");
            return "";
        }
    };
    const newChatWrapper = async () => {
        setLoadingPage(true);
        newChat().then(metadata => {
            setLoadingPage(false);
            setAllChatsMetadata(data => {
                return [...data as ChatMetadata[], metadata];
            });
            setSelectedChatId(metadata.id);
            setSelectedChatMetadata(metadata);
        });
    };
    const getChats = async (orgId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/get`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    target: "Chat",
                    sessionId: user.sessionId,
                    orgId,
                })
            }
        );
        if (response.status == 200) {
            return await response.json();
        } else {
            return [];
        }
    };
    const deleteChatGenerator = (id: string) => {
        return () => {
            setLoadingPage(true);
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/deleteChat`,
                {
                    method: "DELETE",
                    body: JSON.stringify({
                        id,
                        sessionId: user.sessionId,
                        orgId,
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            ).then(response => {
                setLoadingPage(false);
                if (response.status == 200) {
                    setAllChatsMetadata(current => {
                        return (current as ChatMetadata[]).filter(item => item.id !== id);
                    });
                    console.log("Success");
                } else {
                    console.log("Failure");
                }
            });
        };
    };
    return (
        <div className="w-full h-[100vh] flex flex-col justify-center items-center">
            {loadingPage ? <Loading /> : <></>}
            <ChatNavBar user={user} onClick={() => setViewChats(true)} />
            <div className="flex flex-row justify-center items-center w-full h-[95%]">
                <div className={`${viewChats ? "absolute top-0 left-0 flex" : "hidden"} md:flex flex-col justify-start items-center h-full overflow-auto w-[80%] border-r-2 border-black bg-slate-800 md:w-[20%] p-4 gap-4`}>
                    <div className="flex flex-row w-full justify-start items-center">
                        <div className="w-auto h-auto md:hidden" onClick={() => setViewChats(false)}>
                            <X width="w-6" height="w-6 hover:scale-105" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2 w-full">
                        <div
                            className="flex flex-row justify-center items-center w-full h-12 md:h-16 hover:cursor-pointer border-2 border-white rounded-lg gap-2 hover:scale-105 transition-all duration-150"
                            onClick={newChatWrapper}
                        >
                            <p className="">{"New Chat"}</p>
                            <div className="w-auto h-auto">
                                <Plus width="w-6" height="h-6" />
                            </div>
                        </div>
                        {allChatMetadata?.map((chat, i) => (
                            <ChatSelect title={chat.title} key={i} selected={chat.id === selectedChatId} onClick={() => setSelectedChatId(chat.id)} onDelete={deleteChatGenerator(chat.id)} />
                        ))}
                    </div>
                </div>
                <div className={`flex flex-col justify-center items-center w-full h-full md:w-[80%] p-2 overflow-hidden`} onClick={() => setViewChats(false)}>
                    <div className="flex flex-col justify-start items-center gap-2 md:gap-4 overflow-auto w-full h-full">
                        <div className="w-full h-full" />
                        {history.map((value, i) => {
                            if (value[1] == "user") {
                                return (
                                    <div key={i} id={i == history.length - 1 ? "last-prompt" : ""} className="flex flex-row justify-end items-center w-full h-auto">
                                        <AbstractChat text={value[0]} type={value[1]} />
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={i} id={i == history.length - 1 ? "last-prompt" : ""} className="flex flex-row justify-start w-full h-auto items-center">
                                        <AbstractChat text={value[0]} type={value[1]} />
                                    </div>
                                );
                            }
                        })
                        }
                    </div>
                    {selectedChatId == "" ?
                        <></>
                        :
                        <ChatBar value={query} change={changeQuery} submit={submitQuery} />
                    }
                </div>
            </div>
        </div>
    );
}
type ChatSelectProps = {
    title: string;
    selected: boolean;
    onClick: () => any;
    onDelete: () => any;
};
function ChatSelect({ title, selected, onClick, onDelete }: ChatSelectProps) {
    const [canDelete, setCanDelete] = useState<boolean>(false);
    if (selected) {
        return (
            <div className="flex flex-row justify-between bg-slate-700 rounded-lg items-center w-full h-12 md:h-16 pr-4 pl-6" onClick={onClick}>
                <ChatIcon width="w-6" height="h-6" />
                <div className="flex flex-row justify-center items-center gap-2">
                    <p className="hover:cursor-default">{canDelete ? `Delete "${title}"` : `${title}`}</p>
                    {canDelete ?
                        <>
                            <div className="w-auto h-auto hover:cursor-pointer" onClick={() => { onDelete(); setCanDelete(false); }}>
                                <Check width="w-6" height="h-6 hover:scale-105" />
                            </div>
                            <div className="w-auto h-auto hover:cursor-pointer" onClick={() => setCanDelete(false)}>
                                <X width="w-6" height="h-6 hover:scale-105" />
                            </div>
                        </>
                        :
                        <div className="w-auto h-auto hover:cursor-pointer" onClick={() => setCanDelete(true)}>
                            <Trash width="w-6" height="h-6 hover:scale-105" />
                        </div>
                    }
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-row justify-between hover:bg-slate-700 hover:cursor-pointer hover:translate-x-1 transition-all duration-150 rounded-lg items-center w-full h-12 md:h-16 pr-4 pl-6" onClick={onClick}>
                <ChatIcon width="w-6" height="h-6" />
                <div className="flex flex-row justify-center items-center gap-2">
                    <p>{title}</p>
                    <div className="w-auto h-auto" onClick={onDelete}>
                        <Trash width="w-6" height="h-6 hover:scale-105" />
                    </div>
                </div>
            </div>
        );
    }
}
type AbstractChatProps = {
    type: PromptType;
    text: string;
};
function AbstractChat({ type, text }: AbstractChatProps) {
    if (type == "user") {
        return (
            <div className="max-w-[80%] w-auto h-auto rounded-t-lg rounded-bl-lg p-4 bg-primary">
                <p className="text-base md:text-lg lg:text-xl">{text}</p>
            </div>
        );
    } else if (type == "file") {
        return (
            <div className="w-[95%] md:w-[70%] h-[200px] md:h-[400px] lg:h-[600px] rounded-t-lg rounded-bl-lg p-4 bg-gray-500">
                <iframe src={text} className="w-full h-full" />
                <a href={text} target="_blank">View file</a>
            </div>
        );
    } else if (type == "loading") {
        return (
            <div className="max-w-[80%] w-auto h-auto flex flex-row gap-2 rounded-t-lg rounded-br-lg p-4 bg-gray-500 dots-container">
                <Dot />
                <Dot />
                <Dot />
            </div>
        );
    } else {
        return (
            <div className="max-w-[80%] w-auto h-auto rounded-t-lg rounded-br-lg p-4 bg-gray-500">
                {text.split('\n').map((line, index) => {
                    if (index == text.split("\n").length - 1) {
                        return (
                            <Fragment key={index}>
                                <p className="text-base md:text-lg lg:text-xl">{line}</p>
                            </Fragment>
                        );
                    } else {
                        return (
                            <Fragment key={index}>
                                <p className="text-base md:text-lg lg:text-xl">{line}</p>
                                <br className="h-1" />
                            </Fragment>
                        );
                    }
                }
                )}
            </div>
        );
    }
}
const Dot = () => (<div className="dot bg-primary rounded-full w-4 md:w-6 lg:w-8 aspect-square"></div>);
function ChatBar({ submit, change, value }: { submit: (event: React.FormEvent<HTMLFormElement>) => any, change: (event: React.ChangeEvent<HTMLInputElement>) => any, value: string; }) {
    return (
        <form className="flex flex-row justify-center items-center w-full h-[10%] py-4" onSubmit={submit}>
            <div className="flex flex-row justify-center gap-1 md:gap-4 items-center w-full md:w-[75%]">
                <input
                    className="appearance-none outline-none w-[80%] rounded-lg border-2 border-gray-600 p-4 h-full bg-gray-900"
                    type="text"
                    value={value}
                    placeholder="Ask a question!"
                    onChange={change}
                />
                <button type="submit" className="h-full bg-primary hover:scale-105 transition-all duration-200 rounded-xl p-4">Submit</button>
            </div>
        </form>
    );
}
;
