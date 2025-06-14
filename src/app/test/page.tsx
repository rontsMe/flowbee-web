'use client'


import React, { useState } from 'react';

const ProfessionalSidebarPreview = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      )
    },
    { 
      id: 'product', 
      label: 'Product', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'kanban', 
      label: 'Kanban', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      )
    },
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
  };

  const styles = {
    sidebar: {
      background: 'linear-gradient(180deg, #1a1f2e 0%, #151a26 100%)', // Subtle vertical gradient
      color: '#f4f4f5',
      borderRight: '1px solid #2a2f3e',
    },
    topNav: {
      background: 'linear-gradient(180deg, #1a1f2e 0%, #151a26 100%)', // Matching gradient
      borderBottom: '1px solid #2a2f3e',
      color: '#f4f4f5',
    },
    activeButton: {
      background: 'linear-gradient(135deg, #252a3a 0%, #1f242f 100%)', // Subtle diagonal gradient
      color: '#f4f4f5',
    },
    inactiveButton: {
      backgroundColor: 'transparent',
      color: '#a8a9aa',
    },
    hoverButton: {
      background: 'linear-gradient(135deg, #1f242f 0%, #1a1f2a 100%)', // Subtle hover gradient
      color: '#d1d5db',
    },
    searchBar: {
      background: 'linear-gradient(135deg, #252a3a 0%, #1f242f 100%)', // Subtle gradient
      border: '1px solid #2a2f3e',
      color: '#f4f4f5',
    },
    logoGradient: {
      background: 'linear-gradient(135deg, #4f6dc7 0%, #3d5aa3 100%)', // Enhanced logo gradient
    },
    activeTab: {
      background: 'linear-gradient(0deg, #4f6dc7 0%, #5a7bd1 100%)', // Subtle upward gradient for active tab
    }
  };

  return (
    <div className="flex h-screen" style={{backgroundColor: '#1f2937'}}>
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 z-10" style={styles.topNav}>
        {/* Left side - Hamburger + Logo */}
        <div className="flex items-center gap-4 w-64">
          <button className="p-1 rounded hover:bg-opacity-80" style={styles.inactiveButton}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo moved to top nav */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={styles.logoGradient}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold">Flowbee</span>
          </div>
        </div>

        {/* Center - Search (centered over main content area only) */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute left-3 top-2.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-12 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              style={styles.searchBar}
            />
            <div className="absolute right-3 top-2 text-xs text-gray-400">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Active Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{backgroundColor: '#252a3a', border: '1px solid #2a2f3e'}}>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span style={{color: '#4f6dc7'}}>Active: enhance_audio</span>
          </div>

          {/* Notification */}
          <button className="relative p-2 rounded-lg transition-all duration-200 hover:scale-105" style={styles.inactiveButton}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>

          {/* User */}
          <button className="w-10 h-10 rounded-full transition-all duration-200 hover:scale-105" style={{backgroundColor: '#252a3a', border: '1px solid #2a2f3e'}}>
            <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-semibold" style={styles.logoGradient}>
              JD
            </div>
          </button>

          {/* Theme Toggle */}
          <button className="p-2 rounded-lg transition-all duration-200 hover:scale-110" style={styles.inactiveButton}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 pt-16 flex flex-col" style={styles.sidebar}>
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs uppercase tracking-wider font-medium mb-4 px-3" style={{color: '#4f6dc7'}}>
            Platform
          </div>
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 font-medium"
              style={
                activeItem === item.id
                  ? styles.activeButton
                  : styles.inactiveButton
              }
              onMouseEnter={(e) => {
                if (activeItem !== item.id) {
                  (e.target as HTMLElement).style.background = styles.hoverButton.background;
                  (e.target as HTMLElement).style.color = styles.hoverButton.color;
                }
              }}
              onMouseLeave={(e) => {
                if (activeItem !== item.id) {
                  (e.target as HTMLElement).style.backgroundColor = styles.inactiveButton.backgroundColor;
                  (e.target as HTMLElement).style.color = styles.inactiveButton.color;
                }
              }}
            >
              <span style={{color: 'inherit'}}>{item.icon}</span>
              <span style={{color: 'inherit'}}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Subtle divider */}
        <div className="mx-4" style={{height: '1px', backgroundColor: '#2a2f3e'}}></div>

        {/* Settings - outside dividers */}
        <div className="p-4">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 font-medium"
            style={styles.inactiveButton}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = styles.hoverButton.background;
              (e.target as HTMLElement).style.color = styles.hoverButton.color;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = styles.inactiveButton.backgroundColor;
              (e.target as HTMLElement).style.color = styles.inactiveButton.color;
            }}
          >
            <span style={{color: 'inherit'}}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <span style={{color: 'inherit'}}>Settings</span>
          </button>
        </div>

        {/* Another subtle divider */}
        <div className="mx-4" style={{height: '1px', backgroundColor: '#2a2f3e'}}></div>

        {/* User Section */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style={{backgroundColor: '#252a3a', color: '#f4f4f5'}}>
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{color: '#f4f4f5'}}>John Doe</p>
              <p className="text-xs truncate" style={{color: '#a8a9aa'}}>john@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 pt-16" 
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #1a202c 100%)',
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(79, 109, 199, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(90, 123, 209, 0.02) 0%, transparent 50%)'
        }}
      >
        {/* Plain breadcrumbs - no backgrounds */}
        <div className="px-6 py-3">
          <nav className="flex items-center space-x-1 text-sm">
            <span className="text-gray-400 hover:text-gray-300 cursor-pointer transition-colors duration-150">
              Dashboard
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-200">
              System Overview
            </span>
          </nav>
        </div>

        {/* Tab navigation - centered below breadcrumbs */}
        <div className="flex justify-center px-6 pb-4">
          <nav className="flex space-x-8">
            <button 
              className="px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150" 
              style={{
                color: '#f4f4f5', 
                borderImage: 'linear-gradient(90deg, #4f6dc7, #5a7bd1) 1'
              }}
            >
              Overview
            </button>
            <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-gray-600 transition-colors duration-150" style={{color: '#9ca3af'}}>
              Analytics
            </button>
            <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-gray-600 transition-colors duration-150" style={{color: '#9ca3af'}}>
              Reports
            </button>
          </nav>
        </div>
        
        {/* Page content */}
        <div className="px-6">
          <div className="text-white text-lg font-semibold mb-4">System Overview</div>
          <div className="text-gray-400 text-sm">
            Professional layout with:
            <br />• Subtle sidebar dividers for better grouping
            <br />• Settings positioned above user profile
            <br />• Centered tab navigation below breadcrumbs
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSidebarPreview;


