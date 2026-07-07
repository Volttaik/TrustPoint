---
name: Pure black theme overhaul
description: Migration from dark-navy to pure black (#000000) theme; icon strategy; webp as decorative elements
---

## Theme
- `colors.dark.background` = `#000000` (pure black, not #0A0A0A)
- `colors.dark.surface` = `#080808`, card = `#0A0A0A`, charcoal = `#1A1A1A`
- `tabBackground` = `#000000`
- `isDark` check across all screens: `colors.background !== "#F4F5F7"` (do NOT use `=== "#0A0A0A"` — it breaks with pure black)

## Icon strategy
- TpIcon (SVG strokes) for ALL functional UI icons: nav bar, quick actions, header buttons, menu items
- webp illustrations (assets/icons/) are purely decorative: rewards cards (passive_income.webp, crowdfunding.webp), future: transfer/deposit decorative banners
- PackIcon/BankIcon webp usage removed from all main screens

## Quick action icon mapping (BankIconName → TpIconName)
- transfer → shuffle, deposit/add → plus, airtime → phone, data → wifi
- bills → file-text, cards → credit-card, savings → trending-up, more → more-horizontal

## Nav bar icons
- Home → home, Transfer → shuffle, Cards → credit-card, Settings → settings

## Caved-in icon boxes
- 58×58, borderRadius 16 (rounded square, not circle)
- Background: #161616 (dark) or primary (accent)
- LinearGradient overlay: rgba(0,0,0,0.55) → transparent, top 45% = inset shadow illusion
- Web: boxShadow inset applied via Platform.select

**Why:** User requested "caved-in / inset" box style replacing circle containers.

## StatusBar fix
All screens: `StatusBar style={colors.background !== "#F4F5F7" ? "light" : "dark"}` — NOT `=== "#0A0A0A"`
