import { Users, DollarSign, TrendingUp, CheckCircle, ChevronRight, Search, Bell } from 'lucide-react';

export const CrmMockup = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-soft-md overflow-hidden text-left font-sans text-xs select-none">
      {/* Window Titlebar */}
      <div className="bg-background-alt px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-mono text-text-secondary ml-2 font-medium">
            anthix-crm / pipeline-dashboard
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Search className="w-3.5 h-3.5" />
          <Bell className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
            Live Demo
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* KPI Metric Summary Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pipeline</span>
              <DollarSign className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">$124,500</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+18% this month</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Leads</span>
              <Users className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">84 Contacts</div>
            <div className="text-[10px] text-text-secondary font-medium mt-0.5">
              12 qualified today
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Win Rate</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">28.4%</div>
            <div className="text-[10px] text-primary font-semibold mt-0.5">
              Above target (25%)
            </div>
          </div>
        </div>

        {/* Visual Pipeline Stages */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading">
              Sales Pipeline Stages
            </span>
            <span className="text-[10px] font-mono text-primary font-bold">4 Stages Active</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* Stage 1 */}
            <div className="bg-background-alt/80 p-2.5 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[10px] text-text-main">New Leads</span>
                <span className="bg-white text-text-secondary px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border border-border">
                  4
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-border shadow-soft-xs space-y-1">
                <div className="font-semibold text-text-main text-[11px]">Apex Logistics</div>
                <div className="text-[10px] text-text-secondary">$14,200 • Enterprise</div>
                <span className="inline-block text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                  Warm Inbound
                </span>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-background-alt/80 p-2.5 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[10px] text-text-main">Discovery</span>
                <span className="bg-white text-text-secondary px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border border-border">
                  3
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-border shadow-soft-xs space-y-1">
                <div className="font-semibold text-text-main text-[11px]">Nexus Health</div>
                <div className="text-[10px] text-text-secondary">$28,000 • Custom App</div>
                <span className="inline-block text-[8px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded font-bold">
                  Demo Booked
                </span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-background-alt/80 p-2.5 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[10px] text-text-main">Proposal</span>
                <span className="bg-white text-text-secondary px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border border-border">
                  2
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-border shadow-soft-xs space-y-1">
                <div className="font-semibold text-text-main text-[11px]">Beacon Labs</div>
                <div className="text-[10px] text-text-secondary">$42,500 • Full Stack</div>
                <span className="inline-block text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                  Reviewing
                </span>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="bg-background-alt/80 p-2.5 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[10px] text-emerald-700">Closed-Won</span>
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                  5
                </span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200 shadow-soft-xs space-y-1">
                <div className="font-semibold text-emerald-950 text-[11px]">Kite Financial</div>
                <div className="text-[10px] text-emerald-700">$39,800 • Finalized</div>
                <span className="inline-block text-[8px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                  Active Sprint
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Task Reminder */}
        <div className="p-2.5 rounded-xl bg-background-lavender/50 border border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-main">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-semibold text-[11px]">Next Follow-up:</span>
            <span className="text-text-secondary text-[11px]">Call Beacon Labs at 3:00 PM</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>
    </div>
  );
};
