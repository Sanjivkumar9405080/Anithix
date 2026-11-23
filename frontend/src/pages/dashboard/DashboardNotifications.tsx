import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  MonitorPlay,
  ClipboardList,
  Sparkles,
  ExternalLink,
  CheckCheck,
  RefreshCw,
  Clock,
} from 'lucide-react';
import {
  apiGetUserNotifications,
  apiMarkNotificationRead,
  apiMarkAllNotificationsRead,
  NotificationItem,
} from '../../services/api';

export const DashboardNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiGetUserNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await apiMarkNotificationRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, readAt: new Date().toISOString() } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (e) {
      // Non-fatal
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await apiMarkAllNotificationsRead();
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } catch (e) {
      // Non-fatal
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'demo_shared':
      case 'demo_updated':
        return <MonitorPlay className="w-5 h-5 text-primary" />;
      case 'request_status':
        return <ClipboardList className="w-5 h-5 text-amber-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-text-main tracking-tight">
              Messages &amp; Activity Updates
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-primary text-white">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Real-time notifications regarding shared prototypes, proposal reviews, and team alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-white text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors shadow-soft-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-white text-text-main hover:bg-background-alt font-bold text-xs shadow-soft-xs transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-primary" />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Notifications List */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-soft-xs">
        {loading ? (
          <div className="py-16 text-center text-text-secondary">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-3" />
            <p className="text-sm font-medium">Checking for updates...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-background-lavender text-primary flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-base text-text-main">
              No Notifications Yet
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-sm mx-auto">
              When an engineer shares a prototype or responds to your requests, alerts will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n) => {
              const isUnread = !n.readAt;

              return (
                <div
                  key={n._id}
                  className={`p-5 transition-colors flex items-start gap-4 ${
                    isUnread ? 'bg-background-lavender/30' : 'hover:bg-background-alt/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-soft-xs mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading font-bold text-sm text-text-main">
                        {n.title}
                      </h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-4 pt-1 text-[11px] text-text-secondary">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>

                      {n.link && (
                        <Link
                          to={n.link}
                          onClick={() => handleMarkAsRead(n._id)}
                          className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <span>Open related item</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}

                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(n._id)}
                          className="text-text-secondary hover:text-text-main font-medium underline ml-auto"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
