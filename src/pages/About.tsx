import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { Sparkles, Heart, Mail, HelpCircle, ChevronDown, Send, HandHeart, Users, Target, Eye, Facebook, Twitter, Youtube, BookOpen, Code } from 'lucide-react';

const tabs = [
  { id: 'about', label: 'About Us', icon: Sparkles },
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'contact', label: 'Contact', icon: Mail },
] as const;

type TabId = (typeof tabs)[number]['id'];

const faqs = [
  { q: 'Is Grace Book free to use?', a: 'Yes! Grace Book is completely free. All Bible verses, books, courses, quizzes, and community features are available at no cost.' },
  { q: 'Do I need to create an account?', a: 'You can browse verses, books, and courses without an account. To download books, track progress, save favorites, and participate in chat, you will need to sign up for a free account.' },
  { q: 'How do I download books?', a: 'Go to the Books Library, click on any book to see details, then click the Download button. You will need a free account to track your downloads.' },
  { q: 'Can I contribute content?', a: 'We welcome contributions! Please contact us through the Contact tab if you would like to share books, courses, or other Christian content.' },
  { q: 'How does the quiz scoring work?', a: 'Easy questions are worth 10 points, Medium 20 points, and Hard 30 points. You also earn streak bonuses for consecutive correct answers.' },
  { q: 'Is my data private?', a: 'Yes. Your profile information and activity are protected. Only your username and avatar are visible to other users in the chat community.' },
];

export default function About() {
  const [tab, setTab] = useState<TabId>('about');
  const { showToast } = useToast();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 dark:from-slate-950 dark:via-primary-950 dark:to-slate-950 py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-72 h-72 bg-gold-500 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 mb-6 mx-auto"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Grace Book</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Your premium Christian faith companion — Bible, books, courses, and community.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-8 p-1 glass-card rounded-2xl">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    tab === t.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold mb-3 text-primary-700 dark:text-primary-300">Our Mission</h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Grace Book is a free Christian faith app designed to bring Bible verses, books, courses, quizzes,
                    and community features to believers around the world. We believe that access to God's Word
                    and Christian resources should be free and available to everyone, regardless of location or income.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-card p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 mb-3">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold mb-1">Bible & Books</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Daily verses, full Bible access, and a library of Christian books.</p>
                  </div>
                  <div className="glass-card p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 mb-3">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold mb-1">Courses & Quizzes</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Free video courses and interactive quizzes to grow your faith.</p>
                  </div>
                  <div className="glass-card p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold mb-1">Community</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Chat with believers worldwide and share prayer requests.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'support' && (
              <motion.div
                key="support"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {faqs.map((faq, i) => (
                  <div key={i} className="glass-card p-5">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer font-semibold text-slate-700 dark:text-slate-200">
                        {faq.q}
                        <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                    </details>
                  </div>
                ))}
              </motion.div>
            )}

            {tab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-primary-700 dark:text-primary-300">Get in Touch</h2>
                <form onSubmit={(e) => { e.preventDefault(); showToast('Message sent! We will get back to you soon.', 'success'); (e.target as HTMLFormElement).reset(); }} className="space-y-4">
                  <input type="text" placeholder="Your name" required className="input-field" />
                  <input type="email" placeholder="Your email" required className="input-field" />
                  <textarea placeholder="Your message" rows={4} required className="input-field" />
                  <button type="submit" className="btn-primary w-full">
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Connect with us:</p>
                  <div className="flex gap-3">
                    <a href="https://t.me/graceapp7" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-all">
                      <Send className="h-5 w-5" />
                    </a>
                    <a href="mailto:graceapp@proton.me" className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all">
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
