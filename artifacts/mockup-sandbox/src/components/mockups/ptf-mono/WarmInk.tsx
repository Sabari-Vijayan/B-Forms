import React from "react";
import {
  LayoutDashboard,
  PlusSquare,
  LogOut,
  MoreVertical,
  Users,
  Calendar,
  Settings,
  Edit2,
  Trash2,
  Share,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const FORMS_DATA = [
  {
    id: 1,
    title: "Customer Feedback Q3",
    status: "published",
    date: "Oct 12, 2023",
    responses: 142,
  },
  {
    id: 2,
    title: "Annual Event RSVP",
    status: "published",
    date: "Oct 15, 2023",
    responses: 89,
  },
  {
    id: 3,
    title: "Product Feature Survey",
    status: "draft",
    date: "Oct 18, 2023",
    responses: 0,
  },
  {
    id: 4,
    title: "Engineering Job Application",
    status: "published",
    date: "Oct 20, 2023",
    responses: 34,
  },
];

export function WarmInk() {
  return (
    <div 
      className="min-h-screen w-full flex font-serif" 
      style={{ backgroundColor: "#faf9f7", color: "#1a1814" }}
    >
      {/* Sidebar */}
      <div 
        className="w-64 border-r flex flex-col justify-between"
        style={{ backgroundColor: "#f5f3ef", borderColor: "#e8e4de" }}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div 
              className="w-6 h-6 rounded-sm" 
              style={{ backgroundColor: "#1a1814" }}
            />
            <span className="font-semibold text-lg tracking-tight font-sans">Prompt to Form</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 font-sans">
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: "#ede9e3", color: "#1a1814" }}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </a>
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-black/5"
              style={{ color: "#1a1814" }}
            >
              <PlusSquare className="w-4 h-4" />
              Create Form
            </a>
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-black/5"
              style={{ color: "#1a1814" }}
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </nav>
        </div>

        {/* User / Footer */}
        <div 
          className="p-4 border-t"
          style={{ borderColor: "#e8e4de" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col font-sans">
              <span className="text-sm font-medium">Editor</span>
              <span className="text-xs opacity-70">editor@paper.inc</span>
            </div>
            <button className="p-2 hover:bg-black/5 rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        {/* Header */}
        <header 
          className="px-8 py-8 border-b flex items-center justify-between sticky top-0 z-10"
          style={{ backgroundColor: "#faf9f7", borderColor: "#e8e4de" }}
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Forms</h1>
            <p className="text-sm mt-1 opacity-70 font-sans">Manage and create your digital publications.</p>
          </div>
          <Button 
            className="font-sans border-0 shadow-none hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#1a1814", color: "#faf9f7" }}
          >
            <PlusSquare className="w-4 h-4 mr-2" />
            New Form
          </Button>
        </header>

        {/* Form Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FORMS_DATA.map((form) => (
              <div 
                key={form.id} 
                className="rounded-lg p-6 flex flex-col justify-between transition-all hover:shadow-sm group"
                style={{ 
                  backgroundColor: "#ffffff", 
                  borderColor: "#e8e4de",
                  borderWidth: "1px",
                  borderStyle: "solid"
                }}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ 
                          backgroundColor: form.status === "published" ? "#1a1814" : "transparent",
                          border: form.status === "published" ? "none" : "1px solid #1a1814"
                        }}
                      />
                      <span className="text-xs uppercase tracking-widest font-sans font-medium">
                        {form.status}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 -mr-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="font-sans rounded-none border"
                        style={{ 
                          backgroundColor: "#ffffff", 
                          borderColor: "#1a1814",
                          color: "#1a1814"
                        }}
                      >
                        <DropdownMenuItem className="cursor-pointer focus:bg-black/5 rounded-none">
                          <Edit2 className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer focus:bg-black/5 rounded-none">
                          <Share className="w-4 h-4 mr-2" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator style={{ backgroundColor: "#e8e4de" }} />
                        <DropdownMenuItem className="cursor-pointer focus:bg-black/5 rounded-none text-red-600 focus:text-red-700">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 leading-tight">{form.title}</h3>
                </div>

                <div 
                  className="mt-6 pt-4 border-t flex items-center justify-between text-sm font-sans"
                  style={{ borderColor: "#e8e4de", color: "rgba(26, 24, 20, 0.7)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{form.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{form.responses}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarmInk;
