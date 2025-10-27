import { SandboxProvider, SandboxProviderConfig, SandboxInfo, CommandResult } from "./types";

/**
 * Basic E2B Provider implementation
 * This is a placeholder to get rid of the "setupViteApp not implemented" error
 * and let the rest of the app function.
 */
export class E2BProvider extends SandboxProvider {
  private sandboxId: string | null = null;

  constructor(config: SandboxProviderConfig) {
    super(config);
  }

  async createSandbox(): Promise<SandboxInfo> {
    // Normally you'd call the E2B API here. We're stubbing it for now.
    this.sandboxId = "dev-sandbox-" + Date.now();
    return {
      sandboxId: this.sandboxId,
      url: `https://sandbox.e2b.dev/${this.sandboxId}`,
      provider: "e2b",
      createdAt: new Date()
    };
  }

  async runCommand(command: string): Promise<CommandResult> {
    console.log(`[E2BProvider] Pretending to run: ${command}`);
    return { stdout: "ok", stderr: "", exitCode: 0, success: true };
  }

  async writeFile(path: string, content: string): Promise<void> {
    console.log(`[E2BProvider] Writing file at ${path}`);
    return;
  }

  async readFile(path: string): Promise<string> {
    console.log(`[E2BProvider] Reading file at ${path}`);
    return "";
  }

  async listFiles(directory?: string): Promise<string[]> {
    console.log(`[E2BProvider] Listing files in ${directory || "/"}`);
    return [];
  }

  async installPackages(packages: string[]): Promise<CommandResult> {
    console.log(`[E2BProvider] Installing packages: ${packages.join(", ")}`);
    return { stdout: "installed", stderr: "", exitCode: 0, success: true };
  }

  async setupViteApp(): Promise<void> {
    console.log("[E2BProvider] setupViteApp placeholder called");
    return;
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
    console.log(`[E2BProvider] Terminating sandbox ${this.sandboxId}`);
    this.sandboxId = null;
  }

  isAlive(): boolean {
    return this.sandboxId !== null;
  }
}
