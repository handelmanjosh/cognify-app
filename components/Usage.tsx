import { BG_COLOR_2 } from "@/constants";
import Container from "./metrics-props/Container";
import { useEffect, useRef, useState } from "react";
import ItemTitle from "./metrics-props/ItemTitle";


export default function Usage() {
    const [percentage, setPercentage] = useState<number[]>([]);
    useEffect(() => {
        // api query to get percentage

        setPercentage([10, 20, 30, 40]);
    }, []);
    return (
        <Container color={`${BG_COLOR_2}`}>
            {/* <ItemTitle text={`${percentage[percentage.length - 1]}% usage`} /> */}
            <ItemTitle text="Usage" />
            <div className="h-[85%] w-full ">
                {/* <Graph values={percentage} /> */}
            </div>
        </Container>
    );
}
type GraphProps = {
    values: number[];
};
function Graph({ values }: GraphProps) {
    useEffect(() => {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        let context = canvas.getContext("2d") as CanvasRenderingContext2D;
        let spaceBetween = canvas.width / values.length;
        let x = 0;
        let index = 0;
        while (x < canvas.width) {
            let y = canvas.height - ((values[index] / 100) * canvas.height); // scale y as percentage of height
            if (index == 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
            index++;
            x += spaceBetween;
        }
        context.strokeStyle = "white";
        context.lineWidth = 3;
        context.stroke();
    });
    return (
        <canvas id="canvas" className="w-full h-full" />
    );
}