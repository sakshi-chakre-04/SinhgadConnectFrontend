import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon,
  BeakerIcon,
  BoltIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const departments = [
  {
    name: 'Computer',
    icon: ComputerDesktopIcon,
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Programming, AI/ML, Web Development',
    members: '500+'
  },
  {
    name: 'IT',
    icon: CpuChipIcon,
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Networks, Security, Cloud Computing',
    members: '400+'
  },
  {
    name: 'Electronics',
    icon: BoltIcon,
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'VLSI, Embedded Systems, IoT',
    members: '350+'
  },
  {
    name: 'Electrical',
    icon: BoltIcon,
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Power Systems, Control, Machines',
    members: '300+'
  },
  {
    name: 'Mechanical',
    icon: WrenchScrewdriverIcon,
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Design, Manufacturing, Thermal',
    members: '450+'
  },
  {
    name: 'Civil',
    icon: BuildingOfficeIcon,
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Structures, Construction, Planning',
    members: '350+'
  },
];

export default function Community() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Hero Section - Compact & Glass */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl hover-glow transition-all duration-500 group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient-x"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium mb-2">
              <UserGroupIcon className="w-4 h-4 mr-2" /> Campus Groups
            </div>
            <h1 className="text-3xl font-bold mb-2">Find Your Tribe 🎓</h1>
            <p className="text-indigo-100 max-w-xl text-sm leading-relaxed">
              Connect with department peers, share resources, and get mentorship from seniors within your field.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 transform rotate-12">
              <span className="text-3xl">🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Cards Grid - Decluttered */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.name}
              onClick={() => navigate(`/department/${dept.name}`)}
              className="group glass-panel rounded-2xl p-6 hover:bg-white/40 transition-all duration-300 cursor-pointer border border-white/30 flex flex-col items-center text-center gap-4"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                {dept.name}
              </h3>

              <div className="flex items-center text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform mt-auto">
                <span>View Discussions</span>
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
