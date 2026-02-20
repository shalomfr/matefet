import type { Job } from "bullmq";
import { checkScheduledTasks } from "../../lib/automation/scheduler";

export async function processScheduledJob(job: Job) {
  console.log("Running scheduled task check...");
  const count = await checkScheduledTasks();
  console.log(`Processed ${count} scheduled tasks`);
}
