import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MonitorPlay,
  ExternalLink,
  Sparkles,
  Calendar,
  Clock,
  MessageSquare,
  RefreshCw,
  Video,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { apiGetUserDemos, apiGetUserDemoById, DemoItem } from '../../services/api';

export const DashboardDemos: React.FC = () => {
  const [demos, setDemos] = useState<DemoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState<DemoItem | null>(null);

  const fetchDemos = async () => {
    setLoading(true);
    try {
      const res = await apiGetUserDemos();
      if (res.success && res.data) {
        setDemos(res.data.demos);
      }
    } catch (err) {
      console.error('Failed to load user demos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const handleOpenDemo = async (demo: DemoItem) => {
    setSelectedDemo(demo);
    // Mark as viewed on the backend
    try {
      await apiGetUserDemoById(demo._id);
    } catch (e) {
      // Non-fatal
    }
  };

  return (
    <div className="space-y-6 max-w-6xl font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-main tracking-tight">
              My Shared Prototypes &amp; Demos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-background-lavender text-primary">
              {demos.length} Ready
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Custom systems, interactive proof-of-concepts, and prototypes published specifically for you.
          </p>
        </div>

        <button
          onClick={fetchDemos}
          disabled={loading}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-border bg-white text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors shadow-soft-xs"
          title="Refresh Demos"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
        </button>
      </div>

      {/* 2. Demos Content Grid */}
      {loading ? (
        <div className="py-20 text-center text-text-secondary bg-white rounded-3xl border border-border shadow-soft-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p className="text-sm font-medium">Loading your interactive prototypes...</p>
        </div>
      ) : demos.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 text-center shadow-soft-xs">
          <div className="w-16 h-16 rounded-3xl bg-background-lavender text-primary flex items-center justify-center mx-auto mb-4">
            <MonitorPlay className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-heading text-text-main">
            No Custom Prototypes Published Yet
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-2 max-w-md mx-auto leading-relaxed">
            When you consult with our team or request a prototype, our engineers publish personalized, interactive demo builds directly to your workspace.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft-sm hover:bg-primary-hover transition-colors font-heading"
            >
              <span>Request a Custom Build</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-text-main hover:bg-background-alt transition-colors"
            >
              <span>Explore Public Concept Showcase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo) => {
            const isUnread = !demo.viewedByUserAt;

            return (
              <div
                key={demo._id}
                className="bg-white rounded-3xl border border-border hover:border-primary/50 shadow-soft-xs hover:shadow-soft-md transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Unread indicator ribbon */}
                {isUnread && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white shadow-soft-xs uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>New Prototype</span>
                  </div>
                )}

                <div>
                  {/* Category & Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-background-lavender text-primary font-heading border border-primary/20">
                      {demo.category}
                    </span>

                    {demo.isExpired ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                        Expired
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active Access</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-black text-xl text-text-main tracking-tight group-hover:text-primary transition-colors">
                    {demo.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-text-secondary mt-2 line-clamp-3 leading-relaxed">
                    {demo.description}
                  </p>

                  {/* Admin Message Banner */}
                  {demo.adminMessage && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-background-alt border border-border text-xs text-text-main flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-bold text-[11px] text-text-secondary uppercase font-heading block mb-0.5">
                          Engineer Note
                        </span>
                        <p className="line-clamp-2 italic text-text-secondary">
                          "{demo.adminMessage}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Expiration or Shared date info */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Shared {new Date(demo.createdAt).toLocaleDateString()}</span>
                    </div>

                    {demo.expiresAt && (
                      <div className="flex items-center gap-1 text-amber-700 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Valid until {new Date(demo.expiresAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenDemo(demo)}
                    className="text-xs font-bold text-text-secondary hover:text-primary transition-colors"
                  >
                    View Details
                  </button>

                  {demo.isExpired ? (
                    <div className="flex items-center gap-1.5 text-xs text-rose-500 font-bold bg-rose-50 px-3.5 py-2 rounded-xl">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Demo Expired</span>
                    </div>
                  ) : (
                    <a
                      href={demo.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleOpenDemo(demo)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft-xs hover:shadow-soft-sm transition-all"
                    >
                      <MonitorPlay className="w-4 h-4" />
                      <span>Launch Prototype</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Demo Detailed Modal */}
      {selectedDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/30 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-border shadow-soft-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-background-lavender text-primary uppercase font-heading">
                  {selectedDemo.category}
                </span>
                <h2 className="text-xl font-black font-heading text-text-main mt-1">
                  {selectedDemo.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDemo(null)}
                className="p-1.5 rounded-xl border border-border hover:bg-background-alt text-text-secondary"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1 font-heading">
                  Prototype Scope &amp; Description
                </span>
                <p className="text-text-main leading-relaxed whitespace-pre-wrap bg-background-alt/50 p-4 rounded-2xl border border-border">
                  {selectedDemo.description}
                </p>
              </div>

              {selectedDemo.adminMessage && (
                <div className="p-4 bg-background-lavender/50 rounded-2xl border border-primary/20 space-y-1">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block font-heading">
                    Note from the ANTHIX Team
                  </span>
                  <p className="text-text-main italic text-xs sm:text-sm leading-relaxed">
                    "{selectedDemo.adminMessage}"
                  </p>
                </div>
              )}

              {/* Auxiliary links (video, attachments) */}
              {(selectedDemo.videoUrl || selectedDemo.attachmentUrl) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {selectedDemo.videoUrl && (
                    <a
                      href={selectedDemo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl border border-border bg-background-alt hover:border-primary/50 transition-colors flex items-center gap-3 text-xs font-bold text-text-main"
                    >
                      <Video className="w-5 h-5 text-primary" />
                      <span>Watch Walkthrough Video</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto text-text-secondary" />
                    </a>
                  )}

                  {selectedDemo.attachmentUrl && (
                    <a
                      href={selectedDemo.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl border border-border bg-background-alt hover:border-primary/50 transition-colors flex items-center gap-3 text-xs font-bold text-text-main"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="truncate">
                        {selectedDemo.attachmentName || 'Download Documentation'}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto text-text-secondary" />
                    </a>
                  )}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-background-alt border border-border grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-text-secondary block text-[11px]">Shared Date:</span>
                  <span className="font-semibold text-text-main">
                    {new Date(selectedDemo.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary block text-[11px]">Status:</span>
                  <span
                    className={`font-semibold ${
                      selectedDemo.isExpired ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {selectedDemo.isExpired ? 'Expired' : 'Active & Available'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-background-alt/30 flex items-center justify-between">
              <button
                onClick={() => setSelectedDemo(null)}
                className="px-4 py-2 rounded-xl border border-border bg-white text-xs font-bold text-text-secondary hover:text-text-main transition-colors"
              >
                Close
              </button>

              {!selectedDemo.isExpired && (
                <a
                  href={selectedDemo.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft-xs hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
                >
                  <MonitorPlay className="w-4 h-4" />
                  <span>Launch Live Prototype</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
