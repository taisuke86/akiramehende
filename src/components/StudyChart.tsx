"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StudyChartProps {
  yearlyStats: {
    year: number;
    monthlyStats: Array<{
      month: number;
      sessions: number;
      duration: number;
    }>;
    totalDuration: number;
    totalSessions: number;
  };
  isDarkMode?: boolean;
}

export default function StudyChart({ yearlyStats, isDarkMode = false }: StudyChartProps) {
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  // 学習時間（分）を時間に変換
  const durationData = yearlyStats.monthlyStats.map(stat => 
    Math.round(stat.duration / 60 * 10) / 10  // 小数点1位まで
  );

  // 学習回数データ
  const sessionData = yearlyStats.monthlyStats.map(stat => stat.sessions);

  const textColor = isDarkMode ? '#f3f4f6' : '#374151';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  const backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';

  // 棒グラフ（学習時間）
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: '学習時間（時間）',
        data: durationData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // 折れ線グラフ（学習回数）
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: '学習回数（回）',
        data: sessionData,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: backgroundColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* 年間サマリー */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {yearlyStats.year}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">年</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.round(yearlyStats.totalDuration / 60)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">総学習時間（時間）</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {yearlyStats.totalSessions}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">総学習回数（回）</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {yearlyStats.totalSessions > 0 
              ? Math.round(yearlyStats.totalDuration / yearlyStats.totalSessions) 
              : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">平均時間（分/回）</div>
        </div>
      </div>

      {/* 学習時間グラフ */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          月別学習時間
        </h3>
        <div className="h-64">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>

      {/* 学習回数グラフ */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          月別学習回数
        </h3>
        <div className="h-64">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}