'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useAppDispatch , useAppSelector} from '@/Redux/store';
import { addUser } from '@/features/user/userSlice';
import { useRouter } from 'next/navigation';

const schema = z.object({
  emailId: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type FormField = z.infer<typeof schema>;

export default function SignIn() {
  const authStatus = useAppSelector(store => store.user.isAuthenticated)
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormField>({
    resolver: zodResolver(schema),
  });  
  const dispactch = useAppDispatch();
  const router = useRouter();
  
  useEffect(()=> {
    if(authStatus){
      router.push("/home")
    }
  }, [router, dispactch, authStatus])

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    try {
      const res = await axios.post('http://localhost:4000/api/v1/signin', data);
      dispactch(addUser(res.data.serverResponse.data));
      localStorage.setItem('token',res.data.token);
      router.push("/home");
      // console.log('Sign-in successful:', res.data.serverResponse.data, res.data.token);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || 'Invalid email or password';
      setError('emailId', { message: errorMessage });
      setError('password', { message: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-teal-50 to-blue-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="emailId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              {...register('emailId')}
              type="email"
              id="emailId"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200"
              placeholder="you@example.com"
              aria-invalid={errors.emailId ? 'true' : 'false'}
            />
            {errors.emailId && (
              <p className="mt-1 text-sm text-red-500">{errors.emailId.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200"
              placeholder="••••••••"
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg disabled:bg-teal-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{' '}
          <Link
            href="/signup"
            className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}