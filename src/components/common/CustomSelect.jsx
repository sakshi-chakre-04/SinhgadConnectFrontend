import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

const CustomSelect = ({ value, onChange, options, icon: Icon, placeholder = 'Select' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue } }); // Mimic native event for compatibility
        setIsOpen(false);
    };

    return (
        <div className="relative group min-w-[160px]" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between pl-3 pr-3 py-2 text-sm font-medium border rounded-xl transition-all shadow-sm outline-none
          ${isOpen
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white'
                        : 'border-gray-200 bg-white/50 hover:bg-white text-gray-700'
                    }`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {Icon && (
                        <span className={`flex-shrink-0 ${isOpen ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'} transition-colors`}>
                            <Icon className="h-4 w-4" />
                        </span>
                    )}
                    <span className="truncate block">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDownIcon
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ml-2 flex-shrink-0
            ${isOpen ? 'rotate-180 text-indigo-500' : ''}
          `}
                />
            </button>

            {/* Styled Options Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full min-w-[180px] right-0 bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl shadow-xl ring-1 ring-black/5 animate-slideDown overflow-hidden p-1">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors
                  ${value === option.value
                                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }
                `}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <span className="truncate">{option.label}</span>
                                </div>
                                {value === option.value && (
                                    <CheckIcon className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
