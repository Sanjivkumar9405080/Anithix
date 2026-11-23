import { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, Building2, User, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { ServiceType, ContactFormData } from '../../../types';
import { Button } from '../../../components/common/Button';
import { submitContact } from '../../../services/api';

interface ContactCTAProps {
  selectedService: ServiceType;
  onServiceChange: (service: ServiceType) => void;
  onContactClick?: () => void;
}

export const ContactCTA = ({ selectedService, onServiceChange, onContactClick }: ContactCTAProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    organization: '',
    service: selectedService,
    message: '',
  });

  const [audienceTag, setAudienceTag] = useState<string>('Business / Startup');
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);

  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({ ...prev, service: selectedService }));
    }
  }, [selectedService]);

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

    setIsSubmitted(true);
    setSubmittedData({ ...formData });
    setFormData({
      fullName: '',
      email: '',
      organization: '',
      service: selectedService || 'Digital Solutions',
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
      service: selectedService || 'Digital Solutions',
      message: '',
    });
    setErrors({});
    setServerError(null);
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <>
      {/* 1. Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-8 bg-background-alt relative overflow-hidden border-t border-border">
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-r from-background-lavender/60 via-background-softBlue/50 to-white rounded-full blur-3xl -z-10 pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary text-xs font-bold tracking-wider uppercase mb-4 border border-border shadow-soft-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>LET'S CONNECT</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-main tracking-tight leading-tight mb-4">
              Have an idea in mind?
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal font-sans">
              Tell us what you want to build, improve, or explore. Let's discuss the right next step.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-border shadow-soft-md">
            {isSubmitted && submittedData ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-soft-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="font-heading font-extrabold text-2xl text-text-main mb-3">
                  Inquiry Submitted Successfully!
                </h3>

                <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto mb-6 font-sans">
                  Thank you, <strong className="text-text-main">{submittedData.fullName}</strong>. Your inquiry regarding{' '}
                  <strong className="text-primary">{submittedData.service}</strong> has been received by our engineering team. We'll be in touch shortly.
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
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="font-semibold block mb-0.5">Submission Error</strong>
                      {serverError}
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
                          onClick={() => {
                            setFormData({ ...formData, service: option });
                            onServiceChange(option);
                          }}
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
      </section>

      {/* 2. Final CTA Banner */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 bg-background-lavender relative overflow-hidden border-t border-border">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[950px] h-[380px] sm:h-[480px] bg-gradient-to-r from-primary/15 via-sky-400/15 to-primary/10 rounded-[120px] blur-3xl -z-0 pointer-events-none transform -rotate-3"
          aria-hidden="true"
        />
        <div 
          className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full border border-primary/20 animate-pulse pointer-events-none -z-0"
          style={{ animationDuration: '4s' }}
          aria-hidden="true"
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full border border-sky-400/20 pointer-events-none -z-0"
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-primary-deep text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>START THE JOURNEY</span>
          </div>

          <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-text-main tracking-tight leading-[1.1] mb-6">
            Your next idea <span className="gradient-text">starts here.</span>
          </h2>

          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10 font-normal font-sans">
            Let's explore how thoughtful technology can help turn your goals into reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => {
                if (onContactClick) {
                  onContactClick();
                } else {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              icon={<ArrowRight className="w-5 h-5 ml-1" />}
              className="px-9 py-4 shadow-soft-lg hover:shadow-glow-primary"
            >
              Let's Talk
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
