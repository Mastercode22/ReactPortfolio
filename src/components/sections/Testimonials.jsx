import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';
import { testimonialsData } from '../../data/testimonials';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Testimonials = () => {
  const { isDark } = useTheme();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonialsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const activeTestimonial = testimonialsData[current];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeader
          badge="Endorsements & Praise"
          title="What Founders & Engineering Leaders Say"
          subtitle="Testimonials from client leaders who experienced the impact of high-end UI architecture firsthand."
        />

        <div className="max-w-4xl mx-auto relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard neumorphic gradientBorder className="p-8 sm:p-12 relative text-center space-y-6">
                
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 opacity-20 text-[#6C63FF] dark:text-[#7C5CFF]">
                  <Quote className="w-12 h-12" />
                </div>

                {/* Stars Rating */}
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  {[...Array(activeTestimonial.stars)].map((_, sIdx) => (
                    <Star key={sIdx} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-base sm:text-xl font-medium text-[#1B2430] dark:text-[#F8FAFC] italic leading-relaxed max-w-3xl mx-auto">
                  "{activeTestimonial.quote}"
                </p>

                {/* Author Avatar & Meta */}
                <div className="flex flex-col items-center justify-center space-y-2 pt-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#6C63FF] shadow-lg">
                    <img
                      src={activeTestimonial.avatar}
                      alt={activeTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-[#1B2430] dark:text-[#F8FAFC]">
                      {activeTestimonial.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#667085] dark:text-[#CBD5E1]">
                      {activeTestimonial.role} — <span className="text-[#6C63FF] dark:text-[#7C5CFF]">{activeTestimonial.company}</span>
                    </p>
                  </div>
                </div>

              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Controls & Dots */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevSlide}
              className={`p-3 rounded-full transition-all ${
                isDark ? 'neu-flat-dark text-white' : 'neu-flat-light text-[#1B2430]'
              }`}
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-2">
              {testimonialsData.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrent(dotIdx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    current === dotIdx
                      ? 'w-8 bg-[#6C63FF] dark:bg-[#7C5CFF]'
                      : 'w-2.5 bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className={`p-3 rounded-full transition-all ${
                isDark ? 'neu-flat-dark text-white' : 'neu-flat-light text-[#1B2430]'
              }`}
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
