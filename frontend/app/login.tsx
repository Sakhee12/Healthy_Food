import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { sendOtp, verifyOtp } from "../api/auth";
import { ActivityIndicator } from "react-native";

const journeyImages = [
  require("../assets/images/poster1.jpg"),
  require("../assets/images/poster2.jpg"),
  require("../assets/images/poster3.jpg"),
  require("../assets/images/poster4.jpg"),
  
  require("../assets/images/bites.jpg"),
  require("../assets/images/cookies.jpg"),
  require("../assets/images/dryfruit.jpg"),
  require("../assets/images/ghee.jpg"),
  require("../assets/images/makhan.jpg"),
  require("../assets/images/papad.jpg"),
  require("../assets/images/nuts.jpg"),
];

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams();
  const { login } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    const res = await sendOtp(phone);
    setLoading(false);
    if (res.success) {
      setShowOtp(true);
    } else {
      setError(res.message);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    const res = await verifyOtp(phone, otp);
    setLoading(false);
    if (res.success && res.token) {
      login(phone, res.token);
      if (redirect === "checkout") {
        router.replace("/checkout");
      } else {
        router.replace("/home");
      }
    } else {
      setError(res.message);
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % journeyImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Images */}
      <Animated.Image
        source={journeyImages[index]}
        style={[styles.heroImage, { opacity: fadeAnim }]}
        resizeMode="contain"
      />

      {/* Logo */}
      <Image
        source={require("../assets/images/logo.jpeg")}
        style={styles.logo}
      />

      <Text style={styles.title}>Healthy khao, umar badhao</Text>
      <Text style={styles.subtitle}>
        Fresh • Organic • Nutrition for life
      </Text>

      {/* PHONE INPUT */}
      {!showOtp && (
        <>
          <View style={styles.inputBox}>
            <Text style={styles.code}>+91</Text>
            <TextInput
              placeholder="Enter mobile number"
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: phone.length === 10 ? "#2E7D32" : "#BDBDBD" },
            ]}
            disabled={phone.length !== 10 || loading}
            onPress={handleSendOtp}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Continue</Text>}
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to our{" "}
            <Text style={styles.link}>Terms</Text> &{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </>
      )}

      {/* OTP INPUT */}
      {showOtp && (
        <>
          <Text style={styles.otpText}>
            Enter OTP sent to +91 {phone}
          </Text>

          <TextInput
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            placeholder="• • • • • •"
            placeholderTextColor="#AAA"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: otp.length === 6 ? "#2E7D32" : "#BDBDBD" },
            ]}
            disabled={otp.length !== 6 || loading}
            onPress={handleVerifyOtp}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
          </TouchableOpacity>

          <Text style={styles.resend}>Didn’t receive OTP? Resend</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 24,
  },

  heroImage: {
    width: "90%",
    height: 220,
    marginBottom: 10,
  },

  logo: {
    width: 80,
    height: 80,
    marginTop: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B5E20",
    marginTop: 12,
  },

  subtitle: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 4,
    marginBottom: 30,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    borderRadius: 14,
    width: "100%",
    height: 50,
    paddingHorizontal: 12,
  },

  code: {
    fontWeight: "600",
    marginRight: 6,
    color: "#2E7D32",
  },

  input: {
    flex: 1,
    fontSize: 15,
  },

  button: {
    width: "100%",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  otpText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    marginTop: 10,
  },

  otpInput: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    borderRadius: 14,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 10,
  },

  resend: {
    marginTop: 18,
    color: "#2E7D32",
    fontWeight: "600",
  },

  terms: {
    fontSize: 11,
    color: "#757575",
    textAlign: "center",
    marginTop: 20,
  },

  link: {
    color: "#2E7D32",
    fontWeight: "600",
  },
});