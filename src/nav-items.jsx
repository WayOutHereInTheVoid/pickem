import { HomeIcon, CalendarIcon, FileUpIcon, BarChartIcon, EditIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import SetupGames from "./pages/SetupGames.jsx";
import ImportPicks from "./pages/ImportPicks.jsx";
import Standings from "./pages/Standings.jsx";
import EditPicks from "./pages/EditPicks.jsx";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Set Up Games",
    to: "/setup-games",
    icon: <CalendarIcon className="h-4 w-4" />,
    page: <SetupGames />,
  },
  {
    title: "Import Picks",
    to: "/import-picks",
    icon: <FileUpIcon className="h-4 w-4" />,
    page: <ImportPicks />,
  },
  {
    title: "Edit Picks",
    to: "/edit-picks/:week",
    icon: <EditIcon className="h-4 w-4" />,
    page: <EditPicks />,
  },
  {
    title: "Standings",
    to: "/standings",
    icon: <BarChartIcon className="h-4 w-4" />,
    page: <Standings />,
  },
];
