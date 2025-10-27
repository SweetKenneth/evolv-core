import { E2BProvider } from "./e2b-provider"; // adjust path if needed

export function sandboxFactory(selectedProvider: string, config?: any) {
  switch (selectedProvider) {
    case "e2b":
      return new E2BProvider(config || {});
    default:
      throw new Error(
        `Unknown sandbox provider: ${selectedProvider}. Supported provider: e2b`
      );
  }
}
