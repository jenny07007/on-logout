"use client";

import { ParaProvider as ParaSDKProvider } from "@getpara/react-sdk";
import { API_KEY, ENVIRONMENT } from "~/lib/para";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import "@getpara/react-sdk/styles.css";

const solanaNetwork = WalletAdapterNetwork.Devnet;
const endpoint = "https://api.devnet.solana.com";

export function ParaProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ParaSDKProvider
      paraClientConfig={{
        apiKey: API_KEY,
        env: ENVIRONMENT,
      }}
      externalWalletConfig={{
        wallets: ["PHANTOM", "BACKPACK", "SOLFLARE"],
        includeWalletVerification: true,
        solanaConnector: {
          config: {
            endpoint,
            chain: solanaNetwork,
            appIdentity: {
              uri:
                typeof window !== "undefined"
                  ? `${window.location.protocol}//${window.location.host}`
                  : "",
            },
          },
        },
      }}
      config={{
        appName: "Harkness Research",
        disableAutoSessionKeepAlive: true,
      }}
      callbacks={{
        onLogout(event) {
          console.log("[ParaProvider] User logged out:", event);
        },
      }}
      paraModalConfig={{
        disableEmailLogin: false,
        disablePhoneLogin: true,
        authLayout: ["AUTH:FULL", "EXTERNAL:FULL"],
        oAuthMethods: ["GOOGLE", "TWITTER"],
        onRampTestMode: true,
        theme: {
          foregroundColor: "#010101",
          backgroundColor: "#F8F8F8",
          accentColor: "#c1c1c1",
          darkForegroundColor: "#b2b2b2",
          darkBackgroundColor: "#101010",
          darkAccentColor: "#515151",
          mode: "light",
          borderRadius: "none",
          font: "Inter",
        },
        logo: "/logo.svg",
        recoverySecretStepEnabled: false,
        twoFactorAuthEnabled: false,
      }}
    >
      {children}
    </ParaSDKProvider>
  );
}
