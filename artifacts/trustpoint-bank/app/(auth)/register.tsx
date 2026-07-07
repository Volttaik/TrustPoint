import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OTPInput } from "@/components/ui/OTPInput";
import { PinPad } from "@/components/ui/PinPad";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STEPS = ["Phone", "OTP", "Profile", "PIN", "Done"];

const GENDERS = ["Male", "Female", "Rather not say"];
const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

export default function RegisterScreen() {
  const { registerUser, phoneExists } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [state, setState] = useState("");
  const [showStateList, setShowStateList] = useState(false);

  const formatDob = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - 16);
  const minDob = new Date();
  minDob.setFullYear(minDob.getFullYear() - 100);

  const handleDobChange = (event: any, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event.type === "dismissed") return;
    if (selected) {
      setDobDate(selected);
      setDob(formatDob(selected));
      setError("");
    }
  };

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinStep, setPinStep] = useState<"set" | "confirm">("set");
  const [pinError, setPinError] = useState(false);

  const handlePhone = async () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) { setError("Enter a valid phone number"); return; }
    setLoading(true);
    setError("");
    try {
      const exists = await phoneExists(cleaned);
      if (exists) {
        setError("This number is already registered. Please login instead.");
        setLoading(false);
        return;
      }
    } catch {}
    await AsyncStorage.setItem("@tp_last_phone", cleaned);
    setLoading(false);
    setStep(1);
  };

  const handleOTP = (code: string) => {
    if (code.length === 4) setTimeout(() => setStep(2), 400);
  };

  const handleProfile = () => {
    if (!name.trim()) { setError("Full name is required"); return; }
    if (!gender) { setError("Please select your gender"); return; }
    setError("");
    setStep(3);
  };

  const handlePinFirstSet = (key: string) => {
    const newPin = pin + key;
    if (newPin.length <= 4) {
      setPin(newPin);
      if (newPin.length === 4) {
        AsyncStorage.setItem("@tp_reg_pin", newPin);
        setTimeout(() => { setPinStep("confirm"); setPin(""); }, 300);
      }
    }
  };

  const handlePinConfirm = (key: string) => {
    const newConfirm = confirmPin + key;
    if (newConfirm.length <= 4) {
      setConfirmPin(newConfirm);
      if (newConfirm.length === 4) {
        setTimeout(async () => {
          const stored = await AsyncStorage.getItem("@tp_reg_pin");
          const origPin = stored || "";
          if (newConfirm !== origPin) {
            setPinError(true);
            setConfirmPin("");
            setTimeout(() => setPinError(false), 800);
          } else {
            await finishRegister(origPin);
          }
        }, 300);
      }
    }
  };

  const handlePinKey = pinStep === "set" ? handlePinFirstSet : handlePinConfirm;
  const currentPinValue = pinStep === "set" ? pin : confirmPin;

  const finishRegister = async (rawPin: string) => {
    setLoading(true);
    try {
      await registerUser({
        name: name.trim(),
        phone: phone.replace(/\D/g, ""),
        email: email.trim() || undefined,
        gender,
        dateOfBirth: dob,
        stateOfOrigin: state,
        rawPin,
      });
      setStep(4);
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    setError("");
    if (step === 3 && pinStep === "confirm") { setPinStep("set"); setConfirmPin(""); return; }
    setStep((s) => Math.max(0, s - 1));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { fontFamily: "Inter_700Bold" }]}>Welcome to TrustPoint</Text>
            <Text style={[styles.stepSub, { fontFamily: "Inter_400Regular" }]}>
              Enter your phone number to get started. No BVN needed.
            </Text>
            <Input
              label="Phone Number"
              value={phone}
              onChangeText={(t) => { setPhone(t); setError(""); }}
              keyboardType="phone-pad"
              placeholder="e.g. 08012345678"
              prefixIcon={<TpIcon name="phone" size={18} color="#8E8E93" strokeWidth={1.8} />}
              maxLength={14}
            />
            {error ? <Text style={[styles.errorMsg, { fontFamily: "Inter_400Regular" }]}>{error}</Text> : null}
            <Button onPress={handlePhone} fullWidth loading={loading} disabled={phone.replace(/\D/g,"").length < 10}>
              Continue
            </Button>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")} style={{ alignSelf: "center" }}>
              <Text style={[styles.linkText, { fontFamily: "Inter_400Regular" }]}>
                Already have an account? <Text style={{ color: "#E63946" }}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { fontFamily: "Inter_700Bold" }]}>Verify your number</Text>
            <Text style={[styles.stepSub, { fontFamily: "Inter_400Regular" }]}>
              Enter any 4-digit code to verify{"\n"}
              <Text style={{ color: "#E63946" }}>{phone}</Text>
            </Text>
            <OTPInput length={4} onComplete={handleOTP} timerSeconds={45} onResend={() => {}} />
            <Text style={[styles.devNote, { fontFamily: "Inter_400Regular" }]}>
              For now, enter any 4 digits to proceed.
            </Text>
          </View>
        );

      case 2:
        return (
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "100%" }}>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { fontFamily: "Inter_700Bold" }]}>Your Profile</Text>
              <Text style={[styles.stepSub, { fontFamily: "Inter_400Regular" }]}>Tell us about yourself</Text>

              <Input
                label="Full Name *"
                value={name}
                onChangeText={(t) => { setName(t); setError(""); }}
                placeholder="e.g. Adaeze Okafor"
                prefixIcon={<TpIcon name="user" size={18} color="#8E8E93" strokeWidth={1.8} />}
              />
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. ada@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                prefixIcon={<TpIcon name="mail" size={18} color="#8E8E93" strokeWidth={1.8} />}
              />

              <View>
                <Text style={[styles.fieldLabel, { fontFamily: "Inter_500Medium" }]}>Gender *</Text>
                <View style={styles.chipRow}>
                  {GENDERS.map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => { setGender(g); setError(""); }}
                      style={[
                        styles.genderChip,
                        {
                          backgroundColor: gender === g ? "#E63946" : "#1A1A1A",
                          borderColor: gender === g ? "#E63946" : "#2A2A2A",
                        },
                      ]}
                    >
                      <Text style={[styles.chipText, { color: gender === g ? "#fff" : "#8E8E93", fontFamily: "Inter_500Medium" }]}>
                        {g}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View>
                <Text style={[styles.fieldLabel, { fontFamily: "Inter_500Medium" }]}>Date of Birth</Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={[styles.stateSelector, { backgroundColor: "#181818" }]}
                >
                  <TpIcon name="calendar" size={18} color="#8E8E93" strokeWidth={1.8} />
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      fontSize: 15,
                      fontFamily: "Inter_500Medium",
                      color: dob ? "#fff" : "#6E6E73",
                    }}
                  >
                    {dob || "DD/MM/YYYY"}
                  </Text>
                  <TpIcon name="chevron-right" size={16} color="#8E8E93" strokeWidth={2} />
                </Pressable>
              </View>

              {showDatePicker && (
                <>
                  {Platform.OS === "ios" && (
                    <View style={{ backgroundColor: "#181818", borderRadius: 16, overflow: "hidden" }}>
                      <DateTimePicker
                        value={dobDate ?? maxDob}
                        mode="date"
                        display="spinner"
                        onChange={handleDobChange}
                        maximumDate={maxDob}
                        minimumDate={minDob}
                        themeVariant="dark"
                        textColor="#fff"
                        style={{ height: 180 }}
                      />
                      <Pressable
                        onPress={() => setShowDatePicker(false)}
                        style={{ padding: 14, alignItems: "center", borderTopWidth: 1, borderTopColor: "#2A2A2A" }}
                      >
                        <Text style={{ color: "#E63946", fontFamily: "Inter_600SemiBold", fontSize: 15 }}>Done</Text>
                      </Pressable>
                    </View>
                  )}
                  {Platform.OS === "android" && (
                    <DateTimePicker
                      value={dobDate ?? maxDob}
                      mode="date"
                      display="default"
                      onChange={handleDobChange}
                      maximumDate={maxDob}
                      minimumDate={minDob}
                    />
                  )}
                  {Platform.OS === "web" && (
                    <DateTimePicker
                      value={dobDate ?? maxDob}
                      mode="date"
                      onChange={handleDobChange}
                      maximumDate={maxDob}
                      minimumDate={minDob}
                    />
                  )}
                </>
              )}

              <View>
                <Text style={[styles.fieldLabel, { fontFamily: "Inter_500Medium" }]}>State of Origin</Text>
                <Pressable
                  onPress={() => setShowStateList((v) => !v)}
                  style={[styles.stateSelector, { backgroundColor: "#181818" }]}
                >
                  <TpIcon name="map-pin" size={18} color="#8E8E93" strokeWidth={1.8} />
                  <Text style={[styles.stateSelectorText, { color: state ? "#F1FAEE" : "#8E8E93", fontFamily: "Inter_400Regular" }]}>
                    {state || "Select state…"}
                  </Text>
                  <TpIcon name={showStateList ? "chevron-up" : "chevron-down"} size={16} color="#8E8E93" strokeWidth={2} />
                </Pressable>
                {showStateList && (
                  <View style={[styles.stateList, { backgroundColor: "#1A1A1A", borderColor: "#2A2A2A" }]}>
                    <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                      {NIGERIAN_STATES.map((s) => (
                        <Pressable
                          key={s}
                          onPress={() => { setState(s); setShowStateList(false); }}
                          style={[styles.stateItem, { borderBottomColor: "#2A2A2A" }]}
                        >
                          <Text style={[styles.stateItemText, { color: state === s ? "#E63946" : "#F1FAEE", fontFamily: "Inter_400Regular" }]}>
                            {s}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {error ? <Text style={[styles.errorMsg, { fontFamily: "Inter_400Regular" }]}>{error}</Text> : null}
              <Button onPress={handleProfile} fullWidth disabled={!name.trim() || !gender}>
                Continue
              </Button>
            </View>
          </KeyboardAvoidingView>
        );

      case 3:
        return (
          <View style={styles.pinContent}>
            <Text style={[styles.stepTitle, { fontFamily: "Inter_700Bold", textAlign: "center" }]}>
              {pinStep === "set" ? "Create your PIN" : "Confirm your PIN"}
            </Text>
            <Text style={[styles.stepSub, { fontFamily: "Inter_400Regular", textAlign: "center" }]}>
              {pinStep === "set"
                ? "Set a secure 4-digit transaction PIN"
                : "Re-enter your PIN to confirm"}
            </Text>
            {pinError && (
              <Text style={[styles.errorMsg, { fontFamily: "Inter_500Medium", textAlign: "center" }]}>
                PINs don't match. Try again.
              </Text>
            )}
            <PinPad
              pin={currentPinValue}
              onKeyPress={handlePinKey}
              onDelete={() => {
                if (pinStep === "set") setPin((p) => p.slice(0, -1));
                else setConfirmPin((p) => p.slice(0, -1));
              }}
              shake={pinError}
            />
            {loading && (
              <Text style={[{ color: "#8E8E93", fontSize: 13, fontFamily: "Inter_400Regular" }]}>
                Creating account…
              </Text>
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.successContent}>
            <View style={styles.checkCircle}>
              <TpIcon name="check" size={52} color="#fff" strokeWidth={2.5} />
            </View>
            <Text style={[styles.welcomeTitle, { fontFamily: "Inter_700Bold" }]}>
              Welcome, {name.split(" ")[0]}!
            </Text>
            <Text style={[styles.stepSub, { fontFamily: "Inter_400Regular", textAlign: "center" }]}>
              Your TrustPoint account has been created successfully.
            </Text>
            <Button onPress={() => router.replace("/(main)")} fullWidth size="large">
              Go to Dashboard
            </Button>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {step < 4 && (
        <View style={styles.header}>
          {step > 0 ? (
            <TouchableOpacity onPress={back} style={styles.backBtn}>
              <TpIcon name="arrow-left" size={22} color="#F1FAEE" strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <View style={styles.headerCenter}>
            <Image
              source={require("@/assets/images/icon_transparent.png")}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </View>
          <View style={{ width: 40 }} />
        </View>
      )}

      {step < 4 && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((step + 1) / (STEPS.length - 1)) * 100}%` as any }]} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#1A1A1A", alignItems: "center", justifyContent: "center" },
  headerCenter: { alignItems: "center" },
  headerIcon: { width: 40, height: 40 },
  progressBar: { height: 3, backgroundColor: "#1A1A1A", marginHorizontal: 20, borderRadius: 2, marginBottom: 4 },
  progressFill: { height: 3, backgroundColor: "#E63946", borderRadius: 2 },
  content: { padding: 24, paddingBottom: 60 },
  stepContent: { gap: 18 },
  pinContent: { alignItems: "center", gap: 20, paddingTop: 16 },
  successContent: { alignItems: "center", gap: 20, paddingTop: 32 },
  stepTitle: { fontSize: 28, color: "#F1FAEE", letterSpacing: -1 },
  stepSub: { fontSize: 15, color: "#8E8E93", lineHeight: 22 },
  fieldLabel: { fontSize: 13, color: "#8E8E93", marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  genderChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5 },
  chipText: { fontSize: 14 },
  stateSelector: { height: 52, borderRadius: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 10 },
  stateSelectorText: { flex: 1, fontSize: 15 },
  stateList: { borderRadius: 12, borderWidth: 1, marginTop: 4, overflow: "hidden" },
  stateItem: { padding: 14, borderBottomWidth: 0.5 },
  stateItemText: { fontSize: 14 },
  errorMsg: { fontSize: 13, color: "#E63946" },
  linkText: { fontSize: 14, color: "#8E8E93" },
  devNote: { fontSize: 12, color: "#555", textAlign: "center" },
  checkCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#E63946", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  welcomeTitle: { fontSize: 32, color: "#F1FAEE", letterSpacing: -1 },
});
