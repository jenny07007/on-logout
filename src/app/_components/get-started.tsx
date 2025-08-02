"use client";
import { useModal, useAccount } from "@getpara/react-sdk";
import UserAvatar from "./user-avatar";

export default function GetStarted() {
  const { openModal } = useModal();
  const { isConnected } = useAccount();

  if (isConnected) {
    return <UserAvatar />;
  }

  return (
    <button
      className="transform rounded-lg bg-white px-6 py-3 font-semibold text-purple-900 shadow-lg transition-colors duration-200 hover:cursor-pointer hover:bg-purple-100 active:scale-95"
      onClick={() => {
        openModal();
      }}
    >
      Get Started
    </button>
  );
}
