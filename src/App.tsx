import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import ResultDashboard from './components/ResultDashboard';
import HealthLibrary from './components/HealthLibrary';
import { HealthData, AssessmentResult } from './types';
import { assessCancerRisk } from './services/gemini';
import { Heart, LogIn, LogOut, User } from 'lucide-react';
import { auth, signInWithGoogle, saveAssessment } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Button } from '@/components/ui/button';

export default function App() {
  const [view, setView] = useState<'landing' | 'form' | 'result' | 'library'>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    setView('form');
  };

  const handleLibrary = () => {
    setView('library');
  };

  React.useEffect(() => {
    const handleNavLibrary = () => setView('library');
    window.addEventListener('navigate-library', handleNavLibrary);
    return () => window.removeEventListener('navigate-library', handleNavLibrary);
  }, []);

  const handleSubmit = async (data: HealthData) => {
    setIsLoading(true);
    try {
      const assessment = await assessCancerRisk(data);
      
      // Save to Firestore
      try {
        await saveAssessment(data, assessment);
      } catch (dbError) {
        console.error('Failed to save to Firestore:', dbError);
      }

      setResult(assessment);
      setView('result');
    } catch (error) {
      console.error(error);
      alert('An error occurred during assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={handleReset}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">CancerGuard</span>
          </div>
          
          <div className="flex items-center gap-4">
            {view !== 'landing' && (
              <div className="flex gap-4 mr-4 border-r pr-4">
                <button 
                  onClick={handleLibrary}
                  className={`text-sm font-medium transition-colors ${view === 'library' ? 'text-primary' : 'hover:text-primary'}`}
                >
                  Health Library
                </button>
                <button 
                  onClick={handleReset}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Home
                </button>
              </div>
            )}

            {isAuthReady && (
              user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs font-medium text-slate-700">{user.displayName}</span>
                    <button 
                      onClick={() => auth.signOut()}
                      className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-primary/20" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 text-slate-600 hover:text-primary"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )
            )}
          </div>
        </div>
      </nav>

      <main>
        {view === 'landing' && <LandingPage onStart={handleStart} />}
        {view === 'form' && (
          <AssessmentForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}
        {view === 'result' && result && (
          <ResultDashboard result={result} onReset={handleReset} />
        )}
        {view === 'library' && <HealthLibrary />}
      </main>
    </div>
  );
}

