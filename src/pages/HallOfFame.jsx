import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrophyIcon, PlayIcon } from '@heroicons/react/24/outline';
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
        videoId: 'https://youtu.be/uBMUfPphCIY?si=5-87tNJYYP5_oN2i', // Replace with actual YouTube video ID
        thumbnail: null // Will auto-generate from video ID
    },
    {
        id: 2,
        name: 'Ananya Mohan',
        company: 'LTIMindtree',
        role: 'Graduate Engineer Trainee',
        year: '2026',
        department: 'ENTC',
        videoId: 'https://youtu.be/UfZbxHGCx5U?si=-FxYmfb__JmbAF8R', // Replace with actual YouTube video ID
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

const VideoCard = ({ video, onPlay }) => {
    const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

    return (
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50 hover:-translate-y-1">
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
                        e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                    }}
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <PlayIcon className="w-8 h-8 text-indigo-600 ml-1" />
                    </div>
                </div>
                {/* Company Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-600">
                    {video.company}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg">{video.name}</h3>
                <p className="text-indigo-600 font-medium text-sm">{video.role}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">{video.department}</span>
                    <span>•</span>
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
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 p-8 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>

                <div className="relative z-10">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <TrophyIconSolid className="w-10 h-10 text-yellow-300 animate-pulse" />
                        <h1 className="text-3xl font-bold">Hall of Fame</h1>
                    </div>
                    <p className="text-white/80 text-lg">Celebrating our successful alumni who cracked their dream placements</p>
                </div>
            </div>

            {/* Year Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {years.map(year => (
                    <button
                        key={year}
                        onClick={() => setFilterYear(year)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filterYear === year
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                            }`}
                    >
                        {year === 'all' ? 'All Years' : `Batch ${year}`}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-4 text-center border border-indigo-100">
                    <div className="text-2xl font-bold text-indigo-600">{hallOfFameVideos.length}</div>
                    <div className="text-xs text-gray-600 mt-1">Success Stories</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center border border-green-100">
                    <div className="text-2xl font-bold text-green-600">{new Set(hallOfFameVideos.map(v => v.company)).size}</div>
                    <div className="text-xs text-gray-600 mt-1">Companies</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 text-center border border-amber-100">
                    <div className="text-2xl font-bold text-amber-600">{new Set(hallOfFameVideos.map(v => v.year)).size}</div>
                    <div className="text-xs text-gray-600 mt-1">Batches</div>
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
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <TrophyIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No videos for this year</p>
                    <p className="text-gray-400 text-sm mt-1">Check back later!</p>
                </div>
            )}

            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                            title={`${selectedVideo.name}'s Success Story`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                    <button
                        className="absolute top-4 right-4 text-white/80 hover:text-white text-sm flex items-center gap-2"
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
