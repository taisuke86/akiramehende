// IPA試験マスタデータ

export type ExamType = {
  code: string;
  name: string;
  shortName: string;
  level: 'basic' | 'advanced' | 'expert';
  minHours: number;
  maxHours: number;
  recommendedHours: number;
  description: string;
  examTimes: string; // 年2回、年1回など
};

export const IPA_EXAMS: ExamType[] = [
  {
    code: 'IP',
    name: 'ITパスポート試験',
    shortName: 'ITパスポート',
    level: 'basic',
    minHours: 100,
    maxHours: 150,
    recommendedHours: 120,
    description: 'ITの基礎知識を問う国家試験',
    examTimes: '年間を通じて実施',
  },
  {
    code: 'FE',
    name: '基本情報技術者試験',
    shortName: '基本情報',
    level: 'basic',
    minHours: 200,
    maxHours: 300,
    recommendedHours: 250,
    description: 'ITエンジニアの登竜門',
    examTimes: '年2回（春期・秋期）',
  },
  {
    code: 'AP',
    name: '応用情報技術者試験',
    shortName: '応用情報',
    level: 'advanced',
    minHours: 300,
    maxHours: 500,
    recommendedHours: 400,
    description: 'ワンランク上のITエンジニアを目指す',
    examTimes: '年2回（春期・秋期）',
  },
  {
    code: 'SC',
    name: '情報処理安全確保支援士試験',
    shortName: '情報処理安全確保支援士',
    level: 'expert',
    minHours: 500,
    maxHours: 700,
    recommendedHours: 600,
    description: 'サイバーセキュリティ分野の国家資格',
    examTimes: '年2回（春期・秋期）',
  },
  {
    code: 'SA',
    name: 'システムアーキテクト試験',
    shortName: 'システムアーキテクト',
    level: 'expert',
    minHours: 600,
    maxHours: 800,
    recommendedHours: 700,
    description: 'システム設計・アーキテクチャの専門家',
    examTimes: '年1回（秋期）',
  },
  {
    code: 'PM',
    name: 'プロジェクトマネージャ試験',
    shortName: 'プロジェクトマネージャ',
    level: 'expert',
    minHours: 500,
    maxHours: 700,
    recommendedHours: 600,
    description: 'プロジェクト管理の専門家',
    examTimes: '年1回（春期）',
  },
  {
    code: 'DB',
    name: 'データベーススペシャリスト試験',
    shortName: 'データベーススペシャリスト',
    level: 'expert',
    minHours: 500,
    maxHours: 700,
    recommendedHours: 600,
    description: 'データベース分野の専門家',
    examTimes: '年1回（春期）',
  },
  {
    code: 'NW',
    name: 'ネットワークスペシャリスト試験',
    shortName: 'ネットワークスペシャリスト',
    level: 'expert',
    minHours: 500,
    maxHours: 700,
    recommendedHours: 600,
    description: 'ネットワーク分野の専門家',
    examTimes: '年1回（秋期）',
  },
];

export const getExamByCode = (code: string): ExamType | undefined => {
  return IPA_EXAMS.find(exam => exam.code === code);
};

export const getExamsByLevel = (level: ExamType['level']): ExamType[] => {
  return IPA_EXAMS.filter(exam => exam.level === level);
};

export const getLevelLabel = (level: ExamType['level']): string => {
  switch (level) {
    case 'basic':
      return '基本レベル';
    case 'advanced':
      return '応用レベル';
    case 'expert':
      return '高度レベル';
    default:
      return '';
  }
};

export const getLevelColor = (level: ExamType['level']): string => {
  switch (level) {
    case 'basic':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'advanced':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'expert':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};