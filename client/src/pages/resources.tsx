import { useResources } from "@/hooks/use-resources";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button, Input, Textarea } from "@/components/ui-elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Link as LinkIcon, Video, Plus, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ResourcesPage() {
  const { resources = [], create, isLoading } = useResources();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "note",
    company: ""
  });

  const handleCreate = async () => {
    await create(formData);
    setIsOpen(false);
    setFormData({ title: "", content: "", type: "note", company: "" });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-red-400" />;
      case 'link': return <LinkIcon className="w-5 h-5 text-blue-400" />;
      default: return <FileText className="w-5 h-5 text-yellow-400" />;
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading resources...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 w-full">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-white">Resource Sharing</h1>
          <p className="text-muted-foreground">Access notes, interview questions, and senior placement videos.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={(open) => {
          if (open && !user) {
            setLocation("/auth");
            return;
          }
          setIsOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Share Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Share a New Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={formData.type} onValueChange={v => setFormData(prev => ({ ...prev, type: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-panel border-white/10 text-white">
                    <SelectItem value="note">Note / Interview Q&A</SelectItem>
                    <SelectItem value="link">Useful Link</SelectItem>
                    <SelectItem value="video">Placement Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Link or Content</label>
                <Textarea 
                  value={formData.content} 
                  onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company (Optional)</label>
                <Input 
                  value={formData.company} 
                  onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">Share</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((r: any) => (
          <Card key={r.id} className="glass-panel border-white/5 hover-elevate transition-all group">
            <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {getIcon(r.type)}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-bold text-white truncate">{r.title}</CardTitle>
                <p className="text-xs text-muted-foreground truncate">
                  by {r.author.fullName} • {formatDistanceToNow(new Date(r.createdAt))} ago
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {r.company && (
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                  {r.company}
                </Badge>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {r.content}
              </p>
              {r.type === 'link' || r.type === 'video' ? (
                <a 
                  href={r.content.startsWith('http') ? r.content : `https://${r.content}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-xs font-bold text-primary hover:underline"
                >
                  View Resource <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
