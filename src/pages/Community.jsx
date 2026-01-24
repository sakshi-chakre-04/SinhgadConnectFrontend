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
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const departments = [
  {
    name: 'Computer',
    icon: ComputerDesktopIcon,
    gradient: 'from-violet-500 to-purple-600',
    description: 'Programming, AI/ML, Web Development',
    members: '500+'
  },
  {
    name: 'IT',
    icon: CpuChipIcon,
    gradient: 'from-indigo-500 to-violet-600',
    description: 'Networks, Security, Cloud Computing',
    members: '400+'
  },
  {
    name: 'Electronics',
    icon: BoltIcon,
    gradient: 'from-fuchsia-500 to-pink-600',
    description: 'VLSI, Embedded Systems, IoT',
    members: '350+'
  },
  {
    name: 'Electrical',
    icon: BoltIcon,
    gradient: 'from-purple-500 to-indigo-600',
    description: 'Power Systems, Control, Machines',
    members: '300+'
  },
  {
    name: 'Mechanical',
    icon: WrenchScrewdriverIcon,
    gradient: 'from-pink-500 to-rose-600',
    description: 'Design, Manufacturing, Thermal',
    members: '450+'
  },
  {
    name: 'Civil',
    icon: BuildingOfficeIcon,
    gradient: 'from-violet-600 to-fuchsia-600',
    description: 'Structures, Construction, Planning',
    members: '350+'
  },
];

export default function Community() {
  const navigate = useNavigate();

  return (
    <div
      className="space-y-8 min-h-screen pb-8"
      style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}
    >
      {/* Hero Section */}
      {/* Hero Section */}
      <div
        className="relative overflow-hidden rounded-b-3xl md:rounded-3xl p-6 text-white shadow-2xl transition-all duration-500 group mx-0"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 25%, #a855f7 50%, #c026d3 75%, #d946ef 100%)',
          boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(217, 70, 239, 0.15)'
        }}
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-400/30 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-1000"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            {/* Animated Pill */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium mb-3 animate-pulse">
              <UserGroupIcon className="w-4 h-4 mr-2" />
              Campus Communities
            </div>
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
              Find Your Tribe 🎓
            </h1>
            <p className="text-violet-100 max-w-xl text-sm leading-relaxed">
              Connect with department peers, share resources, and get mentorship from seniors within your field.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 px-4 md:px-0">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.name}
              onClick={() => navigate(`/department/${dept.name}`)}
              className="group rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-4 hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.15)';
              }}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                style={{ boxShadow: '0 8px 20px rgba(139, 92, 246, 0.25)' }}
              >
                <Icon className="w-8 h-8" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                {dept.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {dept.description}
              </p>

              {/* Members Badge */}
              <div className="flex items-center gap-2 text-xs font-medium text-violet-500 bg-violet-50 px-3 py-1.5 rounded-full">
                <UserGroupIcon className="w-4 h-4" />
                {dept.members} members
              </div>

              {/* CTA */}
              <div className="flex items-center text-sm font-semibold text-violet-600 group-hover:text-violet-700 transition-colors mt-auto">
                <span>View Discussions</span>
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
