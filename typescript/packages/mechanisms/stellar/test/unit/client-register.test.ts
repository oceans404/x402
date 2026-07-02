import { describe, it, expect, vi } from "vitest";
import { STELLAR_WILDCARD_CAIP2 } from "../../src/constants";
import { registerExactStellarScheme } from "../../src/exact/client/register";
import { ExactStellarScheme } from "../../src/exact/client/scheme";
import type { ClientStellarSigner } from "../../src/signer";
import type { x402Client, PaymentPolicy } from "@x402/core/client";

const mockSigner: ClientStellarSigner = {
  address: "GBBO4ZDDZTSM2IUKQYBAST3CFHNPFXECGEFTGWTA2WELR2BIWDK57UVE",
  signAuthEntry: vi.fn(),
};

describe("registerExactStellarScheme (client)", () => {
  it("registers the wildcard network when no networks are provided", () => {
    const register = vi.fn();
    const registerPolicy = vi.fn();
    const client = { register, registerPolicy } as unknown as x402Client;

    const result = registerExactStellarScheme(client, { signer: mockSigner });

    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith(STELLAR_WILDCARD_CAIP2, expect.any(ExactStellarScheme));
    expect(registerPolicy).not.toHaveBeenCalled();
    expect(result).toBe(client);
  });

  it("registers each provided network instead of the wildcard, reusing one scheme instance", () => {
    const register = vi.fn();
    const client = { register, registerPolicy: vi.fn() } as unknown as x402Client;

    registerExactStellarScheme(client, {
      signer: mockSigner,
      networks: ["stellar:pubnet", "stellar:testnet"],
    });

    expect(register).toHaveBeenCalledTimes(2);
    const [firstNetwork, firstScheme] = register.mock.calls[0];
    const [secondNetwork, secondScheme] = register.mock.calls[1];
    expect(firstNetwork).toBe("stellar:pubnet");
    expect(secondNetwork).toBe("stellar:testnet");
    expect(firstScheme).toBeInstanceOf(ExactStellarScheme);
    expect(firstScheme).toBe(secondScheme);
  });

  it("forwards rpcConfig to the underlying scheme", () => {
    const register = vi.fn();
    const client = { register, registerPolicy: vi.fn() } as unknown as x402Client;

    registerExactStellarScheme(client, {
      signer: mockSigner,
      rpcConfig: { url: "https://custom-rpc.example.com" },
    });

    const [, scheme] = register.mock.calls[0];
    expect(scheme).toEqual(
      expect.objectContaining({
        signer: mockSigner,
        rpcConfig: { url: "https://custom-rpc.example.com" },
      }),
    );
  });

  it("registers provided policies", () => {
    const registerPolicy = vi.fn();
    const client = { register: vi.fn(), registerPolicy } as unknown as x402Client;
    const policyA = vi.fn() as unknown as PaymentPolicy;
    const policyB = vi.fn() as unknown as PaymentPolicy;

    registerExactStellarScheme(client, { signer: mockSigner, policies: [policyA, policyB] });

    expect(registerPolicy).toHaveBeenCalledTimes(2);
    expect(registerPolicy).toHaveBeenNthCalledWith(1, policyA);
    expect(registerPolicy).toHaveBeenNthCalledWith(2, policyB);
  });
});
