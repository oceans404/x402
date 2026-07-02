---
'@x402/stellar': minor
---

Add `registerExactStellarScheme()` convenience export to `@x402/stellar/exact/server` and `@x402/stellar/exact/client`, mirroring `@x402/evm`'s `registerExactEvmScheme()`. Previously, integrating Stellar required callers to know the `stellar:*` CAIP-2 wildcard and call the resource server/client's `.register()` method directly, unlike EVM which hides this behind a one-line wrapper.
