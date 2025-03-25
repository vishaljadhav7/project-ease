'use client'

import React from 'react'
import Image from 'next/image';
import { useAppSelector } from '@/Redux/store';

export default function User() {
  const userData = useAppSelector((store) => store.user.userInfo);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg font-medium">Loading user data...</p>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userData.id as string);
   
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Profile Avatar */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 shadow-md">
            <Image
              src={userData.profileAvatarUrl || "/default-avatar.png"} // Fallback image
              alt={`${userData.userName}'s avatar`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{userData.userName}</h1>
          <p className="text-gray-600 text-lg">{userData.emailId}</p>
        </div>

        {/* Details List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
            <span className="text-gray-700 font-medium">User ID</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">{userData.id}</span>
              <button 
                onClick={copyToClipboard}
                title="Copy User ID"
              >
                📋
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
            <span className="text-gray-700 font-medium">Team ID</span>
            <span className="text-gray-600 text-sm">
              {userData.teamId || "Not assigned"}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
            <span className="text-gray-700 font-medium">Admin Status</span>
            <span className="text-gray-600 text-sm">
              {userData.isAdmin ? "Administrator" : "Regular User"}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
            <span className="text-gray-700 font-medium">Profile URL</span>
            <a
              href={userData.profileAvatarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 text-sm hover:underline truncate max-w-xs"
            >
              View Image
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}