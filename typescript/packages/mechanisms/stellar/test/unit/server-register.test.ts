import { describe, it, expect, vi } from "vitest";
import { STELLAR_WILDCARD_CAIP2 } from "../../src/constants";
import { registerExactStellarScheme } from "../../src/exact/server/register";
import { ExactStellarScheme } from "../../src/exact/server/scheme";
import type { x402ResourceServer } from "@x402/core/server";

describe("registerExactStellarScheme (server)", () => {
  it("registers the wildcard network when no networks are provided", () => {
    const register = vi.fn();
    const server = { register } as unknown as x402ResourceServer;

    const result = registerExactStellarScheme(server);

    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith(STELLAR_WILDCARD_CAIP2, expect.any(ExactStellarScheme));
    expect(result).toBe(server);
  });

  it("registers each provided network instead of the wildcard", () => {
    const register = vi.fn();
    const server = { register } as unknown as x402ResourceServer;

    registerExactStellarScheme(server, { networks: ["stellar:pubnet", "stellar:testnet"] });

    expect(register).toHaveBeenCalledTimes(2);
    expect(register).toHaveBeenNthCalledWith(1, "stellar:pubnet", expect.any(ExactStellarScheme));
    expect(register).toHaveBeenNthCalledWith(2, "stellar:testnet", expect.any(ExactStellarScheme));
  });
});
