import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../_components/Topbar";
import PaymentMethodDetailsForm from "../_components/payment-method-details-form";
import { PaymentType } from "@prisma/client";

export const generateMetadata = () => {
  return {
    title: "Add Payment Method | GrowonsMedia",
    description: "Add Payment Method",
  };
};

const page = async () => {
  const session = await auth();

  const { paymentTypes } = await fetchData();

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Add Payment Method" />
      </nav>
      <section>
        <div className="m-4">
          <PaymentMethodDetailsForm
            userId={session?.user.id || ""}
            paymentTypes={paymentTypes}
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

    const paymentTypes = paymentTypesResponse.map((type) => ({ type }));

    return { paymentTypes };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { paymentTypes: [] };
  }
}

export default page;
