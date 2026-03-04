import { useJobs } from "@/hooks/use-jobs";
import { useApply, useApplications } from "@/hooks/use-applications";
import { Card, Button, Badge } from "@/components/ui-elements";
import { Building2, MapPin, DollarSign, Clock, Search } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui-elements";

export default function StudentDashboard() {
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: applications } = useApplications();
  const applyMutation = useApply();
  const [searchTerm, setSearchTerm] = useState("");

  if (jobsLoading) return <div className="p-8 text-center"><span className="animate-pulse">Loading jobs...</span></div>;

  const appliedJobIds = new Set(applications?.map(app => app.jobId) || []);

  const filteredJobs = jobs?.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Discover Opportunities</h1>
          <p className="text-muted-foreground">Find and apply for the best roles matching your skills.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search roles, companies..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs?.map(job => (
          <Card key={job.id} className="flex flex-col h-full">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                {appliedJobIds.has(job.id) ? (
                  <Badge variant="success">Applied</Badge>
                ) : (
                  <Badge variant="outline">New</Badge>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{job.title}</h3>
              <p className="text-primary font-medium mb-4">{job.company}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" /> {job.location}
                </div>
                {job.salary && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2" /> {job.salary}
                  </div>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" /> {job.postedAt ? format(new Date(job.postedAt), 'MMM d, yyyy') : 'Recently'}
                </div>
              </div>

              <div className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {job.description}
              </div>
            </div>
            
            <div className="p-6 pt-0 mt-auto border-t border-white/5 flex gap-3 pt-4">
              <Button 
                className="w-full" 
                variant={appliedJobIds.has(job.id) ? "secondary" : "primary"}
                disabled={appliedJobIds.has(job.id) || applyMutation.isPending}
                onClick={() => applyMutation.mutate(job.id)}
              >
                {appliedJobIds.has(job.id) ? "Application Sent" : "Apply Now"}
              </Button>
            </div>
          </Card>
        ))}
        {filteredJobs?.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            No jobs found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
