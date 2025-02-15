import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDomains } from "@/actions/admin-domains";
import TopBar from "../../../_components/Topbar";
import PanelListingTable from "../_components/panel-listing-component";

export const generateMetadata = () => {
  return {
    title: "Panels | GrowonsMedia",
    description: "Panels Listing page",
  };
};

const page = async () => {
  const domainsResponse = await getDomains();
  const domains = domainsResponse?.data || [];
  const half = Math.ceil(domains.length / 2);
  const firstHalf = domains.slice(0, half);
  const secondHalf = domains.slice(half);

  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Panels" />
      </div>
      <section className="space-y-4 md:max-h-[90vh] w-full md:w-[100%] p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 h-full w-full">
          <div>
            <PanelListingTable domains={firstHalf} />
          </div>
          <div>
            <PanelListingTable domains={secondHalf} />
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
