import React from "react";
import { auth } from "@/auth";
import { getDomains } from "@/actions/admin-domains";
import DomainAutomationForm from "./manage-automation-orders";

const ManageAutomateSettings = async () => {
  // const domainsList = await getDomains();

  // console.log(domainsList);

  const session = await auth();
  return (
    <div className="flex justify-around flex-col mx-2 mt-5 w-full md:w-56 bg-gray-100 p-2 rounded-lg h-24 md:h-28">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Automate Orders</span>
      </div>
      <p className="mt-3">
        <DomainAutomationForm />
      </p>
    </div>
  );
};

export default ManageAutomateSettings;
