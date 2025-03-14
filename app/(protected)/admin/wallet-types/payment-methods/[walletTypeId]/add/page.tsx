import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../../_components/Topbar";
import { db } from "@/lib/db";
import AddIncludePaymentMethodsForm from "../_components/add-include-payment-methods-form";
import { PaymentMethodDetails } from "../../../_components/wallet-form";
import { PaymentType } from "@prisma/client";

export const generateMetadata = () => {
  return {
    title: "Add Payment Method | GrowonsMedia",
    description: "Add Payment Method",
  };
};

const page = async ({ params }: { params: { walletTypeId: string } }) => {
  const session = await auth();

  const { paymentTypes, paymentMethodDetails } = await fetchData();

  const teams = await db.team.findMany({
    select: {
      id: true,
      teamId: true,
      name: true,
      products: {
        select: {
          productId: true,
          name: true,
          Price: true,
          Max: true,
          Min: true,
        },
      },
    },
  });

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Add Payment Method" />
      </nav>
      <section>
        <div className="m-4">
          <AddIncludePaymentMethodsForm
            walletTypeId={params.walletTypeId}
            paymentTypes={paymentTypes}
            paymentTypeMethodDetails={paymentMethodDetails}
          />
        </div>
      </section>
    </>
  );
};

async function fetchData() {
  try {
    const paymentTypesResponse = [
      PaymentType.MANUAL,
      PaymentType.CUSTOM_METHOD,
      PaymentType.PAYMENT_GATEWAY,
    ];

    const paymentTypeMethodDetails = await db.paymentTypeModel.findMany({});

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

    const paymentTypes = paymentTypesResponse.map((type) => ({ type }));

    return { paymentTypes, paymentMethodDetails };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { paymentTypes: [], paymentMethodDetails: [] };
  }
}

export default page;
