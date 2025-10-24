import type { AgentFn, AgentContext, AgentOutput, MCPLog } from '@/types/agent';

/**
 * MCP Toolkit - Model Context Protocol for Agent Management
 * Provides registration, invocation, and logging for multi-agent systems
 */

const agents: Record<string, AgentFn> = {};
const logs: MCPLog[] = [];

/**
 * Register an agent function
 */
export function registerAgent(name: string, fn: AgentFn): void {
  if (agents[name]) {
    console.warn(`[MCP] Agent ${name} is being overwritten`);
  }
  agents[name] = fn;
  console.log(`[MCP] Agent ${name} registered successfully`);
}

/**
 * Invoke a registered agent
 */
export async function invokeAgent(
  name: string,
  context: AgentContext
): Promise<AgentOutput> {
  if (!agents[name]) {
    throw new Error(`[MCP] Agent ${name} not registered`);
  }

  const startTime = new Date();
  console.log(`[MCP] Invoking ${name}`, { query: context.query });

  try {
    const result = await agents[name](context);

    // Log successful invocation
    const log: MCPLog = {
      agentName: name,
      action: 'invoke',
      context: {
        query: context.query,
        documentsCount: context.documents?.length || 0,
      },
      result: {
        success: true,
        citationsCount: result.citations?.length || 0,
      },
      timestamp: new Date().toISOString(),
    };
    logs.push(log);

    const duration = Date.now() - startTime.getTime();
    console.log(`[MCP] Agent ${name} completed in ${duration}ms`);

    return result;
  } catch (error) {
    // Log failed invocation
    const log: MCPLog = {
      agentName: name,
      action: 'invoke',
      context: {
        query: context.query,
      },
      result: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      timestamp: new Date().toISOString(),
    };
    logs.push(log);

    console.error(`[MCP] Agent ${name} failed:`, error);
    throw error;
  }
}

/**
 * Get all registered agents
 */
export function getRegisteredAgents(): string[] {
  return Object.keys(agents);
}

/**
 * Get agent logs
 */
export function getAgentLogs(agentName?: string): MCPLog[] {
  if (agentName) {
    return logs.filter(log => log.agentName === agentName);
  }
  return logs;
}

/**
 * Clear agent logs
 */
export function clearLogs(): void {
  logs.length = 0;
  console.log('[MCP] Logs cleared');
}

/**
 * Get agent execution stats
 */
export function getAgentStats() {
  const stats: Record<string, { total: number; success: number; failed: number }> = {};

  logs.forEach(log => {
    if (!stats[log.agentName]) {
      stats[log.agentName] = { total: 0, success: 0, failed: 0 };
    }
    stats[log.agentName].total++;
    if (log.result.success) {
      stats[log.agentName].success++;
    } else {
      stats[log.agentName].failed++;
    }
  });

  return stats;
}
