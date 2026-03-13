import type { ProviderAdapter } from "@vexus/sdk";
import type { ProviderType } from "@vexus/shared";

export class ProviderRegistry {
  private readonly providers = new Map<ProviderType, ProviderAdapter>();

  register(provider: ProviderAdapter): void {
    this.providers.set(provider.key, provider);
  }

  get(providerType: ProviderType): ProviderAdapter {
    const provider = this.providers.get(providerType);

    if (!provider) {
      throw new Error(`Provider ${providerType} is not registered.`);
    }

    return provider;
  }

  list(): ProviderAdapter[] {
    return [...this.providers.values()];
  }
}
