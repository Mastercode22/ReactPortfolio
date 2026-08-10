import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getCertifications } from '../../services/certificationsService';

export const Certifications = () => {
  const { isDark } = useTheme();
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    getCertifications()
      .then((data) => {
        if (Array.isArray(data)) setCerts(data);
      })
      .catch((err) => console.error('Failed to load certifications:', err));
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeader
          badge="Verified Expertise"
          title="Industry Certifications & Credentials"
          subtitle="Validated competence in React architecture, cloud solutions, NoSQL data modeling, and UX design systems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <GlassCard neumorphic gradientBorder className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-4">

                <div className="space-y-3">
                  {/* Top Row */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 rounded-2xl ${
                        isDark ? 'neu-pressed-dark text-[#7C5CFF]' : 'neu-pressed-light text-[#6C63FF]'
                      }`}
                    >
                      <Award className="w-6 h-6" />
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>

                  {/* Title & Issuer */}
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1B2430] dark:text-[#F8FAFC]">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-bold text-[#6C63FF] dark:text-[#7C5CFF] mt-1">
                      {cert.issuer} • <span className="text-[#667085] dark:text-[#CBD5E1] font-medium">{cert.issue_date || cert.date}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#667085] dark:text-[#CBD5E1] leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                {/* Footer Credential Link */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#667085] dark:text-[#CBD5E1]">
                  <span>ID: {cert.credential_id || cert.credentialId || 'N/A'}</span>
                  {cert.verification_url || cert.verificationUrl ? (
                    <a
                      href={cert.verification_url || cert.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[#6C63FF] dark:text-[#7C5CFF] hover:underline"
                    >
                      Verify Credential <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
