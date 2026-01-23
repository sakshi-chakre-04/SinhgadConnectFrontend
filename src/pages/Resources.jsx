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
        { id: 'academics', label: 'Academics', icon: AcademicCapIcon, color: '#4A90E2' },
        { id: 'placement', label: 'Placement', icon: BriefcaseIcon, color: '#8651F1' },
        { id: 'gate', label: 'GATE Prep', icon: BookOpenIcon, color: '#A23CF4' }
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
            <div className="relative overflow-hidden rounded-2xl mx-4 mt-4 p-8 lg:p-10" style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #607BE7 20%, #7666EC 40%, #8651F1 60%, #A23CF4 80%, #B82FF8 90%, #CD13FC 100%)' }}>
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
                                    ? 'text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                style={activeSection === section.id ? { backgroundColor: section.color } : {}}
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
                            <AcademicCapIcon className="w-5 h-5" style={{ color: '#4A90E2' }} />
                            Select Your Stream
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <select
                                    value={selectedDept}
                                    onChange={(e) => { setSelectedDept(e.target.value); setSelectedSubject(''); }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 bg-gray-50"
                                    style={{ '--focus-ring-color': '#4A90E2' }}
                                    onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
                                    onBlur={(e) => e.target.style.borderColor = ''}
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
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 bg-gray-50"
                                    style={{ '--focus-ring-color': '#4A90E2' }}
                                    onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
                                    onBlur={(e) => e.target.style.borderColor = ''}
                                >
                                    <option value="">Choose year...</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year === 'FE' ? 'First Year' : year === 'SE' ? 'Second Year' : year === 'TE' ? 'Third Year' : 'Final Year'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Year Syllabus - shown when year is selected */}
                    {selectedYear && (
                        <a
                            href={academicResources.syllabus[selectedYear]?.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 hover:shadow-md hover:border-green-200 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                                        {selectedYear === 'FE' ? 'First Year' : selectedYear === 'SE' ? 'Second Year' : selectedYear === 'TE' ? 'Third Year' : 'Final Year'} Complete Syllabus
                                    </h3>
                                    <p className="text-sm text-gray-500">SPPU Official Syllabus PDF</p>
                                </div>
                                <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
                            </div>
                        </a>
                    )}

                    {/* Subject Selection - shown when both dept and year selected */}
                    {selectedDept && selectedYear && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <BookOpenIcon className="w-5 h-5" style={{ color: '#4A90E2' }} />
                                Choose Subject
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {getSubjects().map((subject, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSubject(subject)}
                                        className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${selectedSubject === subject
                                            ? 'text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:text-white'
                                            }`}
                                        style={selectedSubject === subject ? { backgroundColor: '#4A90E2' } : {}}
                                        onMouseEnter={(e) => { if (selectedSubject !== subject) e.target.style.backgroundColor = '#7666EC'; }}
                                        onMouseLeave={(e) => { if (selectedSubject !== subject) e.target.style.backgroundColor = ''; }}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subject Resources - shown when subject is selected */}
                    {selectedSubject && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 px-1">
                                📚 Resources for <span style={{ color: '#4A90E2' }}>{selectedSubject}</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Notes Card */}
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                                        <DocumentTextIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">Notes</h4>
                                    <p className="text-sm text-gray-500 mb-4">Lecture notes & study material</p>
                                    {academicResources.notes[selectedSubject] ? (
                                        <a href={academicResources.notes[selectedSubject][0]?.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
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
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
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
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-red-500/30">
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
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                            <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Select your department and year to view subjects</p>
                        </div>
                    )}

                    {/* Prompt to select subject */}
                    {selectedDept && selectedYear && !selectedSubject && (
                        <div className="text-center py-8 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100">
                            <p className="text-indigo-600">👆 Select a subject above to see Notes, PYQs & Videos</p>
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
