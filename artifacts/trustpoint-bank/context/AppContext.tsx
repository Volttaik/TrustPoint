import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { apiGet, apiPost } from "@/utils/api";

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: "credit" | "debit";
  status: "success" | "pending" | "failed";
  date: string;
  category: string;
  reference: string;
  bank?: string;
  avatarColor?: string;
}

export interface Card {
  id: string;
  type: "virtual" | "physical";
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  balance: number;
  frozen: boolean;
  currency: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  account: string;
  avatarColor: string;
  initials: string;
  favorite: boolean;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  stateOfOrigin?: string;
  accountNumber: string;
  bvn?: string;
  tier: number;
  avatarColor: string;
  initials: string;
  balance: number;
  income: number;
  expenses: number;
  pin: string;
  biometricEnabled: boolean;
  onboarded: boolean;
}

export interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  theme: "dark" | "light";
  toggleTheme: () => void;
  transactions: Transaction[];
  cards: Card[];
  beneficiaries: Beneficiary[];
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (data: Partial<User> & { rawPin: string }) => Promise<void>;
  updateBalance: (amount: number, type: "credit" | "debit") => void;
  addTransaction: (tx: Omit<Transaction, "id" | "date" | "reference">) => void;
  toggleFavorite: (id: string) => void;
  addBeneficiary: (b: Omit<Beneficiary, "id">) => void;
  freezeCard: (id: string) => void;
  showBalance: boolean;
  toggleShowBalance: () => void;
  isLoading: boolean;
  phoneExists: (phone: string) => Promise<boolean>;
}

export const AppContext = createContext<AppContextType | null>(null);

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", title: "Adebayo Okafor", subtitle: "Transfer received", amount: 85000, type: "credit", status: "success", date: new Date().toISOString(), category: "Transfer", reference: "TXN001", bank: "GTBank", avatarColor: "#2A9D8F" },
  { id: "2", title: "EKEDC Electricity", subtitle: "Prepaid Token", amount: 5000, type: "debit", status: "success", date: new Date(Date.now() - 3600000).toISOString(), category: "Bills", reference: "TXN002", avatarColor: "#E76F51" },
  { id: "3", title: "MTN Airtime", subtitle: "Airtime Top-up", amount: 1000, type: "debit", status: "success", date: new Date(Date.now() - 7200000).toISOString(), category: "Airtime", reference: "TXN003", avatarColor: "#F4A261" },
  { id: "4", title: "Chioma Ngozi", subtitle: "Money sent", amount: 25000, type: "debit", status: "success", date: new Date(Date.now() - 86400000).toISOString(), category: "Transfer", reference: "TXN004", bank: "Zenith Bank", avatarColor: "#457B9D" },
  { id: "5", title: "Netflix Subscription", subtitle: "Monthly subscription", amount: 4615, type: "debit", status: "success", date: new Date(Date.now() - 86400000 * 2).toISOString(), category: "Entertainment", reference: "TXN005", avatarColor: "#E63946" },
  { id: "6", title: "Salary — TechCorp Ltd", subtitle: "Monthly salary", amount: 450000, type: "credit", status: "success", date: new Date(Date.now() - 86400000 * 5).toISOString(), category: "Income", reference: "TXN006", avatarColor: "#2D6A4F" },
  { id: "7", title: "DStv Subscription", subtitle: "Premium bouquet", amount: 29500, type: "debit", status: "success", date: new Date(Date.now() - 86400000 * 7).toISOString(), category: "Bills", reference: "TXN007", avatarColor: "#023E8A" },
  { id: "8", title: "Emeka Obi", subtitle: "Transfer received", amount: 15000, type: "credit", status: "success", date: new Date(Date.now() - 86400000 * 8).toISOString(), category: "Transfer", reference: "TXN008", bank: "UBA", avatarColor: "#6D6875" },
  { id: "9", title: "Airtel Data Bundle", subtitle: "10GB Monthly", amount: 3500, type: "debit", status: "failed", date: new Date(Date.now() - 86400000 * 9).toISOString(), category: "Data", reference: "TXN009", avatarColor: "#E63946" },
  { id: "10", title: "Shoprite Supermarket", subtitle: "POS Purchase", amount: 12400, type: "debit", status: "success", date: new Date(Date.now() - 86400000 * 10).toISOString(), category: "Shopping", reference: "TXN010", avatarColor: "#48CAE4" },
];

const MOCK_CARDS: Card[] = [
  { id: "c1", type: "physical", number: "5399 **** **** 4821", holder: "John Doe", expiry: "08/28", cvv: "482", balance: 247560, frozen: false, currency: "NGN" },
  { id: "c2", type: "virtual", number: "4156 **** **** 3390", holder: "John Doe", expiry: "12/26", cvv: "310", balance: 50000, frozen: false, currency: "NGN" },
];

const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id: "b1", name: "Adebayo Okafor", bank: "GTBank", account: "0123456789", avatarColor: "#2A9D8F", initials: "AO", favorite: true },
  { id: "b2", name: "Chioma Ngozi", bank: "Zenith Bank", account: "1987654321", avatarColor: "#457B9D", initials: "CN", favorite: true },
  { id: "b3", name: "Emeka Obi", bank: "UBA", account: "3456789012", avatarColor: "#6D6875", initials: "EO", favorite: false },
  { id: "b4", name: "Fatima Musa", bank: "First Bank", account: "5678901234", avatarColor: "#E76F51", initials: "FM", favorite: false },
  { id: "b5", name: "Kola Adesanya", bank: "Access Bank", account: "7890123456", avatarColor: "#F4A261", initials: "KA", favorite: false },
];

const buildUser = (apiUser: any, pin: string): User => {
  const nameParts = (apiUser.name ?? "").trim().split(" ");
  const initials = nameParts.map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "??";
  const colors = ["#E63946", "#2A9D8F", "#457B9D", "#6D6875", "#E76F51"];
  const avatarColor = colors[apiUser.id % colors.length] ?? "#E63946";
  return {
    id: apiUser.id,
    name: apiUser.name ?? "",
    email: apiUser.email ?? "",
    phone: apiUser.phone ?? "",
    gender: apiUser.gender ?? "",
    dateOfBirth: apiUser.dateOfBirth ?? "",
    stateOfOrigin: apiUser.stateOfOrigin ?? "",
    accountNumber: apiUser.accountNumber ?? "",
    tier: parseInt(apiUser.tier ?? "1"),
    avatarColor,
    initials,
    balance: 247560,
    income: 450000,
    expenses: 76015,
    pin,
    biometricEnabled: false,
    onboarded: true,
  };
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [cards, setCards] = useState<Card[]>(MOCK_CARDS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(MOCK_BENEFICIARIES);
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [storedUser, storedTheme, storedTransactions, storedCards, storedBeneficiaries] =
          await Promise.all([
            AsyncStorage.getItem("@tp_user"),
            AsyncStorage.getItem("@tp_theme"),
            AsyncStorage.getItem("@tp_transactions"),
            AsyncStorage.getItem("@tp_cards"),
            AsyncStorage.getItem("@tp_beneficiaries"),
          ]);
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedTheme) setTheme(storedTheme as "dark" | "light");
        else setTheme(systemScheme === "light" ? "light" : "dark");
        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
        if (storedCards) setCards(JSON.parse(storedCards));
        if (storedBeneficiaries) setBeneficiaries(JSON.parse(storedBeneficiaries));
      } catch (e) {
        console.error("AppContext init error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const saveUser = useCallback(async (u: User | null) => {
    if (u) await AsyncStorage.setItem("@tp_user", JSON.stringify(u));
    else await AsyncStorage.removeItem("@tp_user");
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    await AsyncStorage.setItem("@tp_theme", next);
  }, [theme]);

  const toggleShowBalance = useCallback(() => setShowBalance((v) => !v), []);

  const phoneExists = useCallback(async (phone: string): Promise<boolean> => {
    try {
      await apiGet(`/user/${encodeURIComponent(phone)}`);
      return true;
    } catch {
      return false;
    }
  }, []);

  const login = useCallback(async (pin: string): Promise<boolean> => {
    const storedPhone = user?.phone ?? await AsyncStorage.getItem("@tp_last_phone");
    if (!storedPhone) return false;
    try {
      const apiUser = await apiPost("/login", { phone: storedPhone, pin });
      const u = buildUser(apiUser, pin);
      setUser(u);
      await saveUser(u);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, [user, saveUser]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const registerUser = useCallback(async (data: Partial<User> & { rawPin: string }) => {
    try {
      const apiUser = await apiPost("/register", {
        name: data.name,
        phone: data.phone,
        email: data.email,
        pin: data.rawPin,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        stateOfOrigin: data.stateOfOrigin,
      });
      const u = buildUser(apiUser, data.rawPin);
      setUser(u);
      await saveUser(u);
      await AsyncStorage.setItem("@tp_last_phone", data.phone ?? "");
      setIsAuthenticated(true);
    } catch (err: any) {
      throw err;
    }
  }, [saveUser]);

  const updateBalance = useCallback((amount: number, type: "credit" | "debit") => {
    setUser((prev) => {
      if (!prev) return prev;
      const newBal = type === "credit" ? prev.balance + amount : prev.balance - amount;
      const updated = { ...prev, balance: Math.max(0, newBal) };
      saveUser(updated);
      return updated;
    });
  }, [saveUser]);

  const addTransaction = useCallback((tx: Omit<Transaction, "id" | "date" | "reference">) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      date: new Date().toISOString(),
      reference: "TXN" + Date.now().toString().slice(-8),
    };
    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      AsyncStorage.setItem("@tp_transactions", JSON.stringify(updated));
      return updated;
    });
    updateBalance(tx.amount, tx.type);
  }, [updateBalance]);

  const toggleFavorite = useCallback((id: string) => {
    setBeneficiaries((prev) => {
      const updated = prev.map((b) => b.id === id ? { ...b, favorite: !b.favorite } : b);
      AsyncStorage.setItem("@tp_beneficiaries", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addBeneficiary = useCallback((b: Omit<Beneficiary, "id">) => {
    const newB: Beneficiary = { ...b, id: Date.now().toString() };
    setBeneficiaries((prev) => {
      const updated = [...prev, newB];
      AsyncStorage.setItem("@tp_beneficiaries", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const freezeCard = useCallback((id: string) => {
    setCards((prev) => {
      const updated = prev.map((c) => c.id === id ? { ...c, frozen: !c.frozen } : c);
      AsyncStorage.setItem("@tp_cards", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      theme,
      toggleTheme,
      transactions,
      cards,
      beneficiaries,
      login,
      logout,
      registerUser,
      updateBalance,
      addTransaction,
      toggleFavorite,
      addBeneficiary,
      freezeCard,
      showBalance,
      toggleShowBalance,
      isLoading,
      phoneExists,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
