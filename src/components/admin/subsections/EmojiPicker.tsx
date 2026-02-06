// src/components/admin/subsections/EmojiPicker.tsx
'use client';

import { useState } from 'react';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  'Popular': ['📝', '🚀', '📌', '💡', '🎨', '🔧', '📱', '💻', '🎯', '⚡', '🌟', '✨'],
  'Objects': ['📄', '📁', '📂', '🗂️', '📋', '📊', '📈', '📉', '🗃️', '📦', '🎁', '🔖'],
  'Symbols': ['✅', '❌', '⭐', '💎', '🔥', '💫', '🌈', '🎪', '🎭', '🎬', '🎮', '🎲'],
  'Activities': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🥊', '🎯', '🎪', '🎨'],
  'Nature': ['🌱', '🌿', '🍀', '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌴', '🌵', '🌾'],
  'Food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥝', '🍍'],
  'Travel': ['✈️', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻'],
  'Faces': ['😀', '😃', '😄', '😁', '😊', '😍', '🥰', '😎', '🤓', '🧐', '🤔', '🤗']
};

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('Popular');

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
        Icon (Emoji)
      </label>
      
      <div className="flex gap-2">
        {/* Current emoji display */}
        <div className="w-12 h-12 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-2xl">
          {value || '📄'}
        </div>
        
        {/* Picker button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] hover:border-white transition text-left"
        >
          {value ? `${value} Selected` : 'Choose emoji...'}
        </button>
      </div>

      {/* Emoji picker dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Picker panel */}
          <div className="absolute top-full mt-2 left-0 right-0 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* Category tabs */}
            <div className="flex overflow-x-auto border-b border-[#2a2a2a] bg-[#0a0a0a]">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
                  className={`px-3 py-2 text-[11px] font-medium whitespace-nowrap transition ${
                    activeCategory === category
                      ? 'text-white border-b-2 border-white'
                      : 'text-[#707070] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Emoji grid */}
            <div className="p-3 grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-[#1a1a1a] rounded-lg transition"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Manual input */}
            <div className="border-t border-[#2a2a2a] p-3">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Or paste emoji..."
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-[13px] focus:outline-none focus:border-white transition"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}