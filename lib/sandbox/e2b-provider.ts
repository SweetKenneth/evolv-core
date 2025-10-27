// lib/sandbox/e2b-provider.ts
import { SandboxProvider, SandboxProviderConfig, SandboxInfo, CommandResult } from "./types";

export class E2BProvider extends SandboxProvider {
  private sandboxId: string | null = null;

  constructor(config: SandboxProviderConfig) {
    super(config);
    console.warn("[E2BProvider] Stub active — no real sandbox actions are happening.");
  }

  async createSandbox(): Promise<SandboxInfo> {
    this.sandboxId = "fake-sandbox-id";
    this.sandboxInfo = {
      sandboxId: this.sandboxId,
      url: `https://sandbox.fake/${this.sandboxId}`,
      provider: "e2b",
      createdAt: new Date(),
    };
    return this.sandboxInfo;
  }

  async runCommand(command: string): Promise<CommandResult> {
    console.warn(`[E2BProvider] runCommand("${command}") — stubbed`);
    return {
      stdout: `Executed: ${command}`,
      stderr: "",
      exitCode: 0,
      success: true,
    };
  }

  async writeFile(path: string, content: string): Promise<void> {
    console.warn(`[E2BProvider] writeFile("${path}") — stubbed`);
  }

  async readFile(path: string): Promise<string> {
    console.warn(`[E2BProvider] readFile("${path}") — stubbed`);
    return "fake file content";
  }

  async listFiles(directory?: string): Promise<string[]> {
    console.warn(`[E2BProvider] listFiles("${directory || "/"}") — stubbed`);
    return ["index.ts", "package.json"];
  }

  async installPackages(packages: string[]): Promise<CommandResult> {
    console.warn(`[E2BProvider] installPackages(${packages.join(", ")}) — stubbed`);
    return {
      stdout: `Installed packages: ${packages.join(", ")}`,
      stderr: "",
      exitCode: 0,
      success: true,
    };
  }

  getSandboxUrl(): string | null {
    return this.sandboxInfo?.url || null;
  }

  getSandboxInfo(): SandboxInfo | null {
    return this.sandboxInfo;
  }

  async terminate(): Promise<void> {
    console.warn(`[E2BProvider] terminate() — stubbed`);
    this.sandboxId = null;
    this.sandboxInfo = null;
  }

  isAlive(): boolean {
    return this.sandboxId !== null;
  }

  // Optional methods
  async setupViteApp(): Promise<void> {
    console.warn("[E2BProvider] setupViteApp — not implemented");
  }

  async restartViteServer(): Promise<void> {
    console.warn("[E2BProvider] restartViteServer — not implemented");
  }
}
