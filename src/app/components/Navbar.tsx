import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { Plane, ChevronRight, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { HelpSupportModal } from './HelpSupportModal';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [showHelpModal, setShowHelpModal] = useState(false);

  const steps = [
    { label: 'Search', path: '/' },
    { label: 'Flights', path: '/flights' },
    { label: 'Add-ons', path: '/addons' },
    { label: 'Payment', path: '/payment' },
  ];

  return (
    <>
      <nav className="h-16 bg-white border-b border-neutral-200 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Plane size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-900">SwiftAir</span>
        </button>

      <div className="flex items-center gap-4">
        {steps.map((step, index) => {
          const isActive = currentPath === step.path;
          const isPast = steps.findIndex(s => s.path === currentPath) > index;
          
          return (
            <React.Fragment key={step.path}>
              <div className={clsx(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                isActive ? "text-blue-600" : isPast ? "text-neutral-900" : "text-neutral-400"
              )}>
                {isPast ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <div className={clsx(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                    isActive ? "bg-blue-600 text-white" : "bg-neutral-200 text-neutral-600"
                  )}>
                    {index + 1}
                  </div>
                )}
                <span>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight size={14} className="text-neutral-300" />
              )}
            </React.Fragment>
          );
        })}
      </div>

        <div className="hidden lg:flex items-center gap-4 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Real-time Pricing Active</span>
          </div>
          <div className="w-px h-4 bg-neutral-200" />
          <button
            onClick={() => setShowHelpModal(true)}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Help & Support
          </button>
        </div>
      </nav>
      <HelpSupportModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>
  );
}
