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

  const textColor = isDarkMode ? '#e5e7eb' : '#374151';
  const gridColor = isDarkMode ? '#4b5563' : '#e5e7eb';
  const tooltipBgColor = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipBorderColor = isDarkMode ? '#6b7280' : '#d1d5db';

  // 棒グラフ（学習時間）- グラデーション効果
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: '学習時間（時間）',
        data: durationData,
        backgroundColor: durationData.map((_, index) => {
          const opacity = Math.max(0.3, Math.min(1, (index + 1) / 12));
          return isDarkMode 
            ? `rgba(96, 165, 250, ${opacity})`
            : `rgba(59, 130, 246, ${opacity})`;
        }),
        borderColor: isDarkMode ? 'rgba(96, 165, 250, 1)' : 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.8)' : 'rgba(59, 130, 246, 0.8)',
        hoverBorderColor: isDarkMode ? 'rgba(147, 197, 253, 1)' : 'rgba(37, 99, 235, 1)',
        hoverBorderWidth: 3,
      },
    ],
  };

  // 折れ線グラフ（学習回数）- モダンなスタイル
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: '学習回数（回）',
        data: sessionData,
        borderColor: isDarkMode ? 'rgba(52, 211, 153, 1)' : 'rgba(16, 185, 129, 1)',
        backgroundColor: isDarkMode ? 'rgba(52, 211, 153, 0.15)' : 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: 'start',
        tension: 0.4,
        pointBackgroundColor: isDarkMode ? 'rgba(52, 211, 153, 1)' : 'rgba(16, 185, 129, 1)',
        pointBorderColor: isDarkMode ? '#374151' : '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: isDarkMode ? 'rgba(110, 231, 183, 1)' : 'rgba(5, 150, 105, 1)',
        pointHoverBorderColor: isDarkMode ? '#1f2937' : '#ffffff',
        pointHoverBorderWidth: 4,
        segment: {
          borderColor: (ctx: any) => {
            const currentValue = ctx.p1.parsed.y;
            const previousValue = ctx.p0.parsed.y;
            if (currentValue > previousValue) {
              return isDarkMode ? 'rgba(52, 211, 153, 1)' : 'rgba(16, 185, 129, 1)';
            }
            return isDarkMode ? 'rgba(248, 113, 113, 1)' : 'rgba(239, 68, 68, 1)';
          },
        },
      },
    ],
  };

  const getChartOptions = (isBarChart = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          color: textColor,
          font: {
            size: 13,
            weight: 600,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: isBarChart ? 'rect' : 'circle',
        },
      },
      tooltip: {
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: tooltipBorderColor,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (context: any) => {
            return `${context[0].label}`;
          },
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}${isBarChart ? '時間' : '回'}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: 500,
          },
          padding: 8,
        },
        grid: {
          color: gridColor,
          lineWidth: 1,
          drawOnChartArea: true,
          drawTicks: true,
        },
        border: {
          color: gridColor,
          width: 2,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: 500,
          },
          padding: 8,
          callback: function(value: any) {
            return isBarChart ? `${value}h` : `${value}回`;
          },
        },
        grid: {
          color: gridColor,
          lineWidth: 1,
          drawOnChartArea: true,
          drawTicks: false,
        },
        border: {
          color: gridColor,
          width: 2,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart' as const,
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
      line: {
        borderJoinStyle: 'round' as const,
        borderCapStyle: 'round' as const,
      },
      point: {
        hoverBorderWidth: 4,
      },
    },
  });

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
        <div className="h-80">
          <Bar data={barChartData} options={getChartOptions(true)} />
        </div>
      </div>

      {/* 学習回数グラフ */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          月別学習回数
        </h3>
        <div className="h-80">
          <Line data={lineChartData} options={getChartOptions(false)} />
        </div>
      </div>
    </div>
  );
}