import React from 'react';
import { X, Phone, MessageCircle, HelpCircle } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpSupportModal({ isOpen, onClose }: HelpSupportModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative mx-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X size={20} className="text-neutral-500" />
          </button>

          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Help & Support</h2>
          <p className="text-sm text-neutral-500 mb-8">We're here to assist you 24/7</p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-blue-600 text-white rounded-full">
                <Phone size={20} />
              </div>
              <div>
                <div className="font-bold text-neutral-900 mb-1">Call Us</div>
                <div className="text-lg font-bold text-blue-600">1-800-SWIFTAIR</div>
                <div className="text-xs text-neutral-500 mt-1">Available 24/7</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-green-600 text-white rounded-full">
                <MessageCircle size={20} />
              </div>
              <div>
                <div className="font-bold text-neutral-900 mb-1">Live Chat</div>
                <div className="text-sm text-neutral-600">Available 8am–10pm EST</div>
                <button className="mt-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                  Start Chat →
                </button>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-purple-600 text-white rounded-full">
                <HelpCircle size={20} />
              </div>
              <div>
                <div className="font-bold text-neutral-900 mb-1">FAQ & Help Center</div>
                <button className="mt-1 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
                  Browse FAQs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
