import { Activity, Calendar, Stethoscope, BedDouble, CheckCircle } from 'lucide-react';

export const HospitalMockup = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-soft-md overflow-hidden text-left font-sans text-xs select-none">
      {/* Titlebar */}
      <div className="bg-background-alt px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-mono text-text-secondary ml-2 font-medium">
            anthix-health / triage-console
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
            System Online
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Healthcare Overview Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Today&apos;s Appointments</span>
              <Calendar className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">128 Patients</div>
            <div className="text-[10px] text-text-secondary font-medium mt-0.5">
              42 completed • 18 queue
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Bed Occupancy</span>
              <BedDouble className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">74.2%</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              52 beds available
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Staff</span>
              <Stethoscope className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">34 Doctors</div>
            <div className="text-[10px] text-primary font-semibold mt-0.5">
              Shift A on duty
            </div>
          </div>
        </div>

        {/* Triage Queue & Department Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Active Triage Queue */}
          <div className="p-3 rounded-xl bg-background-alt/80 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-[11px] text-text-main flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span>Active Triage Queue</span>
              </span>
              <span className="text-[9px] font-mono text-text-secondary">4 Pending</span>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-main text-[11px]">Cardiology • OPD 102</div>
                  <div className="text-[10px] text-text-secondary">Dr. V. Rao • Patient #T-409</div>
                </div>
                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  Consulting
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-main text-[11px]">Neurology • OPD 205</div>
                  <div className="text-[10px] text-text-secondary">Dr. K. Nair • Patient #T-410</div>
                </div>
                <span className="text-[9px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold border border-sky-200">
                  Vitals Ready
                </span>
              </div>
            </div>
          </div>

          {/* Department Capacity Overview */}
          <div className="p-3 rounded-xl bg-background-alt/80 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-[11px] text-text-main">
                Department Utilization
              </span>
              <span className="text-[9px] font-mono text-text-secondary">Real-Time</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[10px] text-text-secondary mb-1">
                  <span>Intensive Care Unit (ICU)</span>
                  <span className="font-bold text-text-main">18 / 22 Beds (82%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-rose-400 w-[82%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-text-secondary mb-1">
                  <span>General Care Wing</span>
                  <span className="font-bold text-text-main">68 / 100 Beds (68%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-sky-400 w-[68%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer / Protocol Footer */}
        <div className="px-3 py-2 rounded-xl bg-background-alt border border-border flex items-center justify-between text-[10px] text-text-secondary">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Digital registration & secure role-based administrative access enabled.</span>
          </div>
          <span className="font-mono font-bold text-primary">Prototype UI</span>
        </div>
      </div>
    </div>
  );
};
