import { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, Building2, User, Mail, MessageSquare } from 'lucide-react';
import { ServiceType, ContactFormData } from '../../types';
import { Button } from '../../components/common/Button';
import { submitContact } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const Contact = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    organization: '',
    service: 'Digital Solutions',
    message: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  const [audienceTag, setAudienceTag] = useState<string>('Business / Startup');
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);

  const serviceOptions: ServiceType[] = [
    'Digital Solutions',
    'AI & Automation',
    'Technical Training',
    'Other / Not Sure Yet',
  ];

  const audienceOptions = [
    'Business / Startup',
    'College / University',
    'School / EdTech',
    'Healthcare',
    'Corporate Team',
  ];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g., name@example.com).';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us briefly about your goals or requirements.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please share at least 10 characters so we can understand your need.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setServerError(null);

    const result = await submitContact({
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      organization: formData.organization.trim(),
      service: formData.service,
      message: formData.message.trim(),
      subject: `${formData.service} Inquiry from ${formData.fullName.trim()} (${audienceTag})`,
    });

    if (!result.success) {
      if (result.errors && result.errors.length > 0) {
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        result.errors.forEach((err) => {
          if (err.field === 'name') fieldErrors.fullName = err.message;
          if (err.field === 'email') fieldErrors.email = err.message;
          if (err.field === 'message') fieldErrors.message = err.message;
        });
        setErrors(fieldErrors);
      }
      setServerError(result.message || 'Submission failed. Please check your details and try again.');
      setIsSubmitting(false);
      return;
    }

    // Success confirmed by backend
    setIsSubmitted(true);
    setSubmittedData({ ...formData });
    setFormData({
      fullName: '',
      email: '',
      organization: '',
      service: 'Digital Solutions',
      message: '',
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      organization: '',
      service: 'Digital Solutions',
      message: '',
    });
    setErrors({});
    setServerError(null);
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <div className="py-20 sm:py-28 px-4 sm:px-8 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background-lavender text-primary-deep text-xs font-bold tracking-wider uppercase mb-4 border border-primary/20 shadow-soft-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>START A CONVERSATION</span>
        </div>

        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-text-main tracking-tight leading-tight mb-4">
          Let's Discuss <span className="gradient-text">Your Project.</span>
        </h1>

        <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
          Tell us about your organization and what you are looking to build or explore. Our engineering team responds directly.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-border shadow-soft-md">
        {isSubmitted && submittedData ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-soft-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-heading font-extrabold text-2xl text-text-main mb-3">
              Inquiry Prepared Successfully!
            </h3>

            <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto mb-6 font-sans">
              Thank you, <strong className="text-text-main">{submittedData.fullName}</strong>. Your inquiry regarding{' '}
              <strong className="text-primary">{submittedData.service}</strong> has been logged.
            </p>

            <div className="bg-background-alt p-5 rounded-2xl border border-border max-w-md mx-auto text-left mb-8 text-xs space-y-2 font-sans">
              <div className="text-text-secondary font-mono uppercase text-[10px] tracking-wider pb-1 border-b border-border">
                Submission Summary
              </div>
              <div><span className="text-text-secondary">Name:</span> <span className="font-medium text-text-main">{submittedData.fullName}</span></div>
              <div><span className="text-text-secondary">Email:</span> <span className="font-medium text-text-main">{submittedData.email}</span></div>
              {submittedData.organization && (
                <div><span className="text-text-secondary">Organization:</span> <span className="font-medium text-text-main">{submittedData.organization}</span></div>
              )}
              <div><span className="text-text-secondary">Service:</span> <span className="font-medium text-primary">{submittedData.service}</span></div>
              <div><span className="text-text-secondary">Message:</span> <span className="font-medium text-text-main">{submittedData.message}</span></div>
            </div>

            <Button variant="outline" size="sm" onClick={handleReset}>
              Send Another Inquiry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {serverError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 flex items-start gap-3 text-xs sm:text-sm font-sans shadow-soft-xs animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold mb-0.5">Submission Notice</div>
                  <div>{serverError}</div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5 font-heading">
                I am reaching out on behalf of:
              </label>
              <div className="flex flex-wrap gap-2">
                {audienceOptions.map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setAudienceTag(aud)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-sans ${
                      audienceTag === aud
                        ? 'bg-primary text-white shadow-soft-xs'
                        : 'bg-background-alt text-text-secondary hover:text-text-main border border-border'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2 font-heading">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                    }}
                    placeholder="e.g. Sarah Jenkins"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans ${
                      errors.fullName ? 'border-rose-400 focus:border-rose-500' : 'border-border focus:border-primary'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <div className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2 font-heading">
                  Email Address <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="e.g. sarah@organization.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans ${
                      errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-border focus:border-primary'
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="organization" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2 font-heading">
                Organization / Institution <span className="text-text-secondary text-[11px] font-normal lowercase font-sans">(optional)</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="organization"
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Apex Academy or Horizon Health"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2.5 font-heading">
                Service of Interest <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {serviceOptions.map((option) => {
                  const isSelected = formData.service === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, service: option })}
                      className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between font-sans ${
                        isSelected
                          ? 'bg-background-lavender/60 border-primary text-primary font-bold shadow-soft-xs'
                          : 'bg-white border-border text-text-main hover:bg-background-alt'
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2 font-heading">
                Tell Us About Your Project <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-text-secondary absolute left-3.5 top-3.5 pointer-events-none" />
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  placeholder="Share your goals, current challenges, estimated timeline, or questions..."
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-sm text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-sans ${
                    errors.message ? 'border-rose-400 focus:border-rose-500' : 'border-border focus:border-primary'
                  }`}
                />
              </div>
              {errors.message && (
                <div className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-sans">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.message}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                icon={<Send className="w-4 h-4" />}
                className="w-full"
              >
                Send Inquiry
              </Button>
              <div className="text-center mt-3 text-[11px] text-text-secondary font-sans">
                We respect your privacy. Direct response from the ANTHIX engineering team.
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
