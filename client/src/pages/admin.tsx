import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui-elements";
import { Check, X, Shield } from "lucide-react";

export default function AdminPage() {
  const { toast } = useToast();
  
  const { data: verifications, isLoading } = useQuery({
    queryKey: [api.admin.listPendingVerifications.path],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(buildUrl(api.admin.approveVerification.path, { id }), {
        method: 'POST',
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.listPendingVerifications.path] });
      toast({ title: "Verification approved" });
    },
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 w-full">
      <div className="flex items-center space-x-3">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-display font-bold text-white">Admin Panel</h1>
      </div>

      <div className="grid gap-6">
        <Card className="glass-panel border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Pending Verification Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {verifications?.length === 0 ? (
              <p className="text-muted-foreground">No pending requests.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {verifications?.map((v: any) => (
                  <div key={v.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{v.user.fullName}</p>
                      <p className="text-sm text-muted-foreground">@{v.user.username} • {v.user.role}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => approveMutation.mutate(v.id)} isLoading={approveMutation.isPending}>
                        <Check className="w-4 h-4 mr-2" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
