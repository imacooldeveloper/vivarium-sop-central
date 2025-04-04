
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  HomeIcon, 
  BookOpenIcon, 
  BuildingIcon, 
  ClipboardListIcon, 
  UsersIcon, 
  Settings2Icon,
  LogOutIcon,
  GraduationCapIcon
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { logout, userProfile } = useAuth();
  const isAdmin = userProfile?.accountType === 'Admin';
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-700">Vivarium SOP</h1>
        <p className="text-sm text-gray-500 mt-1">
          {userProfile?.facilityName || 'Research Facility'}
        </p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <NavLink to="/" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <HomeIcon className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/sops" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <BookOpenIcon className="w-5 h-5" />
          <span>SOPs</span>
        </NavLink>

        <NavLink to="/quizzes" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <ClipboardListIcon className="w-5 h-5" />
          <span>Quizzes</span>
        </NavLink>

        <NavLink to="/certifications" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <GraduationCapIcon className="w-5 h-5" />
          <span>Certifications</span>
        </NavLink>

        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin
              </p>
            </div>

            <NavLink to="/users" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <UsersIcon className="w-5 h-5" />
              <span>Users</span>
            </NavLink>

            <NavLink to="/buildings" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <BuildingIcon className="w-5 h-5" />
              <span>Buildings</span>
            </NavLink>

            <NavLink to="/settings" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <Settings2Icon className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
          </>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="sidebar-item w-full justify-center"
        >
          <LogOutIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
