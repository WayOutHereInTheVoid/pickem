# NFL Pick'em League Manager

This is a web application for managing an NFL pick'em league. It allows a league manager to set up the weekly games, and for users to submit their picks. The application also calculates scores and displays standings.

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

3. Create a `.env` file in the root of the project and add your Supabase URL and anon key:

   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

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

- **Home**: The landing page of the application.
- **Submit Picks**: A page where users can submit their picks for the week.
- **Standings**: A page that displays the current standings of the league.
- **Manager**: A page where the league manager can set up the weekly games, import picks, and enter results.

### Manager Account Setup

Before you can use the manager features, you will need to set up a manager account. To do this, navigate to the `/manager-setup` page. You will be prompted to create a manager account with an email and password.

Once you have created a manager account, you can log in to the manager page to access the manager features.
