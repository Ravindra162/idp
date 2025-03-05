"use client";
import React, { useState, useEffect } from "react";
import { fetchVisibilityState, updateVisibilityState } from "@/actions/admin-visibility";
import { Button } from "@/components/ui/button";

interface AdminVisibilityProps {
  productId: string;
  text: string;
  field: "visibleToAllDomains" | "visibleToAllTeams" | "visibleToAllWalletTypes";
}

const AdminVisibility: React.FC<AdminVisibilityProps> = ({ productId, text, field }) => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const getState = async () => {
      const state = await fetchVisibilityState(productId, field);
      setIsVisible(state);
    };

    getState();
  }, [productId, field]);

  const handleToggle = async () => {
    if (isVisible === null) return;

    const newState = !isVisible;
    const success = await updateVisibilityState({ productId, newState, field });

    if (success) {
      setIsVisible(newState);
    }
  };

  return (
    <Button onClick={handleToggle} variant={isVisible ? "destructive" : "default"}>
      {isVisible ? `Deactivate ${text}` : `Activate ${text}`}
    </Button>
  );
};

export default AdminVisibility;
