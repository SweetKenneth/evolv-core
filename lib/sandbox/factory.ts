// lib/sandbox/factory.ts
import { SandboxProviderConfig, SandboxProvider } from "./types";
import { E2BProvider } from "./e2b-provider";

export class SandboxFactory {
  static create(config?: SandboxProviderConfig): SandboxProvider {
    const selectedProvider = process.env.SANDBOX_PROVIDER || "e2b";

    switch (selectedProvider) {
      case "e2b":
        return new E2BProvider(config || {});

      default:
        throw new Error(
          `[SandboxFactory] Unknown sandbox provider: ${selectedProvider}. Supported providers: e2b`
        );
    }
  }
}
