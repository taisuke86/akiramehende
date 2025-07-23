/**
 * 日本時間（JST）での日付処理ユーティリティ
 */

/**
 * 日付を日本時間で表示用にフォーマット
 */
export function formatDateJST(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

/**
 * 日付と時刻を日本時間で表示用にフォーマット
 */
export function formatDateTimeJST(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * 現在の日本時間を取得（ISO文字列で返す）
 */
export function getCurrentJSTDate(): Date {
  // ブラウザの現在時刻をJSTとして扱う
  const now = new Date();
  
  // JSTタイムゾーンでの現在時刻を取得
  const jstTime = new Date(now.toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" }));
  
  return jstTime;
}

/**
 * 日付入力値を日本時間として解釈してUTCに変換
 */
export function convertJSTDateToUTC(dateString: string): Date {
  // YYYY-MM-DD形式の文字列を日本時間として解釈
  const jstDate = new Date(dateString + 'T00:00:00+09:00');
  return jstDate;
}

/**
 * UTCの日付を日本時間でのYYYY-MM-DD形式の文字列に変換（input[type="date"]用）
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // 日本時間でのYYYY-MM-DD形式を取得
  const jstFormatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = jstFormatter.formatToParts(dateObj);
  const year = parts.find(part => part.type === 'year')?.value;
  const month = parts.find(part => part.type === 'month')?.value;
  const day = parts.find(part => part.type === 'day')?.value;
  
  return `${year}-${month}-${day}`;
}