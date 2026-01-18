import React, { useState } from 'react';
import {
    AcademicCapIcon,
    BriefcaseIcon,
    BookOpenIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    CodeBracketIcon,
    CpuChipIcon,
    CalculatorIcon,
    ArrowTopRightOnSquareIcon,
    ChevronDownIcon,
    FolderOpenIcon
} from '@heroicons/react/24/outline';

// ============================================
// DATA STRUCTURE - FILL IN YOUR LINKS HERE
// ============================================

// SPPU Subjects by Department and Year
const subjectData = {
    Computer: {
        FE: ['Engineering Mathematics-I', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical Engineering', 'Engineering Mechanics'],
        SE: ['Data Structures', 'Object Oriented Programming', 'Computer Graphics', 'Digital Electronics', 'Discrete Mathematics'],
        TE: ['Database Management Systems', 'Operating Systems', 'Computer Networks', 'Theory of Computation', 'Software Engineering'],
        BE: ['Machine Learning', 'Data Science', 'Cloud Computing', 'Cyber Security', 'High Performance Computing']
    },
    IT: {
        FE: ['Engineering Mathematics-I', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical Engineering', 'Engineering Mechanics'],
        SE: ['Data Structures', 'Object Oriented Programming', 'Web Technology', 'Digital Electronics', 'Discrete Mathematics'],
        TE: ['Database Management Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering', 'Data Analytics'],
        BE: ['Machine Learning', 'Cloud Computing', 'Information Security', 'Big Data Analytics', 'IoT']
    },
    ENTC: {
        FE: ['Engineering Mathematics-I', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical Engineering', 'Engineering Mechanics'],
        SE: ['Electronic Devices & Circuits', 'Digital Electronics', 'Network Analysis', 'Signals & Systems', 'Electromagnetic Engineering'],
        TE: ['Microprocessors', 'Control Systems', 'Digital Communication', 'VLSI Design', 'Embedded Systems'],
        BE: ['Wireless Communication', 'Digital Signal Processing', 'Antenna & Wave Propagation', 'Optical Communication', 'Robotics']
    },
    Mechanical: {
        FE: ['Engineering Mathematics-I', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical Engineering', 'Engineering Mechanics'],
        SE: ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Strength of Materials', 'Machine Drawing'],
        TE: ['Heat Transfer', 'Dynamics of Machinery', 'Design of Machine Elements', 'CAD/CAM', 'Metrology'],
        BE: ['Refrigeration & AC', 'Automobile Engineering', 'Power Plant Engineering', 'Industrial Engineering', 'Robotics']
    },
    Civil: {
        FE: ['Engineering Mathematics-I', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical Engineering', 'Engineering Mechanics'],
        SE: ['Surveying', 'Building Materials', 'Strength of Materials', 'Fluid Mechanics', 'Engineering Geology'],
        TE: ['Structural Analysis', 'Concrete Technology', 'Geotechnical Engineering', 'Transportation Engineering', 'Hydrology'],
        BE: ['Design of Steel Structures', 'Construction Management', 'Environmental Engineering', 'Earthquake Engineering', 'Bridge Engineering']
    },
    Electrical: {
        FE: ['Engineering Mathematics-I', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical Engineering', 'Engineering Mechanics'],
        SE: ['Circuit Theory', 'Electrical Machines-I', 'Electronic Devices', 'Electromagnetic Fields', 'Digital Electronics'],
        TE: ['Power Systems', 'Control Systems', 'Electrical Machines-II', 'Power Electronics', 'Microprocessors'],
        BE: ['Switchgear & Protection', 'Electric Drives', 'High Voltage Engineering', 'Smart Grid', 'Renewable Energy']
    }
};

// Resource links structure - YOU WILL FILL THESE
// Format: { title: 'Resource Name', url: 'https://...', type: 'pdf/video/link' }
const academicResources = {
    // Notes - organized by subject
    // Add your Google Drive links here
    notes: {
        // Example: 'Data Structures': [{ title: 'Complete Notes', url: 'https://drive.google.com/...', type: 'pdf' }]
    },

    // Syllabus by year
    syllabus: {
        FE: { url: 'https://www.unipune.ac.in/', title: 'FE Syllabus 2024' },
        SE: { url: 'https://www.unipune.ac.in/', title: 'SE Syllabus 2024' },
        TE: { url: 'https://www.unipune.ac.in/', title: 'TE Syllabus 2024' },
        BE: { url: 'https://www.unipune.ac.in/', title: 'BE Syllabus 2024' }
    },

    // Previous Year Questions
    pyq: {
        url: 'https://www.studocu.com/',
        title: 'Previous Year Question Papers'
    }
};

// Placement resources
const placementResources = {
    dsa: [
        { title: 'LeetCode', description: 'Practice coding problems', url: 'https://leetcode.com/', icon: CodeBracketIcon },
        { title: 'NeetCode', description: 'Structured DSA roadmap', url: 'https://neetcode.io/', icon: CodeBracketIcon },
        { title: 'Striver SDE Sheet', description: '180 must-do problems', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', icon: CodeBracketIcon },
        { title: 'GeeksforGeeks', description: 'DSA tutorials & problems', url: 'https://www.geeksforgeeks.org/data-structures/', icon: CodeBracketIcon },
        { title: 'HackerRank', description: 'Practice & get certified', url: 'https://www.hackerrank.com/', icon: CodeBracketIcon }
    ],
    coreSubjects: [
        { title: 'Operating Systems - Gate Smashers', description: 'Complete OS playlist', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p', icon: CpuChipIcon },
        { title: 'DBMS - Gate Smashers', description: 'Complete DBMS playlist', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y', icon: CpuChipIcon },
        { title: 'Computer Networks - Gate Smashers', description: 'Complete CN playlist', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_', icon: CpuChipIcon },
        { title: 'System Design - Gaurav Sen', description: 'System design concepts', url: 'https://www.youtube.com/c/GauravSensei', icon: CpuChipIcon },
        { title: 'OOPs - Kunal Kushwaha', description: 'OOPs concepts in Java', url: 'https://www.youtube.com/watch?v=BSVKUk58K6U', icon: CpuChipIcon }
    ],
    aptitude: [
        { title: 'PrepInsta', description: 'Company-specific papers', url: 'https://prepinsta.com/', icon: CalculatorIcon },
        { title: 'IndiaBix', description: 'Aptitude & verbal reasoning', url: 'https://www.indiabix.com/', icon: CalculatorIcon },
        { title: 'Freshersworld', description: 'Placement papers', url: 'https://www.freshersworld.com/', icon: CalculatorIcon },
        { title: 'Youth4work', description: 'Practice tests', url: 'https://www.youth4work.com/', icon: CalculatorIcon },
        { title: 'Sawaal', description: 'Quantitative aptitude', url: 'https://www.sawaal.com/', icon: CalculatorIcon }
    ]
};

// GATE resources
const gateResources = [
    { title: 'GATE Overflow', description: 'Previous year solutions & discussions', url: 'https://gateoverflow.in/', category: 'Community' },
    { title: 'Gate Smashers', description: 'Complete GATE preparation playlist', url: 'https://www.youtube.com/c/GateSmashers', category: 'Video' },
    { title: 'NPTEL', description: 'IIT lectures for all subjects', url: 'https://nptel.ac.in/', category: 'Video' },
    { title: 'GeeksforGeeks GATE', description: 'Topic-wise GATE preparation', url: 'https://www.geeksforgeeks.org/gate-cs-notes-gq/', category: 'Notes' },
    { title: 'Made Easy Notes', description: 'Handwritten notes (search online)', url: 'https://www.google.com/search?q=made+easy+notes+pdf', category: 'Notes' },
    { title: 'GATE Pyq - PYQs', description: 'Previous year GATE papers', url: 'https://gate.iitk.ac.in/GATE2024/', category: 'PYQ' },
    { title: 'Ravindrababu Ravula', description: 'Best for Theory subjects', url: 'https://www.youtube.com/c/RavindrababuRavula', category: 'Video' },
    { title: 'Unacademy GATE', description: 'Free GATE lectures', url: 'https://unacademy.com/goal/gate-cs-it/NVLIA', category: 'Video' }
];

const departments = ['Computer', 'IT', 'ENTC', 'Mechanical', 'Civil', 'Electrical'];
const years = ['FE', 'SE', 'TE', 'BE'];

const Resources = () => {
    const [activeSection, setActiveSection] = useState('academics');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [placementTab, setPlacementTab] = useState('dsa');

    const sections = [
        { id: 'academics', label: 'Academics', icon: AcademicCapIcon, gradient: 'from-blue-500 to-cyan-500' },
        { id: 'placement', label: 'Placement', icon: BriefcaseIcon, gradient: 'from-violet-500 to-purple-500' },
        { id: 'gate', label: 'GATE Prep', icon: BookOpenIcon, gradient: 'from-emerald-500 to-teal-500' }
    ];

    const getSubjects = () => {
        if (selectedDept && selectedYear && subjectData[selectedDept]) {
            return subjectData[selectedDept][selectedYear] || [];
        }
        return [];
    };

    return (
        <div className="min-h-screen pb-20 lg:pb-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl mx-4 mt-4 p-8 lg:p-10">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <FolderOpenIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white">Resources Hub</h1>
                    </div>
                    <p className="text-indigo-100 text-lg max-w-2xl">
                        Everything you need for academics, placements, and GATE preparation - all in one place.
                    </p>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="px-4 mt-6">
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {sections.map(section => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${activeSection === section.id
                                        ? `bg-gradient-to-r ${section.gradient} text-white shadow-lg`
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {section.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Academics Section */}
            {activeSection === 'academics' && (
                <div className="px-4 mt-6 space-y-6">
                    {/* Department & Year Selection */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
                            Select Your Stream
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <select
                                    value={selectedDept}
                                    onChange={(e) => { setSelectedDept(e.target.value); setSelectedSubject(''); }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                                >
                                    <option value="">Choose department...</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept} Engineering</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => { setSelectedYear(e.target.value); setSelectedSubject(''); }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                                >
                                    <option value="">Choose year...</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year === 'FE' ? 'First Year' : year === 'SE' ? 'Second Year' : year === 'TE' ? 'Third Year' : 'Final Year'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Show content only if dept and year selected */}
                    {selectedDept && selectedYear && (
                        <>
                            {/* Notes Section */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                                    Subject Notes
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {getSubjects().map((subject, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSubject(subject)}
                                            className={`p-4 rounded-xl border text-left transition-all ${selectedSubject === subject
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <p className="font-medium text-sm">{subject}</p>
                                            <p className="text-xs text-gray-500 mt-1">Click for notes</p>
                                        </button>
                                    ))}
                                </div>

                                {selectedSubject && (
                                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                        <p className="text-sm text-amber-700">
                                            <strong>📚 {selectedSubject}</strong> - Notes coming soon! Add your Google Drive links in the code.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Syllabus & PYQ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <a
                                    href={academicResources.syllabus[selectedYear]?.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                            <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                {selectedYear} Syllabus
                                            </h3>
                                            <p className="text-sm text-gray-500">SPPU Official Syllabus</p>
                                        </div>
                                        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" />
                                    </div>
                                </a>

                                <a
                                    href={academicResources.pyq.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                            <DocumentTextIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                Previous Year Questions
                                            </h3>
                                            <p className="text-sm text-gray-500">PYQs for all subjects</p>
                                        </div>
                                        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" />
                                    </div>
                                </a>
                            </div>
                        </>
                    )}

                    {/* Prompt if not selected */}
                    {(!selectedDept || !selectedYear) && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                            <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Select your department and year to view resources</p>
                        </div>
                    )}
                </div>
            )}

            {/* Placement Section */}
            {activeSection === 'placement' && (
                <div className="px-4 mt-6 space-y-6">
                    {/* Placement Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {[
                            { id: 'dsa', label: 'DSA & Coding', icon: CodeBracketIcon },
                            { id: 'coreSubjects', label: 'Core Subjects', icon: CpuChipIcon },
                            { id: 'aptitude', label: 'Aptitude', icon: CalculatorIcon }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setPlacementTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${placementTab === tab.id
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Resource Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {placementResources[placementTab]?.map((resource, idx) => {
                            const Icon = resource.icon;
                            return (
                                <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
                                                {resource.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">{resource.description}</p>
                                        </div>
                                        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-violet-500 shrink-0" />
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* GATE Section */}
            {activeSection === 'gate' && (
                <div className="px-4 mt-6 space-y-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                        <h2 className="text-lg font-semibold text-emerald-800 mb-2">GATE Preparation Resources</h2>
                        <p className="text-emerald-600 text-sm">Curated resources for GATE CS/IT preparation</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gateResources.map((resource, idx) => (
                            <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                                        <BookOpenIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                                                {resource.title}
                                            </h3>
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                                {resource.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{resource.description}</p>
                                    </div>
                                    <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 shrink-0" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resources;
