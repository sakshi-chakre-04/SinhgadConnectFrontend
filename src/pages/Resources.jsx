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
    FolderOpenIcon,
    SparklesIcon
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
    const [activeSection, setActiveSection] = useState('academics');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [placementTab, setPlacementTab] = useState('dsa');

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
        <div
            className="min-h-screen pb-20 lg:pb-6"
            style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ffffff 100%)' }}
        >
            {/* Hero Header */}
            <div
                className="relative overflow-hidden rounded-2xl mx-3 md:mx-4 p-8 lg:p-10"
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
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                        >
                            <FolderOpenIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">Resources Hub</h1>
                            <p className="text-violet-100 text-sm">Everything you need in one place</p>
                        </div>
                    </div>
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
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${activeSection === section.id
                                    ? 'text-white shadow-lg'
                                    : 'bg-white/80 text-violet-600 hover:bg-violet-50 border border-violet-200'
                                    }`}
                                style={activeSection === section.id ? {
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                } : {}}
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
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                        }}
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <AcademicCapIcon className="w-5 h-5 text-violet-500" />
                            Select Your Stream
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <select
                                    value={selectedDept}
                                    onChange={(e) => { setSelectedDept(e.target.value); setSelectedSubject(''); }}
                                    className="w-full px-4 py-3 border-2 border-violet-100 rounded-xl focus:outline-none focus:border-violet-400 bg-white/50 transition-colors"
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
                                    className="w-full px-4 py-3 border-2 border-violet-100 rounded-xl focus:outline-none focus:border-violet-400 bg-white/50 transition-colors"
                                >
                                    <option value="">Choose year...</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year === 'FE' ? 'First Year' : year === 'SE' ? 'Second Year' : year === 'TE' ? 'Third Year' : 'Final Year'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Year Syllabus */}
                    {selectedYear && (
                        <a
                            href={academicResources.syllabus[selectedYear]?.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-2xl p-5 transition-all group hover:scale-[1.01]"
                            style={{
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)'
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                    <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                                        {selectedYear === 'FE' ? 'First Year' : selectedYear === 'SE' ? 'Second Year' : selectedYear === 'TE' ? 'Third Year' : 'Final Year'} Complete Syllabus
                                    </h3>
                                    <p className="text-sm text-gray-500">SPPU Official Syllabus PDF</p>
                                </div>
                                <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                            </div>
                        </a>
                    )}

                    {/* Subject Selection */}
                    {selectedDept && selectedYear && (
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(139, 92, 246, 0.15)',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                            }}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <BookOpenIcon className="w-5 h-5 text-violet-500" />
                                Choose Subject
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {getSubjects().map((subject, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSubject(subject)}
                                        className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${selectedSubject === subject
                                            ? 'text-white shadow-lg'
                                            : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                                            }`}
                                        style={selectedSubject === subject ? {
                                            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                                        } : {}}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subject Resources */}
                    {selectedSubject && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 px-1">
                                <SparklesIcon className="w-5 h-5 text-violet-500" />
                                Resources for <span className="text-violet-600">{selectedSubject}</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Notes Card */}
                                <div
                                    className="rounded-2xl p-6 transition-all group cursor-pointer hover:scale-[1.02]"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(139, 92, 246, 0.15)',
                                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                                    }}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg" style={{ boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)' }}>
                                        <DocumentTextIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-violet-600 transition-colors">Notes</h4>
                                    <p className="text-sm text-gray-500 mb-4">Lecture notes & study material</p>
                                    {academicResources.notes[selectedSubject] ? (
                                        <a href={academicResources.notes[selectedSubject][0]?.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 text-sm font-medium hover:underline">
                                            View Notes <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Coming Soon</span>
                                    )}
                                </div>

                                {/* PYQ Card */}
                                <a
                                    href={academicResources.pyq.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-2xl p-6 transition-all group hover:scale-[1.02]"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(251, 146, 60, 0.2)',
                                        boxShadow: '0 4px 20px rgba(251, 146, 60, 0.08)'
                                    }}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 shadow-lg" style={{ boxShadow: '0 8px 20px rgba(251, 146, 60, 0.3)' }}>
                                        <ClipboardDocumentListIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">Previous Year Papers</h4>
                                    <p className="text-sm text-gray-500 mb-4">Past exam questions</p>
                                    <span className="inline-flex items-center gap-1 text-orange-600 text-sm font-medium">
                                        View PYQs <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    </span>
                                </a>

                                {/* Video Lectures Card */}
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedSubject + ' SPPU lectures')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-2xl p-6 transition-all group hover:scale-[1.02]"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.08)'
                                    }}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg" style={{ boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)' }}>
                                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-red-600 transition-colors">Video Lectures</h4>
                                    <p className="text-sm text-gray-500 mb-4">YouTube tutorials</p>
                                    <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                                        Search Videos <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    </span>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Prompt if not selected */}
                    {(!selectedDept || !selectedYear) && (
                        <div
                            className="text-center py-12 rounded-2xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(139, 92, 246, 0.15)'
                            }}
                        >
                            <AcademicCapIcon className="w-16 h-16 text-violet-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Select your department and year to view subjects</p>
                        </div>
                    )}

                    {/* Prompt to select subject */}
                    {selectedDept && selectedYear && !selectedSubject && (
                        <div
                            className="text-center py-8 rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)',
                                border: '1px solid rgba(139, 92, 246, 0.2)'
                            }}
                        >
                            <p className="text-violet-600 font-medium">👆 Select a subject above to see Notes, PYQs & Videos</p>
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
                                        ? 'text-white shadow-lg'
                                        : 'bg-white/80 text-violet-600 hover:bg-violet-50 border border-violet-200'
                                        }`}
                                    style={placementTab === tab.id ? {
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                    } : {}}
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
                                    className="rounded-2xl p-5 transition-all group hover:scale-[1.01]"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(139, 92, 246, 0.15)',
                                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg" style={{ boxShadow: '0 6px 15px rgba(139, 92, 246, 0.3)' }}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
                                                {resource.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">{resource.description}</p>
                                        </div>
                                        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-violet-500 shrink-0 transition-colors" />
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
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(217, 70, 239, 0.15) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.3)'
                        }}
                    >
                        <h2 className="text-lg font-semibold text-violet-700 mb-2 flex items-center gap-2">
                            <BookOpenIcon className="w-5 h-5" />
                            GATE Preparation Resources
                        </h2>
                        <p className="text-sm text-violet-600">Curated resources for GATE CS/IT preparation</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gateResources.map((resource, idx) => (
                            <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-2xl p-5 transition-all group hover:scale-[1.01]"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(139, 92, 246, 0.15)',
                                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg" style={{ boxShadow: '0 6px 15px rgba(139, 92, 246, 0.3)' }}>
                                        <BookOpenIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
                                                {resource.title}
                                            </h3>
                                            <span
                                                className="px-2 py-0.5 text-xs rounded-full text-white font-medium"
                                                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' }}
                                            >
                                                {resource.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{resource.description}</p>
                                    </div>
                                    <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-violet-500 transition-colors" />
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
