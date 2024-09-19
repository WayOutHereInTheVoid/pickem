import { HomeIcon, FileUpIcon, BarChartIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import ImportPicks from "./pages/ImportPicks.jsx";
import Standings from "./pages/Standings.jsx";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Import Picks",
    to: "/import-picks",
    icon: <FileUpIcon className="h-4 w-4" />,
    page: <ImportPicks />,
  },
  {
    title: "Standings",
    to: "/standings",
    icon: <BarChartIcon className="h-4 w-4" />,
    page: <Standings />,
  },
];
