import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationBar from "../../../money/_components/PaginationBar";
import { revalidatePath } from "next/cache";
import ImageDialog from "@/components/shared/Image-dialog";
import ModifyPaymentMethodType from "./payment-method-modify";

type PaymentTypeTableProps = {
  searchParams: { page: string };
  userId: string;
};

export async function PaymentTypeTable({
  userId,
  searchParams,
}: PaymentTypeTableProps) {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  // Fetch total count for pagination
  const totalItemCount = await db.paymentTypeModel.count({
    where: { userId: userId },
  });

  const totalPages = Math.ceil(totalItemCount / pageSize);

  // Fetch records with pagination
  const paymentMethods = await db.paymentTypeModel.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath(`/payment-methods/${userId}`);

  return (
    <section>
      <div className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[75vh] w-full md:w-[100%] p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UPI ID</TableHead>
              <TableHead>UPI Number</TableHead>
              <TableHead>Account Details</TableHead>
              <TableHead>IFSC Code</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Bank Name</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {totalItemCount === 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={12} className="text-center">
                  No payment methods found
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
          <TableBody>
            {paymentMethods.map((method) => (
              <TableRow key={method.id}>
                <TableCell>{method.upiid || "N/A"}</TableCell>
                <TableCell>{method.upinumber || "N/A"}</TableCell>
                <TableCell>{method.accountDetails || "N/A"}</TableCell>

                {/* <TableCell>{method.secure_url}</TableCell> */}
                <TableCell>{method.ifsccode || "N/A"}</TableCell>
                <TableCell>{method.accountType || "N/A"}</TableCell>
                <TableCell>{method.name || "N/A"}</TableCell>
                <TableCell>{method.bankName || "N/A"}</TableCell>
                <TableCell>{method.paymentTypeMethod}</TableCell>
                <TableCell>
                  <ImageDialog
                    imageLink={
                      method.secure_url === null
                        ? "/svgs/logo.webp"
                        : method.secure_url
                    }
                  />
                </TableCell>
                <TableCell>
                  <ModifyPaymentMethodType id={userId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
}
