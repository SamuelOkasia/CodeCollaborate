// src/app/page.tsx

import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to CodeCollaborate</h1>
        <p className="mb-4">Login to get started:</p>
        <div className="space-y-4">
          <a href="http://localhost:5000/auth/google">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login with Google
            </button>
          </a>
          <a href="http://localhost:5000/auth/github">
            <button className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
              Login with GitHub
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;