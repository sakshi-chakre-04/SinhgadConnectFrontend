import React, { useState } from 'react';
import {
    BookOpenIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    WrenchScrewdriverIcon,
    MagnifyingGlassIcon,
    ArrowTopRightOnSquareIcon,
    SparklesIcon,
    DocumentTextIcon,
    CodeBracketIcon,
    VideoCameraIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

// Resource data organized by category
const resourcesData = {
    study: {
        title: 'Study Materials',
        description: 'Notes, syllabus, and previous year papers',
        icon: BookOpenIcon,
        gradient: 'from-blue-500 to-cyan-500',
        items: [
            {
                title: 'SPPU Syllabus',
                description: 'Official syllabus for all branches',
                url: 'http://collegecirculars.unipune.ac.in/',
                type: 'document',
                tags: ['Official', 'Syllabus']
            },
            {
                title: 'Last Moment Tuitions',
                description: 'Video lectures for engineering subjects',
                url: 'https://www.youtube.com/@LastMomentTuitions',
                type: 'video',
                tags: ['YouTube', 'Free']
            },
            {
                title: 'Gate Smashers',
                description: 'CS/IT core subject explanations',
                url: 'https://www.youtube.com/@GateSmashers',
                type: 'video',
                tags: ['YouTube', 'GATE']
            },
            {
                title: 'GeeksforGeeks',
                description: 'Programming tutorials and notes',
                url: 'https://www.geeksforgeeks.org/',
                type: 'website',
                tags: ['Coding', 'Notes']
            },
            {
                title: 'Studocu',
                description: 'Previous year papers and notes',
                url: 'https://www.studocu.com/',
                type: 'document',
                tags: ['PYQ', 'Notes']
            }
        ]
    },
    placement: {
        title: 'Placement Prep',
        description: 'Aptitude, coding, and interview resources',
        icon: BriefcaseIcon,
        gradient: 'from-violet-500 to-purple-500',
        items: [
            {
                title: 'LeetCode',
                description: 'Practice coding problems for interviews',
                url: 'https://leetcode.com/',
                type: 'coding',
                tags: ['Coding', 'Interview']
            },
            {
                title: 'PrepInsta',
                description: 'Company-specific aptitude papers',
                url: 'https://prepinsta.com/',
                type: 'website',
                tags: ['Aptitude', 'TCS', 'Infosys']
            },
            {
                title: 'IndiaBix',
                description: 'Aptitude and verbal reasoning',
                url: 'https://www.indiabix.com/',
                type: 'website',
                tags: ['Aptitude', 'Free']
            },
            {
                title: 'HackerRank',
                description: 'Coding practice and certifications',
                url: 'https://www.hackerrank.com/',
                type: 'coding',
                tags: ['Coding', 'Certificate']
            },
            {
                title: 'InterviewBit',
                description: 'Structured interview preparation',
                url: 'https://www.interviewbit.com/',
                type: 'coding',
                tags: ['DSA', 'Interview']
            },
            {
                title: 'Naukri Campus',
                description: 'Off-campus placement opportunities',
                url: 'https://www.naukri.com/campus/',
                type: 'website',
                tags: ['Jobs', 'Fresher']
            }
        ]
    },
    courses: {
        title: 'Online Courses',
        description: 'Free and paid courses from top platforms',
        icon: AcademicCapIcon,
        gradient: 'from-emerald-500 to-teal-500',
        items: [
            {
                title: 'NPTEL',
                description: 'Free IIT/IISc courses with certificates',
                url: 'https://nptel.ac.in/',
                type: 'website',
                tags: ['Free', 'Certificate', 'IIT']
            },
            {
                title: 'Coursera',
                description: 'World-class courses from universities',
                url: 'https://www.coursera.org/',
                type: 'website',
                tags: ['Paid', 'Certificate']
            },
            {
                title: 'freeCodeCamp',
                description: 'Free coding bootcamp & certifications',
                url: 'https://www.freecodecamp.org/',
                type: 'coding',
                tags: ['Free', 'Web Dev']
            },
            {
                title: 'Udemy',
                description: 'Affordable courses on any topic',
                url: 'https://www.udemy.com/',
                type: 'website',
                tags: ['Paid', 'Diverse']
            },
            {
                title: 'MIT OpenCourseWare',
                description: 'Free MIT course materials',
                url: 'https://ocw.mit.edu/',
                type: 'website',
                tags: ['Free', 'MIT']
            }
        ]
    },
    tools: {
        title: 'Tools & Discounts',
        description: 'Free tools and student offers',
        icon: WrenchScrewdriverIcon,
        gradient: 'from-orange-500 to-amber-500',
        items: [
            {
                title: 'GitHub Student Pack',
                description: 'Free tools worth $200k+ for students',
                url: 'https://education.github.com/pack',
                type: 'website',
                tags: ['Free', 'Must Have']
            },
            {
                title: 'JetBrains for Students',
                description: 'Free IntelliJ, PyCharm, WebStorm',
                url: 'https://www.jetbrains.com/student/',
                type: 'website',
                tags: ['Free', 'IDE']
            },
            {
                title: 'Figma for Students',
                description: 'Free professional design tool',
                url: 'https://www.figma.com/education/',
                type: 'website',
                tags: ['Free', 'Design']
            },
            {
                title: 'Notion for Students',
                description: 'Free productivity & notes app',
                url: 'https://www.notion.so/students',
                type: 'website',
                tags: ['Free', 'Productivity']
            },
            {
                title: 'Microsoft Azure for Students',
                description: '$100 cloud credits + free services',
                url: 'https://azure.microsoft.com/en-us/free/students/',
                type: 'website',
                tags: ['Free', 'Cloud']
            },
            {
                title: 'Canva Pro for Students',
                description: 'Free premium design templates',
                url: 'https://www.canva.com/education/',
                type: 'website',
                tags: ['Free', 'Design']
            }
        ]
    }
};

// Get icon based on resource type
const getTypeIcon = (type) => {
    switch (type) {
        case 'video': return VideoCameraIcon;
        case 'coding': return CodeBracketIcon;
        case 'document': return DocumentTextIcon;
        default: return GlobeAltIcon;
    }
};

const Resources = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'all', label: 'All Resources', icon: SparklesIcon },
        { id: 'study', label: 'Study', icon: BookOpenIcon },
        { id: 'placement', label: 'Placement', icon: BriefcaseIcon },
        { id: 'courses', label: 'Courses', icon: AcademicCapIcon },
        { id: 'tools', label: 'Tools', icon: WrenchScrewdriverIcon },
    ];

    // Filter resources based on category and search
    const getFilteredResources = () => {
        let results = [];

        const categoriesToSearch = activeCategory === 'all'
            ? Object.keys(resourcesData)
            : [activeCategory];

        categoriesToSearch.forEach(catKey => {
            const category = resourcesData[catKey];
            category.items.forEach(item => {
                if (
                    searchQuery === '' ||
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                ) {
                    results.push({ ...item, category: catKey, categoryData: category });
                }
            });
        });

        return results;
    };

    const filteredResources = getFilteredResources();

    return (
        <div className="min-h-screen pb-20 lg:pb-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl mx-4 mt-4 p-8 lg:p-12">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <BookOpenIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white">Resources Hub</h1>
                    </div>
                    <p className="text-indigo-100 text-lg max-w-2xl mb-6">
                        Curated collection of study materials, placement resources, courses, and tools to help you succeed in your academic journey.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search resources, topics, or tags..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white/95 backdrop-blur-sm rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="px-4 mt-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeCategory === cat.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Category Cards (when showing all) */}
            {activeCategory === 'all' && searchQuery === '' && (
                <div className="px-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(resourcesData).map(([key, category]) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-left"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{category.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{category.description}</p>
                                    <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                                        <span>{category.items.length} resources</span>
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Resource List */}
            <div className="px-4 mt-6">
                {(activeCategory !== 'all' || searchQuery !== '') && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {searchQuery ? `Search Results (${filteredResources.length})` : resourcesData[activeCategory]?.title}
                            </h2>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>

                        {filteredResources.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No resources found matching your search.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredResources.map((resource, idx) => {
                                    const TypeIcon = getTypeIcon(resource.type);
                                    return (
                                        <a
                                            key={idx}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${resource.categoryData.gradient} flex items-center justify-center shrink-0`}>
                                                    <TypeIcon className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
                                                            {resource.title}
                                                        </h3>
                                                        <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 shrink-0" />
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {resource.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {resource.tags.map((tag, tidx) => (
                                                            <span
                                                                key={tidx}
                                                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Stats Footer */}
            <div className="px-4 mt-8">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-indigo-600">
                                {Object.values(resourcesData).reduce((acc, cat) => acc + cat.items.length, 0)}
                            </div>
                            <div className="text-sm text-gray-500">Total Resources</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-violet-600">4</div>
                            <div className="text-sm text-gray-500">Categories</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-emerald-600">Free</div>
                            <div className="text-sm text-gray-500">Most Resources</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-amber-600">Updated</div>
                            <div className="text-sm text-gray-500">Monthly</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resources;
