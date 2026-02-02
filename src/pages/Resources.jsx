import React, { useState, useEffect } from 'react';
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
    FolderOpenIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon
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

// Resource links structure
const academicResources = {
    notes: {},
    syllabus: {
        FE: { url: 'https://www.unipune.ac.in/', title: 'FE Syllabus 2024' },
        SE: { url: 'https://www.unipune.ac.in/', title: 'SE Syllabus 2024' },
        TE: { url: 'https://www.unipune.ac.in/', title: 'TE Syllabus 2024' },
        BE: { url: 'https://www.unipune.ac.in/', title: 'BE Syllabus 2024' }
    },
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
    // Initialize state from localStorage for persistence
    const [activeSection, setActiveSection] = useState(() => {
        return localStorage.getItem('resources_activeSection') || 'academics';
    });
    const [selectedDept, setSelectedDept] = useState(() => {
        return localStorage.getItem('resources_selectedDept') || '';
    });
    const [selectedYear, setSelectedYear] = useState(() => {
        return localStorage.getItem('resources_selectedYear') || '';
    });
    const [selectedSubject, setSelectedSubject] = useState('');
    const [placementTab, setPlacementTab] = useState(() => {
        return localStorage.getItem('resources_placementTab') || 'dsa';
    });

    // Persist choices to localStorage
    useEffect(() => {
        localStorage.setItem('resources_activeSection', activeSection);
    }, [activeSection]);

    useEffect(() => {
        localStorage.setItem('resources_placementTab', placementTab);
    }, [placementTab]);

    useEffect(() => {
        localStorage.setItem('resources_selectedDept', selectedDept);
    }, [selectedDept]);

    useEffect(() => {
        localStorage.setItem('resources_selectedYear', selectedYear);
    }, [selectedYear]);

    const sections = [
        { id: 'academics', label: 'Academics', icon: AcademicCapIcon },
        { id: 'placement', label: 'Placement', icon: BriefcaseIcon },
        { id: 'gate', label: 'GATE Prep', icon: BookOpenIcon }
    ];

    const getSubjects = () => {
        if (selectedDept && selectedYear && subjectData[selectedDept]) {
            return subjectData[selectedDept][selectedYear] || [];
        }
        return [];
    };

    return (
        <div className="pb-20 lg:pb-6">
            {/* Hero Header */}
            <div
                className="relative overflow-hidden rounded-2xl mx-3 md:mx-4 p-6"
                style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 25%, #a855f7 50%, #c026d3 75%, #d946ef 100%)',
                    boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(217, 70, 239, 0.15)'
                }}
            >
                {/* Background Effects */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-400/30 blur-3xl rounded-full"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                        >
                            <FolderOpenIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Resources Hub</h1>
                            <p className="text-violet-100 text-sm">Everything you need in one place</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Tabs - Enhanced with animated underline */}
            <div className="px-4 mt-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {sections.map(section => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`relative flex items-center gap-2 px-5 py-3 font-semibold whitespace-nowrap transition-all duration-200 rounded-xl cursor-pointer ${isActive
                                    ? 'text-white'
                                    : 'text-violet-600 bg-white/85 border border-violet-100 hover:bg-violet-50 hover:border-violet-200'
                                    }`}
                                style={isActive ? {
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                } : { opacity: isActive ? 1 : 0.85 }}
                            >
                                <Icon className="w-5 h-5" />
                                {section.label}
                                {/* Animated underline indicator */}
                                {isActive && (
                                    <span
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/40 rounded-full"
                                        style={{ animation: 'fadeIn 0.3s ease-out' }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Academics Section */}
            {activeSection === 'academics' && (
                <div className="px-4 mt-6 space-y-6 animate-fade-slide-in">
                    {/* Department & Year Selection - Compact */}
                    <div
                        className="rounded-xl p-4"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                            boxShadow: '0 2px 12px rgba(139, 92, 246, 0.06)'
                        }}
                    >
                        <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <AcademicCapIcon className="w-5 h-5 text-violet-500" />
                            Select Your Stream
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Department</label>
                                <select
                                    value={selectedDept}
                                    onChange={(e) => { setSelectedDept(e.target.value); setSelectedSubject(''); }}
                                    className="w-full px-3 py-2.5 border border-violet-100 rounded-lg focus:outline-none focus:border-violet-400 bg-white/50 transition-colors text-sm"
                                >
                                    <option value="">Choose department...</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept} Engineering</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => { setSelectedYear(e.target.value); setSelectedSubject(''); }}
                                    className="w-full px-3 py-2.5 border border-violet-100 rounded-lg focus:outline-none focus:border-violet-400 bg-white/50 transition-colors text-sm"
                                >
                                    <option value="">Choose year...</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year === 'FE' ? 'First Year' : year === 'SE' ? 'Second Year' : year === 'TE' ? 'Third Year' : 'Final Year'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Year Syllabus - Compact Inline */}
                    {selectedYear && (
                        <a
                            href={academicResources.syllabus[selectedYear]?.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl p-3 bg-white border border-emerald-100 transition-all group hover:border-emerald-200 hover:shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                                <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-emerald-600 transition-colors">
                                    {selectedYear === 'FE' ? 'First Year' : selectedYear === 'SE' ? 'Second Year' : selectedYear === 'TE' ? 'Third Year' : 'Final Year'} Complete Syllabus
                                </h3>
                                <p className="text-xs text-gray-500">SPPU Official PDF</p>
                            </div>
                            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                        </a>
                    )}

                    {/* Subject Selection - Compact Pills */}
                    {selectedDept && selectedYear && (
                        <div className="rounded-xl p-4 bg-white border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <BookOpenIcon className="w-4 h-4 text-violet-500" />
                                Choose Subject
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {getSubjects().map((subject, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSubject(subject)}
                                        className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${selectedSubject === subject
                                            ? 'bg-violet-600 text-white shadow-sm'
                                            : 'bg-gray-50 text-gray-600 hover:bg-violet-50 hover:text-violet-700 border border-gray-100'
                                            }`}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subject Resources - Polished Cards */}
                    {selectedSubject && (
                        <div className="space-y-3 animate-fade-slide-in">
                            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 px-1">
                                <SparklesIcon className="w-4 h-4 text-violet-500" />
                                Resources for <span className="text-violet-600">{selectedSubject}</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Notes Card */}
                                <div className="rounded-xl p-4 bg-white border border-gray-100 transition-all group hover:shadow-md hover:border-violet-200">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                                            <DocumentTextIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 text-sm group-hover:text-violet-600 transition-colors">Notes</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Lecture notes & material</p>
                                            <div className="mt-2">
                                                {academicResources.notes[selectedSubject] ? (
                                                    <a href={academicResources.notes[selectedSubject][0]?.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 text-xs font-medium hover:underline">
                                                        View Notes <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Coming Soon</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PYQ Card */}
                                <a
                                    href={academicResources.pyq.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl p-4 bg-white border border-gray-100 transition-all group hover:shadow-md hover:border-orange-200"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0">
                                            <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 text-sm group-hover:text-orange-600 transition-colors">Previous Year Papers</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Past exam questions</p>
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1 text-orange-600 text-xs font-medium">
                                                    View PYQs <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                {/* Video Lectures Card */}
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedSubject + ' SPPU lectures')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl p-4 bg-white border border-gray-100 transition-all group hover:shadow-md hover:border-red-200"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 text-sm group-hover:text-red-600 transition-colors">Video Lectures</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">YouTube tutorials</p>
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                                                    Search Videos <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Empty State - No Dept/Year */}
                    {(!selectedDept || !selectedYear) && (
                        <div
                            className="text-center py-10 rounded-xl animate-fade-slide-in bg-white border border-gray-100"
                        >
                            <div className="animate-gentle-pulse">
                                <AcademicCapIcon className="w-12 h-12 text-violet-200 mx-auto mb-3" />
                            </div>
                            <p className="text-gray-600 font-medium">Select your department and year</p>
                            <p className="text-gray-400 text-sm mt-0.5">to explore subjects and resources</p>
                        </div>
                    )}

                    {/* Empty State - No Subject Selected */}
                    {selectedDept && selectedYear && !selectedSubject && (
                        <div className="text-center py-6 rounded-xl bg-violet-50/50 border border-violet-100">
                            <p className="text-violet-600 text-sm font-medium">👆 Select a subject to view resources</p>
                        </div>
                    )}
                </div>
            )}

            {/* Placement Section */}
            {activeSection === 'placement' && (
                <div className="px-4 mt-2 space-y-4 animate-fade-slide-in">
                    {/* Placement Header - Compact */}
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' }}
                        >
                            <span className="text-white text-sm">🎯</span>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Placement Preparation Hub</h2>
                            <p className="text-xs text-gray-500">Interview prep • Coding • Aptitude</p>
                        </div>
                    </div>

                    {/* Track-Style Tabs - Compact */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {[
                            { id: 'dsa', label: 'DSA & Coding', icon: CodeBracketIcon },
                            { id: 'coreSubjects', label: 'Core Subjects', icon: CpuChipIcon },
                            { id: 'aptitude', label: 'Aptitude', icon: CalculatorIcon }
                        ].map(tab => {
                            const Icon = tab.icon;
                            const isActive = placementTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setPlacementTab(tab.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all duration-200 ${isActive
                                        ? 'bg-orange-600 text-white shadow-sm'
                                        : 'bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600 border border-gray-100'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? '' : 'opacity-60'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Recommended Order Hint - Subtle */}
                    {placementTab === 'dsa' && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-gray-50 border border-gray-100">
                            <span className="text-orange-500">⭐</span>
                            <span className="text-gray-500">Recommended:</span>
                            <span className="font-medium text-gray-700">Striver SDE Sheet → LeetCode</span>
                        </div>
                    )}

                    {/* Resource Cards - Matching Academics Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {placementResources[placementTab]?.map((resource, idx) => {
                            const Icon = resource.icon;
                            return (
                                <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group rounded-xl p-4 bg-white border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-orange-200"
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                                            style={{
                                                background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)'
                                            }}
                                        >
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 text-sm group-hover:text-orange-600 transition-colors">
                                                {resource.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{resource.description}</p>
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1 text-orange-600 text-xs font-medium">
                                                    Open <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* GATE Section */}
            {activeSection === 'gate' && (
                <div className="px-4 mt-2 space-y-4 animate-fade-slide-in">
                    {/* GATE Header - Compact Inline */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                            <BookOpenIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">GATE Preparation Resources</h2>
                            <p className="text-xs text-gray-500">Curated resources for GATE CS/IT</p>
                        </div>
                    </div>

                    {/* Suggested Flow - Subtle */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-gray-50 border border-gray-100">
                        <span className="text-violet-500">⭐</span>
                        <span className="text-gray-500">Suggested:</span>
                        <span className="font-medium text-gray-700">Concepts → Practice (PYQs) → Discussion</span>
                    </div>

                    {/* Concept Building */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Concept Building</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {gateResources.filter(r => r.category === 'Video' || r.category === 'Notes').map((resource, idx) => (
                                <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group rounded-xl p-4 bg-white border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-violet-200"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                                            <BookOpenIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 text-sm group-hover:text-violet-600 transition-colors">
                                                {resource.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{resource.description}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-medium">
                                                    {resource.category}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-violet-600 text-xs font-medium">
                                                    Open <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Practice & PYQs */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Practice & PYQs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {gateResources.filter(r => r.category === 'PYQ').map((resource, idx) => (
                                <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group rounded-xl p-4 bg-white border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-emerald-200"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                                            <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 text-sm group-hover:text-emerald-600 transition-colors">
                                                {resource.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{resource.description}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-medium">
                                                    {resource.category}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                                    Open <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Discussion & Community */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Discussion & Community</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {gateResources.filter(r => r.category === 'Community').map((resource, idx) => (
                                <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group rounded-xl p-4 bg-white border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-amber-200"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 text-sm group-hover:text-amber-600 transition-colors">
                                                {resource.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{resource.description}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium">
                                                    {resource.category}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                                                    Open <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Resources;
