import React from 'react';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Package,
  Heart,
  HelpCircle
} from 'lucide-react';

const ProfileDropdown = ({ isOpen, setIsOpen }) => {
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-gray-700 hover:text-primary-600 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
        <span className="hidden sm:inline">Account</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fade-in">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Welcome!</p>
            <p className="text-xs text-gray-500">Manage your account</p>
          </div>

          {/* Quick Links */}
          <div className="py-2">
            <a href="/orders" className="dropdown-item">
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </a>
            <a href="/wishlist" className="dropdown-item">
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
            </a>
            <a href="/settings" className="dropdown-item">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </a>
            <a href="/help" className="dropdown-item">
              <HelpCircle className="h-4 w-4" />
              <span>Help Center</span>
            </a>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100">
            <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="h-4 w-4 mr-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 