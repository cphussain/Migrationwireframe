import { useDrag, useDrop } from 'react-dnd';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ChevronRight, X, Monitor } from 'lucide-react';

interface VM {
  name: string;
  serviceName: string;
  region: string;
  category: string;
  os?: 'Windows' | 'Linux';
}

const ItemType = 'VM';

// Draggable VM Item Component with Checkbox
export function DraggableVMItem({ 
  vm, 
  onSelect,
  isChecked,
  onCheckChange
}: { 
  vm: VM; 
  onSelect: () => void;
  isChecked: boolean;
  onCheckChange: (checked: boolean) => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { vm },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`border rounded p-3 bg-white cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      } ${isChecked ? 'ring-2 ring-[#DB0011]' : ''}`}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheckChange}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {vm.os === 'Windows' ? (
              <svg className="size-4 flex-shrink-0" viewBox="0 0 88 88" fill="#00ADEF">
                <path d="M0 12.402l35.687-4.8602.0156 34.423-35.67.20313zm35.67 33.529.0277 34.453-35.67-4.9041-.002-29.78zm4.3261-39.025l47.318-6.906v41.527l-47.318.37565zm47.329 39.349-.0111 41.34-47.318-6.6784-.0663-34.739z"/>
              </svg>
            ) : (
              <svg className="size-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12.5 0C11.5 0 10.7 0.8 10.7 1.8c0 0.6 0.3 1.1 0.7 1.4 0 0.1 0 0.1 0 0.2 0 0.4-0.3 0.7-0.7 0.7s-0.7-0.3-0.7-0.7c0-0.1 0-0.1 0-0.2C9.6 2.9 9.3 2.4 9.3 1.8 9.3 0.8 8.5 0 7.5 0S5.7 0.8 5.7 1.8c0 0.6 0.3 1.1 0.7 1.4v0.2c0 1.3 1 2.3 2.3 2.3h3.6c1.3 0 2.3-1 2.3-2.3v-0.2c0.4-0.3 0.7-0.8 0.7-1.4C15.3 0.8 14.5 0 13.5 0h-1z" fill="#FCC624"/>
                <ellipse cx="7.5" cy="7" rx="1" ry="1.5" fill="#000"/>
                <ellipse cx="12.5" cy="7" rx="1" ry="1.5" fill="#000"/>
                <path d="M10 2C6.7 2 4 4.7 4 8v6c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4V8c0-3.3-2.7-6-6-6zm0 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" fill="#000"/>
                <path d="M10 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" fill="#FFF"/>
                <ellipse cx="10" cy="20" rx="3" ry="2" fill="#FCC624"/>
                <ellipse cx="10" cy="21" rx="4" ry="1.5" fill="#FFA500"/>
                <path d="M6 16c-0.5 0.5-1 1.5-1 2.5 0 1.1 0.9 2 2 2s2-0.9 2-2c0-1-0.5-2-1-2.5" fill="#FFA500"/>
                <path d="M14 16c0.5 0.5 1 1.5 1 2.5 0 1.1-0.9 2-2 2s-2-0.9-2-2c0-1 0.5-2 1-2.5" fill="#FFA500"/>
              </svg>
            )}
            <span className="text-slate-900 text-sm">{vm.name}</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {vm.region}
            </Badge>
          </div>
          <p className="text-xs text-slate-600 mt-1">{vm.serviceName}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onSelect}
          className="text-[#DB0011] hover:bg-[#FEF0F1] h-7 w-7 p-0"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// Selected VM Item Component (used in VMSelectionDialog)
export function SelectedVMItem({ vm, onRemove }: { vm: VM; onRemove: () => void }) {
  return (
    <div className="border rounded p-3 bg-green-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {vm.os === 'Windows' ? (
              <svg className="size-4 flex-shrink-0" viewBox="0 0 88 88" fill="#00ADEF">
                <path d="M0 12.402l35.687-4.8602.0156 34.423-35.67.20313zm35.67 33.529.0277 34.453-35.67-4.9041-.002-29.78zm4.3261-39.025l47.318-6.906v41.527l-47.318.37565zm47.329 39.349-.0111 41.34-47.318-6.6784-.0663-34.739z"/>
              </svg>
            ) : (
              <svg className="size-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12.5 0C11.5 0 10.7 0.8 10.7 1.8c0 0.6 0.3 1.1 0.7 1.4 0 0.1 0 0.1 0 0.2 0 0.4-0.3 0.7-0.7 0.7s-0.7-0.3-0.7-0.7c0-0.1 0-0.1 0-0.2C9.6 2.9 9.3 2.4 9.3 1.8 9.3 0.8 8.5 0 7.5 0S5.7 0.8 5.7 1.8c0 0.6 0.3 1.1 0.7 1.4v0.2c0 1.3 1 2.3 2.3 2.3h3.6c1.3 0 2.3-1 2.3-2.3v-0.2c0.4-0.3 0.7-0.8 0.7-1.4C15.3 0.8 14.5 0 13.5 0h-1z" fill="#FCC624"/>
                <ellipse cx="7.5" cy="7" rx="1" ry="1.5" fill="#000"/>
                <ellipse cx="12.5" cy="7" rx="1" ry="1.5" fill="#000"/>
                <path d="M10 2C6.7 2 4 4.7 4 8v6c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4V8c0-3.3-2.7-6-6-6zm0 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" fill="#000"/>
                <path d="M10 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" fill="#FFF"/>
                <ellipse cx="10" cy="20" rx="3" ry="2" fill="#FCC624"/>
                <ellipse cx="10" cy="21" rx="4" ry="1.5" fill="#FFA500"/>
                <path d="M6 16c-0.5 0.5-1 1.5-1 2.5 0 1.1 0.9 2 2 2s2-0.9 2-2c0-1-0.5-2-1-2.5" fill="#FFA500"/>
                <path d="M14 16c0.5 0.5 1 1.5 1 2.5 0 1.1-0.9 2-2 2s-2-0.9-2-2c0-1 0.5-2 1-2.5" fill="#FFA500"/>
              </svg>
            )}
            <span className="text-slate-900 text-sm">{vm.name}</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {vm.region}
            </Badge>
          </div>
          <p className="text-xs text-slate-600 mt-1">{vm.serviceName}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="text-red-600 hover:bg-red-50 h-7 w-7 p-0"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// Drop Zone Component
export function DropZone({ children, onDrop }: { children: React.ReactNode; onDrop: (vm: VM) => void }) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: { vm: VM }) => {
      onDrop(item.vm);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`border-2 border-dashed rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto ${
        isOver ? 'border-[#DB0011] bg-[#FEF0F1]' : 'border-slate-300 bg-slate-50'
      }`}
    >
      {children}
    </div>
  );
}