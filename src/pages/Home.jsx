import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="glass p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full">
        <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 2-3 4-3s4 1.343 4 3-2 3-4 3-4-1.343-4-3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V7m0 4v4m0 0c0 1.657-2 3-4 3s-4-1.343-4-3 2-3 4-3 4 1.343 4 3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Welcome to CertTrack</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Your one-stop platform for managing and tracking certifications. Please login or go to your dashboard to get started.</p>
        <div className="flex gap-4 w-full justify-center">
          <Button size="md" variant="primary" onClick={() => navigate('/login')}>Login</Button>
          <Button size="md" variant="secondary" onClick={() => navigate('/user/dashboard')}>Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
