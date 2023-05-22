import BackBar from "@/components/BackBar";
import BasicLink from "@/components/BasicLink";
import SubmitButton from "@/components/SubmitButton";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@/components/authContext";
import Loading from "@/components/Loading";


const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    login(username, password).then(() => { setIsLoading(false); });
    setUsername("");
    setPassword("");
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-[100vh] p-2">
        {isLoading ? <Loading /> : <></>}
        <BackBar target="/" height="h-[5%]" />
        <form onSubmit={handleSubmit} className="w-full h-[95%] flex flex-col justify-center items-center">
          <div className={`flex flex-col gap-2 md:gap-4 items-center justify-center w-full sm:w-[60%] md:w-[50%] xl:w-[40%] h-[90%] md:h-auto translate-y-[-10%] from-primary to-slate-800 via-slate-800 border-2 border-slate-700 bg-gradient-to-br p-8 rounded-lg`}>
            <div className="flex flex-col justify-center items-center mb-4">
              <p className="md:text-md text-tertiary ">CognifyAI</p>
              <p className="font-bold md:text-4xl text-2xl"> Login to your account </p>
            </div>
            <div className="flex flex-col md:gap-2 justify-center items-center w-full">
              <div className="flex flex-row font-bold text-sm md:text-base items-center justify-start w-full">
                {"Email or Username"}
              </div>
              <input
                className={`bg-slate-800 border-slate-700 border-2 w-full rounded-md p-3`}
                type="text"
                name="username"
                value={username}
                placeholder="Enter email or username"
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col md:gap-2 justify-center items-center w-full">
              <div className="flex flex-row font-bold text-sm md:text-base items-center justify-start w-full">
                {"Password"}
              </div>
              <input
                className={`bg-slate-800 border-slate-700 border-2 w-full rounded-md p-3 focus:border-white`}
                type="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <SubmitButton text="Login" />
            <div className="flex gap-2 flex-row md:mt-2 justify-start w-full items-center">
              <div className="flex flex-row justify-start items-center w-[50%] gap-2">
                <p className="text-tertiary hover:cursor-default md:text-base text-xxs"> Not registered yet?</p>
                <BasicLink target="/register" text="Register now" />
              </div>
              <div className="flex flex-row items-center justify-end w-[50%]">
                <BasicLink target="/forgot-password" text="Forgot password" />
              </div>
            </div>
          </div>
        </form >
      </div >
    </>
  );
};
export default Login;