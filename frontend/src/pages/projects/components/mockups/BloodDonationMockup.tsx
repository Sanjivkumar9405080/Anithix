import { Heart, MapPin, AlertCircle, Droplet } from 'lucide-react';

export const BloodDonationMockup = () => {
  const bloodGroups = [
    { type: 'A+', donors: 28, urgent: false },
    { type: 'O+', donors: 42, urgent: false },
    { type: 'B+', donors: 31, urgent: false },
    { type: 'O-', donors: 4, urgent: true },
    { type: 'AB+', donors: 12, urgent: false },
    { type: 'A-', donors: 6, urgent: true },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-soft-md overflow-hidden text-left font-sans text-xs select-none">
      {/* Titlebar */}
      <div className="bg-background-alt px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-mono text-text-secondary ml-2 font-medium">
            anthix-impact / donor-network
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            2 Urgent Requests
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Blood Group Availability Filter Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-heading flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-rose-500" />
              <span>Blood Group Availability (City District)</span>
            </span>
            <span className="text-[10px] font-mono text-text-secondary">123 Verified Donors</span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {bloodGroups.map((group) => (
              <div
                key={group.type}
                className={`p-2 rounded-xl text-center border transition-all ${
                  group.urgent
                    ? 'bg-rose-50/60 border-rose-300 text-rose-700'
                    : 'bg-background-alt border-border text-text-main'
                }`}
              >
                <div className="font-heading font-black text-sm">{group.type}</div>
                <div className="text-[9px] text-text-secondary font-mono">{group.donors} Donors</div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Requests & Camp Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Urgent Need Card */}
          <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[11px] text-rose-900 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Urgent Requirement</span>
              </span>
              <span className="text-[9px] font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                Needed ASAP
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-rose-100 shadow-soft-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-base text-rose-600">O- (Universal)</span>
                <span className="text-[10px] text-text-secondary font-mono">2 Units</span>
              </div>
              <div className="text-[11px] text-text-main font-semibold">City General Hospital</div>
              <div className="text-[10px] text-text-secondary flex items-center gap-1">
                <MapPin className="w-3 h-3 text-text-secondary" />
                <span>Trauma Center • 2.4 km away</span>
              </div>
            </div>
          </div>

          {/* Local Donation Camp Announcement */}
          <div className="p-3 rounded-xl bg-background-alt/80 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-[11px] text-text-main flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-primary" />
                <span>Upcoming Donation Drive</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-600 font-bold">This Saturday</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-border shadow-soft-xs space-y-1">
              <div className="font-semibold text-text-main text-[11px]">Civic Center Community Hall</div>
              <div className="text-[10px] text-text-secondary">Organized by Red Cross Volunteers</div>
              <div className="text-[9px] font-mono text-primary font-medium flex items-center gap-1 pt-0.5">
                <span>9:00 AM – 4:00 PM • 64 Registered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Notice */}
        <div className="px-3 py-2 rounded-xl bg-background-lavender/40 border border-primary/20 flex items-center justify-between text-[11px]">
          <span className="text-text-secondary font-sans">
            Automated SMS notifications dispatched to eligible nearby donors upon verified emergency.
          </span>
          <span className="text-primary font-bold text-[10px] font-mono">Concept Flow</span>
        </div>
      </div>
    </div>
  );
};
