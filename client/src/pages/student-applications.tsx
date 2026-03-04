import { useApplications } from "@/hooks/use-applications";
import { useJobs } from "@/hooks/use-jobs";
import { useAuth } from "@/hooks/use-auth";
import { Card, Badge, Button } from "@/components/ui-elements";
import { format } from "date-fns";
import { Link } from "wouter";
import { Briefcase, Building2, MapPin, Calendar, ExternalLink } from "lucide-react";

export default function StudentApplicationsPage() {
  const { user } = useAuth();
  const { data: applications, isLoading: appsLoading } = useApplications();
  const { data: jobs, isLoading: jobsLoading } = useJobs();

  if (appsLoading || jobsLoading) return <div className="p-8 text-center animate-pulse">Loading your applications...</div>;

  // Filter to only show the student's own applications
  const myApplications = applications?.filter(app => app.studentId === user?.id) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track the status of roles you've applied for.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {myApplications.length > 0 ? myApplications.map(app => {
          const job = jobs?.find(j => j.id === app.jobId);
          
          return (
            <Card key={app.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:bg-white/[0.02]">
              <div className="flex items-start gap-6">
                <div className="hidden md:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white/80" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{job?.title || "Unknown Role"}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center text-primary font-medium">
                      <Building2 className="w-4 h-4 mr-1.5" /> {job?.company || "Unknown Company"}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1.5" /> {job?.location || "N/A"}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" /> Applied {app.appliedAt ? format(new Date(app.appliedAt), 'MMM d, yyyy') : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                <Badge 
                  variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'} 
                  className="px-4 py-1.5 text-sm uppercase tracking-wider"
                >
                  {app.status}
                </Badge>
                <Link href="/dashboard" className="text-sm text-primary hover:underline flex items-center">
                  Find more jobs <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </Card>
          );
        }) : (
          <div className="text-center py-20 glass-panel rounded-2xl border border-dashed border-white/10">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-6">You haven't applied to any jobs yet. Start exploring!</p>
            <Link href="/dashboard">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
