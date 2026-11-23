import { GraduationCap, Users, Calendar, Award, CheckCircle2, Clock } from 'lucide-react';

export const SchoolMockup = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-soft-md overflow-hidden text-left font-sans text-xs select-none">
      {/* Titlebar */}
      <div className="bg-background-alt px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-mono text-text-secondary ml-2 font-medium">
            anthix-edtech / school-portal
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <span className="text-[10px] font-mono bg-primary/10 text-primary-deep px-2 py-0.5 rounded-full font-bold">
            Term 2 Active
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Attendance</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">96.4%</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              1,368 present today
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Enrolled</span>
              <Users className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">1,420 Students</div>
            <div className="text-[10px] text-text-secondary font-medium mt-0.5">
              48 sections active
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pass Rate</span>
              <Award className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">98.1%</div>
            <div className="text-[10px] text-text-secondary font-medium mt-0.5">
              Mid-term evaluations
            </div>
          </div>
        </div>

        {/* Timetable & Active Classes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Active Schedule */}
          <div className="p-3 rounded-xl bg-background-alt/80 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-[11px] text-text-main flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Today&apos;s Class Schedule</span>
              </span>
              <span className="text-[9px] font-mono text-text-secondary">Grade 10-A</span>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-main text-[11px]">Advanced Physics</div>
                  <div className="text-[10px] text-text-secondary">Lab 3 • Dr. Thorne</div>
                </div>
                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  In Session
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-main text-[11px]">Computer Science</div>
                  <div className="text-[10px] text-text-secondary">Room 204 • Prof. Sen</div>
                </div>
                <span className="text-[9px] font-mono text-text-secondary bg-background-alt px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  11:30 AM
                </span>
              </div>
            </div>
          </div>

          {/* Student Performance Snapshot */}
          <div className="p-3 rounded-xl bg-background-alt/80 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-[11px] text-text-main flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
                <span>Academic Overview</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-600 font-semibold">98% Fees Paid</span>
            </div>

            <div className="space-y-2">
              <div className="bg-white p-2.5 rounded-lg border border-border">
                <div className="flex justify-between text-[10px] text-text-secondary mb-1">
                  <span>STEM Assessment Average</span>
                  <span className="font-bold text-text-main">89.4 / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-sky-400 w-[89%]" />
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-border">
                <div className="flex justify-between text-[10px] text-text-secondary mb-1">
                  <span>Parent Portal Engagement</span>
                  <span className="font-bold text-text-main">92%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-primary w-[92%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notice alert */}
        <div className="px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between text-[11px]">
          <span className="text-text-secondary font-sans">
            Teacher-Parent conference notifications scheduled for Friday, 4:00 PM.
          </span>
          <span className="text-primary font-bold text-[10px]">Automated via SMS/App</span>
        </div>
      </div>
    </div>
  );
};
