import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrophyIcon, PlayIcon, SparklesIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';

// Company logos - Expanded list of recruiters
const companyData = {
    'TCS': { logo: 'https://logo.clearbit.com/tcs.com' },
    'Infosys': { logo: 'https://logo.clearbit.com/infosys.com' },
    'Wipro': { logo: 'https://logo.clearbit.com/wipro.com' },
    'Cognizant': { logo: 'https://logo.clearbit.com/cognizant.com' },
    'Accenture': { logo: 'https://logo.clearbit.com/accenture.com' },
    'Capgemini': { logo: 'https://logo.clearbit.com/capgemini.com' },
    'Tech Mahindra': { logo: 'https://logo.clearbit.com/techmahindra.com' },
    'HCLTech': { logo: 'https://logo.clearbit.com/hcltech.com' },
    'LTIMindtree': { logo: 'https://logo.clearbit.com/ltimindtree.com' },
    'Persistent': { logo: 'https://logo.clearbit.com/persistent.com' },
    'Zensar': { logo: 'https://logo.clearbit.com/zensar.com' },
    'KPIT': { logo: 'https://logo.clearbit.com/kpit.com' },
    'BNY Mellon': { logo: 'https://logo.clearbit.com/bnymellon.com' },
    'Barclays': { logo: 'https://logo.clearbit.com/barclays.com' },
    'Deutsche Bank': { logo: 'https://logo.clearbit.com/db.com' },
    'HSBC': { logo: 'https://logo.clearbit.com/hsbc.com' }
};

// Hall of Fame videos - Add your YouTube video URLs here
const hallOfFameVideos = [
    {
        id: 1,
        name: 'Sarah Khambatta',
        company: 'BNY Mellon',
        role: 'Analyst',
        year: '2026',
        department: 'Computer',
        videoId: 'uBMUfPphCIY?si=5-87tNJYYP5_oN2i',
        thumbnail: null
    },
    {
        id: 2,
        name: 'Ananya Mohan',
        company: 'LTIMindtree',
        role: 'Graduate Engineer Trainee',
        year: '2026',
        department: 'ENTC',
        videoId: 'UfZbxHGCx5U?si=-FxYmfb__JmbAF8R',
        thumbnail: null
    },
    {
        id: 3,
        name: 'Amit Deshmukh',
        company: 'Wipro',
        role: 'Associate Developer',
        year: '2023',
        department: 'Computer',
        videoId: 'dQw4w9WgXcQ',
        thumbnail: null
    }
];

// Get unique companies from videos
const uniqueCompanies = [...new Set(hallOfFameVideos.map(v => v.company))];

// Helper to extract clean YouTube video ID
const getCleanVideoId = (videoId) => {
    if (!videoId) return '';
    return videoId.split('?')[0].split('&')[0];
};

const VideoCard = ({ video, onPlay }) => {
    const cleanId = getCleanVideoId(video.videoId);
    const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
    const company = companyData[video.company];

    return (
        <div
            className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(139, 92, 246, 0.12)',
                boxShadow: '0 2px 12px rgba(139, 92, 246, 0.06)'
            }}
        >
            {/* Video Thumbnail */}
            <div
                className="relative aspect-video cursor-pointer overflow-hidden"
                onClick={() => onPlay(video)}
            >
                <img
                    src={thumbnailUrl}
                    alt={`${video.name}'s success story`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
                    }}
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-colors flex items-center justify-center">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                        }}
                    >
                        <PlayIcon className="w-6 h-6 text-white ml-0.5" />
                    </div>
                </div>
                {/* Company Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 backdrop-blur-md rounded-full text-xs font-semibold text-white bg-black/40">
                    {company?.logo && (
                        <img
                            src={company.logo}
                            alt={video.company}
                            className="w-4 h-4 rounded-full bg-white object-contain"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    )}
                    {video.company}
                </div>
            </div>

            {/* Card Content - Compact */}
            <div className="p-3">
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">{video.name}</h3>
                <p className="text-violet-600 text-sm">{video.role}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 font-medium">
                        {video.department}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>Batch {video.year}</span>
                </div>
            </div>
        </div>
    );
};

const HallOfFame = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [filterYear, setFilterYear] = useState('all');

    const years = ['all', ...new Set(hallOfFameVideos.map(v => v.year))];

    const filteredVideos = filterYear === 'all'
        ? hallOfFameVideos
        : hallOfFameVideos.filter(v => v.year === filterYear);

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
                            <TrophyIconSolid className="w-7 h-7 text-yellow-300" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-2">
                                Hall of Fame
                                <SparklesIcon className="w-6 h-6 text-yellow-300" />
                            </h1>
                            <p className="text-violet-100 text-sm">Celebrating our successful alumni</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-4 space-y-4">
                {/* Compact Stats Bar + Year Filter Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Year Filters */}
                    <div className="flex gap-2 overflow-x-auto">
                        {years.map(year => (
                            <button
                                key={year}
                                onClick={() => setFilterYear(year)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filterYear === year
                                    ? 'text-white bg-violet-600 shadow-md'
                                    : 'bg-white/80 text-violet-600 hover:bg-violet-50 border border-violet-200'
                                    }`}
                            >
                                {year === 'all' ? 'All Years' : `Batch ${year}`}
                            </button>
                        ))}
                    </div>

                    {/* Compact Stats */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-bold text-violet-600">{hallOfFameVideos.length}</span>
                            <span className="text-gray-500">Stories</span>
                        </div>
                        <div className="w-px h-4 bg-violet-200"></div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-bold text-purple-600">{uniqueCompanies.length}</span>
                            <span className="text-gray-500">Companies</span>
                        </div>
                        <div className="w-px h-4 bg-violet-200"></div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-bold text-fuchsia-600">{new Set(hallOfFameVideos.map(v => v.year)).size}</span>
                            <span className="text-gray-500">Batches</span>
                        </div>
                    </div>
                </div>

                {/* Company Logo Strip - Animated Marquee */}
                <div
                    className="rounded-xl p-4 overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.1)'
                    }}
                >
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <BuildingOffice2Icon className="w-4 h-4" />
                        <span className="font-medium">Our alumni are placed at</span>
                    </div>
                    <div className="relative overflow-hidden">
                        {/* Fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none"></div>

                        {/* Scrolling content - inline-flex w-max prevents wrapping */}
                        <div className="inline-flex w-max items-center gap-6 animate-marquee">
                            {/* First set */}
                            {Object.entries(companyData).map(([name, data]) => (
                                <div
                                    key={`first-${name}`}
                                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-violet-100 shadow-sm"
                                >
                                    <img
                                        src={data.logo}
                                        alt={name}
                                        className="w-6 h-6 rounded object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{name}</span>
                                </div>
                            ))}
                            {/* Duplicate set for seamless loop */}
                            {Object.entries(companyData).map(([name, data]) => (
                                <div
                                    key={`second-${name}`}
                                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-violet-100 shadow-sm"
                                >
                                    <img
                                        src={data.logo}
                                        alt={name}
                                        className="w-6 h-6 rounded object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map(video => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onPlay={setSelectedVideo}
                        />
                    ))}
                </div>

                {filteredVideos.length === 0 && (
                    <div
                        className="text-center py-16 rounded-2xl"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(139, 92, 246, 0.15)'
                        }}
                    >
                        <div
                            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                            style={{
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)'
                            }}
                        >
                            <TrophyIcon className="w-10 h-10 text-violet-400" />
                        </div>
                        <p className="text-gray-700 font-semibold text-lg">No videos for this year</p>
                        <p className="text-gray-500 text-sm mt-1">Check back later!</p>
                    </div>
                )}
            </div>

            {/* Video Modal */}
            {
                selectedVideo && (
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div
                            className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
                            style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 100px rgba(139, 92, 246, 0.2)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getCleanVideoId(selectedVideo.videoId)}?autoplay=1`}
                                title={`${selectedVideo.name}'s Success Story`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <button
                            className="absolute top-6 right-6 px-4 py-2 rounded-xl text-white/90 hover:text-white text-sm font-medium flex items-center gap-2 transition-all hover:bg-white/10"
                            onClick={() => setSelectedVideo(null)}
                        >
                            Close ✕
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default HallOfFame;
