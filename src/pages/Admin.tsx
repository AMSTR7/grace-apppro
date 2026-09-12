import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { UploadButton } from '@/components/UploadButton';
import type { Book, Course, Quiz as QuizType, Profile, PrayerRequest, ContactMessage, NewsletterSubscriber, Post, Ad, Message, ChatRoom, Flyer, Blog } from '@/types';
import {
  Lock, LayoutDashboard, Library, GraduationCap, BrainCircuit, Users, Mail,
  Plus, Edit2, Trash2, X, Download, TrendingUp, Award, MessageSquare, Heart, FileText,
  Megaphone, Image as ImageIcon, Ban, VolumeX, Volume2, Trash, BarChart3, LayoutGrid,
  Link2, Search, Eye, CheckCircle, XCircle, Newspaper,
} from 'lucide-react';
import { EmptyState } from '@/components/ui';

const ADMIN_PASSWORD = 'grace2024';
type Tab = 'dashboard' | 'books' | 'courses' | 'quizzes' | 'posts' | 'users' | 'chat' | 'ads' | 'messages' | 'flyers' | 'blogs';

export default function Admin() {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      showToast('Welcome, Admin!', 'success');
    } else {
      showToast('Wrong password', 'error');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter password to continue</p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="input-field"
                autoFocus
              />
              <button type="submit" className="btn-primary w-full">Unlock</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['dashboard', 'books', 'courses', 'quizzes', 'posts', 'users', 'chat', 'ads', 'messages', 'flyers', 'blogs'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === t ? 'bg-primary-600 text-white' : 'glass-card hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <AdminContent tab={tab} showToast={showToast} />
    </div>
  );
}

function AdminContent({ tab, showToast }: { tab: Tab; showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  switch (tab) {
    case 'dashboard':
      return <DashboardTab />;
    case 'books':
      return <BooksTab showToast={showToast} />;
    case 'courses':
      return <CoursesTab showToast={showToast} />;
    case 'quizzes':
      return <QuizzesTab showToast={showToast} />;
    case 'posts':
      return <PostsTab showToast={showToast} />;
    case 'users':
      return <UsersTab showToast={showToast} />;
    case 'chat':
      return <ChatTab showToast={showToast} />;
    case 'ads':
      return <AdsTab showToast={showToast} />;
    case 'messages':
      return <MessagesTab showToast={showToast} />;
    case 'flyers':
      return <FlyersTab showToast={showToast} />;
    case 'blogs':
      return <BlogsTab showToast={showToast} />;
  }
}

function DashboardTab() {
  const [stats, setStats] = useState({ books: 0, courses: 0, quizzes: 0, posts: 0, users: 0 });
  useEffect(() => {
    (async () => {
      const [b, c, q, p, u] = await Promise.all([
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        books: b.count ?? 0,
        courses: c.count ?? 0,
        quizzes: q.count ?? 0,
        posts: p.count ?? 0,
        users: u.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: 'Books', value: stats.books, icon: Library, gradient: 'from-gold-400 to-gold-600' },
    { label: 'Courses', value: stats.courses, icon: GraduationCap, gradient: 'from-accent-500 to-accent-700' },
    { label: 'Quizzes', value: stats.quizzes, icon: BrainCircuit, gradient: 'from-rose-500 to-rose-700' },
    { label: 'Posts', value: stats.posts, icon: LayoutGrid, gradient: 'from-emerald-500 to-emerald-700' },
    { label: 'Users', value: stats.users, icon: Users, gradient: 'from-primary-500 to-primary-700' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="glass-card p-5">
            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} mb-3`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function BooksTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', cover_url: '', pdf_url: '', epub_url: '', price: '0', price_type: 'free', category: 'General' });

  const load = async () => {
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    setBooks((data as Book[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('books').insert({ ...form, price: parseFloat(form.price) });
    if (error) { showToast('Failed to add book', 'error'); return; }
    showToast('Book added!', 'success');
    setShowForm(false);
    setForm({ title: '', author: '', cover_url: '', pdf_url: '', epub_url: '', price: '0', price_type: 'free', category: 'General' });
    load();
  };

  const deleteBook = async (id: string) => {
    await supabase.from('books').delete().eq('id', id);
    showToast('Book deleted', 'info');
    load();
  };

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-4"><Plus className="h-4 w-4" /> Add Book</button>
      {showForm && (
        <form onSubmit={addBook} className="glass-card p-4 mb-4 space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="input-field" required />
          <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author" className="input-field" required />
          <input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="Cover URL" className="input-field" />
          <input value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} placeholder="PDF URL" className="input-field" />
          <input value={form.epub_url} onChange={(e) => setForm({ ...form, epub_url: e.target.value })} placeholder="EPUB URL" className="input-field" />
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="input-field" />
          <select value={form.price_type} onChange={(e) => setForm({ ...form, price_type: e.target.value })} className="input-field">
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="input-field" />
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}
      <div className="space-y-2">
        {books.map((book) => (
          <div key={book.id} className="glass-card p-3 flex items-center gap-3">
            {book.cover_url && <img src={book.cover_url} alt="" className="w-10 h-14 object-cover rounded" />}
            <div className="flex-1">
              <p className="font-medium text-sm">{book.title}</p>
              <p className="text-xs text-slate-500">{book.author}</p>
            </div>
            <button onClick={() => deleteBook(book.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', youtube_video_id: '', thumbnail_url: '', duration: '', instructor: '', category: 'General' });

  const load = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setCourses((data as Course[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('courses').insert(form);
    if (error) { showToast('Failed to add course', 'error'); return; }
    showToast('Course added!', 'success');
    setShowForm(false);
    setForm({ title: '', description: '', youtube_video_id: '', thumbnail_url: '', duration: '', instructor: '', category: 'General' });
    load();
  };

  const deleteCourse = async (id: string) => {
    await supabase.from('courses').delete().eq('id', id);
    showToast('Course deleted', 'info');
    load();
  };

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-4"><Plus className="h-4 w-4" /> Add Course</button>
      {showForm && (
        <form onSubmit={addCourse} className="glass-card p-4 mb-4 space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="input-field" required />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="input-field" />
          <input value={form.youtube_video_id} onChange={(e) => setForm({ ...form, youtube_video_id: e.target.value })} placeholder="YouTube Video ID" className="input-field" />
          <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="Thumbnail URL" className="input-field" />
          <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration" className="input-field" />
          <input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} placeholder="Instructor" className="input-field" />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="input-field" />
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}
      <div className="space-y-2">
        {courses.map((course) => (
          <div key={course.id} className="glass-card p-3 flex items-center gap-3">
            {course.thumbnail_url && <img src={course.thumbnail_url} alt="" className="w-16 h-10 object-cover rounded" />}
            <div className="flex-1">
              <p className="font-medium text-sm">{course.title}</p>
              <p className="text-xs text-slate-500">{course.category}</p>
            </div>
            <button onClick={() => deleteCourse(course.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizzesTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', difficulty: 'Easy', category: 'Bible' });

  const load = async () => {
    const { data } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false }).limit(50);
    setQuizzes((data as QuizType[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('quizzes').insert(form);
    if (error) { showToast('Failed to add quiz', 'error'); return; }
    showToast('Quiz added!', 'success');
    setShowForm(false);
    setForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', difficulty: 'Easy', category: 'Bible' });
    load();
  };

  const deleteQuiz = async (id: string) => {
    await supabase.from('quizzes').delete().eq('id', id);
    showToast('Quiz deleted', 'info');
    load();
  };

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-4"><Plus className="h-4 w-4" /> Add Quiz</button>
      {showForm && (
        <form onSubmit={addQuiz} className="glass-card p-4 mb-4 space-y-3">
          <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" className="input-field" required />
          <input value={form.option_a} onChange={(e) => setForm({ ...form, option_a: e.target.value })} placeholder="Option A" className="input-field" required />
          <input value={form.option_b} onChange={(e) => setForm({ ...form, option_b: e.target.value })} placeholder="Option B" className="input-field" required />
          <input value={form.option_c} onChange={(e) => setForm({ ...form, option_c: e.target.value })} placeholder="Option C" className="input-field" required />
          <input value={form.option_d} onChange={(e) => setForm({ ...form, option_d: e.target.value })} placeholder="Option D" className="input-field" required />
          <select value={form.correct_answer} onChange={(e) => setForm({ ...form, correct_answer: e.target.value })} className="input-field">
            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
          </select>
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="input-field">
            <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
          </select>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="input-field" />
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}
      <div className="space-y-2">
        {quizzes.map((q) => (
          <div key={q.id} className="glass-card p-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="font-medium text-sm">{q.question}</p>
              <p className="text-xs text-slate-500">{q.category} · {q.difficulty}</p>
            </div>
            <button onClick={() => deleteQuiz(q.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostsTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(50);
    setPosts((data as Post[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const deletePost = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
    showToast('Post deleted', 'info');
    load();
  };

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <div key={post.id} className="glass-card p-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="font-medium text-sm">{post.title ?? 'Untitled'}</p>
            <p className="text-xs text-slate-500">{post.type} · {new Date(post.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

function UsersTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setUsers((data as Profile[]) ?? []);
      setLoading(false);
    });
  }, []);

  const toggleAdmin = async (user: Profile) => {
    await supabase.from('profiles').update({ is_admin: !user.is_admin }).eq('id', user.id);
    showToast('User updated', 'success');
    setUsers(users.map(u => u.id === user.id ? { ...u, is_admin: !u.is_admin } : u));
  };

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div key={user.id} className="glass-card p-3 flex items-center gap-3">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-gold-400 flex items-center justify-center text-white text-xs font-bold">
              {user.username?.charAt(0).toUpperCase() ?? '?'}
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-sm">{user.username ?? 'Unknown'}</p>
            <p className="text-xs text-slate-500">{user.full_name ?? ''}</p>
          </div>
          <button onClick={() => toggleAdmin(user)} className={`px-3 py-1 rounded-lg text-xs font-medium ${user.is_admin ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            {user.is_admin ? 'Admin' : 'User'}
          </button>
        </div>
      ))}
    </div>
  );
}

function ChatTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('chat_rooms').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setRooms((data as ChatRoom[]) ?? []);
      setLoading(false);
    });
  }, []);

  const deleteRoom = async (id: string) => {
    await supabase.from('chat_rooms').delete().eq('id', id);
    showToast('Room deleted', 'info');
    setRooms(rooms.filter(r => r.id !== id));
  };

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div className="space-y-2">
      {rooms.map((room) => (
        <div key={room.id} className="glass-card p-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="font-medium text-sm">{room.name}</p>
            <p className="text-xs text-slate-500">{room.type} · {room.is_private ? 'Private' : 'Public'}</p>
          </div>
          <button onClick={() => deleteRoom(room.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

function AdsTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', image_url: '', link_url: '', is_active: true });

  const load = async () => {
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    setAds((data as Ad[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addAd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('ads').insert(form);
    if (error) { showToast('Failed to add ad', 'error'); return; }
    showToast('Ad added!', 'success');
    setShowForm(false);
    setForm({ title: '', image_url: '', link_url: '', is_active: true });
    load();
  };

  const toggleActive = async (ad: Ad) => {
    await supabase.from('ads').update({ is_active: !ad.is_active }).eq('id', ad.id);
    setAds(ads.map(a => a.id === ad.id ? { ...a, is_active: !a.is_active } : a));
  };

  const deleteAd = async (id: string) => {
    await supabase.from('ads').delete().eq('id', id);
    showToast('Ad deleted', 'info');
    load();
  };

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-4"><Plus className="h-4 w-4" /> Add Ad</button>
      {showForm && (
        <form onSubmit={addAd} className="glass-card p-4 mb-4 space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="input-field" required />
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="input-field" required />
          <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="Link URL" className="input-field" />
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}
      <div className="space-y-2">
        {ads.map((ad) => (
          <div key={ad.id} className="glass-card p-3 flex items-center gap-3">
            {ad.image_url && <img src={ad.image_url} alt="" className="w-12 h-12 object-cover rounded" />}
            <div className="flex-1">
              <p className="font-medium text-sm">{ad.title}</p>
              <p className="text-xs text-slate-500">{ad.is_active ? 'Active' : 'Inactive'}</p>
            </div>
            <button onClick={() => toggleActive(ad)} className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800">{ad.is_active ? 'Deactivate' : 'Activate'}</button>
            <button onClick={() => deleteAd(ad.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(50).then(({ data }) => {
      setMessages((data as ContactMessage[]) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <div key={msg.id} className="glass-card p-4">
          <p className="font-medium text-sm">{msg.name}</p>
          <p className="text-xs text-slate-500 mb-1">{msg.email}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{msg.message}</p>
        </div>
      ))}
    </div>
  );
}

function FlyersTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('flyers').select('*').order('created_at', { ascending: false }).limit(50);
    setFlyers((data as Flyer[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleApproved = async (flyer: Flyer) => {
    await supabase.from('flyers').update({ is_approved: !flyer.is_approved }).eq('id', flyer.id);
    setFlyers(flyers.map(f => f.id === flyer.id ? { ...f, is_approved: !f.is_approved } : f));
  };

  const deleteFlyer = async (id: string) => {
    await supabase.from('flyers').delete().eq('id', id);
    showToast('Flyer deleted', 'info');
    load();
  };

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div className="space-y-2">
      {flyers.map((flyer) => (
        <div key={flyer.id} className="glass-card p-3 flex items-center gap-3">
          {flyer.image_url && <img src={flyer.image_url} alt="" className="w-12 h-12 object-cover rounded" />}
          <div className="flex-1">
            <p className="font-medium text-sm">{flyer.title ?? 'Untitled'}</p>
            <p className="text-xs text-slate-500">{flyer.is_approved ? 'Approved' : 'Pending'}</p>
          </div>
          <button onClick={() => toggleApproved(flyer)} className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800">{flyer.is_approved ? 'Unapprove' : 'Approve'}</button>
          <button onClick={() => deleteFlyer(flyer.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

function BlogsTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false }).limit(50);
    setBlogs((data as Blog[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const deleteBlog = async (id: string) => {
    await supabase.from('blogs').delete().eq('id', id);
    showToast('Blog deleted', 'info');
    load();
  };

  if (loading) return <div className="skeleton h-40 rounded-xl" />;

  return (
    <div className="space-y-2">
      {blogs.map((blog) => (
        <div key={blog.id} className="glass-card p-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="font-medium text-sm">{blog.title ?? 'Untitled'}</p>
            <p className="text-xs text-slate-500">{blog.category} · {new Date(blog.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={() => deleteBlog(blog.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}
