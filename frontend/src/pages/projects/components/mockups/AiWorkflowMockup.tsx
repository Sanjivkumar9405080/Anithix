import { Bot, Cpu, Zap, Play } from 'lucide-react';

export const AiWorkflowMockup = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-soft-md overflow-hidden text-left font-sans text-xs select-none">
      {/* Titlebar */}
      <div className="bg-background-alt px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-mono text-text-secondary ml-2 font-medium">
            anthix-ai / pipeline-orchestrator
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
            Pipeline Active
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Metric Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-2.5 rounded-xl bg-background-alt border border-border">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Executions Today
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">1,480 Runs</div>
            <div className="text-[10px] text-emerald-600 font-semibold">100% Success Rate</div>
          </div>

          <div className="p-2.5 rounded-xl bg-background-alt border border-border">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Avg Latency
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">420 ms</div>
            <div className="text-[10px] text-primary font-semibold">Optimized Cache</div>
          </div>

          <div className="p-2.5 rounded-xl bg-background-alt border border-border">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Time Saved
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">34.5 Hours</div>
            <div className="text-[10px] text-text-secondary">This week</div>
          </div>
        </div>

        {/* Visual Node Flow */}
        <div className="p-3.5 rounded-xl bg-background-alt/90 border border-border space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-heading font-bold text-text-main flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>Active Workflow: Inbound Document Classification</span>
            </span>
            <span className="text-[9px] font-mono text-primary font-bold">Node Canvas</span>
          </div>

          <div className="grid grid-cols-3 gap-2 relative">
            {/* Step 1: Trigger */}
            <div className="p-2.5 rounded-xl bg-white border border-border shadow-soft-xs space-y-1 relative">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                  01 TRIGGER
                </span>
                <Play className="w-3 h-3 text-sky-500 fill-sky-500" />
              </div>
              <div className="font-semibold text-text-main text-[11px]">Webhook Event</div>
              <div className="text-[10px] text-text-secondary">Inbound PDF / email doc</div>
            </div>

            {/* Step 2: AI Synthesis */}
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-background-lavender/60 to-white border-2 border-primary/30 shadow-soft-xs space-y-1 relative">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  02 AI MODEL
                </span>
                <Bot className="w-3 h-3 text-primary" />
              </div>
              <div className="font-semibold text-primary-deep text-[11px]">Semantic Parser</div>
              <div className="text-[10px] text-text-secondary">Extract fields & intent</div>
            </div>

            {/* Step 3: Action */}
            <div className="p-2.5 rounded-xl bg-white border border-border shadow-soft-xs space-y-1 relative">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  03 ACTION
                </span>
                <Zap className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="font-semibold text-text-main text-[11px]">CRM & Alerts</div>
              <div className="text-[10px] text-text-secondary">Create lead & notify Slack</div>
            </div>
          </div>
        </div>

        {/* Live Payload Preview */}
        <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] space-y-1 overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1 mb-1">
            <span className="text-emerald-400 font-bold">✓ HTTP 200 — Dispatched</span>
            <span>22ms ago</span>
          </div>
          <div>
            <span className="text-purple-400">&quot;extracted_intent&quot;</span>: <span className="text-emerald-300">&quot;High-Priority Enterprise Lead&quot;</span>,
          </div>
          <div>
            <span className="text-purple-400">&quot;routing_action&quot;</span>: <span className="text-emerald-300">&quot;create_deal_and_assign_exec&quot;</span>
          </div>
        </div>
      </div>
    </div>
  );
};
