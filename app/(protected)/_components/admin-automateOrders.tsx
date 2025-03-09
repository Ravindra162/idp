"use client";
import React, { useState, useEffect } from "react";
import {
  fetchAutomationState,
  updateAutomationState,
} from "@/actions/admin-automateOrders";
import { Button } from "@/components/ui/button";

interface AdminAutomateOrdersProps {
  userId: string; 
  domainId : string;
}
const AdminAutomateOrders: React.FC<AdminAutomateOrdersProps> = ({
  userId,
  domainId
}) => {
  const [isAutomationEnabled, setIsAutomationEnabled] = useState<
    boolean | null
  >(null); 

  useEffect(() => {
    const getState = async () => {
      const state = await fetchAutomationState(domainId);
      console.log(state);
      setIsAutomationEnabled(state);
    };

    getState();
  }, [domainId]);

  const handleToggle = async () => {
    console.log("---------------");
    if (isAutomationEnabled === null) return; 

    const newState = !isAutomationEnabled;
    const success = await updateAutomationState({ autmVar: newState, domainId: domainId, userId : userId });
    console.log(success);
    if (success) {
      setIsAutomationEnabled(newState);
    }
  };

  return (
    <div>
      {isAutomationEnabled !== null ? (
        <Button
          onClick={handleToggle}
          variant={isAutomationEnabled ? "destructive" : "default"}
          className="mt-2 ml-5 "
        >
          {isAutomationEnabled ? "Deactivate" : "Activate"}
        </Button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminAutomateOrders;