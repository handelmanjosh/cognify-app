import Favorites from "@/components/Favorites";
import NavBar from "@/components/NavBar";
import Recent from "@/components/Recent";
import SearchBar from "@/components/SearchBar";
import Upload from "@/components/Upload";
import Usage from "@/components/Usage";
import Wrapper from "@/components/Wrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useData } from "@/components/authContext";


const DashBoard = () => {
    const router = useRouter();
    const [phone, setPhone] = useState<boolean>(false);
    const [orgId, setOrgId] = useState<string>("");
    const { user, organizations } = useData();
    useEffect(() => {
        if (window.innerWidth < 768) {
            setPhone(true);
        }
    }, []);
    useEffect(() => {
        if (!user) router.push("/login");
        if (!organizations || !organizations[0] || organizations.length == 0) {
            router.push("/organizations/join");
        } else {
            router.push("/chat");
            setOrgId(organizations[0].id);
            //need to add organization cycling
            console.log(organizations);
        }
    }, [user, organizations]);
    return (
        <>
            <Wrapper>
                <NavBar user={user} />
                <div className="flex flex-row items-center justify-center h-[30%] md:h-[50%]">
                    <SearchBar />
                </div>
                {phone ?
                    <div className="flex flex-col items-center justify-center gap-1 w-full h-[55%] ">
                        <div className="flex flex-row items-center justify-center gap-1 w-full h-[50%]">
                            <Recent />
                            <Favorites />
                        </div>
                        <div className="flex flex-row items-center justify-center gap-1 w-full h-[50%]">
                            <Usage />
                            <Upload user={user} orgId={orgId} />
                        </div>
                    </div>
                    :
                    <div className="flex flex-row items-center justify-center gap-3 w-full h-[30%]">
                        <Recent />
                        <Favorites />
                        <Usage />
                        <Upload user={user} orgId={orgId} />
                    </div>
                }
            </Wrapper>
        </>
    );
};
export default DashBoard;



function useAll(): { user: any; profile: any; preferences: any; organizations: any; } {
    throw new Error("Function not implemented.");
}
// export const getServerSideProps: GetServerSideProps = async (context) => {
//     return {
//         props: { test: "Hello World" }
//     };
// };
