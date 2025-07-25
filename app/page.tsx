'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient'; // Import the shared client

// --- ICONS (Simple SVG components for a modern feel) ---
const IconClipboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconLoader = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- STYLES ---
const GlobalStyles = () => ( <style>{`@tailwind base; @tailwind components; @tailwind utilities; body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }`}</style> );

// --- UI COMPONENTS ---
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => ( <input {...props} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" /> );
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => ( <textarea {...props} rows={4} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" /> );
const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => ( <select {...props} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")'}}> {children} </select> );
const Button = ({ children, isLoading, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean; children: React.ReactNode }) => ( <button {...props} disabled={isLoading} className={`w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:bg-blue-800/50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 ${className}`}> {isLoading ? <IconLoader /> : children} </button> );

const LandingPage = ({ setView }: { setView: Function }) => (
    <div className="relative w-full min-h-screen flex items-center justify-center text-center px-4 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900/30 to-purple-900/30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,_rgba(147,197,253,0.1),_transparent_40%),radial-gradient(circle_at_80%_90%,_rgba(192,132,252,0.1),_transparent_40%)]"></div>
        <div className="relative z-10 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">StatusRelay</h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">The beautifully simple way to create a public status page. Keep your customers in the loop, effortlessly.</p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => setView({ name: 'login' })} className="px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">Login</button>
                <button onClick={() => setView({ name: 'signup' })} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-transform transform hover:scale-105">Sign Up for Free</button>
            </div>
        </div>
    </div>
);

const AuthFormContainer = ({ title, children, setView, pageType }: { title: string, children: React.ReactNode, setView: Function, pageType: string }) => ( <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl"> <h2 className="text-3xl font-bold text-white text-center">{title}</h2> {children} <p className="mt-6 text-center text-sm text-gray-400"> {pageType === 'login' ? "Don't have an account? " : "Already have an account? "} <a href="#" onClick={(e) => { e.preventDefault(); setView({ name: pageType === 'login' ? 'signup' : 'login' }); }} className="font-medium text-blue-400 hover:text-blue-300"> {pageType === 'login' ? 'Sign Up' : 'Log In'} </a> </p> </div> );

const SignUpPage = ({ setView, setSession }: { setView: Function, setSession: Function }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            setMessage('Check your email for the confirmation link!');
        } catch (error: any) {
            setError(error.message || 'An unexpected error occurred during sign up.');
        } finally {
            setIsLoading(false);
        }
    };

    return ( <AuthFormContainer title="Create an Account" setView={setView} pageType="signup"> <form onSubmit={handleSignUp} className="mt-8 space-y-6"> <Input id="email" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} /> <Input id="password" type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} /> {error && <p className="text-red-400 text-sm text-center">{error}</p>} {message && <p className="text-green-400 text-sm text-center">{message}</p>} <Button type="submit" isLoading={isLoading}>Sign Up</Button> </form> </AuthFormContainer> );
};

const LoginPage = ({ setView, setSession }: { setView: Function, setSession: Function }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            // The onAuthStateChange listener will handle setting the session
        } catch (error: any) {
            setError(error.message || 'An unexpected error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    };

    return ( <AuthFormContainer title="Welcome Back" setView={setView} pageType="login"> <form onSubmit={handleLogin} className="mt-8 space-y-6"> <Input id="email" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} /> <Input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> {error && <p className="text-red-400 text-sm text-center">{error}</p>} <Button type="submit" isLoading={isLoading}>Log In</Button> </form> </AuthFormContainer> );
};

const SetupPage = ({ session, setSetupComplete }: { session: Session, setSetupComplete: Function }) => {
    const [companyName, setCompanyName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const createSlug = (name: string) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    const handleCreatePage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyName.trim()) { setError('Please enter a company name.'); return; }
        setIsLoading(true);
        setError('');
        try {
            const slug = createSlug(companyName);
            const { error: insertError } = await supabase.from('pages').insert([{
                company_name: companyName.trim(),
                page_slug: slug,
                user_id: session.user.id,
            }]);
            if (insertError) throw insertError;
            setSetupComplete(true);
        } catch (error: any) {
            setError(`Could not create page. ${error.message.includes('23505') ? 'This name might be taken.' : 'Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return ( <div className="relative z-10 w-full max-w-xl text-center p-4"> <div className="p-6 sm:p-8 bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl"> <h1 className="text-3xl font-bold text-white">One Last Step!</h1> <p className="mt-2 text-gray-300">Let's get your public status page set up.</p> <form onSubmit={handleCreatePage} className="mt-8 space-y-6 text-left"> <div> <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">Your Company Name</label> <Input id="companyName" type="text" placeholder="e.g., My Awesome Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} /> </div> {error && <p className="text-red-400 text-sm text-center">{error}</p>} <Button type="submit" isLoading={isLoading}>Create Page</Button> </form> </div> </div> );
};

const DashboardPage = ({ session, setView }: { session: Session, setView: Function }) => {
    const [pageData, setPageData] = useState<any>(null);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [newStatus, setNewStatus] = useState('Investigating');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPageAndIncidents = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const { data: page, error: pageError } = await supabase.from('pages').select('*').eq('user_id', session.user.id).single();
            if (pageError) throw pageError;
            setPageData(page);

            if (page) {
                const { data: incidentsData, error: incidentsError } = await supabase.from('incidents').select('*').eq('page_id', page.id).order('created_at', { ascending: false });
                if (incidentsError) throw incidentsError;
                setIncidents(incidentsData || []);
            }
        } catch (error: any) {
            setError(error.message || 'Could not load dashboard data.');
        } finally {
            setIsLoading(false);
        }
    }, [session.user.id]);

    useEffect(() => {
        fetchPageAndIncidents();
    }, [fetchPageAndIncidents]);

    const handleCreateIncident = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newMessage.trim()) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('incidents').insert([{ page_id: pageData.id, title: newTitle, message: newMessage, status: newStatus }]);
            if (error) throw error;
            setNewTitle(''); setNewMessage(''); setNewStatus('Investigating');
            await fetchPageAndIncidents();
        } catch (error: any) {
            console.error("Failed to create incident:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const statusColors: { [key: string]: string } = { Investigating: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', Monitoring: 'bg-blue-500/20 text-blue-300 border-blue-500/30', Resolved: 'bg-green-500/20 text-green-300 border-green-500/30', };

    return ( <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8"> <header className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-center gap-4 mb-8"> <h1 className="text-3xl font-bold text-white text-center sm:text-left">{pageData?.company_name || 'Dashboard'}</h1> <div className="flex items-center gap-4"> <span className="text-gray-400 hidden md:block">{session.user.email}</span> <button onClick={handleSignOut} className="px-4 py-2 bg-gray-800/70 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition-colors">Sign Out</button> </div> </header> {isLoading && <div className="text-center text-gray-300">Loading...</div>} {error && <div className="text-center text-red-400">{error}</div>} {pageData && ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div className="lg:col-span-2 space-y-8"> <div> <h2 className="font-semibold text-white text-lg mb-4">Past Incidents</h2> <div className="space-y-4"> {incidents.length > 0 ? incidents.map(incident => ( <div key={incident.id} className="bg-gray-800/50 border border-gray-700/60 rounded-xl p-5 transition-all hover:border-gray-600"> <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"> <h3 className="font-bold text-white">{incident.title}</h3> <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[incident.status]} flex-shrink-0`}>{incident.status}</span> </div> <p className="mt-2 text-gray-300 text-sm leading-relaxed">{incident.message}</p> <p className="mt-4 text-xs text-gray-500">Posted: {new Date(incident.created_at).toLocaleString()}</p> </div> )) : ( <div className="text-center text-gray-400 py-10 bg-gray-800/30 rounded-lg"><p>No incidents created yet.</p></div> )} </div> </div> </div> <div className="lg:col-span-1 space-y-8"> <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"> <h2 className="font-semibold text-white text-lg">Your Public Page</h2> <div className="mt-4 flex flex-col items-stretch gap-2 bg-gray-900/70 p-3 rounded-lg"> <a href="#" onClick={(e) => { e.preventDefault(); setView({ name: 'public_status_page', slug: pageData.page_slug })}} className="text-green-400 truncate hover:underline p-2 text-center sm:text-left text-sm">StatusRelay.com/status/{pageData.page_slug}</a> <button onClick={() => navigator.clipboard.writeText(`StatusRelay.com/status/${pageData.page_slug}`)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600/20 text-blue-300 rounded-md hover:bg-blue-600/40 transition-colors" title="Copy to clipboard"><IconClipboard /> Copy Link</button> </div> </div> <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"> <h2 className="font-semibold text-white text-lg mb-4">Create New Incident</h2> <form onSubmit={handleCreateIncident} className="space-y-4"> <Input id="title" type="text" placeholder="Incident Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} /> <Textarea id="message" placeholder="What happened? Provide details..." value={newMessage} onChange={e => setNewMessage(e.target.value)} /> <Select id="status" value={newStatus} onChange={e => setNewStatus(e.target.value)}> <option>Investigating</option> <option>Monitoring</option> <option>Resolved</option> </Select> <Button type="submit" isLoading={isSubmitting}>Create Incident</Button> </form> </div> </div> </div> )} </div> );
};

const PublicStatusPage = ({ slug, setView }: { slug: string, setView: Function }) => {
    const [pageData, setPageData] = useState<any>(null);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPublicPageData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const { data: page, error: pageError } = await supabase.from('pages').select('*').eq('page_slug', slug).single();
                if (pageError || !page) throw new Error('This status page could not be found.');
                setPageData(page);

                const { data: incidentsData, error: incidentsError } = await supabase.from('incidents').select('*').eq('page_id', page.id).order('created_at', { ascending: false });
                if (incidentsError) throw new Error('Could not load incidents for this page.');
                setIncidents(incidentsData || []);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPublicPageData();
    }, [slug]);

    const statusColors: { [key: string]: string } = { Investigating: 'bg-yellow-400', Monitoring: 'bg-blue-400', Resolved: 'bg-green-400' };
    const statusTextColors: { [key: string]: string } = { Investigating: 'text-yellow-600', Monitoring: 'text-blue-600', Resolved: 'text-green-600' };

    if (isLoading) return <div className="w-full h-screen flex items-center justify-center bg-gray-50"><p>Loading Status Page...</p></div>;
    if (error) return <div className="w-full h-screen flex items-center justify-center bg-gray-50"><p className="text-red-500">{error}</p></div>;

    const overallStatus = incidents[0]?.status !== 'Resolved' ? incidents[0]?.status : 'All Systems Operational';
    const overallStatusColor = overallStatus === 'All Systems Operational' ? 'text-green-600' : statusTextColors[overallStatus];

    return (
        <div className="w-full min-h-screen bg-gray-50 text-gray-800 font-sans">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{pageData.company_name} Status</h1>
                    <p className={`mt-2 text-lg ${overallStatusColor} font-semibold flex items-center gap-2`}>
                        <span className={`h-3 w-3 rounded-full ${statusColors[overallStatus] || 'bg-green-500'}`}></span>
                        {overallStatus}
                    </p>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold mb-8">Incident History</h2>
                <div className="space-y-12">
                    {incidents.length > 0 ? incidents.map(incident => (
                        <div key={incident.id} className="relative pl-8 sm:pl-10 border-l-2 border-gray-200">
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${statusColors[incident.status]} border-4 border-gray-50`}></div>
                            <p className="text-sm text-gray-500 mb-1">{new Date(incident.created_at).toLocaleString()}</p>
                            <h3 className="text-xl font-bold text-gray-800">{incident.title}</h3>
                            <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-wrap">{incident.message}</p>
                        </div>
                    )) : (
                        <div className="text-center py-10 border border-gray-200 rounded-lg">
                            <IconCheckCircle />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No recent incidents</h3>
                            <p className="mt-1 text-sm text-gray-500">All systems are operating normally.</p>
                        </div>
                    )}
                </div>
            </main>
            <footer className="text-center py-8 text-sm text-gray-500 border-t border-gray-200 mt-12">
                Powered by <a href="#" onClick={(e) => { e.preventDefault(); setView({ name: 'landing' })}} className="text-blue-600 hover:underline font-semibold">StatusRelay</a>
            </footer>
        </div>
    );
};

// --- MAIN APP COMPONENT (Router) ---
export default function App() {
  const [view, setView] = useState({ name: 'landing' }); 
  const [session, setSession] = useState<Session | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // This effect handles loading Tailwind and fonts
    if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
      const tailwindScript = document.createElement('script');
      tailwindScript.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(tailwindScript);
    }
    if (!document.querySelector('link[href*="Inter"]')) {
      const fontLink = document.createElement('link');
      fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    }
  }, []);
  
  useEffect(() => {
    // This effect listens for Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        if (event === 'SIGNED_IN') {
            // Check if this is the first sign-in
            setIsNewUser(session?.user?.created_at === session?.user?.last_sign_in_at);
        }
        if (event === 'SIGNED_OUT') {
            setView({ name: 'landing' });
            setSetupComplete(false);
            setIsNewUser(false);
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderContent = () => {
    if (view.name === 'public_status_page') {
        return <PublicStatusPage slug={(view as any).slug} setView={setView} />;
    }
      
    if (session) {
      if (isNewUser && !setupComplete) {
        return <SetupPage session={session} setSetupComplete={setSetupComplete} />;
      }
      return <DashboardPage session={session} setView={setView} />;
    }
    
    switch (view.name) {
      case 'signup': return <SignUpPage setView={setView} setSession={setSession} />;
      case 'login': return <LoginPage setView={setView} setSession={setSession} />;
      default: return <LandingPage setView={setView} />;
    }
  };

  const isAuthScreen = !session && view.name !== 'public_status_page';

  return (
    <>
      <GlobalStyles />
      <div className={view.name === 'public_status_page' ? 'bg-gray-50' : 'bg-gray-900'}>
        <main className="min-h-screen flex flex-col items-center justify-center">
            {isAuthScreen && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-900/10 to-purple-900/10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,_rgba(147,197,253,0.1),_transparent_40%),radial-gradient(circle_at_80%_90%,_rgba(192,132,252,0.05),_transparent_40%)]"></div>
                </div>
            )}
            <div className="w-full h-full">{renderContent()}</div>
        </main>
      </div>
    </>
  );
}
