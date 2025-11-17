# NFL Pick'em League Manager

This is a web application for managing an NFL pick'em league. It provides a comprehensive suite of tools for league managers to streamline league operations and for participants to engage with the league.

## Core Features

- **Automated Score Calculation**: Automatically calculates weekly and cumulative scores based on submitted picks and game results.
- **Dynamic Standings**: Displays real-time weekly and cumulative standings, with detailed views for each participant.
- **Manager Dashboard**: A dedicated dashboard for league managers to import weekly picks, set game winners, and manage league data.
- **Secure Authentication**: Utilizes Supabase for secure user authentication and management.
- **Responsive Design**: A modern and responsive user interface built with Tailwind CSS and shadcn/ui.

## Technologies Used

This project is built with the following technologies:

- **Vite**: A fast build tool for modern web projects.
- **React**: A JavaScript library for building user interfaces.
- **shadcn/ui**: A collection of re-usable UI components.
- **Tailwind CSS**: A utility-first CSS framework.
- **Supabase**: A backend-as-a-service platform for building secure and scalable applications.
- **React Router**: A routing library for React.
- **Framer Motion**: A library for creating animations.

## Getting Started

To get started with this project, you will need to have Node.js and npm installed on your machine. You will also need to have a Supabase account.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/nfl-pickem-league.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add your Supabase project URL and anon key:

   ```
   VITE_SUPABASE_PROJECT_URL=your-supabase-project-url
   VITE_SUPABASE_API_KEY=your-supabase-anon-key
   ```

   You can find these in your Supabase project settings.

### Database Setup

The database schema is defined in `src/supabase/schema.sql`. You can use the Supabase UI to run this script and set up the necessary tables and functions.

### Running the Project

To run the project in development mode, run the following command:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

### Building the Project

To build the project for production, run the following command:

```bash
npm run build
```

This will create a `dist` directory with the production-ready files.

## Usage

The application has the following pages:

- **Dashboard**: The landing page of the application, displaying a summary of the league.
- **Standings**: A page that displays the current weekly and cumulative standings of the league.
- **Manager**: A page where the league manager can log in to access the manager dashboard.

### Manager Account Setup

Before you can use the manager features, you will need to set up a manager account. To do this, navigate to the `/manager-setup` page. You will be prompted to create a manager account with an email and password.

Once you have created a manager account, you can log in to the manager page to access the manager features, which include:

- **Importing Picks**: Paste poll results to import weekly picks for all participants.
- **Setting Game Winners**: Designate the winning team for each game of the week.
- **Calculating Scores**: Automatically calculate and save weekly and cumulative scores.
