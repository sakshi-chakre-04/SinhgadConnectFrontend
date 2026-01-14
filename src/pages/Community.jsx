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
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <UserGroupIcon className="w-6 h-6" />
            <span className="text-sm font-medium text-white/80">Campus Community</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Connect with Your Department 🎓
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Join discussions with students from your department. Share notes, ask questions about placements,
            and connect with seniors who've been through it all.
          </p>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.name}
              onClick={() => navigate(`/department/${dept.name}`)}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Icon with gradient background */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${dept.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                {dept.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {dept.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <UserGroupIcon className="w-4 h-4" />
                  <span>View Posts</span>
                </div>
                <div className="flex items-center gap-1 text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all">
                  Explore
                  <ArrowRightIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Need Help with Placements?</h2>
        <p className="text-white/90 mb-4 max-w-lg mx-auto">
          Ask questions, get tips from seniors, and share your experiences with the community.
        </p>
        <button
          onClick={() => navigate('/search?q=placement')}
          className="px-6 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg"
        >
          Explore Placement Tips
        </button>
      </div>
    </div>
  );
}
