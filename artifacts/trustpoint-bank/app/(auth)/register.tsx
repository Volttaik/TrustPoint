import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Input } from "@/components/ui/Input";
import { OTPInput } from "@/components/ui/OTPInput";
import { PinPad } from "@/components/ui/PinPad";
import { Button } from "@/components/ui/Button";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";

const PRIMARY = "#E11D33";
const TOTAL_STEPS = 8;

const GENDERS = ["Male", "Female", "Prefer not to say"];

const NIGERIAN_BANKS = [
  { name: "Access Bank",       color: "#CC0000", initials: "AB" },
  { name: "GTBank",            color: "#E85E10", initials: "GT" },
  { name: "Zenith Bank",       color: "#004B9D", initials: "ZB" },
  { name: "First Bank",        color: "#00A0DC", initials: "FB" },
  { name: "UBA",               color: "#E80000", initials: "UB" },
  { name: "Fidelity Bank",     color: "#0F4D95", initials: "FD" },
  { name: "FCMB",              color: "#E11D33", initials: "FC" },
  { name: "Union Bank",        color: "#003399", initials: "UN" },
  { name: "Sterling Bank",     color: "#D71920", initials: "ST" },
  { name: "Stanbic IBTC",     color: "#009BDE", initials: "SI" },
  { name: "Wema Bank",         color: "#6B2082", initials: "WB" },
  { name: "Polaris Bank",      color: "#A6192E", initials: "PL" },
  { name: "Keystone Bank",     color: "#004F30", initials: "KB" },
  { name: "Providus Bank",     color: "#006B3F", initials: "PV" },
  { name: "Moniepoint",        color: "#0066FF", initials: "MP" },
  { name: "Opay",              color: "#09C99A", initials: "OP" },
  { name: "PalmPay",           color: "#04C97F", initials: "PP" },
  { name: "Kuda Bank",         color: "#40196B", initials: "KD" },
  { name: "Lotus Bank",        color: "#009270", initials: "LB" },
  { name: "Parallex Bank",     color: "#003D83", initials: "PX" },
  { name: "Jaiz Bank",         color: "#009A44", initials: "JB" },
  { name: "Ecobank",           color: "#0038A8", initials: "EB" },
  { name: "Unity Bank",        color: "#00704A", initials: "UY" },
  { name: "Titan Trust Bank",  color: "#E31E28", initials: "TT" },
];

const STEP_META = [
  { title: "Create account",    sub: "Start with your email address." },
  { title: "Verify email",      sub: "Enter the 6-digit code sent to your email." },
  { title: "About you",         sub: "Tell us a bit about yourself." },
  { title: "Create PIN",        sub: "Set a secure 4-digit PIN for transactions." },
  { title: "Set password",      sub: "Create a strong password for sign-in." },
  { title: "Profile photo",     sub: "Add a photo so people can recognise you." },
  { title: "Your bank",         sub: "Select your primary Nigerian bank." },
  { title: "Review details",    sub: "Check everything looks right before we create your account." },
];

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = (v: string) => /^(0[7-9][01]\d{8})$/.test(v.replace(/\s/g, ""));

const pwdChecks = (p: string) => ({
  len:   p.length >= 8,
  upper: /[A-Z]/.test(p),
  lower: /[a-z]/.test(p),
  num:   /\d/.test(p),
});

// ── Animated password-requirement row ────────────────────────────────────────
// The check icon does a quick pop-bounce the first time a criterion is satisfied,
// giving tactile feedback that the rule has been met.
function AnimatedReqRow({ label, ok }: { label: string; ok: boolean }) {
  const iconScale = useSharedValue(1);
  const prevOk    = React.useRef(false);

  React.useEffect(() => {
    if (ok && !prevOk.current) {
      iconScale.value = withSequence(
        withTiming(1.45, { duration: 90 }),
        withSpring(1, { damping: 9, stiffness: 260 }),
      );
    }
    prevOk.current = ok;
  }, [ok]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <View style={styles.reqRow}>
      <Animated.View style={iconStyle}>
        <TpIcon name="check-circle" size={14} color={ok ? "#2FBE73" : "#333"} strokeWidth={2} />
      </Animated.View>
      <Text style={[styles.reqText, { color: ok ? "#2FBE73" : "#555", fontFamily: "Inter_400Regular" }]}>
        {label}
      </Text>
    </View>
  );
}

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { registerUser } = useApp();
  const scrollRef = useRef<ScrollView>(null);

  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Step 0 — Email
  const [email, setEmail] = useState("");

  // Step 2 — Personal info
  const [name, setName]             = useState("");
  const [username, setUsername]     = useState("");
  const [phone, setPhone]           = useState("");
  const [gender, setGender]         = useState("");
  const [dobDate, setDobDate]       = useState<Date | null>(null);
  const [dobStr, setDobStr]         = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const maxDob = (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 16); return d; })();
  const minDob = (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 100); return d; })();
  const formatDob = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  const handleDobChange = (_: any, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) { setDobDate(selected); setDobStr(formatDob(selected)); }
  };

  // Step 3 — PIN
  const [pin, setPin]               = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinStep, setPinStep]       = useState<"set" | "confirm">("set");
  const [pinError, setPinError]     = useState(false);
  const pinRef = useRef("");

  // Step 4 — Password
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 5 — Photo
  const [profilePicture, setProfilePicture] = useState<string | undefined>();

  // Step 6 — Bank
  const [selectedBank, setSelectedBank] = useState<string | undefined>();
  const [bankSearch, setBankSearch]     = useState("");

  // ── Shake animation (validation error feedback) ───────────────────
  const shakeX = useSharedValue(0);
  const doShake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10,  { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10,  { duration: 50 }),
      withTiming(0,   { duration: 60 }),
    );
  }, []);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  // ── Step transition animation (slide + fade between steps) ────────
  const stepOpacity = useSharedValue(1);
  const stepSlideX  = useSharedValue(0);
  const stepAnimStyle = useAnimatedStyle(() => ({
    opacity: stepOpacity.value,
    transform: [{ translateX: stepSlideX.value }],
  }));

  // Stable JS callbacks for use inside Reanimated worklet callbacks
  const _scrollTop  = useCallback(() => scrollRef.current?.scrollTo({ y: 0, animated: false }), []);
  const _clearError = useCallback(() => setError(""), []);
  const _setStep    = useCallback((n: number) => setStep(n), []);

  const goToStep = useCallback((newStep: number, dir: 1 | -1) => {
    const outX = -22 * dir;
    const inX  =  22 * dir;
    // Phase 1: fade + slide current content out
    stepOpacity.value = withTiming(0, { duration: 110 });
    stepSlideX.value  = withTiming(outX, { duration: 110 }, (finished) => {
      if (!finished) return;
      // Phase 2: update step while invisible, then slide in from opposite side
      runOnJS(_scrollTop)();
      runOnJS(_clearError)();
      runOnJS(_setStep)(newStep);
      stepSlideX.value  = inX;
      stepOpacity.value = withTiming(1, { duration: 230, easing: Easing.out(Easing.cubic) });
      stepSlideX.value  = withTiming(0, { duration: 230, easing: Easing.out(Easing.cubic) });
    });
  }, [_scrollTop, _clearError, _setStep]);

  const advance = useCallback(() => goToStep(step + 1, 1), [step, goToStep]);

  const handleNext = useCallback(async () => {
    setError("");
    switch (step) {
      case 0:
        if (!isValidEmail(email)) { setError("Enter a valid email address."); doShake(); return; }
        advance();
        break;

      case 2:
        if (!name.trim())            { setError("Full name is required."); doShake(); return; }
        if (!username.trim() || username.trim().length < 3)
                                     { setError("Username must be at least 3 characters."); doShake(); return; }
        if (!/^[a-zA-Z0-9_]+$/.test(username.trim()))
                                     { setError("Username can only contain letters, numbers and underscores."); doShake(); return; }
        if (!isValidPhone(phone))    { setError("Enter a valid 11-digit Nigerian phone number."); doShake(); return; }
        if (!gender)                 { setError("Please select your gender."); doShake(); return; }
        advance();
        break;

      case 4: {
        const checks = pwdChecks(password);
        if (!checks.len || !checks.upper || !checks.lower || !checks.num) {
          setError("Password does not meet all requirements."); doShake(); return;
        }
        if (password !== confirmPassword) { setError("Passwords do not match."); doShake(); return; }
        advance();
        break;
      }

      case 5:
        advance();
        break;

      case 6:
        if (!selectedBank) { setError("Please select your primary bank."); doShake(); return; }
        advance();
        break;

      case 7:
        await handleRegister();
        break;

      default:
        break;
    }
  }, [step, email, name, username, phone, gender, password, confirmPassword, selectedBank]);

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await registerUser({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phone: phone.replace(/\s/g, ""),
        gender,
        dateOfBirth: dobStr,
        rawPin: pinRef.current,
        password,
        profilePicture,
        preferredBank: selectedBank,
      });
      advance(); // → step 8 (success)
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 3 && pinStep === "confirm") {
      setPinStep("set");
      setConfirmPin("");
      return;
    }
    if (step === 0) { router.replace("/(auth)/auth-landing"); return; }
    goToStep(Math.max(0, step - 1), -1);
  };

  // ── PIN step handlers ─────────────────────────────────────────────
  const handlePinKey = (key: string) => {
    if (pinStep === "set") {
      const next = (pin + key).slice(0, 4);
      setPin(next);
      if (next.length === 4) {
        pinRef.current = next;
        setTimeout(() => { setPinStep("confirm"); setPin(""); }, 280);
      }
    } else {
      const next = (confirmPin + key).slice(0, 4);
      setConfirmPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === pinRef.current) {
            setConfirmPin("");
            advance();
          } else {
            setPinError(true);
            setConfirmPin("");
            setTimeout(() => setPinError(false), 800);
          }
        }, 280);
      }
    }
  };

  const handlePinDelete = () => {
    if (pinStep === "set") setPin((p) => p.slice(0, -1));
    else setConfirmPin((p) => p.slice(0, -1));
  };

  const currentPinValue = pinStep === "set" ? pin : confirmPin;

  // ── Profile photo ─────────────────────────────────────────────────
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) setProfilePicture(result.assets[0].uri);
    } catch {}
  };

  // ── Success auto-navigate ──────────────────────────────────────────
  useEffect(() => {
    if (step === 8) {
      const t = setTimeout(() => router.replace("/(auth)/auth-landing"), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  // ── Filtered banks ─────────────────────────────────────────────────
  const filteredBanks = NIGERIAN_BANKS.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const checks = pwdChecks(password);

  // ────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────
  if (step === 8) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <View style={styles.successScreen}>
          <View style={styles.successIcon}>
            <TpIcon name="check" size={52} color="#fff" strokeWidth={2.5} />
          </View>
          <Text style={[styles.successTitle, { fontFamily: "Inter_700Bold" }]}>
            Welcome, {name.split(" ")[0]}!
          </Text>
          <Text style={[styles.successSub, { fontFamily: "Inter_400Regular" }]}>
            Your TrustPoint account has been created. You'll be redirected to sign in shortly.
          </Text>
          <Button onPress={() => router.replace("/(auth)/auth-landing")} fullWidth size="large">
            Go to Sign In
          </Button>
        </View>
      </View>
    );
  }

  const isContinueBtnStep = ![1, 3].includes(step);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <TpIcon name="arrow-left" size={20} color="#F1FAEE" />
        </TouchableOpacity>
        <Image
          source={require("@/assets/images/icon_transparent.png")}
          style={styles.headerIcon}
          resizeMode="contain"
        />
        <View style={{ width: 40 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: `${Math.round(((step + 1) / TOTAL_STEPS) * 100)}%` as any },
          ]}
        />
      </View>
      <Text style={[styles.stepCount, { fontFamily: "Inter_400Regular" }]}>
        Step {step + 1} of {TOTAL_STEPS}
      </Text>

      {/* Step content */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={stepAnimStyle}>
        {/* Step heading */}
        {step !== 3 && (
          <View style={styles.stepHead}>
            <Text style={[styles.stepTitle, { fontFamily: "Inter_700Bold" }]}>
              {STEP_META[step]?.title}
            </Text>
            <Text style={[styles.stepSub, { fontFamily: "Inter_400Regular" }]}>
              {STEP_META[step]?.sub}
            </Text>
          </View>
        )}

        {/* ── Step 0 — Email ──────────────────────────────────────── */}
        {step === 0 && (
          <Animated.View style={[styles.formBlock, shakeStyle]}>
            <Input
              label="Email Address"
              placeholder="e.g. adaeze@email.com"
              value={email}
              onChangeText={(t) => { setEmail(t); setError(""); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleNext}
              prefixIcon={<TpIcon name="mail" size={18} color="#555" strokeWidth={1.8} />}
            />
            {error ? <Text style={[styles.errMsg, { fontFamily: "Inter_400Regular" }]}>{error}</Text> : null}
          </Animated.View>
        )}

        {/* ── Step 1 — Email OTP ──────────────────────────────────── */}
        {step === 1 && (
          <View style={styles.centerBlock}>
            <Text style={[styles.otpEmail, { fontFamily: "Inter_400Regular" }]}>
              Code sent to{" "}
              <Text style={{ color: PRIMARY, fontFamily: "Inter_600SemiBold" }}>{email}</Text>
            </Text>
            <OTPInput
              length={6}
              onComplete={() => setTimeout(advance, 320)}
              timerSeconds={60}
              onResend={() => {}}
            />
            <Text style={[styles.otpNote, { fontFamily: "Inter_400Regular" }]}>
              For now, enter any 6 digits to continue.
            </Text>
          </View>
        )}

        {/* ── Step 2 — Personal Info ───────────────────────────────── */}
        {step === 2 && (
          <Animated.View style={[styles.formBlock, shakeStyle]}>
            <Input
              label="Full Name *"
              placeholder="e.g. Adaeze Okafor"
              value={name}
              onChangeText={(t) => { setName(t); setError(""); }}
              prefixIcon={<TpIcon name="user" size={18} color="#555" strokeWidth={1.8} />}
            />
            <Input
              label="Username *"
              placeholder="e.g. adaeze_ok (min. 3 characters)"
              value={username}
              onChangeText={(t) => { setUsername(t.replace(/\s/g, "")); setError(""); }}
              autoCapitalize="none"
              autoCorrect={false}
              prefixIcon={<TpIcon name="edit-2" size={18} color="#555" strokeWidth={1.8} />}
            />
            <Input
              label="Phone Number *"
              placeholder="e.g. 08012345678"
              value={phone}
              onChangeText={(t) => { setPhone(t); setError(""); }}
              keyboardType="phone-pad"
              maxLength={11}
              prefixIcon={<TpIcon name="phone" size={18} color="#555" strokeWidth={1.8} />}
            />

            {/* Gender */}
            <View>
              <Text style={[styles.fieldLabel, { fontFamily: "Inter_500Medium" }]}>Gender *</Text>
              <View style={styles.chipRow}>
                {GENDERS.map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => { setGender(g); setError(""); }}
                    style={[
                      styles.chip,
                      { backgroundColor: gender === g ? PRIMARY : "#151515", borderColor: gender === g ? PRIMARY : "#222" },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: gender === g ? "#fff" : "#777", fontFamily: "Inter_500Medium" }]}>
                      {g}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* DOB */}
            <View>
              <Text style={[styles.fieldLabel, { fontFamily: "Inter_500Medium" }]}>Date of Birth</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={styles.fieldRow}
              >
                <TpIcon name="calendar" size={18} color="#555" strokeWidth={1.8} />
                <Text style={[styles.fieldRowText, { color: dobStr ? "#F1FAEE" : "#555", fontFamily: "Inter_400Regular" }]}>
                  {dobStr || "DD/MM/YYYY"}
                </Text>
                <TpIcon name="chevron-right" size={16} color="#444" strokeWidth={2} />
              </Pressable>
            </View>

            {showDatePicker && Platform.OS === "ios" && (
              <View style={styles.iosPicker}>
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
                  style={styles.iosPickerDone}
                >
                  <Text style={{ color: PRIMARY, fontFamily: "Inter_600SemiBold", fontSize: 15 }}>Done</Text>
                </Pressable>
              </View>
            )}
            {showDatePicker && Platform.OS === "android" && (
              <DateTimePicker
                value={dobDate ?? maxDob}
                mode="date"
                display="default"
                onChange={handleDobChange}
                maximumDate={maxDob}
                minimumDate={minDob}
              />
            )}
            {showDatePicker && Platform.OS === "web" && (
              <DateTimePicker
                value={dobDate ?? maxDob}
                mode="date"
                onChange={handleDobChange}
                maximumDate={maxDob}
                minimumDate={minDob}
              />
            )}

            {error ? <Text style={[styles.errMsg, { fontFamily: "Inter_400Regular" }]}>{error}</Text> : null}
          </Animated.View>
        )}

        {/* ── Step 3 — PIN ─────────────────────────────────────────── */}
        {step === 3 && (
          <View style={styles.pinBlock}>
            <Text style={[styles.stepTitle, { fontFamily: "Inter_700Bold", textAlign: "center" }]}>
              {pinStep === "set" ? "Create your PIN" : "Confirm your PIN"}
            </Text>
            <Text style={[styles.stepSub, { fontFamily: "Inter_400Regular", textAlign: "center" }]}>
              {pinStep === "set"
                ? "Set a secure 4-digit transaction PIN"
                : "Re-enter your PIN to confirm"}
            </Text>
            {pinError && (
              <Text style={[styles.errMsg, { fontFamily: "Inter_500Medium", textAlign: "center" }]}>
                PINs don't match. Try again.
              </Text>
            )}
            <PinPad
              pin={currentPinValue}
              onKeyPress={handlePinKey}
              onDelete={handlePinDelete}
              shake={pinError}
            />
          </View>
        )}

        {/* ── Step 4 — Password ────────────────────────────────────── */}
        {step === 4 && (
          <Animated.View style={[styles.formBlock, shakeStyle]}>
            <Input
              label="Password"
              placeholder="Min. 8 characters"
              value={password}
              onChangeText={(t) => { setPassword(t); setError(""); }}
              secureTextEntry
              secureToggle
              prefixIcon={<TpIcon name="lock" size={18} color="#555" strokeWidth={1.8} />}
            />
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setError(""); }}
              secureTextEntry
              secureToggle
              prefixIcon={<TpIcon name="lock" size={18} color="#555" strokeWidth={1.8} />}
            />

            {/* Requirements — each row bounces its icon when the criterion is met */}
            <View style={styles.reqBlock}>
              {[
                { label: "At least 8 characters", ok: checks.len },
                { label: "One uppercase letter",  ok: checks.upper },
                { label: "One lowercase letter",  ok: checks.lower },
                { label: "One number",            ok: checks.num },
              ].map((r) => (
                <AnimatedReqRow key={r.label} label={r.label} ok={r.ok} />
              ))}
            </View>

            {error ? <Text style={[styles.errMsg, { fontFamily: "Inter_400Regular" }]}>{error}</Text> : null}
          </Animated.View>
        )}

        {/* ── Step 5 — Profile Photo ───────────────────────────────── */}
        {step === 5 && (
          <View style={styles.photoBlock}>
            <Pressable onPress={pickImage} style={styles.photoCircle}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.photoImg} />
              ) : (
                <>
                  <TpIcon name="camera" size={32} color="#444" strokeWidth={1.5} />
                  <Text style={[styles.photoHint, { fontFamily: "Inter_400Regular" }]}>Tap to add photo</Text>
                </>
              )}
            </Pressable>
            <Button onPress={pickImage} variant="secondary" size="medium">
              Choose from Gallery
            </Button>
            <Text style={[styles.skipNote, { fontFamily: "Inter_400Regular" }]}>
              You can also skip this and add a photo later.
            </Text>
          </View>
        )}

        {/* ── Step 6 — Bank ────────────────────────────────────────── */}
        {step === 6 && (
          <View style={styles.bankBlock}>
            <Input
              placeholder="Search bank…"
              value={bankSearch}
              onChangeText={setBankSearch}
              prefixIcon={<TpIcon name="search" size={18} color="#555" strokeWidth={1.8} />}
              autoCapitalize="none"
            />
            <View style={styles.bankGrid}>
              {filteredBanks.map((b) => {
                const selected = selectedBank === b.name;
                return (
                  <Pressable
                    key={b.name}
                    onPress={() => { setSelectedBank(b.name); setError(""); }}
                    style={[
                      styles.bankCard,
                      {
                        borderColor: selected ? b.color : "#1E1E1E",
                        backgroundColor: selected ? b.color + "18" : "#111",
                      },
                    ]}
                  >
                    <View style={[styles.bankInitials, { backgroundColor: b.color }]}>
                      <Text style={[styles.bankInitialsText, { fontFamily: "Inter_700Bold" }]}>{b.initials}</Text>
                    </View>
                    <Text
                      style={[styles.bankName, { color: selected ? "#F1FAEE" : "#888", fontFamily: "Inter_500Medium" }]}
                      numberOfLines={2}
                    >
                      {b.name}
                    </Text>
                    {selected && (
                      <View style={[styles.bankCheck, { backgroundColor: b.color }]}>
                        <TpIcon name="check" size={10} color="#fff" strokeWidth={2.5} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
            {error ? <Text style={[styles.errMsg, { fontFamily: "Inter_400Regular" }]}>{error}</Text> : null}
          </View>
        )}

        {/* ── Step 7 — Review ──────────────────────────────────────── */}
        {step === 7 && (
          <View style={styles.reviewBlock}>
            {/* Avatar preview */}
            <View style={styles.reviewAvatar}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.reviewAvatarImg} />
              ) : (
                <View style={[styles.reviewAvatarPlaceholder, { backgroundColor: PRIMARY + "22" }]}>
                  <Text style={[styles.reviewAvatarInitials, { fontFamily: "Inter_700Bold", color: PRIMARY }]}>
                    {name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"}
                  </Text>
                </View>
              )}
            </View>

            {/* Info rows */}
            {[
              { label: "Email",         value: email },
              { label: "Full Name",     value: name },
              { label: "Username",      value: "@" + username },
              { label: "Phone",         value: phone },
              { label: "Gender",        value: gender || "—" },
              { label: "Date of Birth", value: dobStr || "—" },
              { label: "PIN",           value: "••••" },
              { label: "Password",      value: "•".repeat(password.length) },
              { label: "Primary Bank",  value: selectedBank || "—" },
            ].map((row) => (
              <View key={row.label} style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { fontFamily: "Inter_400Regular" }]}>{row.label}</Text>
                <Text style={[styles.reviewValue, { fontFamily: "Inter_500Medium" }]} numberOfLines={1}>
                  {row.value}
                </Text>
              </View>
            ))}

            {error ? (
              <View style={styles.errorBox}>
                <TpIcon name="alert-circle" size={14} color={PRIMARY} />
                <Text style={[styles.errMsg, { fontFamily: "Inter_400Regular", color: "#FF6B6B", flex: 1 }]}>{error}</Text>
              </View>
            ) : null}
          </View>
        )}

        </Animated.View>

        {/* Bottom button spacer */}
        <View style={{ height: isContinueBtnStep ? 120 : 40 }} />
      </ScrollView>

      {/* Fixed bottom button */}
      {isContinueBtnStep && (
        <View style={[styles.bottomBtn, { paddingBottom: insets.bottom + 20 }]}>
          <Button
            onPress={handleNext}
            loading={loading}
            fullWidth
            size="large"
            disabled={
              (step === 6 && !selectedBank)
            }
          >
            {step === 7 ? "Create Account" : "Continue"}
          </Button>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#141414",
    alignItems: "center", justifyContent: "center",
  },
  headerIcon: { width: 38, height: 38 },

  /* Progress */
  progressTrack: { height: 3, backgroundColor: "#1A1A1A", marginHorizontal: 20, borderRadius: 2 },
  progressFill:  { height: 3, backgroundColor: PRIMARY, borderRadius: 2 },
  stepCount: { fontSize: 12, color: "#444", textAlign: "right", paddingHorizontal: 20, marginTop: 6, marginBottom: 2 },

  /* Scroll */
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },

  /* Step heading */
  stepHead:  { gap: 10, marginBottom: 28, marginTop: 8 },
  stepTitle: { fontSize: 30, color: "#F1FAEE", letterSpacing: -1 },
  stepSub:   { fontSize: 15, color: "#666", lineHeight: 22 },

  /* Forms */
  formBlock: { gap: 20 },
  centerBlock: { alignItems: "center", gap: 24, paddingTop: 16 },

  /* OTP */
  otpEmail: { fontSize: 14, color: "#666", textAlign: "center" },
  otpNote:  { fontSize: 12, color: "#444", textAlign: "center" },

  /* Gender chips */
  fieldLabel: { fontSize: 13, color: "#666", marginBottom: 8 },
  chipRow:    { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 10, borderWidth: 1.5,
  },
  chipText: { fontSize: 14 },

  /* DOB row */
  fieldRow: {
    height: 52, borderRadius: 12,
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, gap: 10,
    backgroundColor: "#161618",
  },
  fieldRowText: { flex: 1, fontSize: 15 },

  /* iOS date picker */
  iosPicker: { backgroundColor: "#181818", borderRadius: 16, overflow: "hidden", marginTop: 8 },
  iosPickerDone: { padding: 14, alignItems: "center", borderTopWidth: 1, borderTopColor: "#2A2A2A" },

  /* PIN */
  pinBlock: { alignItems: "center", gap: 20, paddingTop: 20, paddingBottom: 16 },

  /* Password requirements */
  reqBlock: { gap: 8, paddingLeft: 4 },
  reqRow:   { flexDirection: "row", alignItems: "center", gap: 8 },
  reqText:  { fontSize: 13 },

  /* Photo */
  photoBlock: { alignItems: "center", gap: 24, paddingTop: 24 },
  photoCircle: {
    width: 148, height: 148, borderRadius: 74,
    backgroundColor: "#111",
    borderWidth: 2, borderColor: "#222",
    borderStyle: "dashed",
    alignItems: "center", justifyContent: "center",
    overflow: "hidden",
    gap: 8,
  },
  photoImg:  { width: "100%", height: "100%" },
  photoHint: { fontSize: 13, color: "#555" },
  skipNote:  { fontSize: 13, color: "#444", textAlign: "center" },

  /* Banks */
  bankBlock: { gap: 16 },
  bankGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  bankCard: {
    width: "47.5%",
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 14, borderWidth: 1.5,
    alignItems: "center", gap: 8,
    position: "relative",
  },
  bankInitials: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  bankInitialsText: { fontSize: 13, color: "#fff" },
  bankName: { fontSize: 11, textAlign: "center" },
  bankCheck: {
    position: "absolute", top: 8, right: 8,
    width: 18, height: 18, borderRadius: 9,
    alignItems: "center", justifyContent: "center",
  },

  /* Review */
  reviewBlock: { gap: 0 },
  reviewAvatar: { alignItems: "center", marginBottom: 24 },
  reviewAvatarImg: { width: 80, height: 80, borderRadius: 40 },
  reviewAvatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: "center", justifyContent: "center",
  },
  reviewAvatarInitials: { fontSize: 28 },
  reviewRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#1A1A1A",
    gap: 16,
  },
  reviewLabel: { fontSize: 13, color: "#555" },
  reviewValue: { fontSize: 14, color: "#F1FAEE", flex: 1, textAlign: "right" },

  /* Error */
  errMsg: { fontSize: 13, color: PRIMARY },
  errorBox: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "#E11D3315", borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: "#E11D3330", marginTop: 8,
  },

  /* Bottom button */
  bottomBtn: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingTop: 16,
    backgroundColor: "#0A0A0A",
    borderTopWidth: 1, borderTopColor: "#111",
  },

  /* Success screen */
  successScreen: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 32, gap: 20,
  },
  successIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#2FBE73",
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
  },
  successTitle: { fontSize: 34, color: "#F1FAEE", letterSpacing: -1, textAlign: "center" },
  successSub:   { fontSize: 15, color: "#666", lineHeight: 24, textAlign: "center" },
});
