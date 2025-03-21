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
  userName : z.string().min(4, {message : "min 8 characters are requierd"}),
  emailId: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  isAdmin : z.boolean().default(false),
});

type FormField = z.infer<typeof schema>;


export default function SignUp() {
  
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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/signup` , data, {
          withCredentials : true
        });

      
        dispactch(addUser(res.data.serverResponse.data));
        localStorage.setItem('token',res.data.token);
        router.push("/home");
        // console.log('Sign-in successful:', res.data.serverResponse.data, res.data.token);
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message || 'Invalid email or password';
        setError('userName', { message: errorMessage });  
        setError('emailId', { message: errorMessage });
        setError('password', { message: errorMessage });
      }
    };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-teal-50 to-blue-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sign Up</h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">
              Username
            </label>
            <input
              {...register("userName")}
              type="text"
              id="username"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all duration-200"
              placeholder="johndoe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              {...register("emailId")}
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all duration-200"
              placeholder="you@example.com"
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
          <div className="flex items-center gap-2">
           <label
             htmlFor="admin"
             className="text-sm font-medium text-gray-700"
           >
             Admin
           </label>
           <input
             {...register('isAdmin')}
             type="checkbox"
             id="admin"
             className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded cursor-pointer"
           />
           {errors.isAdmin && (
             <p className="text-sm text-red-500">{errors.isAdmin.message}</p>
           )}
         </div>
          <button
            type="submit"
            disabled = {isSubmitting}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
          >
            {isSubmitting ? "loading..." :  "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="">
            <button className="text-teal-500 hover:text-teal-600 font-medium transition-colors duration-200">Sign In</button>
          </Link>
        </p>
      </div>
    </div>
  );
}