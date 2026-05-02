import React from "react";
import { 
  LayoutDashboard, 
  PlusSquare, 
  LogOut, 
  MoreVertical,
  ExternalLink,
  Edit2,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DeepBlack() {
  const forms = [
    { id: 1, title: "Customer Feedback", status: "published", date: "2023-10-25", responses: 142 },
    { id: 2, title: "Event RSVP", status: "published", date: "2023-10-20", responses: 89 },
    { id: 3, title: "Product Survey", status: "draft", date: "2023-10-18", responses: 0 },
    { id: 4, title: "Job Application", status: "draft", date: "2023-10-15", responses: 0 },
  ];

  return (
    <div className="min-h-screen w-full overflow-auto bg-[#0a0a0a] text-[#fafafa] font-mono selection:bg-[#fafafa] selection:text-[#0a0a0a]">
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-[#1f1f1f] bg-[#111111] flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-[#1f1f1f]">
            <div className="w-6 h-6 bg-[#fafafa] mr-3"></div>
            <span className="font-bold tracking-tight">PROMPT_TO_FORM</span>
          </div>

          <div className="flex-1 py-6 px-4 flex flex-col gap-2">
            <button className="flex items-center w-full px-4 py-2 text-sm font-medium bg-transparent border-l-2 border-[#fafafa] text-[#fafafa] transition-colors">
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm font-medium border-l-2 border-transparent text-[#888888] hover:text-[#fafafa] transition-colors">
              <PlusSquare className="w-4 h-4 mr-3" />
              Create Form
            </button>
          </div>

          <div className="p-4 border-t border-[#1f1f1f]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#888888] truncate">admin@system.local</span>
              <button className="text-[#888888] hover:text-[#fafafa] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-auto">
          <header className="h-16 flex items-center justify-between px-8 border-b border-[#1f1f1f]">
            <h1 className="text-lg font-medium">Dashboard</h1>
            <Button className="bg-[#fafafa] text-[#0a0a0a] hover:bg-[#e0e0e0] rounded-none h-9 px-4 font-medium">
              <PlusSquare className="w-4 h-4 mr-2" />
              New Form
            </Button>
          </header>

          <div className="p-8 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <Card key={form.id} className="bg-[#111111] border-[#1f1f1f] rounded-none overflow-hidden flex flex-col hover:border-[#333333] transition-colors">
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-lg leading-tight">{form.title}</h3>
                      <button className="text-[#888888] hover:text-[#fafafa]">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between text-sm">
                      <div className="text-[#888888]">{form.date}</div>
                      {form.status === "published" ? (
                        <div className="px-2 py-0.5 bg-[#2a2a2a] text-[#fafafa] text-xs font-medium tracking-wide">
                          PUBLISHED
                        </div>
                      ) : (
                        <div className="px-2 py-0.5 text-[#888888] border border-[#333333] text-xs font-medium tracking-wide">
                          DRAFT
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-[#1f1f1f] p-3 flex justify-between items-center bg-[#0a0a0a]">
                    <div className="text-xs text-[#888888]">
                      {form.responses} responses
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-[#888888] hover:text-[#fafafa] hover:bg-[#1f1f1f] transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-[#888888] hover:text-[#fafafa] hover:bg-[#1f1f1f] transition-colors" disabled={form.status === 'draft'}>
                        <BarChart2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-[#888888] hover:text-[#fafafa] hover:bg-[#1f1f1f] transition-colors" disabled={form.status === 'draft'}>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DeepBlack;
