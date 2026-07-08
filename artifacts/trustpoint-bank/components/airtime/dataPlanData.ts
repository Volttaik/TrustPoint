import type { NetworkId } from "./networkDetect";

export type PlanCategory =
  | "hot-deals"
  | "daily"
  | "weekly"
  | "monthly"
  | "sme"
  | "social"
  | "night"
  | "broadband";

export interface DataPlan {
  id: string;
  size: string;
  price: number;
  validity: string;
  description: string;
  cashback?: number;
  bonus?: string;
  popular?: boolean;
}

export const PLAN_CATEGORIES: { id: PlanCategory; label: string }[] = [
  { id: "hot-deals",  label: "Hot Deals"  },
  { id: "daily",      label: "Daily"      },
  { id: "weekly",     label: "Weekly"     },
  { id: "monthly",    label: "Monthly"    },
  { id: "sme",        label: "SME"        },
  { id: "social",     label: "Social"     },
  { id: "night",      label: "Night"      },
  { id: "broadband",  label: "Broadband"  },
];

const mtnPlans: Record<PlanCategory, DataPlan[]> = {
  "hot-deals": [
    { id: "m-hd-1", size: "110MB",  price: 100,  validity: "1 Day",     description: "110MB Daily Plan",    cashback: 2  },
    { id: "m-hd-2", size: "230MB",  price: 200,  validity: "1 Day",     description: "230MB Daily Plan",    cashback: 4  },
    { id: "m-hd-3", size: "500MB",  price: 350,  validity: "1 Day",     description: "500MB Daily Plan",    cashback: 7  },
    { id: "m-hd-4", size: "500MB",  price: 500,  validity: "7 Days",    description: "500MB Weekly Plan",   cashback: 10 },
    { id: "m-hd-5", size: "1GB",    price: 1000, validity: "30 Days",   description: "1GB Monthly Plan",    cashback: 10, popular: true },
    { id: "m-hd-6", size: "1GB",    price: 1200, validity: "30 Days",   description: "1GB Special Plan",   cashback: 16 },
  ],
  daily: [
    { id: "m-d-1", size: "50MB",   price: 50,  validity: "1 Day", description: "50MB Daily" },
    { id: "m-d-2", size: "150MB",  price: 100, validity: "1 Day", description: "150MB Daily" },
    { id: "m-d-3", size: "500MB",  price: 200, validity: "1 Day", description: "500MB Daily" },
    { id: "m-d-4", size: "1GB",    price: 350, validity: "1 Day", description: "1GB Daily", popular: true },
  ],
  weekly: [
    { id: "m-w-1", size: "500MB",  price: 200,  validity: "7 Days", description: "500MB Weekly" },
    { id: "m-w-2", size: "1.5GB",  price: 500,  validity: "7 Days", description: "1.5GB Weekly" },
    { id: "m-w-3", size: "3GB",    price: 750,  validity: "7 Days", description: "3GB Weekly", popular: true },
    { id: "m-w-4", size: "4.5GB",  price: 1000, validity: "7 Days", description: "4.5GB Weekly" },
  ],
  monthly: [
    { id: "m-m-1", size: "2GB",   price: 1000,  validity: "30 Days", description: "2GB Monthly" },
    { id: "m-m-2", size: "5GB",   price: 2000,  validity: "30 Days", description: "5GB Monthly", popular: true },
    { id: "m-m-3", size: "10GB",  price: 3500,  validity: "30 Days", description: "10GB Monthly" },
    { id: "m-m-4", size: "20GB",  price: 6000,  validity: "30 Days", description: "20GB Monthly" },
    { id: "m-m-5", size: "50GB",  price: 12000, validity: "30 Days", description: "50GB Monthly" },
  ],
  sme: [
    { id: "m-sme-1", size: "1GB",  price: 700,  validity: "30 Days", description: "SME 1GB" },
    { id: "m-sme-2", size: "2GB",  price: 1300, validity: "30 Days", description: "SME 2GB", popular: true },
    { id: "m-sme-3", size: "5GB",  price: 3000, validity: "30 Days", description: "SME 5GB" },
    { id: "m-sme-4", size: "10GB", price: 5000, validity: "30 Days", description: "SME 10GB" },
  ],
  social: [
    { id: "m-soc-1", size: "200MB", price: 100, validity: "7 Days",  description: "WhatsApp & Instagram", bonus: "WhatsApp" },
    { id: "m-soc-2", size: "500MB", price: 200, validity: "14 Days", description: "All Social Apps",     bonus: "All Social" },
    { id: "m-soc-3", size: "1GB",   price: 350, validity: "30 Days", description: "Social Bundle",       bonus: "All Social" },
  ],
  night: [
    { id: "m-n-1", size: "1GB",   price: 200, validity: "12am–5am", description: "Night Plan (1 night)" },
    { id: "m-n-2", size: "2.5GB", price: 500, validity: "12am–5am", description: "Night Plan (1 night)" },
  ],
  broadband: [
    { id: "m-bb-1", size: "30GB",  price: 8000,  validity: "30 Days", description: "Broadband Plan" },
    { id: "m-bb-2", size: "60GB",  price: 15000, validity: "30 Days", description: "Broadband Plan", popular: true },
    { id: "m-bb-3", size: "100GB", price: 20000, validity: "30 Days", description: "Broadband Plan" },
  ],
};

const airtelPlans: Record<PlanCategory, DataPlan[]> = {
  "hot-deals": [
    { id: "a-hd-1", size: "200MB",  price: 200,  validity: "1 Day",   description: "200MB Daily",      cashback: 4, popular: true },
    { id: "a-hd-2", size: "1GB",    price: 500,  validity: "7 Days",  description: "1GB Weekly",       cashback: 8  },
    { id: "a-hd-3", size: "1.5GB",  price: 1000, validity: "30 Days", description: "1.5GB Monthly",    cashback: 12 },
    { id: "a-hd-4", size: "3GB",    price: 1500, validity: "30 Days", description: "3GB Monthly",      cashback: 15 },
  ],
  daily:     [
    { id: "a-d-1", size: "100MB",  price: 100, validity: "1 Day", description: "100MB Daily" },
    { id: "a-d-2", size: "500MB",  price: 200, validity: "1 Day", description: "500MB Daily", popular: true },
    { id: "a-d-3", size: "1GB",    price: 300, validity: "1 Day", description: "1GB Daily" },
  ],
  weekly:    [
    { id: "a-w-1", size: "1.5GB",  price: 350,  validity: "7 Days", description: "1.5GB Weekly" },
    { id: "a-w-2", size: "3GB",    price: 600,  validity: "7 Days", description: "3GB Weekly", popular: true },
  ],
  monthly:   [
    { id: "a-m-1", size: "3GB",   price: 1000, validity: "30 Days", description: "3GB Monthly" },
    { id: "a-m-2", size: "6GB",   price: 1500, validity: "30 Days", description: "6GB Monthly", popular: true },
    { id: "a-m-3", size: "10GB",  price: 2500, validity: "30 Days", description: "10GB Monthly" },
    { id: "a-m-4", size: "15GB",  price: 3500, validity: "30 Days", description: "15GB Monthly" },
  ],
  sme:       [
    { id: "a-sme-1", size: "2GB",  price: 1200, validity: "30 Days", description: "SME 2GB", popular: true },
    { id: "a-sme-2", size: "5GB",  price: 2500, validity: "30 Days", description: "SME 5GB" },
  ],
  social:    [
    { id: "a-soc-1", size: "300MB", price: 150, validity: "14 Days", description: "Social Bundle", bonus: "All Social" },
  ],
  night:     [
    { id: "a-n-1", size: "1.5GB",  price: 300, validity: "12am–5am", description: "Night Plan" },
  ],
  broadband: [
    { id: "a-bb-1", size: "40GB",  price: 10000, validity: "30 Days", description: "Broadband Plan" },
    { id: "a-bb-2", size: "75GB",  price: 18000, validity: "30 Days", description: "Broadband Plan", popular: true },
  ],
};

const gloPlans: Record<PlanCategory, DataPlan[]> = {
  "hot-deals": [
    { id: "g-hd-1", size: "500MB",  price: 100,  validity: "1 Day",   description: "500MB Daily",   cashback: 5, popular: true },
    { id: "g-hd-2", size: "1.5GB",  price: 250,  validity: "7 Days",  description: "1.5GB Weekly",  cashback: 8  },
    { id: "g-hd-3", size: "3.6GB",  price: 500,  validity: "30 Days", description: "3.6GB Monthly", cashback: 10 },
    { id: "g-hd-4", size: "7.5GB",  price: 1000, validity: "30 Days", description: "7.5GB Monthly", cashback: 15 },
  ],
  daily:     [
    { id: "g-d-1", size: "200MB",  price: 50,  validity: "1 Day", description: "200MB Daily" },
    { id: "g-d-2", size: "500MB",  price: 100, validity: "1 Day", description: "500MB Daily", popular: true },
    { id: "g-d-3", size: "1GB",    price: 200, validity: "1 Day", description: "1GB Daily" },
  ],
  weekly:    [
    { id: "g-w-1", size: "1.5GB",  price: 250, validity: "7 Days", description: "1.5GB Weekly", popular: true },
    { id: "g-w-2", size: "4GB",    price: 500, validity: "7 Days", description: "4GB Weekly" },
  ],
  monthly:   [
    { id: "g-m-1", size: "3.6GB",  price: 500,  validity: "30 Days", description: "3.6GB Monthly" },
    { id: "g-m-2", size: "7.5GB",  price: 1000, validity: "30 Days", description: "7.5GB Monthly", popular: true },
    { id: "g-m-3", size: "12GB",   price: 1500, validity: "30 Days", description: "12GB Monthly" },
    { id: "g-m-4", size: "25GB",   price: 2500, validity: "30 Days", description: "25GB Monthly" },
  ],
  sme:       [
    { id: "g-sme-1", size: "2GB",  price: 800,  validity: "30 Days", description: "SME 2GB", popular: true },
    { id: "g-sme-2", size: "5GB",  price: 1800, validity: "30 Days", description: "SME 5GB" },
  ],
  social:    [
    { id: "g-soc-1", size: "500MB", price: 100, validity: "7 Days", description: "Social Bundle", bonus: "All Social" },
  ],
  night:     [
    { id: "g-n-1", size: "2GB",  price: 200, validity: "12am–5am", description: "Night Plan" },
  ],
  broadband: [
    { id: "g-bb-1", size: "50GB",  price: 10000, validity: "30 Days", description: "Broadband" },
    { id: "g-bb-2", size: "100GB", price: 18000, validity: "30 Days", description: "Broadband", popular: true },
  ],
};

const ninemobilePlans: Record<PlanCategory, DataPlan[]> = {
  "hot-deals": [
    { id: "e-hd-1", size: "300MB",  price: 100,  validity: "1 Day",   description: "300MB Daily",   cashback: 3, popular: true },
    { id: "e-hd-2", size: "1GB",    price: 300,  validity: "7 Days",  description: "1GB Weekly",    cashback: 6  },
    { id: "e-hd-3", size: "2GB",    price: 500,  validity: "30 Days", description: "2GB Monthly",   cashback: 8  },
  ],
  daily:     [
    { id: "e-d-1", size: "150MB",  price: 100, validity: "1 Day", description: "150MB Daily" },
    { id: "e-d-2", size: "500MB",  price: 200, validity: "1 Day", description: "500MB Daily", popular: true },
  ],
  weekly:    [
    { id: "e-w-1", size: "1GB",   price: 300, validity: "7 Days", description: "1GB Weekly", popular: true },
    { id: "e-w-2", size: "2GB",   price: 500, validity: "7 Days", description: "2GB Weekly" },
  ],
  monthly:   [
    { id: "e-m-1", size: "2GB",   price: 500,  validity: "30 Days", description: "2GB Monthly" },
    { id: "e-m-2", size: "5GB",   price: 1000, validity: "30 Days", description: "5GB Monthly", popular: true },
    { id: "e-m-3", size: "10GB",  price: 2000, validity: "30 Days", description: "10GB Monthly" },
    { id: "e-m-4", size: "15GB",  price: 3000, validity: "30 Days", description: "15GB Monthly" },
  ],
  sme:       [
    { id: "e-sme-1", size: "1GB",  price: 600,  validity: "30 Days", description: "SME 1GB" },
    { id: "e-sme-2", size: "3GB",  price: 1500, validity: "30 Days", description: "SME 3GB", popular: true },
  ],
  social:    [
    { id: "e-soc-1", size: "250MB", price: 100, validity: "7 Days", description: "Social Bundle", bonus: "All Social" },
  ],
  night:     [
    { id: "e-n-1", size: "1GB",  price: 150, validity: "12am–5am", description: "Night Plan" },
  ],
  broadband: [
    { id: "e-bb-1", size: "30GB",  price: 8000,  validity: "30 Days", description: "Broadband" },
    { id: "e-bb-2", size: "60GB",  price: 15000, validity: "30 Days", description: "Broadband", popular: true },
  ],
};

export const DATA_PLANS: Record<NetworkId, Record<PlanCategory, DataPlan[]>> = {
  mtn:      mtnPlans,
  airtel:   airtelPlans,
  glo:      gloPlans,
  "9mobile": ninemobilePlans,
};

export const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
