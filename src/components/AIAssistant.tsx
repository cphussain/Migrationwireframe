import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Bot, X, Send, Sparkles, Database, Layers, TrendingUp, Users, Server } from 'lucide-react';
import { getVMInventory, getPhases, getCategories } from '../data/mockApi';

interface AIAssistantProps {
  userRole?: string;
  userRegion?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

const quickActions = [
  { icon: Database, label: 'Total VMs', query: 'How many VMs are in the inventory?' },
  { icon: Layers, label: 'Phase Status', query: 'Show me all active phases' },
  { icon: TrendingUp, label: 'Migration Progress', query: 'What is the overall migration progress?' },
  { icon: Server, label: 'VMs by Category', query: 'Show VMs breakdown by category' },
  { icon: Users, label: 'VMs by Region', query: 'Show VMs breakdown by region' },
];

export function AIAssistant({ userRole, userRegion }: AIAssistantProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: '1',
        type: 'assistant',
        content: `Hello! I'm your MiOA AI Assistant. I can help you search and analyze your migration data. Try asking me about:\n\n• VM inventory and counts\n• Phase status and details\n• Migration progress\n• Category distribution\n• Region-specific data\n\nWhat would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const analyzeQuery = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();
    
    // Fetch data
    const vms = await getVMInventory();
    const phases = await getPhases();
    const categories = await getCategories();
    
    // Total VMs
    if (lowerQuery.includes('how many') || lowerQuery.includes('total vm') || lowerQuery.includes('count')) {
      const totalVMs = vms.length;
      const byRegion = vms.reduce((acc, vm) => {
        acc[vm.region] = (acc[vm.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const regionBreakdown = Object.entries(byRegion)
        .map(([region, count]) => `• ${region}: ${count} VMs`)
        .join('\n');
      
      return `📊 **Total VM Inventory**: ${totalVMs} VMs\n\n**Breakdown by Region:**\n${regionBreakdown}`;
    }
    
    // Phase information
    if (lowerQuery.includes('phase') || lowerQuery.includes('migration phase')) {
      const totalPhases = phases.length;
      const phaseDetails = phases
        .map(phase => `• **${phase.name}**: ${phase.vms.length} VMs, CR: ${phase.changeRequest}`)
        .join('\n');
      
      return `📋 **Total Phases**: ${totalPhases}\n\n**Phase Details:**\n${phaseDetails || '• No phases created yet'}`;
    }
    
    // Migration progress
    if (lowerQuery.includes('progress') || lowerQuery.includes('migrated') || lowerQuery.includes('completion')) {
      const totalVMs = vms.length;
      // Mock migration completion data
      const completedVMs = Math.floor(totalVMs * 0.45); // 45% completed as example
      const inProgressVMs = Math.floor(totalVMs * 0.25); // 25% in progress
      const pendingVMs = totalVMs - completedVMs - inProgressVMs;
      const percentage = ((completedVMs / totalVMs) * 100).toFixed(1);
      
      return `📈 **Overall Migration Progress**: ${percentage}%\n\n**Status Breakdown:**\n• ✅ Completed: ${completedVMs} VMs\n• 🔄 In Progress: ${inProgressVMs} VMs\n• ⏳ Pending: ${pendingVMs} VMs\n• **Total**: ${totalVMs} VMs`;
    }
    
    // Category breakdown
    if (lowerQuery.includes('category') || lowerQuery.includes('categories')) {
      const byCategory = vms.reduce((acc, vm) => {
        acc[vm.category] = (acc[vm.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const categoryBreakdown = Object.entries(byCategory)
        .map(([category, count]) => {
          const catInfo = categories.find(c => c.id === category);
          return `• **${category}** (${catInfo?.strategy}): ${count} VMs`;
        })
        .join('\n');
      
      return `🏷️ **VMs by Category:**\n\n${categoryBreakdown}`;
    }
    
    // Region breakdown
    if (lowerQuery.includes('region') && !lowerQuery.includes('by region breakdown')) {
      const byRegion = vms.reduce((acc, vm) => {
        acc[vm.region] = (acc[vm.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const regionBreakdown = Object.entries(byRegion)
        .map(([region, count]) => {
          const percentage = ((count / vms.length) * 100).toFixed(1);
          return `• **${region}**: ${count} VMs (${percentage}%)`;
        })
        .join('\n');
      
      return `🌍 **VMs by Region:**\n\n${regionBreakdown}`;
    }
    
    // Search for specific VM
    if (lowerQuery.includes('gb') && /gb\d{5}/.test(lowerQuery)) {
      const vmName = lowerQuery.match(/gb\d{5}/)?.[0].toUpperCase();
      const vm = vms.find(v => v.name.toLowerCase() === vmName?.toLowerCase());
      
      if (vm) {
        return `🖥️ **VM Details: ${vm.name}**\n\n• **Service**: ${vm.serviceName}\n• **Region**: ${vm.region}\n• **Category**: ${vm.category}\n• **Status**: Available for migration`;
      } else {
        return `❌ VM "${vmName}" not found in inventory.`;
      }
    }
    
    // Service information
    if (lowerQuery.includes('service')) {
      const byService = vms.reduce((acc, vm) => {
        acc[vm.serviceName] = (acc[vm.serviceName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const serviceBreakdown = Object.entries(byService)
        .slice(0, 10)
        .map(([service, count]) => `• ${service}: ${count} VMs`)
        .join('\n');
      
      return `💼 **Top Services (by VM count):**\n\n${serviceBreakdown}`;
    }
    
    // User access based on role
    if (lowerQuery.includes('access') || lowerQuery.includes('permission')) {
      if (userRole === 'Administrator') {
        return `👑 **Your Access Level: Administrator**\n\n• Full access to all regions\n• Can manage all VMs\n• Can create and modify phases\n• Can execute migrations\n• Can manage user roles`;
      } else if (userRole === 'Region Lead') {
        return `👨‍💼 **Your Access Level: Region Lead**\n\n• Access limited to: ${userRegion}\n• Can view ${userRegion} VMs only\n• Can create phases for your region\n• Can execute migrations in your region`;
      } else if (userRole === 'Migration Engineer') {
        return `🔧 **Your Access Level: Migration Engineer**\n\n• Can create migration phases\n• Can execute migrations\n• Cannot modify VM inventory\n• Cannot manage users`;
      }
    }
    
    // Default response
    return `I understand you're asking about "${query}". Here are some queries I can help with:\n\n• "How many VMs are in the inventory?"\n• "Show me all phases"\n• "What is the migration progress?"\n• "Show VMs by category"\n• "Show VMs by region"\n• "What are my access permissions?"\n• "Search for VM GB00001"\n\nPlease try one of these queries!`;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const queryToAnalyze = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(async () => {
      const response = await analyzeQuery(queryToAnalyze);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => handleSend(), 100);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 size-14 rounded-full bg-[#DB0011] hover:bg-[#B00010] text-white shadow-2xl z-50 p-0"
        title="Open AI Assistant"
      >
        <Bot className="size-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[450px] h-[650px] bg-white rounded-lg shadow-2xl z-50 flex flex-col border-2 border-[#DB0011]">
      {/* Header */}
      <div className="bg-[#DB0011] text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="size-6" />
            <Sparkles className="size-3 absolute -top-1 -right-1 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-semibold">MiOA AI Assistant</h3>
            <p className="text-xs text-red-100">Powered by AI • Always ready to help</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-red-800 hover:text-white p-1 h-auto"
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="p-3 bg-slate-50 border-b">
          <p className="text-xs text-slate-600 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.query)}
                  className="gap-1.5 text-xs h-7"
                >
                  <Icon className="size-3" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-[#DB0011] text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-900 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your migration..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="bg-[#DB0011] hover:bg-[#B00010] text-white"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          💡 Try: "Show VMs by region" or "What is my access level?"
        </p>
      </div>
    </div>
  );
}