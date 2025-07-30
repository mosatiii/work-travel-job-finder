import React from 'react';
import { Briefcase, Compass } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-12 flex items-center justify-center px-8 pt-4 relative z-10">
      <div className="bg-white rounded-full px-4 py-2 shadow-md border border-gray-200">
        <div className="flex items-center space-x-2">
          {/* Logo with gradient background */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-lg">
            <div className="relative">
              <Compass className="w-4 h-4 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full flex items-center justify-center">
                <Briefcase className="w-1 h-1 text-indigo-700" />
              </div>
            </div>
          </div>
          
          {/* Brand text */}
          <div>
            <h1 className="text-sm font-bold text-gray-900 tracking-tight">
              Work & Travel
              <span className="text-indigo-600 ml-1">Australia</span>
            </h1>
            <p className="text-gray-600 text-xs font-medium">
              Discover your next adventure
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 