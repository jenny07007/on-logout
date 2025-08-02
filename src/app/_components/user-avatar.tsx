"use client";

import { useAccount, useLinkedAccounts, useLogout } from "@getpara/react-sdk";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useModal } from "@getpara/react-sdk";

interface UserInfo {
  name: string;
  email?: string;
  address?: string;
  avatar?: string;
  type: string;
}

export default function UserAvatar() {
  const { embedded, external } = useAccount();
  const { data: linkedAccounts } = useLinkedAccounts({ withMetadata: true });
  const { logout } = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const getUserInfo = (): UserInfo | null => {
    if (linkedAccounts) {
      const primaryAccounts = linkedAccounts.primary || [];
      for (const account of primaryAccounts) {
        if (account.type === "EMAIL") {
          return {
            email: account.identifier,
            name: account.displayName ?? account.identifier.split("@")[0],
            type: "email",
          };
        }

        if (account.type === "GOOGLE" && account.metadata) {
          const metadata = account.metadata as {
            email?: string;
            name?: string;
            picture?: string;
          };
          return {
            email: metadata.email ?? account.identifier,
            name:
              metadata.name ??
              account.displayName ??
              account.identifier.split("@")[0],
            avatar: metadata.picture,
            type: "google",
          };
        }

        if (account.type === "TWITTER" && account.metadata) {
          const metadata = account.metadata as {
            name?: string;
            username?: string;
            profile_image_url?: string;
          };
          return {
            name: metadata.name ?? metadata.username ?? account.displayName,
            avatar: metadata.profile_image_url,
            type: "twitter",
          };
        }
      }

      const linkedAccountsList = linkedAccounts.linked || [];
      for (const account of linkedAccountsList) {
        if (account.type === "EMAIL") {
          return {
            email: account.identifier,
            name: account.displayName ?? account.identifier.split("@")[0],
            type: "email",
          };
        }
      }
    }

    if (
      embedded?.isConnected &&
      embedded?.wallets &&
      embedded.wallets.length > 0
    ) {
      const wallet = embedded.wallets[0];
      if (wallet?.address) {
        return {
          address: wallet.address,
          name: `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`,
          type: "wallet",
        };
      }
    }

    if (external?.solana?.publicKey) {
      const address = external.solana.publicKey.toString();
      return {
        address,
        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
        type: "solana-wallet",
      };
    }

    return null;
  };

  const userInfo = getUserInfo();

  if (!userInfo) return null;

  const getInitial = () => {
    if (userInfo.name) {
      return userInfo.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20"
      >
        {userInfo.avatar ? (
          <Image
            src={userInfo.avatar}
            alt="User avatar"
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
            {getInitial()}
          </div>
        )}
        <div className="text-left">
          <div className="text-sm font-medium text-white">{userInfo.name}</div>
          {userInfo.email && (
            <div className="text-xs text-white/70">{userInfo.email}</div>
          )}
        </div>
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-72 rounded-lg bg-white shadow-lg">
          <div className="border-b border-gray-200 p-4">
            <div className="font-medium break-all text-gray-900">
              {userInfo.name}
            </div>
            {userInfo.email && (
              <div className="text-sm break-all text-gray-500">
                {userInfo.email}
              </div>
            )}
            {userInfo.address && (
              <div className="mt-1 font-mono text-xs break-all text-gray-400">
                {userInfo.address}
              </div>
            )}
            <div className="mt-1 text-xs text-gray-400">
              Connected via {userInfo.type}
            </div>
          </div>
          <div className="space-y-1 p-2">
            <button
              onClick={() => {
                openModal();
                setShowDropdown(false);
              }}
              className="w-full rounded px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              My Wallet
            </button>
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              className="w-full rounded px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
