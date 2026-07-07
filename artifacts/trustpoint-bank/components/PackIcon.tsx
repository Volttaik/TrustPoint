import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

/* ─────────────────────────────────────────────────────────
   PackIcon — renders icons from the investment_funding_icons
   pack (.webp). Typed as a literal union so invalid names
   are caught at compile-time.
───────────────────────────────────────────────────────── */

// No explicit type annotation — TS infers the literal keys
const PACK = {
  /* ── Quick Actions / bottom nav ── */
  transfer:         require("@/assets/icons/investment_flow.webp"),
  deposit:          require("@/assets/icons/funding.webp"),
  airtime:          require("@/assets/icons/payment_info.webp"),
  data:             require("@/assets/icons/it_investment.webp"),
  bills:            require("@/assets/icons/financial_calculation.webp"),
  cards:            require("@/assets/icons/business_card.webp"),
  savings:          require("@/assets/icons/savings.webp"),
  more:             require("@/assets/icons/portfolio.webp"),

  /* ── Bottom nav ── */
  home:             require("@/assets/icons/home_investment.webp"),
  settings:         require("@/assets/icons/financial_strategy.webp"),

  /* ── Dashboard header ── */
  support:          require("@/assets/icons/financial_literacy.webp"),
  notifications:    require("@/assets/icons/stock_market_news.webp"),

  /* ── More screen menu ── */
  edit_profile:     require("@/assets/icons/evaluation.webp"),
  upgrade:          require("@/assets/icons/medal.webp"),
  linked_accounts:  require("@/assets/icons/funding_platform.webp"),
  savings_goals:    require("@/assets/icons/investment_saving.webp"),
  investments:      require("@/assets/icons/investment_growth.webp"),
  loans:            require("@/assets/icons/debt_weight.webp"),
  referrals:        require("@/assets/icons/online_donation.webp"),
  security:         require("@/assets/icons/financial_security.webp"),
  devices:          require("@/assets/icons/it_investment.webp"),
  theme:            require("@/assets/icons/financial_strategy.webp"),
  help:             require("@/assets/icons/financial_literacy.webp"),
  logout:           require("@/assets/icons/loss.webp"),
  copy:             require("@/assets/icons/file_management.webp"),

  /* ── Transaction category icons ── */
  tx_transfer:      require("@/assets/icons/investment_flow.webp"),
  tx_bills:         require("@/assets/icons/financial_calculation.webp"),
  tx_airtime:       require("@/assets/icons/payment_info.webp"),
  tx_data:          require("@/assets/icons/it_investment.webp"),
  tx_entertainment: require("@/assets/icons/online_trading.webp"),
  tx_income:        require("@/assets/icons/income_rise.webp"),
  tx_shopping:      require("@/assets/icons/online_clothes_shopping.webp"),
  tx_default:       require("@/assets/icons/business_card.webp"),
};

/** Strict literal union of every valid icon name in the pack. */
export type PackIconName = keyof typeof PACK;

interface PackIconProps {
  name: PackIconName;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export function PackIcon({ name, size = 32, style }: PackIconProps) {
  return (
    <Image
      source={PACK[name]}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
}
