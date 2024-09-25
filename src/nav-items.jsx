import { HomeIcon, BarChartIcon, UserIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import Standings from "./pages/Standings.jsx";
import ManagerPage from "./pages/ManagerPage.jsx";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Standings",
    to: "/standings",
    icon: <BarChartIcon className="h-4 w-4" />,
    page: <Standings />,
  },
  {
    title: "Manager Login",
    to: "/manager",
    icon: <UserIcon className="h-4 w-4" />,
    page: <ManagerPage />,
  },
];
