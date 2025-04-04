
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenIcon, ClipboardListIcon, UserCheckIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.accountType === 'Admin';

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.firstName || 'User'}!
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Active SOPs" 
            value={24} 
            icon={<BookOpenIcon className="w-4 h-4" />}
            trend={{ value: 5, positive: true }}
          />
          
          <DashboardCard 
            title="Completed Quizzes" 
            value={userProfile?.quizScores?.length || 0} 
            icon={<ClipboardListIcon className="w-4 h-4" />}
          />
          
          <DashboardCard 
            title="Certifications" 
            value={12} 
            icon={<UserCheckIcon className="w-4 h-4" />}
          />
          
          <DashboardCard 
            title="Expiring Soon" 
            value={3} 
            icon={<AlertCircleIcon className="w-4 h-4" />}
            className="border-orange-200 bg-orange-50"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recently Updated SOPs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Placeholder for recent SOPs */}
              <p className="text-sm text-muted-foreground">
                {isAdmin 
                  ? "Your team has no recent SOP updates."
                  : "No recent SOP updates available."
                }
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Upcoming Due Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Placeholder for upcoming deadlines */}
              <p className="text-sm text-muted-foreground">
                No upcoming deadlines at this time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
