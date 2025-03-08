import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import PaginationBar from "./PaginationBar";
import { formatPrice } from "@/components/shared/formatPrice";
import BadgeStatus from "./BadgeStatus";
import ImageDialog from "@/components/shared/Image-dialog";
import ReasonDialog from "@/components/shared/ReasonDialog";
import { revalidatePath } from "next/cache";

type TableProps = {
  searchParams: { page: string };
  userId: string;
  walletId : string;
};

export async function MoneyTable({ userId, walletId, searchParams }: TableProps) {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 12;
  const totalItemCount = (
    await db.money.findMany({
      where: { userId: userId , walletId : walletId },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const invoices = await db.money.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const wallet = await db.wallet.findUnique({
    where : {
      id : walletId
    },
    include : {
      walletType : true
    }
  });

  revalidatePath(`/money/record/${userId}`);

  return (
    <section>
      <div className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[75vh] w-full md:w-[100%] p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account No</TableHead>
              <TableHead>UPI-ID</TableHead>
              <TableHead>Transaction id</TableHead>
              <TableHead>Charge Money</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          {totalItemCount === 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No invoices found
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.upiId}>
                <TableCell>{invoice.accountNumber}</TableCell>
                <TableCell>{invoice.upiId}</TableCell>
                <TableCell>{invoice.transactionId}</TableCell>
                <TableCell>{formatPrice(Number(invoice.amount), wallet?.walletType.currencyCode ?? "")}</TableCell>
                <TableCell className="cursor-pointer">
                  {invoice.status === "FAILED" && invoice.failureReason !== null ? (
                    <ReasonDialog
                      status={invoice.status}
                      reason={invoice.failureReason}
                    />
                  ) : (
                    <BadgeStatus status={invoice.status} />
                  )}
                </TableCell>
                <TableCell>
                  <ImageDialog
                    imageLink={
                      invoice.secure_url === "PayGIC Payment Gateway"
                        ? "/svgs/logo.webp"
                        : invoice.secure_url ?? ""
                    }
                  />
                </TableCell>
                <TableCell>{invoice.createdAt.toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalItemCount !== 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-left" colSpan={4}>
                  {formatPrice(
                    invoices.reduce((acc, cur) => acc + Number(cur.amount), 0), wallet?.walletType.currencyCode ?? ""
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
}
