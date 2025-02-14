"use client";

import React, { useEffect, useState, useTransition } from "react";
import { fetchAutomationStates, updateAutomationState } from "@/actions/admin-automateOrders";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type AutomationState = {
    id: string;
    domainId: string;
    domainName: string;
    autmVar: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  

const DomainAutomationForm = () => {
  const [domains, setDomains] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [automationStates, setAutomationStates] = useState<AutomationState[]>([]);


  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-sm font-bold">Edit Settings</h2>
      <div className="grid gap-4">
        {domains.map(({ domainId, domainName, autmVar, userId }) => (
          <div key={domainId} className="p-4 border rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{domainName}</p>
              <p className="text-sm text-gray-500">Domain ID: {domainId}</p>
            </div>
            <Button
              disabled={isPending}
              onClick={() => {}}
              className={autmVar ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
            >
              {autmVar ? "Enabled" : "Disabled"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainAutomationForm;
