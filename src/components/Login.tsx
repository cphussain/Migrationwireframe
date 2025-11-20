import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowRight, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, role: string, region?: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mock user credentials with roles and regions
  const mockUsers = [
    { username: 'admin', password: 'Adm!n@2024#Secure', role: 'Administrator', region: undefined },
    { username: 'john.doe', password: 'J0hn$D0e!2024#MiOA', role: 'Region Lead', region: 'US-East' },
    { username: 'jane.smith', password: 'J@ne$m!th#2024#EU', role: 'Region Lead', region: 'EU-Central' },
    { username: 'mike.wilson', password: 'M!ke$W1ls0n@2024#Eng', role: 'Migration Engineer', region: undefined },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = mockUsers.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      onLogin(user.username, user.role, user.region);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-6">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-[#DB0011] px-4 py-3 rounded-lg shadow-lg">
              <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <ArrowRight className="size-8 text-white" />
              <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L4 12V28L20 36L36 28V12L20 4Z" fill="white"/>
                <path d="M20 14L14 17V23L20 26L26 23V17L20 14Z" fill="#DB0011"/>
              </svg>
            </div>
          </div>
          <h1 className="text-[#DB0011] mb-2">MiOA</h1>
          <p className="text-[#DB0011]">Migration, Innovation &</p>
          <p className="text-[#DB0011]">Orchestration Assistant</p>
          <p className="text-[#DB0011]/70 text-sm mt-1">Platform Migration</p>
        </div>

        {/* Login Card */}
        <Card className="border-2 border-[#DB0011] shadow-xl">
          <CardHeader>
            <CardTitle className="text-[#DB0011]">Sign In</CardTitle>
            <CardDescription className="text-slate-600">
              Enter your credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-900">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-[#DB0011] focus:ring-[#DB0011]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-900">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-[#DB0011] focus:ring-[#DB0011]"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-[#DB0011] hover:bg-[#A50010] text-white">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}