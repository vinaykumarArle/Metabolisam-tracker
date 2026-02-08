import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ChevronLeft, Flame, TrendingDown, Apple, Dumbbell, FileText } from 'lucide-react';
import { statisticsService, WeeklyStats, DailyWeightData } from '../lib/statisticsService';
import { useAuthStore } from '../store/authStore';

interface StatisticsScreenProps {
  onBack: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ onBack }) => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [weightData, setWeightData] = useState<DailyWeightData[]>([]);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, [user, period]);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const today = new Date().toISOString().split('T')[0];

      if (period === 'weekly') {
        const weekStats = await statisticsService.getWeeklyStats(user.id, today);
        setStats(weekStats);

        const weekWeightData = await statisticsService.getWeeklyWeightData(user.id, today);
        setWeightData(weekWeightData);
      } else {
        const now = new Date();
        const monthStats = await statisticsService.getMonthlyStats(
          user.id,
          now.getFullYear(),
          now.getMonth() + 1
        );
        setStats(monthStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-violet-500/30 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Statistics</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Period Toggle */}
      <div className="flex gap-2 p-4 bg-slate-800/30 border-b border-slate-700">
        <button
          onClick={() => setPeriod('weekly')}
          className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
            period === 'weekly'
              ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setPeriod('monthly')}
          className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
            period === 'monthly'
              ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          This Month
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-8">
        {!stats ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">No data available yet</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {/* Streak */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <p className="text-xs text-slate-400">Streak</p>
                </div>
                <p className="text-3xl font-bold text-white">{stats.streak}</p>
                <p className="text-xs text-slate-400 mt-1">days</p>
              </div>

              {/* Weight Change */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-green-500" />
                  <p className="text-xs text-slate-400">Weight Change</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {stats.weightChange > 0 ? '+' : ''}
                  {stats.weightChange.toFixed(1)}
                </p>
                <p className="text-xs text-slate-400 mt-1">kg</p>
              </div>

              {/* Avg Weight */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                <p className="text-xs text-slate-400 mb-2">Avg Weight</p>
                <p className="text-3xl font-bold text-white">{stats.averageWeight.toFixed(1)}</p>
                <p className="text-xs text-slate-400 mt-1">kg</p>
              </div>

              {/* Completion Rate */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                <p className="text-xs text-slate-400 mb-2">Completion</p>
                <p className="text-3xl font-bold text-white">{Math.round(stats.completionRate)}%</p>
                <p className="text-xs text-slate-400 mt-1">
                  {stats.completedDays}/{stats.totalDays} days
                </p>
              </div>
            </div>

            {/* Weight Chart */}
            {weightData.length > 0 && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-4">Weight Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Entry Breakdown */}
            {stats.totalEntries > 0 && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-4">Entry Breakdown</h3>
                <div className="flex gap-8 items-center justify-center">
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Meals', value: stats.mealCount, color: '#8b5cf6' },
                          { name: 'Exercise', value: stats.exerciseCount, color: '#ec4899' },
                          { name: 'Notes', value: stats.noteCount, color: '#06b6d4' },
                        ].filter((d) => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: 'Meals', value: stats.mealCount, color: '#8b5cf6' },
                          { name: 'Exercise', value: stats.exerciseCount, color: '#ec4899' },
                          { name: 'Notes', value: stats.noteCount, color: '#06b6d4' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {[
                      { name: 'Meals', value: stats.mealCount, color: '#8b5cf6' },
                      { name: 'Exercise', value: stats.exerciseCount, color: '#ec4899' },
                      { name: 'Notes', value: stats.noteCount, color: '#06b6d4' },
                    ].map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm text-slate-300">
                          {entry.name}: <span className="font-semibold text-white">{entry.value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Apple className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white">{stats.mealCount}</p>
                <p className="text-xs text-slate-400 mt-1">Meals</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Dumbbell className="w-4 h-4 text-pink-400" />
                </div>
                <p className="text-2xl font-bold text-white">{stats.exerciseCount}</p>
                <p className="text-xs text-slate-400 mt-1">Exercise</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-bold text-white">{stats.noteCount}</p>
                <p className="text-xs text-slate-400 mt-1">Notes</p>
              </div>
            </div>

            {/* Weight Range */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-4">Weight Range</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Lowest</span>
                  <span className="text-white font-semibold">{stats.minWeight.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Highest</span>
                  <span className="text-white font-semibold">{stats.maxWeight.toFixed(1)} kg</span>
                </div>
                <div className="border-t border-slate-600 pt-3 flex justify-between items-center">
                  <span className="text-slate-400">Difference</span>
                  <span className="text-white font-semibold">
                    {(stats.maxWeight - stats.minWeight).toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
