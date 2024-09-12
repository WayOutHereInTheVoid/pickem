import { HomeIcon, CalendarIcon, CheckSquareIcon, TrophyIcon, BarChartIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import SetupGames from "./pages/SetupGames.jsx";
import SubmitPicks from "./pages/SubmitPicks.jsx";
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
    title: "Submit Picks",
    to: "/submit-picks",
    icon: <CheckSquareIcon className="h-4 w-4" />,
    page: <SubmitPicks />,
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