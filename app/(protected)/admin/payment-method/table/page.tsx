import { auth } from "@/lib/auth";
import { PaymentTypeTable } from "../_components/payment-method-details-table";
import TopBar from "@/app/(protected)/_components/Topbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const generateMetadata = () => {
  return {
    title: "Payment Methods | GrowonsMedia",
    description: "View and manage your payment methods",
  };
};

const Page = async ({ searchParams }: { searchParams: { page: string } }) => {
  const session = await auth();
  const userId = session?.user.id || "";

  if (!userId) {
    return <p className="text-center text-red-500">Unauthorized</p>;
  }

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Payment Methods" />
      </nav>
      <section>
        <div className="m-2">
        <div className="flex justify-between items-center">
        <Button className="flex items-center " asChild>
          <Link href={`/admin/payment-method/add`} className="inline">
            <Image
              src="/svgs/plus.svg"
              alt="add payment method"
              width={20}
              height={20}
              className="h-6 w-6 mr-1"
            />
             Add PaymentMethod
          </Link>
        </Button>
      </div>
          <PaymentTypeTable userId={userId} searchParams={searchParams} />
        </div>
      </section>
    </>
  );
};

export default Page;
