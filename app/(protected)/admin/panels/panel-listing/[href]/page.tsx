import React from "react";
import { getDomains } from "@/actions/admin-domains";
import TopBar from "../../../../_components/Topbar";
import PanelListingTable from "../../_components/panel-listing-component";
import { db } from "@/lib/db";

export const generateMetadata = () => {
  return {
    title: "Panels | GrowonsMedia",
    description: "Panels Listing page",
  };
};

const page = async ({ params }: { params: { href: string } }) => {
  const domainsResponse = await getDomains();
  let basehref = "";
  if(params.href === "user"){
    basehref = "/admin/user/table";
  }
  else if(params.href === "wallet-history"){
    basehref = "/admin/wallet/history"
  }
  else if(params.href === "wallet"){
    basehref = "/admin/wallet/invoices";
  }
  else if(params.href === "withdraw_funds"){
    basehref = "/admin/withdraw_funds/records";
  }
  else if(params.href === "withdraw_funds-history"){
    basehref = "/admin/withdraw_funds/history";
  }
  else if(params.href === "team"){
    basehref = "/admin/team/table";
  }
  else if(params.href === "order"){
    basehref = "/admin/orders/records";
  }
  else if(params.href === "order-history"){
    basehref = "/admin/orders/history";
  }
  else if(params.href === "user-analytics"){
    basehref = "/admin/analytics/user";
  }
  else if(params.href === "wallet-analytics"){
    basehref = "/admin/analytics/wallet/table";
  }
  else if(params.href === "product-analytics"){
    basehref = "/admin/analytics/product";
  }
  const domains = await Promise.all(
      (domainsResponse?.data || []).map(async (domain: any) => {

        let pendingInvoiceCount = 0;
        if(params.href === "wallet") {
          await db.money.count({
            where: {
              status: "PENDING",
              domainId: domain.id,
            },
          });
        }
        else if(params.href === "order") {
          await db.order.count({
            where: {
              status: "PENDING",
              domainId: domain.id,
            }
          });
        }
        else if(params.href === "withdraw") {
          await db.withdrawalRequest.count({
            where: {
              status: "PENDING",
              domainId: domain.id,
            }
          });
        }

        return {
          ...domain,
          href: `${basehref}/${domain.id}`,
          notifications:pendingInvoiceCount,
        };
      })
  );
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
            <PanelListingTable domains={firstHalf}  />
          </div>
          <div>
            <PanelListingTable domains={secondHalf}/>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
