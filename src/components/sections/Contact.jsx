import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import NeumorphicButton from '../ui/NeumorphicButton';
import { Mail, MapPin, Phone, Send, CheckCircle2, Clock, MessageSquare, Loader2, ExternalLink, Navigation } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mapAddressUrl = "https://www.google.com/maps/place/Anbert+Garden/@5.6121596,-0.1320006,17z/data=!3m1!4b1!4m6!3m5!1s0xfdf84dd0d3b9991:0xc3edc513cbcc6e1e!8m2!3d5.6121596!4d-0.1320006!16s%2Fg%2F11f0210_71?hl=en&entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D";

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate async submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Initiate Dialogue"
          title="Let’s Build Something Extraordinary Together"
          subtitle="Whether you have an upcoming enterprise web project, a custom React application, or simply want to connect."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Direct Info & Availability */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard neumorphic className="p-8 space-y-6">
              
              {/* Availability Badge */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs font-bold text-emerald-500">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span>Currently Accepting New Projects Q3/Q4</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
                  Direct Contact Information
                </h3>
                <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                  I typically respond within 24 hours. For urgent project inquiries, reach out via direct email or schedule a consultation.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  { icon: Mail, label: 'Email', value: 'emmanuelquarshie395@gmail.com', href: 'mailto:emmanuel.quarshie@example.com' },
                  { icon: MapPin, label: 'Location', value: 'Anbert Garden, Ghana / Remote Worldwide', href: mapAddressUrl },
                  { icon: Clock, label: 'Timezone', value: 'Greenwich Mean Time (GMT / UTC+0)', href: '#' }
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

          {/* Right Column: Neumorphic Contact Form */}
          <div className="lg:col-span-7">
            <GlassCard neumorphic gradientBorder className="p-8 sm:p-10 relative">
              
              <h3 className="text-2xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#6C63FF]" /> Send a Direct Message
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-3xl text-center space-y-4 bg-emerald-500/10 border border-emerald-500/30"
                >
                  <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500 animate-bounce" />
                  <h4 className="text-2xl font-extrabold text-emerald-500">Message Transmitted Successfully!</h4>
                  <p className="text-sm text-[#667085] dark:text-[#CBD5E1] max-w-md mx-auto">
                    Thank you for reaching out. Your project details have been received and I will contact you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC]">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all ${
                          isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                        }`}
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC]">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all ${
                          isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC]">
                      Subject / Project Type
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Enterprise React SPA / UI Design System"
                      className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all ${
                        isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                      }`}
                    />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1B2430] dark:text-[#F8FAFC]">
                      Message & Requirements *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your project goals, timelines, and technical preferences..."
                      className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all resize-none ${
                        isDark ? 'neu-pressed-dark text-white placeholder-slate-500 focus:border-[#7C5CFF]' : 'neu-pressed-light text-slate-800 placeholder-slate-400 focus:border-[#6C63FF]'
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <NeumorphicButton
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-base"
                    icon={loading ? Loader2 : Send}
                  >
                    {loading ? 'Transmitting Message...' : 'Send Message Now'}
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
                    Studio & Location Map — Anbert Garden
                  </h4>
                  <p className="text-xs text-[#667085] dark:text-[#CBD5E1] mt-0.5">
                    Coordinates: 5.6121596, -0.1320006 • Anbert Garden, Ghana
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
