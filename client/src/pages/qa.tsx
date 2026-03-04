import { useQA } from "@/hooks/use-qa";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useLocation } from "wouter";

import { Button, Input, Textarea } from "@/components/ui-elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function QAPage() {
  const { questions = [], ask, answer, isLoading } = useQA();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState<Record<number, string>>({});

  const handleAsk = async () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    if (!newQuestion.trim()) return;
    await ask({ content: newQuestion });
    setNewQuestion("");
  };

  const handleAnswer = async (questionId: number) => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    const content = newAnswers[questionId];
    if (!content?.trim()) return;
    await answer({ questionId, content });
    setNewAnswers(prev => ({ ...prev, [questionId]: "" }));
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading discussions...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 w-full">
      <div className="space-y-4">
        <h1 className="text-3xl font-display font-bold text-white">Q&A Discussion Forum</h1>
        <p className="text-muted-foreground">Interact with seniors and peers to resolve your queries.</p>
      </div>

      <Card className="glass-panel border-white/5">
        <CardContent className="pt-6 space-y-4">
          <Textarea 
            placeholder="What is your question?" 
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="bg-white/5 border-white/10 text-white min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleAsk} disabled={!newQuestion.trim()}>
              Post Question
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {questions.map((q: any) => (
          <Card key={q.id} className="glass-panel border-white/5 overflow-visible">
            <CardHeader className="flex flex-row items-start space-x-4 space-y-0">
              <Avatar className="w-10 h-10 border border-white/10">
                <AvatarFallback className="bg-primary/20 text-primary">
                  {q.author.fullName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{q.author.fullName}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(q.createdAt))} ago
                  </span>
                </div>
                <p className="text-foreground">{q.content}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pl-14 space-y-4 border-l border-white/5">
                {q.answers.map((a: any) => (
                  <div key={a.id} className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 border border-white/10">
                      <AvatarFallback className="bg-accent/20 text-accent text-xs">
                        {a.author.fullName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{a.author.fullName}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(a.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{a.content}</p>
                    </div>
                  </div>
                ))}

                <div className="flex items-center space-x-2 pt-2">
                  <Input 
                    placeholder="Write an answer..." 
                    value={newAnswers[q.id] || ""}
                    onChange={(e) => setNewAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white h-9 text-sm"
                  />
                  <Button size="sm" onClick={() => handleAnswer(q.id)} disabled={!newAnswers[q.id]?.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
