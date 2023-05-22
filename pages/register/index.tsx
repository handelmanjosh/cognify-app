import BackBar from "@/components/BackBar";
import BasicLink from "@/components/BasicLink";
import SubmitButton from "@/components/SubmitButton";
import { useState } from "react";



export default function Create() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [toggled, setToggled] = useState<boolean>(true);
  const [organization, setOrganization] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }
    let response: any = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/createUser`,
      {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    if (!response.success) {
      console.error("User already exists!");
    }
    setUsername("");
    setPassword("");
  };
  const checkUsername = () => {
    if (username === "") return "valid";
    let atSymbol: boolean = false;
    let dot: boolean = false;
    for (let i = 0; i < username.length; i++) {
      if (username[i] === "@") {
        if (atSymbol) {
          return "Email contains invalid characters";
        } else {
          atSymbol = true;
        }
      } else if (username[i] == ".") {
        dot = true;
      }
    }
    if (atSymbol && dot) {
      return "valid";
    } else {
      return "Invalid email";
    }
  };
  const checkPassword2 = () => {
    if (password2 === "") return "valid";
    if (password2.length != password.length) return "Passwords must match";
    for (let i = 0; i < password2.length; i++) {
      if (password[i] !== password2[i]) {
        return "Passwords must match";
      }
    }
    return "valid";
  };
  const checkPassword = () => {
    if (password === "") return "valid";
    if (password.length < 10) {
      return "Password must be 10 characters or greater";
    }
    let number: boolean = false;
    let letter: boolean = false;
    for (let i = 0; i < password.length; i++) {
      if (!isNaN(Number(password[i]))) {
        number = true;
      } else {
        letter = true;
      }
    }
    if (number && letter) {
      return "valid";
    } else if (number) {
      return "Password must contain letters";
    } else {
      return "Password must contain numbers";
    }
  };
  const checkOrganization = () => {
    return "valid";
  };
  return (
    <>
      <div className="w-full h-[100vh] flex flex-col justify-center items-center p-2">
        <BackBar target="/login" height="h-[5%]" />
        <form onSubmit={handleSubmit} className="w-full h-[95%] flex flex-col justify-center items-center">
          <div className={`flex flex-col gap-3 items-center justify-center w-full sm:w-[80%] md:w-[70%] lg:w-[50%] xl:w-[40%] h-[90%] md:h-auto  translate-y-[-10%] from-primary to-slate-800 via-slate-800 border-2 border-slate-700 bg-gradient-to-br p-8 rounded-lg`}>
            <div className="flex flex-col justify-center items-center mb-4">
              <p className="md:text-md text-tertiary ">CognifyAI</p>
              <p className="font-bold md:text-4xl  text-xl"> Create your account </p>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center w-full">
              <div className="flex flex-row font-bold text-sm md:text-lg items-center justify-start w-full">
                {"Email"}
              </div>
              <StyledInput
                value={username}
                change={(event) => setUsername(event.target.value)}
                name="username"
                type="text"
                required={true}
                invalidCheck={checkUsername}
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col gap-2 justify-center items-center w-full">
              <div className="flex flex-row font-bold text-sm md:text-lg items-center justify-start w-full">
                {"Password"}
              </div>
              <StyledInput
                value={password}
                change={(event) => setPassword(event.target.value)}
                name="password"
                type="password"
                required={true}
                invalidCheck={checkPassword}
                placeholder="Enter your password"
              />
              <StyledInput
                value={password2}
                change={(event) => setPassword2(event.target.value)}
                name="password2"
                type="password"
                required={true}
                invalidCheck={() => "valid"}
                placeholder="Re-enter your password"
              />
            </div>
            <div className="flex flex-col gap-2 justify-center items-center w-full">
              <div className="flex flex-row font-bold text-sm md:text-lg items-center justify-start w-full">
                {"Organization"}
              </div>
              <div className="flex flex-row justify-start gap-4 items-center w-full">
                <p className="text-tertiary hover:cursor-default md:text-base text-sm text-center"> {toggled ? "Joining organization" : "Creating organization"} </p>
                <div className={`w-8 h-auto flex flex-row items-center ${toggled ? "justify-start" : "justify-end"}  hover:cursor-pointer border-tertiary border-2 rounded-full`} onClick={() => setToggled(!toggled)}>
                  <div className="p-2 bg-primary rounded-full w-4 h-4"></div>
                </div>
              </div>
            </div>
            <StyledInput
              value={organization}
              change={(event) => setOrganization(event.target.value)}
              name="organization"
              type="text"
              required={true}
              invalidCheck={checkOrganization}
              placeholder="Enter organization code"
            />
            <SubmitButton text="Create Account" />
            <div className="flex gap-2 flex-row mt-2 md:mt-4 justify-start w-full items-center -translate-y-3 md:-translate-y-0">
              <p className="text-tertiary hover:cursor-default md:text-base text-xxs"> Already registered? </p>
              <BasicLink target="/login" text="Login" />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
type StyledInputProps = {
  value: string;
  type: string;
  name: string;
  placeholder: string;
  change: (event: React.ChangeEvent<HTMLInputElement>) => any;
  invalidCheck: () => string;
  required: boolean;
};
function StyledInput({ value, change, required, type, name, placeholder, invalidCheck }: StyledInputProps) {
  const [invalid, setInvalid] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  return (
    <>
      {required ?
        <div className="flex flex-col justify-center items-center w-full">
          <input
            className="bg-slate-800 border-slate-700 border-2 w-full rounded-md p-2 md:p-3"
            type={type}
            name={name}
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              change(event);
              const temp = invalidCheck();
              if (temp === "valid") {
                setInvalid(false);
              } else {
                setInvalid(true);
                setMessage(temp);
              }
            }}
            placeholder={placeholder}
            required
          />
          {invalid ? <div className="flex flex-row justify-end items-center w-full">
            <p className="text-red-600 italic text-xxxs md:text-xs px-1">{message}</p>
          </div> : <></>}
        </div>
        :
        <div className="flex flex-col justify-center items-center w-full">
          <input
            className="bg-black border-tertiary border-2 w-full rounded-md p-2 md:p-3 "
            type={type}
            name={name}
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              change(event);
              const temp = invalidCheck();
              if (temp === "valid") {
                setInvalid(false);
              } else {
                setInvalid(true);
                setMessage(temp);
              }
            }}
            placeholder={placeholder}
          />
          {invalid ? <div className="flex flex-row justify-end items-center w-full">
            <p className="text-red-600 italic text-xxxs md:text-xs px-1">{message}</p>
          </div> : <></>}
        </div>
      }
    </>
  );
};