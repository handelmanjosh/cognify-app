import { useEffect, useState } from "react";
import Container from "./metrics-props/Container";
import ItemTitle from "./metrics-props/ItemTitle";
import { BG_COLOR_2, PRIMARY_BG_COLOR, SUBTEXT_COLOR } from "@/constants";



export default function Favorites() {
    const [favorites, setFavorites] = useState<string[][]>([]);
    useEffect(() => {
        // some api query to get user favorites
        setFavorites(sortByDay([
            ["favorite-file-1.pdf", "2 days ago"],
            ["favorite-file-2.png", "4 days ago"],
            ["favorite-file-3.jpg", "1 day ago"]]));
    }, []);
    const sortByDay = (arr: string[][]): string[][] => {
        const extract = (b: string[]): number => {
            let num = "";
            let target = b[1];
            for (let i = 0; i < target.length; i++) {
                let temp = Number(target[i]);
                if (!Number.isNaN(temp)) {
                    num += temp;
                } else {
                    break;
                }
            }
            return Number(num);
        };
        const values: number[] = [];
        const helper: number[][] = [];
        let index: number = 0;
        for (const element of arr) {
            let age = extract(element);
            values.push(age);
            helper.push([age, index]);
            index++;
        }
        values.sort();
        const result: string[][] = new Array(arr.length);
        for (const help of helper) {
            let index = help[1];

            let actualIndex = values.indexOf(help[0]);
            values[actualIndex] = -1;
            result[actualIndex] = arr[index];
        }
        return result;

    };
    return (
        <Container color="#00000">
            <ItemTitle text="Favorites" />
            <div className="flex flex-col gap-3 md:gap-5 items-center justify-center h-[85%] w-full">
                {favorites.map((favoriteText, index) => (
                    <FavoriteFile key={index} text={favoriteText[0]} secondaryText={favoriteText[1]} />
                ))}
            </div>
        </Container>
    );
}
type FavoriteFileProps = {
    text: string;
    secondaryText: string;
};
function FavoriteFile({ text, secondaryText }: FavoriteFileProps) {
    const [icon, setIcon] = useState<string>("/star-full.svg");
    const [phone, setPhone] = useState<boolean>(false);
    useEffect(() => {
        if (window.innerWidth < 768) {
            setPhone(true);
        }
    }, []);
    const switchIcon = () => {
        //toggle from outline to filled in
        if (icon === "/star-empty.svg") {
            setIcon("/star-full.svg");
        } else {
            setIcon("/star-empty.svg");
        }
    };
    const viewFile = () => {
        console.log("File viewed");
    };
    return (
        <div
            className={`flex flex-row h-[25%] justify-center w-full hover:cursor-pointer rounded-lg md:rounded-2xl bg-default items-center md:gap-2 py-1 px-2 md:py-2 md:px-4 button-bounce-smaller-animate`}
            onClick={viewFile}
        >
            <div className="flex flex-row items-center  justify-center w-[10%] h-full">
                <button
                    className={` translate-x-2 -translate-y-[1px] hover:brightness-110 flex flex-row items-center justify-center w-6 h-6`}
                    onClick={switchIcon}>
                    <img
                        src={icon}
                        className="w-full h-full"
                    />
                </button>
            </div>
            <div className="flex flex-row items-center h-full justify-center text-xxs md:text-xs w-[90%] md:w-[60%] xl:text-sm ">
                <strong className="text-center">
                    {text}
                </strong>
            </div>
            {phone ? <></> :
                <div className="flex w-[30%]">
                    <p className={`text-[${SUBTEXT_COLOR}] text-xs italic whitespace-nowrap`}>
                        {secondaryText}
                    </p>
                </div>
            }
        </div>
    );
}