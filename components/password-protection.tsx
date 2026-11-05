'use client';

import 'lib/password-utils'; // Import utilities to make them available globally
import { ReactNode, useEffect, useState } from 'react';

const PASSWORD = 'itmustbemagic';
const STORAGE_KEY = 'site_access_granted';
const EXPIRY_HOURS = 24;

interface PasswordProtectionProps {
  children: ReactNode;
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Skip password protection on checkout subdomain
    if (typeof window !== 'undefined' && window.location.hostname.startsWith('checkout.')) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check if user has valid access
    const checkAccess = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const { timestamp } = JSON.parse(stored);
          const expiryTime = timestamp + (EXPIRY_HOURS * 60 * 60 * 1000);
          
          if (Date.now() < expiryTime) {
            setIsAuthenticated(true);
          } else {
            // Access expired, remove from storage
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {
          // Invalid stored data, remove it
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    checkAccess();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (inputPassword === PASSWORD) {
      // Store access with timestamp
      const accessData = {
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accessData));
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password. Please try again.');
      setInputPassword('');
    }
  };

  // Show loading state briefly to prevent flash
  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-[2rem]">
        <div className="w-full max-w-[400px] mx-auto">
          
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-[1.5rem] py-[1.2rem] text-[1.6rem] border border-gray-300 border-b-0 rounded-none focus:outline-none focus:border-black focus:border-b-0 transition-colors"
              autoFocus
            />
            
            <button
              type="submit"
              className="w-full bg-black text-white px-[1.5rem] py-[1.2rem] text-[1.6rem] font-medium border border-black transition-colors "
              disabled={!inputPassword.trim()}
            >
              Enter Site
            </button>
            
            {error && (
              <p className="text-red-600 text-[1.4rem] mt-[0.5rem]">{error}</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  // User is authenticated, show the actual content
  return <>{children}</>;
}