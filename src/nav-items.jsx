import { HomeIcon, BarChartIcon, UserIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import Standings from "./pages/Standings.jsx";
import HistoricalStandings from "./pages/HistoricalStandings.jsx";
import ManagerPage from "./pages/ManagerPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";

/**
 * @typedef {Object} NavItem
 * @property {string} title - The title of the navigation item.
 * @property {string} to - The path to navigate to.
 * @property {React.ReactNode} icon - The icon for the navigation item.
 * @property {React.ReactNode} page - The page component to render.
 * @property {boolean} [hidden] - Whether the navigation item is hidden.
 */

/**
 * An array of navigation items.
 * @type {Array<NavItem>}
 */
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
    title: "Contest 1 Results",
    to: "/historical-standings",
    icon: <BarChartIcon className="h-4 w-4" />,
    page: <HistoricalStandings />,
  },
  {
    title: "Manager Login",
    to: "/manager",
    icon: <UserIcon className="h-4 w-4" />,
    page: <ManagerPage />,
  },
  {
    title: "Auth Callback",
    to: "/auth/callback",
    icon: null,
    page: <AuthCallback />,
    hidden: true // Hide from navigation menu
  },
];
