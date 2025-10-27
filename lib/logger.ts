import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "scraper.log");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export function logEvent(event: string, data?: any) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${event}${data ? " | " + JSON.stringify(data) : ""}\n`;
  fs.appendFileSync(logFile, entry);
  console.log(entry);
}

export function logError(event: string, error: any) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ERROR: ${event} | ${error?.message || error}\n`;
  fs.appendFileSync(logFile, entry);
  console.error(entry);
}
