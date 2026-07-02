import { x402Client, PaymentPolicy } from "@x402/core/client";
import { Network } from "@x402/core/types";
import { ExactStellarScheme } from "./scheme";
import { STELLAR_WILDCARD_CAIP2 } from "../../constants";
import { ClientStellarSigner } from "../../signer";
import { RpcConfig } from "../../utils";

/**
 * Configuration options for registering Stellar schemes to an x402Client
 */
export interface StellarClientConfig {
  /**
   * The Stellar signer to use for creating payment payloads
   */
  signer: ClientStellarSigner;

  /**
   * Optional RPC configuration (e.g. a custom RPC URL)
   */
  rpcConfig?: RpcConfig;

  /**
   * Optional policies to apply to the client
   */
  policies?: PaymentPolicy[];

  /**
   * Optional specific networks to register.
   * If not provided, registers wildcard support (stellar:*).
   */
  networks?: Network[];
}

/**
 * Registers the Stellar exact payment scheme to an x402Client instance.
 *
 * @param client - The x402Client instance to register schemes to
 * @param config - Configuration for Stellar client registration
 * @returns The client instance for chaining
 *
 * @example
 * ```typescript
 * import { registerExactStellarScheme } from "@x402/stellar/exact/client";
 * import { x402Client } from "@x402/core/client";
 *
 * const client = new x402Client();
 * registerExactStellarScheme(client, { signer });
 * ```
 */
export function registerExactStellarScheme(
  client: x402Client,
  config: StellarClientConfig,
): x402Client {
  const stellarScheme = new ExactStellarScheme(config.signer, config.rpcConfig);

  if (config.networks && config.networks.length > 0) {
    config.networks.forEach(network => {
      client.register(network, stellarScheme);
    });
  } else {
    client.register(STELLAR_WILDCARD_CAIP2, stellarScheme);
  }

  if (config.policies) {
    config.policies.forEach(policy => {
      client.registerPolicy(policy);
    });
  }

  return client;
}
