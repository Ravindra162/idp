import { auth, signOut } from "@/auth";
import TopBar from "./_components/Topbar";
import NewsNotices from "./_components/News-notices";
import BalanceCard from "./_components/BalanceCard";
import BankDetails from "./_components/bank-details";
import SupportLink from "./_components/support-link";
import AdminAutomateOrders from "./_components/admin-automateOrders";
import AdminUpdateStocks from "./_components/update-stocks";
import ManagePaymentMode from "./_components/mange-payments-mode";
import { db } from "@/lib/db";
export default async function Home() {
  const session = await auth();

  console.log(session)


  

  return (
    <section>
      <div className="hidden md:block">
        <TopBar title={"Dashboard"} />
      </div>
      <NewsNotices />
      <div>
        <p className="border-l-4 rounded-sm border-black  mt-4 mx-2">
          <span className="ml-1 text-lg font-semibold">Overview</span>
        </p>
        <div className="flex flex-wrap">
          {session?.user.role !== "ADMIN" && <BalanceCard />}
          {session?.user.role === "ADMIN" && <BankDetails />}
          {session?.user.role === "ADMIN" && (
            <AdminAutomateOrders userId={session.user.id ?? ""} />
          )}
          {session?.user.role === "ADMIN" && <AdminUpdateStocks />}
          {session?.user.role === "ADMIN" && <SupportLink />}
          {session?.user.role === "ADMIN" && <ManagePaymentMode />}
        </div>
      </div>
    </section>
  );
}
