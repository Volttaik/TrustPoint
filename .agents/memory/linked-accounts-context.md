---
name: Linked account context pattern
description: How the dual-bank account feature should route balance/accountNumber data across screens
---

## Rule
Wherever balance or account number is displayed (BalanceShield, Transfer "paying from", More screen account card), the source must be the **active linked account**, not `user`.

```ts
const activeAccount   = linkedAccounts.find((a) => a.id === activeAccountId);
const activeBalance   = activeAccount?.balance      ?? user?.balance  ?? 0;
const activeAccountNum = activeAccount?.accountNumber ?? user?.accountNumber;
```

**Why:** `user` is the TrustPoint account singleton; `linkedAccounts` contains all accounts including TrustPoint (id: "tp-default") plus any external banks the user added. When the user switches to a different bank, `user` still holds TrustPoint data, so reading from it produces stale/wrong balance and account number.

**How to apply:** Any screen that shows account balance, account number, or "paying from" data should destructure `linkedAccounts` and `activeAccountId` from `useApp()` and compute the active account object before passing values to child components.

## Key constants/banks.ts pattern
`getBankInfo(name)` does a case-insensitive lookup; falls back to a generic colored-initial entry if the bank name is not in NIGERIAN_BANKS. Always use this instead of manual string comparisons when deciding which bank logo to show.

## Seeding on registration
`buildDefaultLinkedAccounts(apiUser, preferredBank)` creates the initial array with TrustPoint as [0] and the preferredBank as [1] (if different from TrustPoint). This is called in both `registerUser()` and on first-load from AsyncStorage (when `@tp_linked_accounts` is absent).
