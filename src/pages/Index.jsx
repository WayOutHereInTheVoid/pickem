import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Football Pick 'Em League Dashboard</h1>
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
    <Card className="bg-card hover:bg-secondary transition-colors duration-200">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link to={linkTo}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Go to {title}</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Index;
