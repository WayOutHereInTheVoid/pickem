This application is a comprehensive tool designed to manage an NFL Pick'em league. It serves both league managers and participants by providing a centralized platform for all league-related activities.

**For Participants:**

*   **Dashboard:** Upon visiting the application, users are greeted with a dashboard that provides a high-level overview of the league. This includes a leaderboard showing the top participants and quick links to other sections of the app.
*   **Standings:** Participants can view detailed standings, both for the current week and cumulatively for the entire season. The standings page includes features like searching for specific teams and seeing how ranks have changed from the previous week.

**For League Managers:**

*   **Secure Login:** A dedicated login page ensures that only authorized managers can access the administrative features.
*   **Manager Dashboard:** Once logged in, managers have access to a powerful dashboard where they can:
    *   **Import Picks:** Rather than manually entering each participant's pick for the week, managers can simply paste the results from a poll (e.g., from a messaging app or social media) into a text area. The application will then parse this data and automatically assign picks to the correct participants.
    *   **Set Game Winners:** After the real-world NFL games have been played, the manager can go through a list of the week's matchups and select the winning team for each.
    *   **Calculate Scores:** With the click of a button, the application will compare the imported picks against the game winners and calculate the weekly scores for each participant. These scores are then automatically added to the cumulative standings.
*   **Data Export:** Managers can export the weekly results to an HTML file, which can be easily shared with league participants.

**Technical Details:**

*   **Frontend:** The application is built as a single-page application using **React** and **Vite**. It features a modern, responsive user interface built with **Tailwind CSS** and a component library called **shadcn/ui**.
*   **Backend:** The backend is powered by **Supabase**, a backend-as-a-service platform. Supabase provides the database for storing all league data (picks, scores, games, etc.) as well as the authentication system for the manager login.
*   **Data Fetching:** The application uses **React Query** to manage data fetching from the Supabase backend, providing a robust and efficient way to keep the displayed data up-to-date.
*   **External APIs:** The application also integrates with external APIs to fetch real-time NFL game data, such as scores and schedules. This ensures that the information displayed in the app is always accurate.

In summary, this NFL Pick'em League Manager is a one-stop solution for running a pick'em league, automating many of the tedious tasks involved and providing a fun and engaging experience for participants.
