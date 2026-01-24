import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrophyIcon, PlayIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';

// Hall of Fame videos - Add your YouTube video URLs here
const hallOfFameVideos = [
    {
        id: 1,
        name: 'Sarah Khambatta',
        company: 'BNY Mellon',
        role: 'Analyst',
        year: '2026',
        department: 'Computer',
        videoId: 'uBMUfPphCIY?si=5-87tNJYYP5_oN2i', // Replace with actual YouTube video ID
        thumbnail: null // Will auto-generate from video ID
    },
    {
        id: 2,
        name: 'Ananya Mohan',
        company: 'LTIMindtree',
        role: 'Graduate Engineer Trainee',
        year: '2026',
        department: 'ENTC',
        videoId: 'UfZbxHGCx5U?si=-FxYmfb__JmbAF8R', // Replace with actual YouTube video ID
        thumbnail: null
    },
    {
        id: 3,
        name: 'Amit Deshmukh',
        company: 'Wipro',
        role: 'Associate Developer',
        year: '2023',
        department: 'Computer',
        videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
        thumbnail: null
    }
];

// Helper to extract clean YouTube video ID (removes query params like ?si=...)
const getCleanVideoId = (videoId) => {
    if (!videoId) return '';
    // Remove any query parameters
    return videoId.split('?')[0].split('&')[0];
};

const VideoCard = ({ video, onPlay }) => {
    const cleanId = getCleanVideoId(video.videoId);
    const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;

    return (
        <div
            className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
            style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-colors flex items-center justify-center">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                        }}
                    >
                        <PlayIcon className="w-8 h-8 text-white ml-1" />
                    </div>
                </div>
                {/* Company Badge */}
                <div
                    className="absolute top-3 left-3 px-3 py-1.5 backdrop-blur-sm rounded-full text-xs font-semibold text-white"
                    style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                    }}
                >
                    {video.company}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-violet-600 transition-colors">{video.name}</h3>
                <p className="text-violet-600 font-medium text-sm">{video.role}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <span
                        className="px-2.5 py-1 rounded-full font-medium"
                        style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)',
                            color: '#7c3aed'
                        }}
                    >
                        {video.department}
                    </span>
                    <span className="text-violet-300">•</span>
                    <span className="text-gray-600">Batch {video.year}</span>
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300/10 blur-3xl rounded-full"></div>

                <div className="relative z-10">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-4 mb-3">
                        <div
                            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                        >
                            <TrophyIconSolid className="w-9 h-9 text-yellow-300 drop-shadow-lg" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg flex items-center gap-2">
                                Hall of Fame
                                <SparklesIcon className="w-6 h-6 text-yellow-300 animate-pulse" />
                            </h1>
                            <p className="text-violet-100 text-sm">Celebrating our successful alumni</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
                {/* Year Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {years.map(year => (
                        <button
                            key={year}
                            onClick={() => setFilterYear(year)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filterYear === year
                                ? 'text-white shadow-lg'
                                : 'bg-white/80 text-violet-600 hover:bg-violet-50 border border-violet-200'
                                }`}
                            style={filterYear === year ? {
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                            } : {}}
                        >
                            {year === 'all' ? 'All Years' : `Batch ${year}`}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div
                        className="rounded-2xl p-5 text-center backdrop-blur-sm"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: '2px solid rgba(139, 92, 246, 0.3)',
                            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)'
                        }}
                    >
                        <div className="text-3xl font-bold text-violet-600">{hallOfFameVideos.length}</div>
                        <div className="text-sm text-gray-600 mt-1 font-medium">Success Stories</div>
                    </div>
                    <div
                        className="rounded-2xl p-5 text-center backdrop-blur-sm"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: '2px solid rgba(168, 85, 247, 0.3)',
                            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.1)'
                        }}
                    >
                        <div className="text-3xl font-bold text-purple-600">{new Set(hallOfFameVideos.map(v => v.company)).size}</div>
                        <div className="text-sm text-gray-600 mt-1 font-medium">Companies</div>
                    </div>
                    <div
                        className="rounded-2xl p-5 text-center backdrop-blur-sm"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: '2px solid rgba(217, 70, 239, 0.3)',
                            boxShadow: '0 4px 20px rgba(217, 70, 239, 0.1)'
                        }}
                    >
                        <div className="text-3xl font-bold text-fuchsia-600">{new Set(hallOfFameVideos.map(v => v.year)).size}</div>
                        <div className="text-sm text-gray-600 mt-1 font-medium">Batches</div>
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
            {selectedVideo && (
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
            )}
        </div>
    );
};

export default HallOfFame;
