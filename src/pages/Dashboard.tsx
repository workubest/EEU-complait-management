import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentComplaints } from '@/components/dashboard/RecentComplaints';
import { useAuth } from '@/contexts/AuthContext';

export function Dashboard() {
  const { user, role } = useAuth();

  const getWelcomeMessage = () => {
    const messages = {
      admin: 'System Administration Overview',
      manager: 'Regional Management Overview',
      foreman: 'Field Operations Overview',
      operator: 'Control Room Overview',
      technician: 'Your Assigned Tasks'
    };
    return messages[role];
  };

  return (
    <div className="space-y-6">
      {/* Animated, branded header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-extrabold text-primary drop-shadow-sm tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
          {getWelcomeMessage()}
        </p>
      </div>

      {/* Stats Cards - modern, interactive card */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="rounded-xl border-none shadow-card bg-gradient-to-br from-primary/10 to-primary-glow/10 p-4 hover:shadow-elevated hover:scale-[1.02] transition-all duration-300 group">
          <StatsCards />
        </div>
      </div>

      {/* Recent Complaints - modern, interactive card */}
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="rounded-xl border-none shadow-card bg-gradient-to-br from-success/10 to-primary-glow/10 p-4 hover:shadow-elevated hover:scale-[1.02] transition-all duration-300 group">
          <RecentComplaints />
        </div>
      </div>
    </div>
  );
}