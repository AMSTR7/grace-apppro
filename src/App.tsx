import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Bible from '@/pages/Bible';
import Blog from '@/pages/Blog';
import Courses from '@/pages/Courses';

type Route = '/' | '/bible' | '/blog' | '/courses';

function getRouteFromPath(path: string): Route {
  if (path === '/bible') return '/bible';
  if (path === '/blog') return '/blog';
  if (path === '/courses') return '/courses';
  return '/';
}

function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-slate-900 dark:from-slate-950 dark:to-primary-950 py-20 sm:py-28">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-72 h-72 bg-gold-500 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="text-sm text-white/90 font-medium">Grace Book</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Your Christian Faith Companion
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-8">
            Daily Bible verses, free books, courses, quizzes, and a global faith community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/bible" className="btn-gold">Read the Bible</a>
            <a href="/blog" className="btn-ghost">Read Blog</a>
            <a href="/courses" className="btn-ghost">Watch Courses</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(getRouteFromPath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setRoute(getRouteFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(getRouteFromPath(path));
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar currentPath={route} onNavigate={handleNavigate} />
      {route === '/' && <HomePage />}
      {route === '/bible' && <Bible />}
      {route === '/blog' && <Blog />}
      {route === '/courses' && <Courses />}
    </div>
  );
}
