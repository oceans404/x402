import { x402ResourceServer } from "@x402/core/server";
import { Network } from "@x402/core/types";
import { ExactStellarScheme } from "./scheme";
import { STELLAR_WILDCARD_CAIP2 } from "../../constants";

/**
 * Configuration options for registering Stellar schemes to an x402ResourceServer
 */
export interface StellarResourceServerConfig {
  /**
   * Optional specific networks to register
   * If not provided, registers wildcard support (stellar:*)
   */
  networks?: Network[];
}

/**
 * Registers the Stellar exact payment scheme to an x402ResourceServer instance.
 *
 * @param server - The x402ResourceServer instance to register schemes to
 * @param config - Configuration for Stellar resource server registration
 * @returns The server instance for chaining
 *
 * @example
 * ```typescript
 * import { registerExactStellarScheme } from "@x402/stellar/exact/server";
 * import { x402ResourceServer } from "@x402/core/server";
 *
 * const server = new x402ResourceServer(facilitatorClient);
 * registerExactStellarScheme(server);
 * ```
 */
export function registerExactStellarScheme(
  server: x402ResourceServer,
  config: StellarResourceServerConfig = {},
): x402ResourceServer {
  if (config.networks && config.networks.length > 0) {
    config.networks.forEach(network => {
      server.register(network, new ExactStellarScheme());
    });
  } else {
    server.register(STELLAR_WILDCARD_CAIP2, new ExactStellarScheme());
  }

  return server;
}
