import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import NeumorphicButton from '../ui/NeumorphicButton';
import { Mail, MapPin, Phone, Send, CheckCircle2, Clock, MessageSquare, Loader2, ExternalLink, Navigation, AlertCircle, Building2, Briefcase } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getContact, postContactMessage } from '../../services/contactService';

export const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    company: '',
    project_type: '',
    website: '' // Spam Honeypot Field
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    getContact()
      .then((data) => {
        if (data) setContactData(data);
      })
      .catch((err) => console.error('Failed to load contact settings:', err));
  }, []);

  const mapAddressUrl = contactData?.google_maps_url || "https://www.google.com/maps/place/Anbert+Garden/@5.6121596,-0.1320006,17z";

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full Name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errs.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await postContactMessage(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        company: '',
        project_type: '',
        website: ''
      });
      setErrors({});
    } catch (err) {
      console.error('Failed to send message:', err);
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeader
          badge={contactData?.badge || "Initiate Dialogue"}
          title={contactData?.heading || "Let’s Build Something Extraordinary Together"}
          subtitle={contactData?.subheading || "Whether you have an upcoming enterprise web project, a custom React application, or simply want to connect."}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">

          {/* Left Column: Direct Info & Availability */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard neumorphic className="p-8 space-y-6">

              {/* Availability Badge */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs font-bold text-emerald-500">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span>{contactData?.availability_text || "Currently Accepting New Projects Q3/Q4"}</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
                  Direct Contact Information
                </h3>
                <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                  I typically respond within 24 hours. For urgent project inquiries, reach out via direct email or phone.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  { icon: Mail, label: 'Email', value: contactData?.email || 'quarshie395@gmail.com', href: `mailto:${contactData?.email || 'quarshie395@gmail.com'}` },
                  { icon: Phone, label: 'Phone', value: contactData?.phone || '+233 20 000 0000', href: `tel:${contactData?.phone}` },
                  { icon: MapPin, label: 'Location', value: contactData?.location || 'Greater Accra, Ghana / Remote Worldwide', href: mapAddressUrl },
                  { icon: Clock, label: 'Response Time', value: contactData?.response_time || 'Within 24 Hours', href: '#' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-2xl ${
                        isDark ? 'neu-pressed-dark text-[#7C5CFF]' : 'neu-pressed-light text-[#6C63FF]'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#CBD5E1]">
                        {item.label}
                      </span>
                      <p className="text-sm font-bold text-[#1B2430] dark:text-[#F8FAFC]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </GlassCard>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <GlassCard neumorphic gradientBorder className="p-8 sm:p-10 relative">

              <h3 className="text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#6C63FF]" /> Send a Direct Message
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-3xl text-center space-y-4 bg-emerald-500/10 border border-emerald-500/30"
                >
                  <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500 animate-bounce" />
                  <h4 className="text-2xl font-extrabold text-emerald-500">Message Received!</h4>
                  <p className="text-sm text-[#667085] dark:text-[#CBD5E1] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your message has been received. I'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-md"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                  {/* Anti-Spam Honeypot (Hidden from real users) */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {apiError && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs font-bold text-rose-500">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC]">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all ${
                          errors.name ? 'border-2 border-rose-500' : ''
                        } ${
                          isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                        }`}
                      />
                      {errors.name && <p className="text-xs font-bold text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC]">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all ${
                          errors.email ? 'border-2 border-rose-500' : ''
                        } ${
                          isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                        }`}
                      />
                      {errors.email && <p className="text-xs font-bold text-rose-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Phone (Optional) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#6C63FF]" /> Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                          isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                        }`}
                      />
                    </div>

                    {/* Company (Optional) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#6C63FF]" /> Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        className={`w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                          isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                        }`}
                      />
                    </div>

                    {/* Project Type (Optional) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC] flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#6C63FF]" /> Project Type
                      </label>
                      <input
                        type="text"
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleChange}
                        placeholder="Web App / API"
                        className={`w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                          isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC]">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Enterprise Web Development Inquiry"
                      className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all ${
                        errors.subject ? 'border-2 border-rose-500' : ''
                      } ${
                        isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                      }`}
                    />
                    {errors.subject && <p className="text-xs font-bold text-rose-500 mt-1">{errors.subject}</p>}
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC]">
                      Message & Requirements *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your project goals, timelines, and technical preferences..."
                      className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all resize-none ${
                        errors.message ? 'border-2 border-rose-500' : ''
                      } ${
                        isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                      }`}
                    />
                    {errors.message && <p className="text-xs font-bold text-rose-500 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <NeumorphicButton
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-base"
                    icon={loading ? Loader2 : Send}
                  >
                    {loading ? 'Sending...' : 'Send Message Now'}
                  </NeumorphicButton>

                </form>
              )}

            </GlassCard>
          </div>

        </div>

        {/* Location Map Section Below Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <GlassCard neumorphic gradientBorder className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-2xl ${
                    isDark ? 'neu-pressed-dark text-[#7C5CFF]' : 'neu-pressed-light text-[#6C63FF]'
                  }`}
                >
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
                    Studio & Location Map — {contactData?.location || "Anbert Garden, Ghana"}
                  </h4>
                  <p className="text-xs text-[#667085] dark:text-[#CBD5E1] mt-0.5">
                    Coordinates: 5.6121596, -0.1320006 • {contactData?.location || "Anbert Garden, Ghana"}
                  </p>
                </div>
              </div>

              <NeumorphicButton
                variant="secondary"
                onClick={() => window.open(mapAddressUrl, '_blank')}
                icon={ExternalLink}
                className="text-xs py-2.5 px-4"
              >
                Open in Google Maps
              </NeumorphicButton>
            </div>

            {/* Embedded Interactive Map Canvas */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
              <iframe
                title="Anbert Garden Map"
                src="https://maps.google.com/maps?q=5.6121596,-0.1320006&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter saturate-[0.85] contrast-[1.05]"
              />
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
