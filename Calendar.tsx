
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Video, 
  Clock, 
  CheckSquare, 
  Calendar as CalendarIcon,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Task, Meeting } from '../types';

interface CalendarProps {
  tasks: Task[];
  meetings: Meeting[];
}

export const CalendarView: React.FC<CalendarProps> = ({ tasks, meetings }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState<'all' | 'meetings' | 'tasks'>('all');
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= totalDays; i++) calendarDays.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));

  const getItemsForDay = (date: Date) => {
    const dayTasks = tasks.filter(t => {
      const d = new Date(t.dueDate);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    });
    const dayMeetings = meetings.filter(m => {
      const d = new Date(m.time);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    });
    return { dayTasks, dayMeetings };
  };

  const changeMonth = (offset: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1));
  };

  const activeAgendaItems = getItemsForDay(today);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Agency Schedule</h2>
          <p className="text-slate-400">Manage meetings and task deadlines in separate workflows.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-[#16161a] border border-slate-800 rounded-xl p-1 flex">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterType === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('meetings')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterType === 'meetings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Meetings
            </button>
            <button 
              onClick={() => setFilterType('tasks')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterType === 'tasks' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Tasks
            </button>
          </div>
          
          <div className="flex items-center bg-[#16161a] border border-slate-800 rounded-xl p-1">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 text-xs font-bold text-white min-w-[120px] text-center uppercase tracking-widest">
              {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
        {/* Main Grid View */}
        <div className="flex-[2] bg-[#16161a] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/40">
            {days.map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{day}</div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 overflow-y-auto">
            {calendarDays.map((date, idx) => {
              if (!date) return <div key={`empty-${idx}`} className="border-r border-b border-slate-800/30 bg-slate-900/10"></div>;
              
              const { dayTasks, dayMeetings } = getItemsForDay(date);
              const isToday = date.toDateString() === today.toDateString();
              
              return (
                <div 
                  key={idx} 
                  className={`min-h-[120px] border-r border-b border-slate-800/50 p-2.5 group transition-all hover:bg-slate-800/20 ${
                    isToday ? 'bg-blue-600/5' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold ${
                      isToday ? 'text-blue-500 bg-blue-500/10 w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-500'
                    }`}>
                      {date.getDate()}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {(filterType === 'all' || filterType === 'meetings') && dayMeetings.map(m => (
                      <div key={m.id} className="h-1.5 w-full bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/20 mb-0.5" title={`Meeting: ${m.title}`} />
                    ))}
                    {(filterType === 'all' || filterType === 'tasks') && dayTasks.map(t => (
                      <div key={t.id} className="h-1.5 w-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" title={`Task: ${t.title}`} />
                    ))}
                    
                    <div className="pt-2">
                       {/* Subtle labels in cell for desktop clarity */}
                       {dayMeetings.length > 0 && (filterType === 'all' || filterType === 'meetings') && (
                         <div className="text-[8px] font-bold text-indigo-400 uppercase truncate px-1">{dayMeetings.length} Meet</div>
                       )}
                       {dayTasks.length > 0 && (filterType === 'all' || filterType === 'tasks') && (
                         <div className="text-[8px] font-bold text-emerald-400 uppercase truncate px-1">{dayTasks.length} Task</div>
                       )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Separated Agenda Sidebar */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Meetings Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Video size={20} className="mr-2 text-indigo-400" />
                Planned Meetings
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-800/50 px-2 py-1 rounded">Today</span>
            </div>
            <div className="space-y-3">
              {activeAgendaItems.dayMeetings.length > 0 ? (
                activeAgendaItems.dayMeetings.map(m => (
                  <div key={m.id} className="bg-[#16161a] border border-slate-800 p-4 rounded-2xl hover:border-indigo-500/30 transition-all group shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors truncate pr-4">{m.title}</h4>
                      <Clock size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <div className="flex items-center">
                        <span className="text-indigo-400 mr-2">{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>• {m.duration}</span>
                      </div>
                      <button className="flex items-center text-indigo-400 hover:text-indigo-300">
                        Join <ExternalLink size={10} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-600 text-xs italic">
                  No meetings scheduled for today
                </div>
              )}
            </div>
          </section>

          {/* Tasks Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center">
                <CheckSquare size={20} className="mr-2 text-emerald-400" />
                Deliverable Deadlines
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-800/50 px-2 py-1 rounded">Active</span>
            </div>
            <div className="space-y-3">
              {activeAgendaItems.dayTasks.length > 0 ? (
                activeAgendaItems.dayTasks.map(t => (
                  <div key={t.id} className="bg-[#16161a] border border-slate-800 p-4 rounded-2xl hover:border-emerald-500/30 transition-all group shadow-lg">
                    <h4 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-2">{t.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {t.category}
                      </span>
                      <div className="flex items-center text-[10px] font-bold text-emerald-400">
                        <Clock size={12} className="mr-1" />
                        Today
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-600 text-xs italic">
                  No deadlines for today
                </div>
              )}
              
              {/* Future Deadlines Preview */}
              <button className="w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700">
                View Full Agenda <ChevronDown size={12} className="inline ml-1" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
