import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users2, Lightbulb, Compass, Award, HeartHandshake } from 'lucide-react';

export function About() {
  const features = [
    {
      id: 'learn-together',
      title: 'Learn Together',
      description: 'Regular hands-on technical workshops, peer-guided coding labs, and skill-building sessions designed for students at every stage of their academic journey.',
      icon: BookOpen,
      accent: 'Primary focus on collaborative education and practical development.',
    },
    {
      id: 'build-connections',
      title: 'Build Connections',
      description: 'An open, welcoming space where passionate students meet like-minded peers, form project teams, exchange ideas, and connect with senior mentors.',
      icon: Users2,
      accent: 'Fostering lifelong friendships and inter-disciplinary collaboration.',
    },
    {
      id: 'explore-innovation',
      title: 'Explore Innovation',
      description: 'Explore modern software development, digital creative tools, open-source technology, and emerging computing frameworks through collaborative projects.',
      icon: Lightbulb,
      accent: 'Encouraging students to transform ideas into tangible projects.',
    },
    {
      id: 'create-experiences',
      title: 'Create Experiences',
      description: 'From university-wide tech quizzes and exhibitions to guest speaker seminars and annual club gatherings, we craft memorable campus experiences.',
      icon: Compass,
      accent: 'Celebrating student creativity, leadership, and curiosity.',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#FAF6F4] relative overflow-hidden">
      {/* Decorative Gold Accent Accents */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#AE7B29] to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#672C1C] bg-white border border-[#AE7B29]/40 mb-3 shadow-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-[#AE7B29]" />
            <span>WHO WE ARE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#672C1C] tracking-tight mb-5">
            More Than a Club.{' '}
            <span className="text-gold-gradient italic font-serif">A Community.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#66534B] leading-relaxed">
            Our IT Club brings together curious minds who share an interest in technology, creativity, innovation, and collaboration. We organise events, workshops, seminars, and interactive activities that help students learn, connect, and grow together.
          </p>
        </motion.div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                className="bg-white rounded-2xl p-7 border border-[rgba(103,44,28,0.12)] hover:border-[#AE7B29] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Top border gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#AE7B29] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Card Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#FAF6F4] group-hover:bg-[#672C1C] border border-[#AE7B29]/30 flex items-center justify-center mb-6 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#672C1C] group-hover:text-[#AE7B29] transition-colors duration-300" />
                  </div>

                  {/* Step Number Tag */}
                  <span className="text-[11px] font-bold tracking-widest text-[#AE7B29] uppercase mb-1 block">
                    Pillar 0{idx + 1}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#672C1C] mb-3 group-hover:text-[#672C1C]">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#66534B] leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Accent Footer */}
                <div className="pt-4 border-t border-[rgba(103,44,28,0.08)] mt-auto">
                  <p className="text-xs font-medium text-[#AE7B29]">
                    {feature.accent}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Community Values Bar */}
        <motion.div 
          className="mt-12 bg-white rounded-2xl p-6 border border-[#AE7B29]/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F4] flex items-center justify-center text-[#672C1C] shrink-0 border border-[#AE7B29]/40">
              <Award className="w-5 h-5 text-[#AE7B29]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#672C1C]">Open to All University Students</h4>
              <p className="text-xs text-[#66534B]">Whether you are in computing, arts, engineering, or business, everyone is welcome to participate.</p>
            </div>
          </div>

          <a
            href="#events"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('events');
              if (el) {
                const offset = el.getBoundingClientRect().top + window.pageYOffset - 82;
                window.scrollTo({ top: offset, behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#672C1C] hover:bg-[#481B0F] border border-[#AE7B29] transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-[#AE7B29]"
          >
            <span>See What We Do</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
