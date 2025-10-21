interface LogEntry {
  level: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

// In-memory ring buffer for logs (last 200 entries)
const logBuffer: LogEntry[] = [];
const MAX_LOGS = 200;

export function addLog(entry: LogEntry): void {
  logBuffer.push(entry);
  
  // Keep only the last MAX_LOGS entries
  if (logBuffer.length > MAX_LOGS) {
    logBuffer.splice(0, logBuffer.length - MAX_LOGS);
  }
}

export function getLogs(level?: string, limit: number = 50): LogEntry[] {
  let filteredLogs = logBuffer;
  
  if (level) {
    filteredLogs = logBuffer.filter(log => log.level === level);
  }
  
  return filteredLogs.slice(-limit);
}

export function getLogStats(): { total: number; byLevel: Record<string, number> } {
  const byLevel: Record<string, number> = {};
  
  logBuffer.forEach(log => {
    byLevel[log.level] = (byLevel[log.level] || 0) + 1;
  });
  
  return {
    total: logBuffer.length,
    byLevel,
  };
}
