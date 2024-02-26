import { holidays, workingHours, workingHoursInTheYear } from './configuration';

export function todayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function copyTextToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Job data copied!');
  } catch (err) {
    console.error(`Error on copy job data to clipboard`, err);
  }
}

export function buildRow(jobTitle: string, jobLink: string, companyName: string, companyLink: string, salaryFrom: string, salaryTo: string, date: string) {
  return `${companyName}\t${companyLink}\t${jobTitle}\t${jobLink}\t${salaryFrom}\t${salaryTo}\t${date}`;
}

export function clearUrl(rawUrl: string) {
  const parsedUrl = new URL(rawUrl);
  return `${parsedUrl.origin}${parsedUrl.pathname}`.trim();
}

export function hourRateToYear(rate: number): string {
  return `=${rate}*(${workingHoursInTheYear}-${holidays}*${workingHours})`;
}