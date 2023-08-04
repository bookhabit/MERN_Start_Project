import Header from "./Header";
import {Outlet} from "react-router-dom";

export default function Layout() {
  return (
    <div className="py-4 xs:px-0 sm:px-20 xl:px-60 2xl:px-96 flex flex-col min-h-screen mx-auto">
      <Header />
      <Outlet />
    </div>
  ); 
}