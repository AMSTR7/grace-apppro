import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Play, X, RefreshCw, GraduationCap, Clock, User } from 'lucide-react';
import { SkeletonCard, EmptyState } from '@/components/ui';
import type { Course } from '@/types';

const categories = ['All', 'Theology', 'Devotional', 'Bible Study', 'Apologetics', 'General'];

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [category, setCategory] = useState('All');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses((data as Course[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filtered = category === 'All' ? courses : courses.filter((c) => c.category === category);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-slate-900 dark:from-slate-950 dark:to-primary-950 py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-72 h-72 bg-gold-500 rounded-full blur-3xl animate-float" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <GraduationCap className="h-4 w-4 text-gold-400" />
            <span className="text-sm text-white/90 font-medium">Video Courses</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Christian Courses</h1>
          <p className="text-white/80 max-w-2xl mx-auto">Learn and grow through curated video courses on theology, devotionals, and Bible study.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === cat ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg' : 'glass text-slate-600 dark:text-slate-300 hover:scale-105'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center max-w-md mx-auto">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={fetchCourses} className="btn-primary">
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<GraduationCap className="h-8 w-8 text-primary-500" />}
              title="No Courses Yet"
              description="Check back soon for new video courses."
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.06, 0.5) }}
                  className="glass-card overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-gold-100 dark:from-slate-800 dark:to-slate-700">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-16 h-16 rounded-full bg-primary-600/80 flex items-center justify-center">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold">{course.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1 line-clamp-2">{course.title}</h3>
                    {course.description && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{course.description}</p>}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {course.instructor && (
                        <span className="flex items-center gap-1"><User className="h-4 w-4" /> {course.instructor}</span>
                      )}
                      {course.duration && (
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCourse(null)}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold">{selectedCourse.title}</h3>
                <button onClick={() => setSelectedCourse(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="aspect-video bg-black">
                {selectedCourse.youtube_video_id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedCourse.youtube_video_id}`}
                    title={selectedCourse.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60">
                    <Play className="h-12 w-12" />
                  </div>
                )}
              </div>
              {selectedCourse.description && (
                <div className="p-5">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedCourse.description}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
