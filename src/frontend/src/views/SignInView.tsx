import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";

interface Props {
  onSignIn: () => void;
}

export default function SignInView({ onSignIn }: Props) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [activeTab, setActiveTab] = useState("mobile");

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Block invalid characters
    if (/[^0-9+\-]/.test(raw)) {
      setPhoneError("Enter a valid mobile number.");
      const filtered = raw.replace(/[^0-9+\-]/g, "");
      setPhone(filtered);
      return;
    }
    // Only keep allowed characters
    const filtered = raw.replace(/[^0-9+\-]/g, "");
    // Validate total length
    if (filtered.length > 15) {
      setPhoneError("Enter a valid phone number");
      return; // don't update state — block input beyond 15
    }
    setPhone(filtered);
    setPhoneError("");
  }

  function handleContinue() {
    if (activeTab === "mobile") {
      const digits = phone.replace(/\D/g, "");
      if (phone.length > 15) {
        setPhoneError("Enter a valid phone number");
        return;
      }
      if (digits.length < 10) {
        setPhoneError(
          "Please enter a valid phone number (at least 10 digits).",
        );
        return;
      }
      setPhoneError("");
      localStorage.setItem(
        "homefit_user",
        JSON.stringify({ type: "phone", value: phone }),
      );
      onSignIn();
    } else {
      if (!email.toLowerCase().endsWith("@gmail.com")) {
        setEmailError(
          "Please enter a valid Gmail address (must end in @gmail.com).",
        );
        return;
      }
      setEmailError("");
      localStorage.setItem(
        "homefit_user",
        JSON.stringify({ type: "gmail", value: email }),
      );
      onSignIn();
    }
  }

  return (
    <div className="min-h-screen bg-hero-bg flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-card border border-border w-full max-w-md p-8"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/generated/homefit-logo-transparent.dim_400x200.png"
            alt="HomeFit"
            className="h-14 w-auto"
          />
        </div>

        <h1 className="text-2xl font-extrabold text-foreground text-center mb-1">
          Welcome to HomeFit
        </h1>
        <p className="text-muted-foreground text-center text-sm mb-8">
          Sign in to start your workout journey
        </p>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setPhoneError("");
            setEmailError("");
          }}
        >
          <TabsList className="w-full mb-6 bg-muted" data-ocid="signin.tab">
            <TabsTrigger
              value="mobile"
              className="flex-1 text-sm font-semibold"
              data-ocid="signin.mobile.tab"
            >
              📱 Mobile Number
            </TabsTrigger>
            <TabsTrigger
              value="gmail"
              className="flex-1 text-sm font-semibold"
              data-ocid="signin.gmail.tab"
            >
              ✉️ Gmail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mobile">
            <div className="space-y-2">
              <label
                htmlFor="phone-input"
                className="text-sm font-medium text-foreground"
              >
                Mobile Number
              </label>
              <Input
                id="phone-input"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={handlePhoneChange}
                className="h-12 text-base rounded-xl border-border focus-visible:ring-primary"
                data-ocid="signin.phone.input"
              />
              {phoneError && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="signin.phone.error_state"
                >
                  {phoneError}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="gmail">
            <div className="space-y-2">
              <label
                htmlFor="email-input"
                className="text-sm font-medium text-foreground"
              >
                Gmail Address
              </label>
              <Input
                id="email-input"
                type="email"
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                className="h-12 text-base rounded-xl border-border focus-visible:ring-primary"
                data-ocid="signin.email.input"
              />
              {emailError && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="signin.email.error_state"
                >
                  {emailError}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button
          type="button"
          onClick={handleContinue}
          className="w-full h-12 mt-6 bg-primary text-primary-foreground font-bold text-base rounded-xl hover:opacity-90 transition-opacity"
          data-ocid="signin.continue.primary_button"
        >
          Continue →
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
          By continuing, you agree to HomeFit's{" "}
          <span className="text-primary cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-primary cursor-pointer hover:underline">
            Privacy Policy
          </span>
          .
        </p>
      </motion.div>

      <p className="text-xs text-muted-foreground mt-6">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
