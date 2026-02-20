import type { Job } from "bullmq";
import { executeWorkflow } from "../../lib/automation/engine";

type AutomationJobData = {
  workflowId: string;
  executionId: string;
  organizationId: string;
  triggerData?: Record<string, unknown>;
};

export async function processAutomationJob(job: Job<AutomationJobData>) {
  console.log(`Processing automation: workflow=${job.data.workflowId}, execution=${job.data.executionId}`);
  await executeWorkflow(job.data.executionId);
}
