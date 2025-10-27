// lib/sandbox/e2b-provider.ts
import { SandboxProvider, SandboxInfo, CommandResult } from "./types";

export class E2BProvider extends SandboxProvider {
  private sandboxId: string | null = null;

  constructor(config: any) {
    super(config);
    console.warn("[E2BProvider] Stub active — real E2B API not connected yet");
  }

  async createSandbox(): Promise<SandboxInfo> {
    this.sandboxId = "fake-sandbox-" + Date.now();
    return {
      sandboxId: this.sandboxId,
      url: `https://sandbox.e2b.dev/${this.sandboxId}`,
      provider: "e2b",
      createdAt: new Date()
    };
  }

  async runCommand(command: string): Promise<CommandResult> {
    console.warn(`[E2BProvider] runCommand called: ${command}`);
    return { stdout: "ok", stderr: "", exitCode: 0, success: true };
  }

  async writeFile(path: string, content: string): Promise<void> {
    console.warn(`[E2BProvider] writeFile called: ${path}`);
  }

  async readFile(path: string): Promise<string> {
    console.warn(`[E2BProvider] readFile called: ${path}`);
    return "";
  }

  async listFiles(directory?: string): Promise<string[]> {
    console.warn(`[E2BProvider] listFiles called: ${directory}`);
    return [];
  }

  async installPackages(packages: string[]): Promise<CommandResult> {
    console.warn(`[E2BProvider] installPackages called: ${packages.join(", ")}`);
    return { stdout: "installed", stderr: "", exitCode: 0, success: true };
  }

  getSandboxUrl(): string | null {
    return this.sandboxId ? `https://sandbox.e2b.dev/${this.sandboxId}` : null;
  }

  getSandboxInfo(): SandboxInfo | null {
    return this.sandboxId
      ? {
          sandboxId: this.sandboxId,
          url: `https://sandbox.e2b.dev/${this.sandboxId}`,
          provider: "e2b",
          createdAt: new Date()
        }
      : null;
  }

  async terminate(): Promise<void> {
    console.warn("[E2BProvider] terminate called");
    this.sandboxId = null;
  }

  isAlive(): boolean {
    return !!this.sandboxId;
  }
}
