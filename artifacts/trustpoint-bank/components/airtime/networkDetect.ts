export type NetworkId = "mtn" | "airtel" | "glo" | "9mobile";

export interface Network {
  id: NetworkId;
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const NETWORKS: Record<NetworkId, Network> = {
  mtn: {
    id: "mtn",
    name: "MTN",
    color: "#FFC300",
    bgColor: "#1A1500",
    textColor: "#000000",
  },
  airtel: {
    id: "airtel",
    name: "Airtel",
    color: "#E63946",
    bgColor: "#1A0003",
    textColor: "#FFFFFF",
  },
  glo: {
    id: "glo",
    name: "Glo",
    color: "#00B140",
    bgColor: "#001A08",
    textColor: "#FFFFFF",
  },
  "9mobile": {
    id: "9mobile",
    name: "9mobile",
    color: "#00A550",
    bgColor: "#001A0D",
    textColor: "#FFFFFF",
  },
};

const PREFIX_MAP: Record<string, NetworkId> = {
  "0703": "mtn",  "0706": "mtn",  "0803": "mtn",  "0806": "mtn",
  "0810": "mtn",  "0813": "mtn",  "0814": "mtn",  "0816": "mtn",
  "0903": "mtn",  "0906": "mtn",  "0913": "mtn",  "0916": "mtn",
  "0702": "mtn",  "0704": "mtn",
  "0701": "airtel","0708": "airtel","0802": "airtel","0808": "airtel",
  "0812": "airtel","0901": "airtel","0902": "airtel","0904": "airtel",
  "0907": "airtel","0912": "airtel","0911": "airtel",
  "0705": "glo",  "0805": "glo",  "0807": "glo",  "0811": "glo",
  "0815": "glo",  "0905": "glo",  "0915": "glo",
  "0809": "9mobile","0817": "9mobile","0818": "9mobile",
  "0908": "9mobile","0909": "9mobile",
};

export function detectNetwork(phone: string): NetworkId | null {
  const clean = phone.replace(/\D/g, "");
  let prefix = "";
  if (clean.startsWith("0") && clean.length >= 4) {
    prefix = clean.slice(0, 4);
  } else if (clean.startsWith("234") && clean.length >= 6) {
    prefix = "0" + clean.slice(3, 6);
  } else {
    return null;
  }
  return PREFIX_MAP[prefix] ?? null;
}

export const NETWORK_LIST: Network[] = Object.values(NETWORKS);
