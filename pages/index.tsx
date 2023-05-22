import NavBar from "@/components/NavBar";
import Wrapper from "@/components/Wrapper";
import { PartnerController } from "@/components/home-props/PartnerController";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/components/authContext";


const letters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const text: string = "WELCOME TO COGNIFY";
let iterations: number = 0;
let interval: any;
let p: HTMLParagraphElement;
let ran = 0;
let partnerController: PartnerController;
//const partners = ["blue", "red", "green", "yellow", "orange", "green", "blue"];
const Home = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { user } = useUser();
  const canvasRef = useRef<any>();
  useEffect(() => {
    if (ran == 1) return;
    canvasRef.current.width = window.innerWidth;
    if (window.innerWidth < 768) {
      canvasRef.current.height = 50;
    } else {
      canvasRef.current.height = 100;
    }
    setIsVisible(true);
    p = document.getElementById("welcome-text-main") as HTMLParagraphElement;
    interval = setInterval(textGenerator, 30);
    const context = canvasRef.current.getContext("2d") as CanvasRenderingContext2D;
    partnerController = new PartnerController(canvasRef.current, context);
    ran = 1;
    frame();
  }, []);


  const textGenerator = () => {
    p.innerText = p.innerText.split("")
      .map((_letter: string, index: number) => {
        if (index < iterations || text[index] == " ") {
          return text[index];
        } else {
          return letters[Math.floor(Math.random() * text.length)];
        }
      }).join("");
    iterations += 1 / 6;
    if (iterations >= text.length) {
      //@ts-ignore
      clearInterval(interval);
      p.innerText = text;
    }
  };
  const frame = async () => {
    if (!partnerController) {
      return;
    } else {
      partnerController.draw();
      requestAnimationFrame(frame);
    }
  };
  return (
    <>
      <Wrapper>
        <div className={`flex flex-col justify-start items-center gap-4 h-full w-full ${isVisible ? "opacity-100 transition-all duration-1000 -translate-y-0 -translate-x-0" : "opacity-0 -translate-y-5 -translate-x-3"}`}>
          <NavBar user={user} />
          <div className="flex flex-col justify-center items-center w-full h-[30%] md:h-full ">
            <p className="text-2xl sm:text-3xl md:text-5xl lg:text-8xl font-mono text-center" id="welcome-text-main">
              {"WELCOME TO COGNIFY"}
            </p>
          </div>
          <div className="flex flex-row justify-center items-center w-full">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </Wrapper>
    </>
  );
};
export default Home;


