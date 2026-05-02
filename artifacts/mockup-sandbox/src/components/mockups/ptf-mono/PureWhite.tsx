import React from 'react';
import { LayoutDashboard, Plus, LogOut, FileText, Check, Circle, Edit, Share2, Eye } from 'lucide-react';

export function PureWhite() {
  const forms = [
    { title: "Customer Feedback Survey", status: "published", date: "Oct 12, 2026", responses: 142 },
    { title: "Event RSVP", status: "published", date: "Oct 10, 2026", responses: 89 },
    { title: "Product Survey", status: "draft", date: "Oct 05, 2026", responses: 0 },
    { title: "Job Application", status: "draft", date: "Sep 28, 2026", responses: 0 },
  ];

  return (
    <div className="min-h-screen w-full overflow-auto bg-white text-black font-sans flex">
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 border-r border-[#e5e5e5] h-screen sticky top-0 flex flex-col justify-between bg-white">
        <div>
          <div className="px-6 py-6 border-b border-[#e5e5e5] flex items-center gap-3">
            <div className="w-7 h-7 bg-black flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold tracking-tight">P</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">Prompt to Form</span>
          </div>
          
          <nav className="p-4 flex flex-col gap-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium border-b border-black">
              <LayoutDashboard size={16} />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-black transition-colors">
              <Plus size={16} />
              Create Form
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-[#e5e5e5]">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex-1 overflow-hidden mr-2">
              <p className="text-xs font-medium text-gray-500 truncate">user@example.com</p>
            </div>
            <button className="text-gray-500 hover:text-black transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 lg:p-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-2">Manage your forms and view responses.</p>
            </div>
            <button className="bg-black text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Plus size={16} />
              New Form
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form, i) => (
              <div key={i} className="border border-[#e5e5e5] p-6 hover:border-black transition-colors bg-white group flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2.5 border border-[#e5e5e5] inline-block">
                    <FileText size={20} className="text-black" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-black"><Edit size={16} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-black"><Share2 size={16} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-black"><Eye size={16} /></button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-base mb-1 truncate">{form.title}</h3>
                
                <div className="mt-auto pt-6 flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 border text-xs font-medium uppercase tracking-wider ${form.status === 'published' ? 'border-black text-black' : 'border-[#e5e5e5] text-gray-500'}`}>
                      {form.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 text-xs">
                    <span>{form.responses} responses</span>
                    <span>{form.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
