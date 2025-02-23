import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../_components/Topbar";
import { getDomains } from "@/actions/admin-domains";
import EditPaymentMethodDetailsForm, {
  PaymentTypeMethod,
} from "../../_components/edit-payment-method-details-form";
import { db } from "@/lib/db";

export const generateMetadata = () => {
  return {
    title: "Edit Payment Method | GrowonsMedia",
    description: "Edit Payment Method",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const session = await auth();

  const paymentTypesResponse = ["MANUAL", "CUSTOM_METHOD"];

  const paymentTypes = paymentTypesResponse.map((type) => ({ type }));

  const paymentDetails = await db.paymentTypeModel.findUnique({
    where: { id: params.id },
  });
  console.log(params.id);
  

  const initialValues: PaymentTypeMethod = {
    paymentType: paymentDetails?.paymentTypeMethod || "",
    accountDetails: paymentDetails?.accountDetails || "",
    upiid: paymentDetails?.upiid || "",
    upinumber: paymentDetails?.upinumber || "",
    image: undefined,
    name: paymentDetails?.name || "",
    bankName: paymentDetails?.bankName || "",
    accountType: paymentDetails?.accountType || "",
    ifsccode: paymentDetails?.ifsccode || "",
    userId: session?.user.id || "",
  };
  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Payment Method" />
      </nav>
      <section>
        <div className="m-4">
          <EditPaymentMethodDetailsForm
            userId={session?.user.id || ""}
            initialValues={initialValues}
            paymentTypes={paymentTypes}
          />
        </div>
      </section>
    </>
  );
};

export default page;
