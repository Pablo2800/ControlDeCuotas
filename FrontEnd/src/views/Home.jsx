import { Toaster } from "react-hot-toast";
import NavBar from "../components/NavBar";
import AllSocios from "./AllSocios";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen h-full items-center">
      <NavBar />
      <div className="mt-5 w-11/12">
        <AllSocios />
      </div>
      <Toaster />
    </div>
  );
}
