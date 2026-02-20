import type { Job } from "bullmq";
import { sendEmail } from "../../lib/email";

type EmailJobData = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export async function processEmailJob(job: Job<EmailJobData>) {
  console.log(`Sending email to: ${job.data.to}, subject: ${job.data.subject}`);
  await sendEmail(job.data);
}
