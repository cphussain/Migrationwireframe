import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { VMInventory } from './components/VMInventory';
import { CategoryManagement } from './components/CategoryManagement';
import { PhaseCreation } from './components/PhaseCreation';
import { MigrationReports } from './components/MigrationReports';
import { LeadAssignment } from './components/LeadAssignment';
import { AIAssistant } from './components/AIAssistant';
import { Capacity } from './components/Capacity';
import { Server, Tags, GitBranch, BarChart3, ArrowRight, Users, LogOut, User, Shield, MapPin, ChevronDown, Palette, HardDrive } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { getVMInventory, getPhases, getCategories } from './data/mockApi';

interface UserSession {
  username: string;
  role: string;
  region?: string;
}

type Theme = 'red' | 'white';

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [activeView, setActiveView] = useState('phases');
  const [theme, setTheme] = useState<Theme>('red');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mioa-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('mioa-theme', newTheme);
  };

  // Theme colors
  const themeColors = {
    red: {
      primary: '#DB0011',
      primaryHover: '#B00010',
      primaryLight: '#FEF0F1',
      text: '#DB0011',
      bg: '#FFFFFF',
      sidebarBg: '#DB0011',
      sidebarText: '#FFFFFF',
      border: '#B00010',
      activeBtn: '#B00010',
    },
    white: {
      primary: '#DB0011',
      primaryHover: '#B00010',
      primaryLight: '#FEF0F1',
      text: '#1E293B',
      bg: '#FFFFFF',
      sidebarBg: '#FFFFFF',
      sidebarText: '#475569',
      border: '#E2E8F0',
      activeBtn: '#DB0011',
    }
  };

  const colors = themeColors[theme];

  const allMenuItems = [
    { id: 'phases', label: 'Phases', icon: GitBranch, roles: ['Administrator', 'Region Lead', 'Migration Engineer'] },
    { id: 'capacity', label: 'Capacity', icon: HardDrive, roles: ['Administrator', 'Region Lead', 'Migration Engineer'] },
    { id: 'inventory', label: 'VM Inventory', icon: Server, roles: ['Administrator', 'Region Lead', 'Migration Engineer'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['Administrator', 'Region Lead'] },
    { id: 'categories', label: 'Categories', icon: Tags, roles: ['Administrator', 'Region Lead'] },
    { id: 'leads', label: 'Lead Assignment', icon: Users, roles: ['Administrator'] },
  ];

  // Filter menu items based on user role
  const menuItems = userSession 
    ? allMenuItems.filter(item => item.roles.includes(userSession.role))
    : [];

  const handleLogin = (username: string, role: string, region?: string) => {
    setUserSession({ username, role, region });
  };

  const handleLogout = () => {
    setUserSession(null);
    setActiveView('phases');
  };

  // Show login if not authenticated
  if (!userSession) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Vertical Navigation */}
      <aside 
        className="w-64 flex flex-col border-r-2"
        style={{ 
          backgroundColor: colors.sidebarBg,
          borderColor: colors.border,
          color: colors.sidebarText
        }}
      >
        {/* Logo Section */}
        <div 
          className="p-6 border-b-2"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded"
              style={{ backgroundColor: colors.activeBtn }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="8" width="12" height="8" fill="white" rx="1"/>
                <rect x="2" y="18" width="12" height="8" fill="white" rx="1"/>
                <rect x="2" y="28" width="12" height="8" fill="white" rx="1"/>
                <rect x="16" y="8" width="12" height="8" fill="white" rx="1"/>
                <rect x="16" y="18" width="12" height="8" fill="white" rx="1"/>
                <rect x="16" y="28" width="12" height="8" fill="white" rx="1"/>
                <rect x="30" y="8" width="8" height="8" fill="white" rx="1"/>
                <rect x="30" y="18" width="8" height="8" fill="white" rx="1"/>
                <rect x="30" y="28" width="8" height="8" fill="white" rx="1"/>
              </svg>
              <ArrowRight className="size-6 text-white" />
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L4 12V28L20 36L36 28V12L20 4Z" fill="white"/>
                <path d="M20 14L14 17V23L20 26L26 23V17L20 14Z" fill={colors.activeBtn}/>
              </svg>
            </div>
          </div>
          <h1 style={{ color: colors.sidebarText }} className="text-center">MiOA</h1>
          <p className="text-sm mt-1 text-center" style={{ color: colors.sidebarText }}>Migration, Innovation &</p>
          <p className="text-xs text-center" style={{ color: colors.sidebarText, opacity: 0.8 }}>Orchestration Assistant</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveView(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: isActive ? colors.activeBtn : 'transparent',
                      color: isActive ? '#FFFFFF' : colors.sidebarText,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = theme === 'red' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(100, 116, 139, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon className="size-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - simplified without user info */}
        <div 
          className="p-4 border-t-2"
          style={{ borderColor: colors.border }}
        >
          <p className="text-xs text-center" style={{ color: colors.sidebarText, opacity: 0.6 }}>Platform Migration</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50">
        {/* Header with logged-in user and logout */}
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-slate-900">
                {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <Palette className="size-4 text-slate-600" />
                <span className="text-sm text-slate-600">Theme:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleThemeChange('red')}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      theme === 'red'
                        ? 'bg-[#DB0011] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Red
                  </button>
                  <button
                    onClick={() => handleThemeChange('white')}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      theme === 'white'
                        ? 'bg-slate-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    White
                  </button>
                </div>
              </div>

              {/* User Menu with Logout */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50">
                    <div className="size-8 bg-[#DB0011] rounded-full flex items-center justify-center">
                      <User className="size-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-slate-900 text-sm">{userSession.username}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          {userSession.role}
                        </Badge>
                        {userSession.region && (
                          <Badge variant="outline" className="text-xs px-2 py-0 bg-blue-50 text-blue-700 border-blue-200">
                            {userSession.region}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronDown className="size-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2">
                    <p className="text-sm text-slate-900">{userSession.username}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="size-3 text-slate-500" />
                      <p className="text-xs text-slate-500">{userSession.role}</p>
                    </div>
                    {userSession.region && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3 text-slate-500" />
                        <p className="text-xs text-slate-500">{userSession.region}</p>
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-[#DB0011] cursor-pointer"
                  >
                    <LogOut className="size-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activeView === 'phases' && <PhaseCreation userSession={userSession} />}
          {activeView === 'inventory' && <VMInventory userSession={userSession} />}
          {activeView === 'categories' && <CategoryManagement userSession={userSession} />}
          {activeView === 'leads' && <LeadAssignment />}
          {activeView === 'reports' && <MigrationReports userSession={userSession} />}
          {activeView === 'capacity' && <Capacity userSession={userSession} />}
        </div>
      </main>
      
      {/* AI Assistant - Floating Button */}
      <AIAssistant userRole={userSession.role} userRegion={userSession.region} />
    </div>
  );
}