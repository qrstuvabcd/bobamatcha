export function logCronEvent(event: string, metadata?: any) {
  console.log(`[MONITOR] ${event}`, {
    timestamp: new Date().toISOString(),
    env: process.env.VERCEL_ENV || 'development',
    ...metadata,
  });
  
  // 生產環境：發送自定義指標（預留擴展位）
  if (process.env.VERCEL_ENV === 'production') {
    // 這裡可以接入 Sentry, Logtail 或 Datadog
    // Example:
    // Sentry.captureMessage(`Cron Event: ${event}`, { extra: metadata });
  }
}
