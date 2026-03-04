import { useJobs, useCreateJob } from "@/hooks/use-jobs";
import { useAuth } from "@/hooks/use-auth";
import { Card, Button, Input, Textarea, Label } from "@/components/ui-elements";
import { Plus, Users, Briefcase } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const createJobMutation = useCreateJob();
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: user?.fullName || "",
    location: "",
    salary: "",
    description: "",
    requirements: ""
  });

  const myJobs = jobs?.filter(j => j.employerId === user?.id) || [];

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJobMutation.mutateAsync(formData);
    setIsCreating(false);
    setFormData({ title: "", company: user?.fullName || "", location: "", salary: "", description: "", requirements: "" });
  };

  if (jobsLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Employer Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings and find the perfect candidates.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" /> Post New Job
        </Button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10"
          >
            <Card className="p-8 border-primary/50 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
              <h2 className="text-2xl font-bold mb-6 text-primary">Create Job Posting</h2>
              <form onSubmit={handleCreateJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Remote / New York, NY" />
                  </div>
                  <div className="space-y-2">
                    <Label>Salary Range (Optional)</Label>
                    <Input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="$100k - $130k" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Job Description</Label>
                  <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[150px]" />
                </div>
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <Textarea required value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} placeholder="List skills and qualifications..." />
                </div>
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                  <Button type="submit" isLoading={createJobMutation.isPending}>Publish Job</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-2xl font-bold mb-6">Your Active Postings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myJobs.length > 0 ? myJobs.map(job => (
          <Card key={job.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-white">{job.title}</h4>
                <p className="text-primary text-sm">{job.location}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{job.description}</p>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-sm text-muted-foreground flex items-center">
                <Users className="w-4 h-4 mr-2" /> Applications
              </span>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/employer/applications'}>
                View Candidates
              </Button>
            </div>
          </Card>
        )) : (
          <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl glass-panel">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No active postings</h3>
            <p className="text-muted-foreground mb-4">You haven't posted any jobs yet.</p>
            <Button onClick={() => setIsCreating(true)}>Create Your First Job</Button>
          </div>
        )}
      </div>
    </div>
  );
}
