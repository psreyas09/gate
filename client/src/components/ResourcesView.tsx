import React, { useState } from 'react';
import {
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Users,
  Search,
  Sparkles,
  Bookmark,
  GraduationCap,
  Code
} from 'lucide-react';

interface ResourceItem {
  title: string;
  category: 'videos' | 'notes' | 'cheatsheets' | 'books' | 'community';
  url: string;
  source: string;
  description: string;
  badge?: string;
  isHighYield?: boolean;
}

const curatedResources: ResourceItem[] = [
  // 1. Official Video Lectures
  {
    title: 'NPTEL Official GATE Video Portal (CSE & IT)',
    category: 'videos',
    url: 'https://gate.nptel.ac.in/video.php?branchID=2&cid=1',
    source: 'NPTEL / IIT Professors',
    description: 'Official, authoritative subject-wise video lectures recorded by IIT professors specifically for GATE CSE. Free and strictly syllabus-aligned.',
    badge: 'Official IIT',
    isHighYield: true
  },
  {
    title: 'Computer Networks Complete GATE Playlist',
    category: 'videos',
    url: 'https://www.youtube.com/playlist?list=PLOG_8OlGMp73hMyn-WX1M2Q4ON98DmaRq',
    source: 'Ankit Doyla Sir (Unacademy)',
    description: 'In-depth conceptual lectures covering OSI/TCP-IP, Subnetting, Flow Control, and Application layer protocols.',
    badge: 'YouTube High-Yield',
    isHighYield: true
  },
  {
    title: 'Theory of Computation (TOC) GATE Playlist',
    category: 'videos',
    url: 'https://www.youtube.com/playlist?list=PLOG_8OlGMp72SAVxAk3VwEKQNbLkpN4Vs',
    source: 'Ankit Doyla Sir (Unacademy)',
    description: 'Crystal-clear walk-through of Finite Automata, DFA minimization, and regular expression shortcuts.',
    badge: 'YouTube Playlist'
  },

  // 2. Structured Notes
  {
    title: 'PhysicsWallah (PW) Free GATE CSE Notes',
    category: 'notes',
    url: 'https://www.pw.live/exams/gate/gate-cse-notes/',
    source: 'PhysicsWallah',
    description: 'Well-structured, comprehensive topic notes and downloadable PDF study material covering all key GATE CSE subjects.',
    badge: 'Top Free Notes',
    isHighYield: true
  },
  {
    title: 'GATE CSE Resource Hub (gatecse.in)',
    category: 'notes',
    url: 'https://gatecse.in/gate-cse-resources/',
    source: 'GateCSE.in',
    description: 'A legendary central repository of GATE CSE standard PDFs, syllabus breakdowns, and previous year answer explanations.',
    badge: 'Community Classic',
    isHighYield: true
  },
  {
    title: 'GATE & CSE Resources Repository',
    category: 'notes',
    url: 'https://github.com/baquer/GATE-and-CSE-Resources-for-Students',
    source: 'GitHub Open Source',
    description: 'A curated GitHub repository containing organized study materials, handwritten toppers notes, and subject folders.',
    badge: 'GitHub Repo'
  },
  {
    title: 'GATE CSE 2027 Resource Hub & PYQs',
    category: 'notes',
    url: 'https://gist.github.com/Alimammiya/0768324e8d07c17a69c787d7782593d9',
    source: 'GitHub Gist',
    description: 'Free study material, subject-wise notes, previous year questions (PYQs), and curated resources targeted for GATE CSE 2027.',
    badge: 'Target 2027'
  },
  {
    title: 'Curated Notes & Past Papers (Google Drive)',
    category: 'notes',
    url: 'https://drive.google.com/drive/folders/1_Y5ifg_kljqmOyIJqBwe5y0MkEX8tOi7',
    source: 'Community Reddit Drive',
    description: 'Collection of handwritten notes, coaching materials, and past question papers shared by qualified students.',
    badge: 'Drive Folder'
  },

  // 3. Formula Sheets & Last Minute Notes
  {
    title: 'GeeksforGeeks Last Minute Notes (LMNs)',
    category: 'cheatsheets',
    url: 'https://www.geeksforgeeks.org/last-minute-notes-lmns/',
    source: 'GeeksforGeeks',
    description: 'Essential formula sheets, algorithmic complexities, and quick revision bullet points for rapid pre-exam recall across CSE subjects.',
    badge: 'Formula Sheets',
    isHighYield: true
  },
  {
    title: 'GATE Exam & Placement Guide Mobile App',
    category: 'cheatsheets',
    url: 'https://play.google.com/store/apps/details?id=com.dps.b_t',
    source: 'Google Play Store',
    description: 'Free mobile reference app containing handwritten formula sheets, PDFs, and quick revision cards for on-the-go review.',
    badge: 'Mobile App'
  },

  // 4. Programming Books
  {
    title: 'GoalKicker Free Programming Tech Books',
    category: 'books',
    url: 'https://goalkicker.com/',
    source: 'GoalKicker',
    description: 'Free, high-quality reference books compiled from Stack Overflow documentation for C, Algorithms, and Data Structures.',
    badge: 'Free Books'
  },
  {
    title: 'Madhurima Rawat Semester & Code Notes',
    category: 'books',
    url: 'https://github.com/madhurimarawat/Semester-Notes',
    source: 'GitHub',
    description: 'Comprehensive college semester notes, implemented code examples, and CS topic summaries from the source gist.',
    badge: 'Code & Notes'
  },

  // 5. Discussion Communities
  {
    title: 'CSE GATE Notes Telegram Discussion Group',
    category: 'community',
    url: 'https://t.me/cse_gatenotes',
    source: 'Telegram',
    description: 'Active discussion community for GATE CSE aspirants to discuss tricky questions, share notes, and clear exam doubts.',
    badge: 'Active Group'
  },
  {
    title: 'GATE Data Science & AI Community',
    category: 'community',
    url: 'https://t.me/+VUcQzNznBcg3NWI1',
    source: 'Telegram',
    description: 'Discussion channel dedicated to the new GATE DA paper, covering Probability, Linear Algebra, Machine Learning, and Python.',
    badge: 'DA & AI'
  }
];

export const ResourcesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredResources = curatedResources.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5 shrink-0" /> Curated Reference Hub
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
          GATE CSE &amp; IT Free Study Resources
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          A collection of the highest-rated free resources for GATE CSE preparation: official NPTEL IIT video lectures, PhysicsWallah structured notes, GeeksforGeeks formula sheets, and verified community materials.
        </p>

        {/* Source citation */}
        <div className="pt-1.5 text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5">
          <span>Sourced &amp; verified from:</span>
          <a
            href="https://gist.github.com/madhurimarawat/376ed280655bbd1a8d712741f282a08c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1"
          >
            madhurimarawat/GATE-CSE-Resources Gist <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Category Pills (Horizontal scrolling on mobile) */}
        <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
          <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 min-w-max">
            {[
              { id: 'all', label: 'All Resources', icon: Bookmark },
              { id: 'videos', label: 'Video Lectures', icon: Video },
              { id: 'notes', label: 'PDF Notes', icon: FileText },
              { id: 'cheatsheets', label: 'Formula Sheets', icon: Sparkles },
              { id: 'books', label: 'Books & Code', icon: Code },
              { id: 'community', label: 'Community', icon: Users },
            ].map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 touch-manipulation whitespace-nowrap min-h-[36px] ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search resources, topics..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 min-h-[38px]"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredResources.map((item, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-lg group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  {item.source}
                </span>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.isHighYield
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                {item.category}
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
              >
                <span>Open Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
