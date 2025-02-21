import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../_components/Topbar";
import { getDomains } from "@/actions/admin-domains";
import PaymentMethodDetailsForm from "../../_components/payment-method-details-form";
import EditPaymentMethodDetailsForm, { PaymentTypeMethod } from "../../_components/edit-payment-method-details-form";
import { db } from "@/lib/db";

export const generateMetadata = () => {
  return {
    title: "Edit Payment Method | GrowonsMedia",
    description: "Edit Payment Method",
  };
};

const page = async ({params} : { params : {id : string}}) => {
  const session = await auth();

  const paymentDetails = await db.paymentTypeModel.findUnique({
    where: { id : params.id },
  });

  const initialValues : PaymentTypeMethod = {
        accountDetails: paymentDetails?.accountDetails || "",
        upiid: paymentDetails?.upiid || "",
        upinumber: paymentDetails?.upinumber || "",
        image: undefined, 
        name: paymentDetails?.name || "",
        bankName: paymentDetails?.bankName || "",
        accountType: paymentDetails?.accountType || "",
        ifsccode: paymentDetails?.ifsccode || "",
        userId: session?.user.id || "",
      }
    ;

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Payment Method" />
      </nav>
      <section>
        <div className="m-4">
          <EditPaymentMethodDetailsForm userId = {session?.user.id || ""} initialValues={initialValues} />
        </div>
      </section>
    </>
  );
};


export default page;
