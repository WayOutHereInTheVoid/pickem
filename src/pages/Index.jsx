import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Football Pick 'Em League Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="Set Up Games"
            description="Input this week's matchups and results"
            linkTo="/setup-games"
          />
          <DashboardCard
            title="Import Picks"
            description="Import picks from poll results"
            linkTo="/import-picks"
          />
          <DashboardCard
            title="View Standings"
            description="See weekly and cumulative standings"
            linkTo="/standings"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, linkTo }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link to={linkTo}>
        <Button>Go to {title}</Button>
      </Link>
    </div>
  );
};

export default Index;
