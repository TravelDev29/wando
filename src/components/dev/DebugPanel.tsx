'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface LogEntry {
  level: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

interface LogStats {
  total: number;
  byLevel: Record<string, number>;
}

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats>({ total: 0, byLevel: {} });
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevel) params.set('level', selectedLevel);
      params.set('limit', '100');

      const response = await fetch(`/api/_logs?${params}`);
      const data = await response.json();

      setLogs(data.logs || []);
      setStats(data.stats || { total: 0, byLevel: {} });
    } catch (error) {
      logger.error('Failed to fetch logs', undefined, { error });
    } finally {
      setIsLoading(false);
    }
  }, [selectedLevel]);

  // Toggle panel with Ctrl+Shift+L
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch logs when panel opens or level changes
  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen, fetchLogs]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const createGitHubIssue = (log: LogEntry) => {
    const issueText = `## Bug Report

**Error Message:** ${log.message}

**Level:** ${log.level}
**Timestamp:** ${log.timestamp}
${log.requestId ? `**Request ID:** ${log.requestId}` : ''}

**Stack Trace:**
\`\`\`
${log.stack || 'No stack trace available'}
\`\`\`

**Context:**
\`\`\`json
${JSON.stringify(log.context, null, 2)}
\`\`\`

**Environment:**
- User Agent: ${navigator.userAgent}
- URL: ${window.location.href}
- Timestamp: ${new Date().toISOString()}
`;

    copyToClipboard(issueText);
  };

  const getLastError = () => {
    return logs.find(log => log.level === 'error');
  };

  const getLevelColor = (level: string) => {
    const colors = {
      debug: 'text-cyan-600',
      info: 'text-green-600',
      warn: 'text-yellow-600',
      error: 'text-red-600',
    };
    return colors[level as keyof typeof colors] || 'text-gray-600';
  };

  if (!isOpen) return null;

  const lastError = getLastError();

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Debug Panel</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Stats */}
        <div className="text-xs text-gray-600">
          Total: {stats.total} |
          {Object.entries(stats.byLevel).map(([level, count]) => (
            <span key={level} className="ml-2">
              {level}: {count}
            </span>
          ))}
        </div>

        {/* Level Filter */}
        <div>
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="">All Levels</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* Last Error */}
        {lastError && (
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <div className="text-xs font-medium text-red-800 mb-1">
              Last Error
            </div>
            <div className="text-xs text-red-700 mb-2">{lastError.message}</div>
            <div className="flex space-x-1">
              <button
                onClick={() =>
                  copyToClipboard(JSON.stringify(lastError, null, 2))
                }
                className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded"
              >
                Copy
              </button>
              <button
                onClick={() => createGitHubIssue(lastError)}
                className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
              >
                GitHub Issue
              </button>
            </div>
          </div>
        )}

        {/* Logs List */}
        <div className="max-h-48 overflow-y-auto">
          {logs
            .slice(-10)
            .reverse()
            .map((log, index) => (
              <div
                key={index}
                className="text-xs border-b border-gray-100 py-1"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${getLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-700 truncate">{log.message}</div>
                {log.requestId && (
                  <div className="text-gray-500">ID: {log.requestId}</div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
