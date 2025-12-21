import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

export default function TrafficAnalytics({
    period,
    startDate,
    endDate,
    totalVisits,
    uniqueVisitors,
    bounceRate,
    visitsOverTime,
    timeOfDayStats,
    deviceStats,
    browserStats,
    referrerStats,
    topArticles,
    peakDays,
    realtimeActivity,
    articleViews, // Add this since your controller has it
    periodOptions,
}) {
    const [darkMode, setDarkMode] = useState(window.localStorage.getItem('theme') === 'dark');
    const [activeTab, setActiveTab] = useState('overview');

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const handleFilterChange = (filterType, value) => {
        router.get(route('admin.traffic'), {
            ...(filterType === 'period' ? { period: value, page_type: pageType } : {}),
            ...(filterType === 'page_type' ? { period: period, page_type: value } : {}),
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Format number with commas
    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    // Calculate percentage for progress bars
    const calculatePercentage = (value, total) => {
        return total > 0 ? Math.round((value / total) * 100) : 0;
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <AdminNavbar adminName="Admin" darkMode={darkMode} setDarkMode={setDarkMode} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Traffic Analytics</h1>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {startDate} to {endDate}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export Report
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Time Period
                                </label>
                                <select
                                    value={period}
                                    onChange={(e) => handleFilterChange('period', e.target.value)}
                                    className={`w-full sm:w-40 px-3 py-2 rounded-lg border ${darkMode 
                                        ? 'bg-gray-800 border-gray-700 text-white' 
                                        : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                >
                                    {periodOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Page Type
                                </label>
                       
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{formatNumber(totalVisits)}</div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Visits
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{formatNumber(uniqueVisitors)}</div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Unique Visitors
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{bounceRate}%</div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Bounce Rate
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">
                            {peakDays.length > 0 ? formatNumber(peakDays[0].visits) : 0}
                        </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Peak Day Visits
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <nav className="-mb-px flex space-x-8">
                            {['overview', 'content', 'audience', 'realtime'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab
                                            ? darkMode
                                                ? 'border-blue-500 text-blue-400'
                                                : 'border-blue-600 text-blue-600'
                                            : darkMode
                                                ? 'border-transparent text-gray-400 hover:text-gray-300'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Visits Over Time Chart */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                            <h2 className="text-xl font-bold mb-6">Visits Over Time</h2>
                            <div className="h-64 flex items-end space-x-1">
                                {visitsOverTime.map((item, index) => {
                                    const maxVisits = Math.max(...visitsOverTime.map(i => i.visits));
                                    const height = maxVisits > 0 ? (item.visits / maxVisits) * 100 : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div 
                                                className="w-full max-w-[40px] bg-gradient-to-t from-blue-500 to-blue-300 dark:from-blue-600 dark:to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                                                style={{ height: `${height}%` }}
                                                title={`${item.visits} visits on ${item.date || item.month}`}
                                            ></div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                                                {item.date ? new Date(item.date).getDate() : item.month?.split('-')[1]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Page Type Breakdown */}
                          {/* Article Views Breakdown */}
<div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
    <h2 className="text-xl font-bold mb-6">Article Engagement</h2>
    {articleViews && (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between mb-1">
                    <span className="font-medium">Total Article Views</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatNumber(articleViews.total_visits || 0)}
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div 
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                        style={{ width: `${calculatePercentage(articleViews.total_visits || 0, totalVisits)}%` }}
                    ></div>
                </div>
            </div>
            
            <div>
                <div className="flex justify-between mb-1">
                    <span className="font-medium">Articles Viewed</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatNumber(articleViews.articles_viewed || 0)} articles
                    </span>
                </div>
            </div>
            
            <div>
                <div className="flex justify-between mb-1">
                    <span className="font-medium">Average Time on Page</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {articleViews.avg_duration 
                            ? (articleViews.avg_duration > 60 
                                ? `${Math.floor(articleViews.avg_duration / 60)}m ${articleViews.avg_duration % 60}s`
                                : `${articleViews.avg_duration}s`)
                            : 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    )}
</div>

                            {/* Device Stats */}
                            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                                <h2 className="text-xl font-bold mb-6">Device Distribution</h2>
                                <div className="space-y-4">
                                    {deviceStats.map((item, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between mb-1">
                                                <span className="font-medium">{item.device_type || 'Unknown'}</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {item.percentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                                <div 
                                                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="space-y-8">
                        {/* Top Articles */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                            <h2 className="text-xl font-bold mb-6">Top Performing Articles</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className={`text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <th className="pb-3 px-2">#</th>
                                            <th className="pb-3 px-2">Article</th>
                                            <th className="pb-3 px-2 text-right">Visits</th>
                                            <th className="pb-3 px-2 text-right">Unique</th>
                                            <th className="pb-3 px-2 text-right">Avg. Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topArticles.map((item, index) => (
                                            <tr key={index} className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                                                <td className="py-3 px-2">
                                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2">
                                                    {item.article ? (
                                                        <div>
                                                            <Link 
                                                                href={`/articles/${item.article.slug}`} 
                                                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                            >
                                                                {item.article.title}
                                                            </Link>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {item.article.category} • {item.article.author}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 dark:text-gray-400 italic">Deleted Article</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-2 text-right font-semibold">
                                                    {formatNumber(item.visits)}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {formatNumber(item.unique_visitors)}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {item.avg_time_on_page > 60 
                                                        ? `${Math.floor(item.avg_time_on_page / 60)}m ${item.avg_time_on_page % 60}s`
                                                        : `${item.avg_time_on_page}s`
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Audience Tab */}
                {activeTab === 'audience' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Browser Stats */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                            <h2 className="text-xl font-bold mb-6">Top Browsers</h2>
                            <div className="space-y-4">
                                {browserStats.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium">{item.browser || 'Unknown'}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                            <div 
                                                className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                       {/* Top IP Addresses */}
<div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
    <h2 className="text-xl font-bold mb-6">Top Visitor IPs</h2>
    <div className="space-y-3">
        {realtimeActivity.slice(0, 8).map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
                <div>
                    <div className="font-medium font-mono text-sm">{activity.ip || 'Unknown'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.browser} • {activity.device_type}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time_ago}
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>

                        {/* Referrer Stats */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                            <h2 className="text-xl font-bold mb-6">Traffic Sources</h2>
                            <div className="space-y-4">
                                {referrerStats.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium">{item.source}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                            <div 
                                                className="bg-yellow-600 dark:bg-yellow-500 h-2 rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Time of Day Analysis */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                            <h2 className="text-xl font-bold mb-6">Peak Hours</h2>
                            <div className="h-48 flex items-end space-x-1">
                                {Array.from({ length: 24 }).map((_, hour) => {
                                    const hourData = timeOfDayStats.find(h => parseInt(h.hour) === hour);
                                    const visits = hourData ? hourData.visits : 0;
                                    const maxVisits = Math.max(...timeOfDayStats.map(h => h.visits));
                                    const height = maxVisits > 0 ? (visits / maxVisits) * 100 : 0;
                                    return (
                                        <div key={hour} className="flex-1 flex flex-col items-center">
                                            <div 
                                                className="w-full max-w-[20px] bg-gradient-to-t from-orange-500 to-orange-300 dark:from-orange-600 dark:to-orange-400 rounded-t-lg"
                                                style={{ height: `${height}%` }}
                                                title={`${visits} visits at ${hour}:00`}
                                            ></div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                {hour === 0 ? '12a' : hour === 12 ? '12p' : hour > 12 ? `${hour-12}p` : `${hour}a`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Real-time Tab */}
                {activeTab === 'realtime' && (
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Real-time Activity (Last 24 Hours)</h2>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {realtimeActivity.length} activities
                                </span>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <th className="pb-3 px-2">Time</th>
                                        <th className="pb-3 px-2">Page/Article</th>
                                        <th className="pb-3 px-2">Visitor</th>
                                        <th className="pb-3 px-2">Location</th>
                                        <th className="pb-3 px-2">Device</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {realtimeActivity.map((activity, index) => (
                                        <tr key={index} className={`border-t ${darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <td className="py-3 px-2">
                                                <div className="text-sm font-medium">{activity.time_ago}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {activity.created_at.split(' ')[1]}
                                                </div>
                                            </td>
                                            <td className="py-3 px-2">
                                                {activity.article ? (
                                                    <div>
                                                        <div className="font-medium">{activity.article.title}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {activity.page_type}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="font-medium">{activity.page_type}</div>
                                                )}
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="text-sm">{activity.ip_address}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {activity.browser}
                                                </div>
                                            </td>
                                            <td className="py-3 px-2">
                                                {activity.country ? (
                                                    <div>
                                                        <div className="text-sm">{activity.country}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {activity.city}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 dark:text-gray-400">Unknown</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="text-sm">{activity.device_type}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}