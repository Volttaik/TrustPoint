import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Skeleton } from "@/components/Skeleton";

export default function DepositScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const [copied, setCopied] = useState(false);
  const [isLoading] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const scale = useSharedValue(1);

  const accountName = user?.name ?? "John Doe";
  const accountNumber = user?.accountNumber ?? "1234567890";
  const bankName = "TrustPoint MFB";

  const handleCopy = async () => {
    await Clipboard.setStringAsync(accountNumber);
    setCopied(true);
    scale.value = withSequence(
      withSpring(1.08, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 12 })
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    await Share.share({
      message: `Send money to:\nName: ${accountName}\nAccount: ${accountNumber}\nBank: ${bankName}`,
      title: "TrustPoint Account Details",
    });
  };

  const copyBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background !== "#F4F5F7" ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Receive Money
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={{ gap: 16 }}>
            <Skeleton height={200} borderRadius={24} />
            <Skeleton height={56} borderRadius={14} />
            <Skeleton height={56} borderRadius={14} />
          </View>
        ) : (
          <>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.primary + "18" }]}>
                <TpIcon name="arrow-down-left" size={28} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                Your Account Details
              </Text>
              <Text style={[styles.cardSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Share these details to receive money
              </Text>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <DetailRow label="Account Name" value={accountName} colors={colors} />
              <View style={[styles.inlineDivider, { backgroundColor: colors.border }]} />

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  Account Number
                </Text>
                <View style={styles.acctRow}>
                  <Text style={[styles.detailValue, { color: colors.text, fontFamily: "Inter_700Bold", letterSpacing: 2 }]}>
                    {accountNumber}
                  </Text>
                  <Pressable onPress={handleCopy} style={[styles.miniCopy, { backgroundColor: colors.primary + "18" }]}>
                    <TpIcon
                      name={copied ? "check" : "copy"}
                      size={14}
                      color={copied ? colors.success : colors.primary}
                      strokeWidth={2}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={[styles.inlineDivider, { backgroundColor: colors.border }]} />
              <DetailRow label="Bank" value={bankName} colors={colors} />
              <View style={[styles.inlineDivider, { backgroundColor: colors.border }]} />
              <DetailRow label="Account Type" value="Savings Account" colors={colors} />

              {copied && (
                <View style={[styles.copiedBanner, { backgroundColor: colors.success + "18", borderColor: colors.success }]}>
                  <TpIcon name="check-circle" size={16} color={colors.success} strokeWidth={1.8} />
                  <Text style={[styles.copiedText, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
                    Account number copied!
                  </Text>
                </View>
              )}
            </View>

            <Animated.View style={copyBtnStyle}>
              <Pressable
                onPress={handleCopy}
                style={[styles.copyBtn, { backgroundColor: colors.primary }]}
              >
                <TpIcon name={copied ? "check-circle" : "copy"} size={20} color="#fff" strokeWidth={1.8} />
                <Text style={[styles.copyBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                  {copied ? "Copied!" : "Copy Account Number"}
                </Text>
              </Pressable>
            </Animated.View>

            <Pressable
              onPress={handleShare}
              style={[styles.shareBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <TpIcon name="share-2" size={20} color={colors.text} strokeWidth={1.8} />
              <Text style={[styles.shareBtnText, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                Share Account Details
              </Text>
            </Pressable>

            <View style={[styles.noteCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
              <TpIcon name="info" size={16} color={colors.primary} strokeWidth={1.8} />
              <Text style={[styles.noteText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Transfers are processed instantly. For large amounts above ₦5,000,000, please contact support.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  scroll: { paddingHorizontal: 20, gap: 16, paddingTop: 4 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 16,
    alignItems: "center",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 20, letterSpacing: -0.5 },
  cardSub: { fontSize: 13, textAlign: "center" },
  divider: { height: 0.5, alignSelf: "stretch" },
  inlineDivider: { height: 0.5 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 4,
  },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14 },
  acctRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  miniCopy: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  copiedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "stretch",
  },
  copiedText: { fontSize: 13 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  copyBtnText: { color: "#fff", fontSize: 16 },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  shareBtnText: { fontSize: 16 },
  noteCard: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  noteText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
});
