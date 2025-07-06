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

  // より強いコントラストを持つ色設定
  const textColor = isDarkMode ? '#ffffff' : '#1f2937';
  const gridColor = isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.4)';
  const tooltipBgColor = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipBorderColor = isDarkMode ? '#6b7280' : '#d1d5db';

  // 棒グラフ（学習時間）- モダンでクリーンなデザイン
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: '学習時間（時間）',
        data: durationData,
        backgroundColor: isDarkMode 
          ? 'rgba(99, 102, 241, 0.8)'
          : 'rgba(99, 102, 241, 0.9)',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: isDarkMode 
          ? 'rgba(129, 140, 248, 0.9)'
          : 'rgba(67, 56, 202, 1)',
        barThickness: 32,
        maxBarThickness: 40,
      },
    ],
  };

  // 折れ線グラフ（学習回数）- シンプルで一貫した色使い
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: '学習回数（回）',
        data: sessionData,
        borderColor: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(34, 197, 94, 1)',
        backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
        borderWidth: 4,
        fill: 'start',
        tension: 0.4,
        pointBackgroundColor: isDarkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(34, 197, 94, 1)',
        pointBorderColor: isDarkMode ? '#1f2937' : '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: isDarkMode ? 'rgba(74, 222, 128, 1)' : 'rgba(21, 128, 61, 1)',
        pointHoverBorderColor: isDarkMode ? '#1f2937' : '#ffffff',
        pointHoverBorderWidth: 3,
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
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 10,
        left: 10,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          color: textColor,
          font: {
            size: 14,
            weight: 600,
            family: 'system-ui, -apple-system, sans-serif',
          },
          padding: 24,
          usePointStyle: true,
          pointStyle: isBarChart ? 'rect' : 'circle',
          boxWidth: isBarChart ? 12 : 8,
          boxHeight: isBarChart ? 12 : 8,
        },
      },
      tooltip: {
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: tooltipBorderColor,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        displayColors: true,
        titleFont: {
          size: 15,
          weight: 600,
          family: 'system-ui, -apple-system, sans-serif',
        },
        bodyFont: {
          size: 14,
          family: 'system-ui, -apple-system, sans-serif',
        },
        callbacks: {
          title: (context: any) => {
            return `${context[0].label}`;
          },
          label: (context: any) => {
            const value = context.parsed.y;
            return `${value}${isBarChart ? '時間' : '回'}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: {
            size: 13,
            weight: 500,
            family: 'system-ui, -apple-system, sans-serif',
          },
          padding: 12,
          maxRotation: 0,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          font: {
            size: 13,
            weight: 500,
            family: 'system-ui, -apple-system, sans-serif',
          },
          padding: 12,
          callback: function(value: any) {
            return isBarChart ? `${value}h` : `${value}回`;
          },
          stepSize: isBarChart ? Math.ceil(Math.max(...durationData) / 5) : Math.ceil(Math.max(...sessionData) / 5),
        },
        grid: {
          color: gridColor,
          lineWidth: 1,
          drawOnChartArea: true,
          drawTicks: false,
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeInOutCubic' as const,
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
      line: {
        borderJoinStyle: 'round' as const,
        borderCapStyle: 'round' as const,
      },
      point: {
        hoverBorderWidth: 3,
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