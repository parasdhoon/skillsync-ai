"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { showCustomToast, ToasterWrapper } from '@/components/CustomToast';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      showCustomToast("Account created successfully", "success");
      setTimeout(() => router.push('/auth/signin'), 3500);
    } else {
      const data = await res.json();
      showCustomToast(data.error || "Something went wrong", "error");
    }
  };

  return (
    <>
      <ToasterWrapper />
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md space-y-6 border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-indigo-600 font-orbitron">Create Account</h2>

          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />

          <button type="submit" className="w-full bg-indigo-600 py-2 rounded-md text-white font-semibold hover:bg-indigo-700 transition duration-300">
            Sign Up
          </button>

          <div className="text-center text-sm text-gray-500">Or</div>

          <button type="button" onClick={() => signIn('google')} className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition">
            <img src="/next.svg" alt="Google" className="h-5 w-5 mr-2" /> Sign Up with Google
          </button>

          <p className="text-center text-sm text-gray-500">Already have an account? <a href="/auth/signin" className="text-indigo-600 hover:underline">Sign In</a></p>
        </form>
      </div>
    </>
  );
}