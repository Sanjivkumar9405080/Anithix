import React, { useState, useEffect } from 'react';
import { Mail, Send, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiSendClientEmail, EmailActivityItem } from '../../services/api';

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecipient?: string;
  initialRecipientName?: string;
  initialSubject?: string;
  initialBody?: string;
  userId?: string;
  requestId?: string;
  onSuccess?: (activity: EmailActivityItem) => void;
}

export const EmailComposerModal: React.FC<EmailComposerModalProps> = ({
  isOpen,
  onClose,
  initialRecipient = '',
  initialRecipientName = '',
  initialSubject = '',
  initialBody = '',
  userId,
  requestId,
  onSuccess,
}) => {
  const [to, setTo] = useState(initialRecipient);
  const [recipientName, setRecipientName] = useState(initialRecipientName);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTo(initialRecipient);
      setRecipientName(initialRecipientName);
      setSubject(initialSubject || 'Re: Your ANTHIX Inquiry');
      setBody(
        initialBody ||
          `Hello ${initialRecipientName || 'there'},\n\nThank you for reaching out to ANTHIX. We have reviewed your request and would like to provide you with the following details:\n\n\n\nBest regards,\nANTHIX Engineering Team\nhttps://anthix.com`
      );
      setError(null);
      setSuccessMsg(null);
      setIsSending(false);
    }
  }, [isOpen, initialRecipient, initialRecipientName, initialSubject, initialBody]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTo = to.trim().toLowerCase();
    if (!cleanTo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanTo)) {
      setError('Please provide a valid recipient email address.');
      return;
    }

    if (!subject.trim()) {
      setError('Subject line is required.');
      return;
    }

    if (!body.trim()) {
      setError('Email message body is required.');
      return;
    }

    setIsSending(true);
    setError(null);

    const res = await apiSendClientEmail({
      to: cleanTo,
      recipientName: recipientName.trim(),
      subject: subject.trim(),
      body: body.trim(),
      userId,
      requestId,
    });

    if (!res.success || !res.data) {
      setError(res.message || 'Failed to dispatch email. Please verify SMTP credentials.');
      setIsSending(false);
      return;
    }

    setSuccessMsg('Email dispatched successfully to client!');
    setIsSending(false);

    if (onSuccess && res.data.activity) {
      onSuccess(res.data.activity);
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-border shadow-soft-xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background-alt/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-background-lavender text-primary flex items-center justify-center border border-primary/20">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-text-main">
                Email Client Directly
              </h3>
              <p className="text-[11px] text-text-secondary">
                Sent via ANTHIX verified delivery service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="p-1.5 rounded-xl text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSend} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Recipient Email <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="client@organization.com"
                required
                className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
                Recipient Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
              Subject <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Re: Your ANTHIX Inquiry - AI & Automation"
              required
              className="w-full px-3.5 py-2.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5 font-heading">
              Message Body <span className="text-primary">*</span>
            </label>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email reply to the client..."
              required
              className="w-full p-3.5 bg-background-alt border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-text-main font-sans resize-y"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-secondary hover:text-text-main hover:bg-background-alt transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-soft-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending Email...' : 'Send Email'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
