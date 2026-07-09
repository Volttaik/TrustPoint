/**
 * Master list of Nigerian banks with brand colors, initials, and logo metadata.
 * Banks with `hasLogo: true` have actual SVG/PNG assets in BankLogo.tsx.
 */

export interface BankInfo {
  name: string;
  color: string;
  initials: string;
  /** Whether BankLogo.tsx has a real graphical logo (not just initials fallback) */
  hasLogo: boolean;
}

export const NIGERIAN_BANKS: BankInfo[] = [
  { name: "Access Bank",       color: "#CC0000",  initials: "AB",  hasLogo: true  },
  { name: "GTBank",            color: "#D94F00",  initials: "GT",  hasLogo: true  },
  { name: "Zenith Bank",       color: "#004B9D",  initials: "ZB",  hasLogo: false },
  { name: "First Bank",        color: "#00A0DC",  initials: "FB",  hasLogo: false },
  { name: "UBA",               color: "#D42E12",  initials: "UB",  hasLogo: true  },
  { name: "Fidelity Bank",     color: "#0F4D95",  initials: "FD",  hasLogo: false },
  { name: "FCMB",              color: "#E11D33",  initials: "FC",  hasLogo: false },
  { name: "Union Bank",        color: "#003399",  initials: "UN",  hasLogo: false },
  { name: "Sterling Bank",     color: "#D71920",  initials: "ST",  hasLogo: false },
  { name: "Stanbic IBTC",      color: "#009BDE",  initials: "SI",  hasLogo: false },
  { name: "Wema Bank",         color: "#6B2082",  initials: "WB",  hasLogo: false },
  { name: "Polaris Bank",      color: "#A6192E",  initials: "PL",  hasLogo: false },
  { name: "Keystone Bank",     color: "#004F30",  initials: "KB",  hasLogo: false },
  { name: "Providus Bank",     color: "#006B3F",  initials: "PV",  hasLogo: false },
  { name: "Moniepoint",        color: "#0357EE",  initials: "MP",  hasLogo: true  },
  { name: "Opay",              color: "#09C99A",  initials: "OP",  hasLogo: true  },
  { name: "PalmPay",           color: "#04C97F",  initials: "PP",  hasLogo: false },
  { name: "Kuda Bank",         color: "#40196B",  initials: "KD",  hasLogo: false },
  { name: "PremiumTrust Bank", color: "#006B3F",  initials: "PT",  hasLogo: false },
  { name: "Lotus Bank",        color: "#009270",  initials: "LB",  hasLogo: false },
  { name: "Parallex Bank",     color: "#003D83",  initials: "PX",  hasLogo: false },
  { name: "Jaiz Bank",         color: "#009A44",  initials: "JB",  hasLogo: false },
  { name: "Ecobank",           color: "#0038A8",  initials: "EB",  hasLogo: false },
  { name: "Unity Bank",        color: "#00704A",  initials: "UY",  hasLogo: false },
  { name: "Titan Trust Bank",  color: "#E31E28",  initials: "TT",  hasLogo: false },
];

export const TRUSTPOINT_BANK: BankInfo = {
  name: "TrustPoint Bank",
  color: "#E11D33",
  initials: "TP",
  hasLogo: true,
};

/** Look up a bank by name (case-insensitive partial match) */
export function getBankInfo(name: string | undefined | null): BankInfo {
  if (!name) return TRUSTPOINT_BANK;
  const lower = name.toLowerCase();
  if (lower.includes("trustpoint")) return TRUSTPOINT_BANK;
  return (
    NIGERIAN_BANKS.find((b) => b.name.toLowerCase() === lower) ??
    NIGERIAN_BANKS.find((b) => lower.includes(b.name.toLowerCase().split(" ")[0])) ?? {
      name,
      color: "#666666",
      initials: name.slice(0, 2).toUpperCase(),
      hasLogo: false,
    }
  );
}
