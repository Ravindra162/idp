import React from "react";
import { auth } from "@/auth";
import EditWalletForm, {
  WalletTypeProps,
} from "../../_components/edit-wallet-form";
import TopBar from "@/app/(protected)/_components/Topbar";
import { db } from "@/lib/db";
import { getDomains } from "@/actions/admin-domains";
import { PaymentType } from "@prisma/client";
import { PaymentMethodDetails } from "../../_components/wallet-form";

export const generateMetadata = () => {
  return {
    title: "Edit Wallet Type | GrowonsMedia",
    description: "Edit Wallet Type",
  };
};

const Page = async ({ params }: { params: { id: string } }) => {

  const { initialData, paymentTypes, domains, paymentMethodDetails } =
    await fetchData(params.id);

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Wallet Type" />
      </nav>
      <section>
        <div className="m-4">
          <EditWalletForm
            intialVals={initialData}
            paymentTypes={paymentTypes}
            domains={domains}
            paymentTypeMethodDetails={paymentMethodDetails ?? []}
          />
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
      select: {
        id: true,
        name: true,
        currencyCode: true,
        description: true,
        domainIds: true,
        payments: true,
      },
    });

    const transformedWalletType = walletType
      ? {
          ...walletType,
          domainIds: Array.isArray(walletType.domainIds)
            ? walletType.domainIds.map((id) => ({ type: id }))
            : [],
        }
      : null;

    const walletPayments = await db.walletTypePayment.findMany({
      where: { walletTypeId: id },
      include: { paymentModel: true },
    });

    const paymentTypeMethodDetails = await db.paymentTypeModel.findMany({
      where: {
        NOT: {
          paymentTypeMethod: "PAYMENT_GATEWAY",
        },
      },
    });

    const paymentMethodDetails: PaymentMethodDetails[] =
      paymentTypeMethodDetails.map((payment) => ({
        id: payment.id,
        public_id: payment.public_id,
        secure_url: payment.secure_url,
        upiid: payment.upiid,
        upinumber: payment.upinumber,
        accountDetails: payment.accountDetails,
        ifsccode: payment.ifsccode,
        accountType: payment.accountType,
        name: payment.name,
        bankName: payment.bankName,
      }));

    let initialData: WalletTypeProps = {
      id: "",
      name: "",
      currencyCode: "",
      description: "",
      domainIds: [],
      payments: [],
    };

    if (walletType) {
      initialData = {
        id: walletType.id,
        name: walletType.name,
        currencyCode: walletType.currencyCode,
        description: walletType.description ?? "",
        domainIds: transformedWalletType?.domainIds ?? [{ type: "" }],
        payments: walletPayments,
      };
    }

    const paymentTypes = paymentTypesResponse.map((type) => ({ type }));

    return {
      paymentTypes,
      domains: domainsResponse.data || [],
      initialData,
      paymentMethodDetails : paymentMethodDetails || [],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      paymentTypes: [],
      domains: [],
      initialData: null,
      paymentTypeMethodDetails: [],
    };
  }
}

export default Page;
