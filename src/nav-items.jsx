import { HomeIcon, CalendarIcon, FileUpIcon, TrophyIcon, BarChartIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import SetupGames from "./pages/SetupGames.jsx";
import ImportPicks from "./pages/ImportPicks.jsx";
import EnterResults from "./pages/EnterResults.jsx";
import Standings from "./pages/Standings.jsx";

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
    title: "Enter Results",
    to: "/enter-results",
    icon: <TrophyIcon className="h-4 w-4" />,
    page: <EnterResults />,
  },
  {
    title: "Standings",
    to: "/standings",
    icon: <BarChartIcon className="h-4 w-4" />,
    page: <Standings />,
  },
];