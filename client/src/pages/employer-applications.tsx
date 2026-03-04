import { useApplications, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { useJobs } from "@/hooks/use-jobs";
import { useAuth } from "@/hooks/use-auth";
import { Card, Button, Badge } from "@/components/ui-elements";
import { format } from "date-fns";
import { Check, X, FileText, Mail, User } from "lucide-react";

export default function EmployerApplicationsPage() {
  const { user } = useAuth();
  const { data: applications, isLoading: appsLoading } = useApplications();
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const updateStatus = useUpdateApplicationStatus();

  if (appsLoading || jobsLoading) return <div className="p-8 text-center animate-pulse">Loading candidates...</div>;

  // Filter jobs owned by employer
  const myJobIds = new Set(jobs?.filter(j => j.employerId === user?.id).map(j => j.id) || []);
  
  // Filter applications for those jobs
  const myApplications = applications?.filter(app => myJobIds.has(app.jobId)) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Candidate Applications</h1>
        <p className="text-muted-foreground">Review and manage candidates applying for your roles.</p>
      </div>

      <div className="space-y-6">
        {myApplications.length > 0 ? myApplications.map(app => {
          const job = jobs?.find(j => j.id === app.jobId);
          
          return (
            <Card key={app.id} className="p-6 md:p-8 border-l-4 border-l-primary flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'} className="uppercase">
                    {app.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Applied on {app.appliedAt ? format(new Date(app.appliedAt), 'MMM d, yyyy') : 'Unknown'}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-1 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  {app.student?.fullName || "Candidate"}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Applying for <strong className="text-foreground">{job?.title || "Unknown Role"}</strong>
                </p>

                <div className="bg-black/30 rounded-xl p-4 mb-4 border border-white/5">
                  <h4 className="text-sm font-semibold text-primary mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Candidate Profile
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2"><span className="text-white">Bio:</span> {app.student?.bio || "No bio provided."}</p>
                  <p className="text-sm text-muted-foreground"><span className="text-white">Skills:</span> {app.student?.skills || "Not specified."}</p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 justify-center md:min-w-[160px]">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => alert('Feature coming soon: Contact candidate')}
                >
                  <Mail className="w-4 h-4 mr-2" /> Contact
                </Button>
                {app.status === 'pending' && (
                  <>
                    <Button 
                      variant="primary"
                      className="w-full justify-start bg-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)] text-white"
                      isLoading={updateStatus.isPending}
                      onClick={() => updateStatus.mutate({ id: app.id, status: 'accepted' })}
                    >
                      <Check className="w-4 h-4 mr-2" /> Accept
                    </Button>
                    <Button 
                      variant="danger" 
                      className="w-full justify-start"
                      isLoading={updateStatus.isPending}
                      onClick={() => updateStatus.mutate({ id: app.id, status: 'rejected' })}
                    >
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        }) : (
          <div className="text-center py-20 glass-panel rounded-2xl border border-dashed border-white/10">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground">When candidates apply to your jobs, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
