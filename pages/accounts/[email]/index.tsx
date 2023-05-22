import EditableStat, { type EditableStatProps } from "@/components/EditableStat";
import { Plus, X } from "@/components/Icons";
import LogOut from "@/components/LogOut";
import { useAuth, useUser } from "@/components/authContext";
import MainUserImage from "@/components/profile-props/MainProfile";
import { AnyARecord } from "dns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

let profile2: any & { sessionId: string | null; };
let profile1: any & { sessionId: string | null; };
export default function Account() {
    const { user, profile, preferences } = useUser();
    const router = useRouter();
    const [selectedPage, setSelectedPage] = useState<number>(0);
    const [newProfile, setNewProfile] = useState<any>(profile);
    const [events, setEvents] = useState<EventProps[][][]>([]);
    useEffect(() => {
        const { email } = router.query;
        if (email != user.email) router.push("/");
        const newEvents: EventProps[][][] = [];
        for (let i = 0; i < 4; i++) {
            const temp = [];
            for (let ii = 0; ii < 7; ii++) {
                temp.push([{ type: "org", text: "Hello!", time: "8:30" }, { type: "org", text: "yeet", time: "10:30 PM" }]);
            }
            //@ts-ignore
            newEvents.push(temp);
        }
        profile2 = { ...profile, sessionId: user.sessionId };
        profile1 = { ...profile, sessionId: user.sessionId };
        setEvents(newEvents);
    }, []);

    useEffect(() => {
        window.addEventListener("beforeunload", handleUnload);

        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [newProfile, profile]);
    const handleUnload = () => {
        console.log(profile2, profile1);
        if (profile2.name === profile1.name &&
            profile2.bio === profile1.bio &&
            profile2.location === profile1.location &&
            profile2.team === profile1.team) {
            console.log("all good");
        } else {
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/update`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        sessionId: profile2.sessionId,
                        targets: ["Profile"],
                        bio: profile2.bio,
                        name: profile2.name,
                        location: profile2.location,
                        team: profile2.team,
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
    };
    const changeEvents = (i: number, ii: number, type: EventOptions, text: string, time: string) => {
        const newEvents = [...events];
        newEvents[i][ii].push({ type, text, time });
        setEvents(newEvents);
    };
    const deleteEvent = (i: number, ii: number, iii: number) => {
        const newEvents = [...events];
        newEvents[i][ii].splice(iii, 1);
        setEvents(newEvents);
    };
    return (
        <div className="flex flex-col justify-start items-center h-[95vh] w-full">
            <div className="flex flex-row justify-end gap-6 items-center w-full h-[5%]">
                <a href="/organizations/create" className="hover:underline hover:font-bold"> Create an Organization </a>
                <a href="/organizations" className="hover:underline hover:font-bold"> My Organizations</a>
                <LogOut sessionId={user?.sessionId ?? ""} />
            </div>
            <div className="flex flex-row justify-center items-center w-full h-full">
                <div className="flex flex-col justify-start items-center h-full gap-16 w-[20%] px-4 py-8">
                    <div className="flex flex-col gap-4 justify-center items-center w-full">
                        <MainUserImage src="" />
                        <div className="flex flex-col gap-1 justify-center items-start w-[70%] h-auto ">
                            <p className="text-2xl text-center">{user?.email}</p>
                            <EditableStat
                                data={newProfile?.name ?? "username"}
                                defaultData={profile?.name ?? "username"}
                                change={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setNewProfile({ ...newProfile, name: event.target.value }); profile2 = { ...profile2, name: event.target.value }; }}
                                reset={() => { setNewProfile({ ...newProfile, name: "" }); profile2 = { ...profile2, name: "" }; }}
                                setDefault={() => { setNewProfile({ ...newProfile, name: "username" }); profile2 = { ...profile2, name: "username" }; }}
                                large={false}
                            />
                        </div>
                    </div>
                    <NavCol
                        f={(n: number) => setSelectedPage(n)}
                        selected={selectedPage}
                        titles={["Info", "Tasks", "Calender", "Files"]}
                    />
                </div>

                {selectedPage == 0 ?
                    <div className="flex flex-col justify-start items-center h-full gap-8 w-[50%] px-4 py-8">
                        <SpendsTimeWith username={newProfile?.name ?? user.email} />
                        <WorksMostWith />
                        <InTeams />
                        <RecentActivities />
                    </div>
                    :
                    selectedPage == 1 ?
                        <div className="flex flex-col justify-start items-center h-full gap-8 w-[50%] px-4 py-8">
                            <TaskList />
                        </div>
                        :
                        selectedPage == 2 ?
                            <div className="flex flex-col justify-start items-center h-full gap-8 w-[80%] px-4 py-8">
                                <Calendar events={events} changeEvents={changeEvents} deleteEvent={deleteEvent} />
                            </div>
                            :
                            <div className="flex flex-col justify-start items-center h-full gap-8 w-[50%] px-4 py-8">

                            </div>
                }


                <div className={`flex flex-col justify-start gap-14 items-center h-full w-[30%] px-4 py-10 ${selectedPage == 2 ? "hidden" : ""}`}>
                    <TextTitle
                        title="Biography"
                        data={newProfile?.bio ?? ""}
                        defaultData={profile?.bio ?? ""}
                        change={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setNewProfile({ ...newProfile, bio: event.target.value }); profile2 = { ...profile2, bio: event.target.value }; }}
                        reset={() => { setNewProfile({ ...newProfile, bio: "" }); profile2 = { ...profile2, bio: "" }; }}
                        setDefault={() => { setNewProfile({ ...newProfile, bio: "" }); profile2 = { ...profile2, bio: "" }; }}
                    />
                    <TextTitle
                        title="Location"
                        data={newProfile?.location ?? ""}
                        defaultData={profile?.location ?? ""}
                        change={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setNewProfile({ ...newProfile, location: event.target.value }); profile2 = { ...profile2, location: event.target.value }; }}
                        reset={() => { setNewProfile({ ...newProfile, location: "" }); profile2 = { ...profile2, location: "" }; }}
                        setDefault={() => { setNewProfile({ ...newProfile, location: "" }); profile2 = { ...profile2, location: "" }; }}
                    />
                    <TextTitle
                        title="Direct responsibilities"
                        data={newProfile?.team ?? ""}
                        defaultData={profile?.team ?? ""}
                        change={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setNewProfile({ ...newProfile, team: event.target.value }); profile2 = { ...profile2, team: event.target.value }; }}
                        reset={() => { setNewProfile({ ...newProfile, team: "" }); profile2 = { ...profile2, team: "" }; }}
                        setDefault={() => { setNewProfile({ ...newProfile, team: "" }); profile2 = { ...profile2, team: "" }; }}
                    />
                </div>
            </div >
        </div>
    );
}
const prevMonth = { months: [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30], getCurrent: (d: number) => d == 11 ? prevMonth.months[0] : prevMonth.months[d + 1], };
const daysOfWeek = {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    index: 0,
    getDay: (): string => {
        const d: string = daysOfWeek.days[daysOfWeek.index];
        daysOfWeek.index = (daysOfWeek.index + 1) % 7;
        return d;
    },
};
function Calendar({ events, changeEvents, deleteEvent }: { events: EventProps[][][], changeEvents: (i: number, ii: number, type: EventOptions, text: string, time: string) => any; deleteEvent: (i: number, ii: number, iii: number) => any; }) {
    const [month, setMonth] = useState<number[][]>([]);
    const [today, setToday] = useState<number>();
    useEffect(() => {
        const date = new Date();
        const day = date.getDay();
        const startDate = date.getDate();
        setToday(startDate);
        const month = date.getMonth();
        const prev = prevMonth.months[month];
        const currentMonth = prevMonth.getCurrent(month);
        let index = -1 * day;
        const finalMonth: number[][] = [];
        for (let week = 0; week < 4; week++) {
            const tempWeek: number[] = [];
            for (let day = 0; day < 7; day++) {
                const today = startDate + index;
                if (today < 1) {
                    tempWeek.push(prev + today);
                } else if (today > currentMonth) {
                    tempWeek.push(today % currentMonth);
                } else {
                    tempWeek.push(today);
                }
                index++;
            }
            finalMonth.push(tempWeek);
        }
        setMonth(finalMonth);
    }, []);
    return (
        <div className="relative bg-gradient-to-br from-primary via-black rounded-xl to-primary p-2 flex flex-col gap-2 justify-center items-center w-auto h-auto">
            {month.map((week, i) => (
                <div className="flex flex-row gap-2 justify-center items-center w-full" key={i}>
                    {week.map((date, ii) => (
                        <Day events={events[i][ii]} changeEvents={changeEvents} deleteEvent={deleteEvent} date={date} day={daysOfWeek.getDay()} key={ii} index={[i, ii]} isToday={date == today} />
                    ))}
                </div>
            ))}
        </div>
    );
}
function Day({ date, day, index, isToday, events, changeEvents, deleteEvent }: { date: number, day: string; index: number[]; isToday: boolean; events: EventProps[], changeEvents: (i: number, ii: number, type: EventOptions, text: string, time: string) => any; deleteEvent: (i: number, ii: number, iii: number) => any; }) {
    const [selected, setSelected] = useState<boolean>(false);
    const [creating, setCreating] = useState<boolean>(false);
    const addEvent = (type: EventOptions, time: string, text: string) => {
        changeEvents(index[0], index[1], type, text, time);
    };
    const createDeleteFunction = (iii: number): (() => any) => {
        return () => deleteEvent(index[0], index[1], iii);
    };
    return (
        <>
            <div
                className={`w-6 h-6 md:w-16 md:h-16 lg:w-24 lg:h-24 xl:w-36 xl:h-36 2xl:h-48 2xl:w-48 px-1 lg:px-2 flex flex-col justify-center hover:scale-105 items-center transition-all duration-300 bg-black rounded-xl`}
                onClick={() => setSelected(true)}
            >
                <div className={`flex flex-col h-[20%] w-full justify-start items-start text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl ${isToday ? "text-primary" : ""}`}>
                    {date}
                </div>
                <div className="flex flex-col h-[70%] w-full justify-start pt-1 gap-2 items-center">
                    <div className="flex flex-col w-full justify-start items-center overflow-auto">
                        {events.map((event, i) => (
                            <Event key={i} {...event} d={createDeleteFunction(i)} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col h-[10%] w-full justify-end items-start text-xxs md:text-xs lg:text-sm xl:text-base 2xl:text-lg">
                    {day}
                </div>
            </div>
            {selected ?
                <div className="absolute top-0 left-0 w-full h-full bg-transparent flex justify-center items-center">
                    <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] 2xl:w-[800px] 2xl:h-[800px] border-primary border-r border-b bg-gradient-to-br from-primary via-black to-black p-4 lg:p-8 bg-black rounded-3xl">
                        <div className={`flex flex-col h-[20%] w-full justify-start items-start text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-8xl`}>
                            {date}
                        </div>
                        <div className="flex flex-col h-[70%] w-full justify-start items-center">
                            <div className="flex flex-col w-full h-full justify-start overflow-auto items-center">
                                {events.map((event, i) => (
                                    <Event key={i} {...event} d={createDeleteFunction(i)} large />
                                ))}
                            </div>
                            <div className="flex justify-center items-center h-[30%] w-full ">
                                {creating ?
                                    <div className="flex flex-col justify-center items-center w-full">
                                        <CreateEvent create={addEvent} />
                                        <div
                                            className="w-full flex flex-row justify-center items-center h-16 hover:scale-125 hover:cursor-pointer transition-all duration-150"
                                            onClick={() => setCreating(false)}
                                        >
                                            <X width="w-10" height="h-10" />
                                        </div>
                                    </div>
                                    :
                                    <div
                                        className="w-16 h-16 hover:scale-125 hover:cursor-pointer transition-all duration-150"
                                        onClick={() => setCreating(true)}
                                    >
                                        <Plus width="w-6 lg:w-10 xl:w-16" height="h-6 lg:h-10 xl:h-16" />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col h-[10%] w-full justify-end items-start">
                            <div className="flex flex-row justify-between items-center w-full">
                                <p className="text-lg md:text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl">{day}</p>
                                <div className="w-10 h-10 hover:scale-125 hover:cursor-pointer transition-all duration-150" onClick={() => { setSelected(false); setCreating(false); }}>
                                    <X width="w-6 lg:w-10" height="w-6 lg:h-10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <></>
            }
        </>
    );
}
type EventOptions = "org" | "user";
function CreateEvent({ create }: { create: (t1: EventOptions, t2: string, t: string) => any; }) {
    const [time, setTime] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [type, setType] = useState<EventOptions>("org");
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        create(type, time, text);
    };
    const processTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        let hour = Number(time.slice(0, 2));
        const minute = Number(time.slice(3, 6));
        let daytime = "AM";
        if (hour > 11) {
            hour -= 12;
            if (hour == 0) hour = 12;
            daytime = "PM";
        }
        const timeString: string = `${hour < 10 ? "0" : ""}${hour}:${minute < 10 ? "0" : ""}${minute} ${daytime}`;
        setTime(timeString);
    };
    return (
        <form
            className="flex flex-row items-center justify-between w-full"
            onSubmit={submit}
        >
            <div className="relative flex flex-row gap-1 lg:gap-2 items-center justify-center">
                <div
                    className={`w-1 h-1 md:w-2 md:h-2 lg:w-4 lg:h-4 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 rounded-full ${type == "org" ? "bg-yellow-400" : "bg-blue-400"}`}
                    onClick={() => type === "org" ? setType("user") : setType("org")}
                >
                </div>
                <input
                    type="time"
                    className="bg-black text-white outline-none text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl h-auto w-auto"
                    onChange={processTime}
                    required
                />
            </div>
            <div className="flex flex-row gap-4 items-center justify-center">
                <input
                    className="outline-none border border-white bg-black rounded-xl w-16 md:w-24 lg:w-32 xl:w-56 focus:border-2 p-2"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value)}
                    required
                />
                <button type="submit" className="bg-primary px-2 py-1 lg:px-4 lg:py-2 rounded-xl hover:scale-105 transition-all duration-150 text-xs md:text-sm lg:text-base">Create</button>
            </div>
        </form>
    );
}
type EventProps = {
    type: EventOptions;
    text: string;
    time: string;
    large?: boolean;
};
function Event({ type, text, time, large, d }: EventProps & { d: () => any; }) {
    return (
        <div className="flex flex-row justify-between items-center w-full">
            {large ?
                <>
                    <div className="flex flex-row justify-start gap-2 items-center">
                        <div className={` w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full ${type == "org" ? "bg-primary" : "bg-tertiary"}`}></div>
                        <p className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl"> {time} </p>
                    </div>
                    <div className="flex flex-row justify-end gap-2 group hover:cursor-default items-center">
                        <p className="text-center text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl align-middle"> {text} </p>
                        <div
                            className="hidden justify-center items-center group-hover:block hover:scale-125 hover:cursor-pointer w-6 h-6"
                            onClick={d}
                        >
                            <X width="w-2 md:w-4 lg:w-6" height="w-2 md:w-4 lg:h-6" />
                        </div>
                    </div>
                </>
                :
                <>
                    <div className="flex flex-row justify-start gap-2 items-center">
                        <div className={`w-1 h-1 lg:w-2 lg:h-2 rounded-full ${type == "org" ? "bg-primary" : "bg-tertiary"}`}></div>
                        <p className="text-center text-xxs md:text-xs lg:text-sm 2xl:text-base"> {time} </p>
                    </div>
                    <div className="flex flex-row justify-end items-center">
                        <p className="text-center text-xs md:text-sm lg:text-base 2xl:text-lg"> {text} </p>
                    </div>
                </>
            }
        </div>
    );
}
function TaskList({ }) {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const deleteFromTasks = (n: string) => {
        const newTasks: TaskProps[] = [];
        for (const task of tasks) {
            if (task.name !== n) {
                newTasks.push(task);
            }
        }
        setTasks(newTasks);
    };
    return (
        <div className="flex flex-col justify-start items-center h-full w-full gap-4">
            {tasks.map((task, index) => (
                <Task {...task} key={index} />
            ))}
            <AddTask add={(n: string, d: boolean, f: (n: string) => any) => setTasks([...tasks, { name: n, done: d, remove: f }])} remove={deleteFromTasks} />
        </div>
    );
}
type TaskProps = {
    name: string;
    done: boolean;
    remove: (n: string) => any;
};
function Task({ name, done, remove }: TaskProps) {
    const [toggle, setToggle] = useState<boolean>(done);
    return (
        <div className="flex flex-row justify-center items-center w-full h-[5%]">
            <div className="flex flex-row justify-start items-center w-[50%] h-full">
                {name}
            </div>
            <div className="flex flex-row justify-end items-center w-[50%] gap-2 h-full">
                <div className="flex flex-row justify-center items-center gap-2" onClick={() => setToggle(!toggle)}>
                    <div className={`w-10 h-10 rounded-md hover:scale-105 bg-primary transition-all duration-150 ${toggle ? "opacity-100" : "opacity-50"}`}></div>
                    <div className={`w-10 h-10 rounded-md hover:scale-105 bg-tertiary transition-all duration-150 ${toggle ? "opacity-50" : "opacity-100"}`}></div>
                </div>
                <div className="w-10 h-10 hover:scale-105" onClick={() => remove(name)}>
                    <X width="w-10" height="w-10" />
                </div>
            </div>
        </div >
    );
}
function AddTask({ add, remove }: { add: (n: string, d: boolean, f: (n: string) => any) => any; remove: (n: string) => any; }) {
    const [name, setName] = useState<string>("");
    const [done, setDone] = useState<boolean>(false);
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        add(name, done, remove);
        setName(""); setDone(false);
    };
    return (
        <form onSubmit={submit} className="flex flex-row justify-center items-center gap-2 w-full h-[5%] mt-6">
            <input
                type="text"
                className="outline-none border border-white bg-black rounded-xl focus:border-2 p-4 w-[80%]"
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                required
            />
            <div
                className={`w-16 h-16 ${done ? "bg-primary" : "bg-tertiary"} hover:cursor-pointer hover:scale-105 transition-all duration-300 rounded-md`}
                onClick={() => setDone(!done)}
            />
            <button
                className="w-16 h-16 rounded-md bg-primary hover:scale-105"
                type="submit"
            >
                {"Create"}
            </button>
        </form>
    );
}
type NavColProps = {
    selected: number;
    f: (s: number) => void;
    titles: string[];
};
function NavCol({ f, selected, titles }: NavColProps) {
    return (
        <div className="flex flex-col justify-center items-center w-[70%] gap-2">
            {titles.map((title, i) => (
                <>
                    {i == selected ?
                        <div key={i} className="hover:cursor-pointer flex flex-row justify-start items-center w-full h-auto">
                            <p className=" text-3xl text-center"> {title} </p>
                        </div>
                        :
                        <div
                            key={i}
                            className="hover:cursor-pointer flex flex-row justify-start brightness-50 hover:brightness-100 transition-all duration-500 items-center w-full h-auto"
                            onClick={() => f(i)}
                        >
                            <p className=" text-3xl text-center">{title}</p>
                        </div>
                    }
                </>
            ))}
        </div>
    );
}


type StatsWrapperProps = {
    height: string;
    title: string;
    children: React.ReactNode;
};
function StatsWrapper({ height, title, children }: StatsWrapperProps) {
    return (
        <div className={`flex flex-col justify-start items-start gap-4 w-full rounded-lg p-4 bg-slate-800 shadow-md shadow-slate-700 ${height}`}>
            <p className="text-center text-base">{title}</p>
            {children}
        </div>
    );
}
function SpendsTimeWith({ username }: { username: string; }) {

    return (
        <StatsWrapper height="h-[30%]" title={`${username} spends most of their time with...`}>
            <div className="flex flex-col justify-center items-center w-full h-full ">

            </div>
        </StatsWrapper>
    );
}
function WorksMostWith() {
    return (
        <StatsWrapper height="h-[20%]" title="Works most with...">
            <div className="flex flex-row justify-center items-center w-full h-full ">

            </div>
        </StatsWrapper>
    );
}
function InTeams() {
    return (
        <StatsWrapper height="h-[30%]" title="In these teams...">
            <div className="flex flex-row justify-center items-center w-full h-full ">

            </div>
        </StatsWrapper>
    );
}
function RecentActivities() {
    return (
        <StatsWrapper height="h-[20%]" title="Recent activities">
            <div className="flex flex-col justify-center items-center w-full h-full ">

            </div>
        </StatsWrapper>
    );
}
type TextTitleProps = { title: string; } & EditableStatProps;
function TextTitle({ title, data, defaultData, change, reset, setDefault }: TextTitleProps) {
    return (
        <div className="flex flex-col justify-start items-start gap-2 w-full h-auto">
            <p className="uppercase text-base">{title}</p>
            <EditableStat
                data={data}
                defaultData={defaultData}
                change={change}
                reset={reset}
                setDefault={setDefault}
                large
            />
        </div>
    );
}
