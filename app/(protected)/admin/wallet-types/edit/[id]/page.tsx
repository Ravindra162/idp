import React from "react";
import { auth } from "@/auth";
import EditWalletForm, { WalletTypeProps } from "../../_components/edit-wallet-form";
import TopBar from "@/app/(protected)/_components/Topbar";
import { db } from "@/lib/db";
import { getDomains } from "@/actions/admin-domains";
import { PaymentType } from "@prisma/client";

export const generateMetadata = () => {
  return {
    title: "Edit Wallet Type | GrowonsMedia",
    description: "Edit Wallet Type",
  };
};

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const { initialData, paymentTypes, domains } = await fetchData(id);

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Wallet Type" />
      </nav>
      <section>
        <div className="m-4">
          <EditWalletForm intialVals={initialData} paymentTypes={paymentTypes} domains={domains} />
        </div>
      </section>
    </>
  );
};

async function fetchData(id: string) {
  try {
    const paymentTypesResponse = ["MANUAL", "PAYMENT_GATEWAY", "CUSTOM_METHOD"];
    const domainsResponse = await getDomains();

    const walletType = await db.walletType.findFirst({
      where: { id: id },
    });

    let initialData: WalletTypeProps = {
      id: "",
      name: "",
      currencyCode: "",
      description: "",
      paymentType: [],
      domainId: [],
      cstpaymentId: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (walletType) {
      initialData = {
        id: walletType.id,
        name: walletType.name,
        currencyCode: walletType.currencyCode,
        description: walletType.description ?? "",
        domainId: walletType.domainId as string[],
        paymentType: walletType.paymentType as PaymentType[],
        cstpaymentId: walletType.cstpaymentId as string[],
        createdAt: new Date(walletType.createdAt),
        updatedAt: new Date(walletType.updatedAt),
      };
    }

    const paymentTypes = paymentTypesResponse.map((type) => ({ type }));

    return { paymentTypes, domains: domainsResponse.data || [], initialData };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { paymentTypes: [], domains: [], initialData: null };
  }
}

export default Page;
