import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, registerUser } = useApp();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    await registerUser({ name, email, phone });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarArea}>
            <Avatar initials={user?.initials ?? "JD"} color={user?.avatarColor ?? colors.primary} size={80} />
            <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: colors.primary }]}>
              <Feather name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your full name" prefixIcon={<Feather name="user" size={18} color="#8E8E93" />} />
          <Input label="Email Address" value={email} onChangeText={setEmail} placeholder="Your email" keyboardType="email-address" autoCapitalize="none" prefixIcon={<Feather name="mail" size={18} color="#8E8E93" />} />
          <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="Your phone" keyboardType="phone-pad" prefixIcon={<Feather name="phone" size={18} color="#8E8E93" />} />

          {saved && (
            <View style={[styles.savedBanner, { backgroundColor: colors.success + "22", borderColor: colors.success }]}>
              <Feather name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.savedText, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>Profile updated!</Text>
            </View>
          )}

          <Button onPress={handleSave} loading={loading} fullWidth size="large">
            Save Changes
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 8, paddingBottom: 40 },
  avatarArea: { alignItems: "center", marginBottom: 8, position: "relative" },
  editAvatarBtn: { position: "absolute", bottom: 0, right: "35%", width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  savedBanner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  savedText: { fontSize: 14 },
});
