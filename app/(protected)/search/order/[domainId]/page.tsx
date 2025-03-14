import Search from "@/components/shared/search";
import {
  Table,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import BalanceCell from "../../../admin/_components/Balance-cell";
import { formatPrice } from "@/components/shared/formatPrice";
import AdminOrderForm from "../../../admin/_components/admin-order-form";
import PaginationBar from "../../../money/_components/PaginationBar";
import SearchPaginationBar from "@/components/shared/search-paginationbar";

const SearchOrder = async ({
  searchParams,
}: {
  searchParams: { query: string; page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pagesize = 4;
  const query = searchParams.query || "";

  const totalItemCount = (
    await db.order.findMany({
      where: {
        OR: [
          {
            name: { mode: "insensitive", contains: query },
          },
        ],
        status: "PENDING",
      },
      include: {
        user: true,
        products: true,
      },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pagesize);

  const orders = await db.order.findMany({
    where: {
      status: "PENDING",
      OR: [
        {
          name: { mode: "insensitive", contains: query },
        },
      ],
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          number: true,
        },
      },
      products: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pagesize,
    take: pagesize,
  });

  if (orders.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>
              <Search fileName="order" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableFooter>
          <TableRow>
            <TableCell className="text-center" colSpan={6}>
              No orders found
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  return (
    <>
      <section className="md:overflow-auto md:max-h-[85vh] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>
                <Search fileName="order" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(async (order) => {
              const products = order.products;
              const wallet = await db.wallet.findUnique({
                where: { id: order.walletId },
              });
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.name}</TableCell>
                  <TableCell>
                    {order.products.map((productOrdered, index) => (
                      <div key={index}>
                        <span>{productOrdered.name}</span>{" "}
                        <span>- Quantity: {productOrdered.quantity}</span>{" "}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <BalanceCell id={order.userId} walletId={order.walletId} />
                  </TableCell>
                  <TableCell>
                    {formatPrice(order.amount, wallet?.currencyCode ?? "")}
                  </TableCell>
                  <TableCell>
                    <AdminOrderForm
                      userId={order.userId}
                      id={order.id}
                      orderId={order.orderId}
                      walletId={order.walletId}
                      amount={order.amount}
                      products={products}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>
                {formatPrice(
                  orders?.reduce((acc, order) => acc + order.amount, 0) ?? 0
                )}
              </TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </section>
      {totalPages > 1 && (
        <SearchPaginationBar
          totalPages={totalPages}
          currentPage={currentPage}
          searchQuery={query}
        />
      )}
    </>
  );
};

export default SearchOrder;
