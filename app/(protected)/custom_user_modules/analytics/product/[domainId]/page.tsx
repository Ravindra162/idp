import { formatPrice } from "@/components/shared/formatPrice";
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
import React from "react";
import ProductQuantity from "../../_components/product-quantity";
import ProductSold from "../../_components/product-sold";
import DateRangeFilter from "../../_components/date-range-filter";
import DownloadToExcel from "../../_components/download-user-to-excel";
import ProductToExcel from "../../_components/product-to-excel";
import { revalidatePath } from "next/cache";
import Search from "@/components/shared/search";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";

const ProductAnalytics = async ({
  searchParams,
  params,
}: {
  searchParams: {
    page: string;
    startDate: Date;
    endDate: Date;
  };
  params: { domainId: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 9;
  const startDate = searchParams.startDate || new Date("1983-01-01");
  const endDate = searchParams.endDate
    ? new Date(
        new Date(searchParams.endDate).setDate(
          new Date(searchParams.endDate).getDate() + 1
        )
      )
    : new Date(new Date().setDate(new Date().getDate() + 1));

  const totalItemCount = await db.product.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  const exportProducts = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const orders = await db.order.findMany({
    where: {
      status: "SUCCESS",
      domainId: params.domainId,
      createdAt: {
        lte: endDate,
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      products: true,
    },
  });

  revalidatePath("/admin/analytics/product");

  return (
    <section className="m-2">
      <div className="flex items-center justify-between gap-x-2 p-1 md:hidden">
        <ProductToExcel
          products={exportProducts}
          orders={orders}
          fileName={"Products"}
        />
        <Search fileName={`product/${params.domainId}`} />
      </div>
      <div className="md:flex md:items-center md:justify-between md:gap-x-2">
        <div className="hidden md:flex items-center justify-between  gap-x-3">
          <ProductToExcel
            products={exportProducts}
            orders={orders}
            fileName={"Products"}
          />
          <Search fileName={`product/${params.domainId}`} />
        </div>
        <div className="mt-1 flex items-center justify-around gap-x-2 w-fit">
          <DateRangeFilter />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product name</TableHead>
            <TableHead>Total Qty sold</TableHead>
            {/* <TableHead>Total revenue collected</TableHead> */}
            <TableHead>Current inventory</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>
                {
                  <ProductQuantity
                    orders={orders}
                    productName={product.productName}
                    productId={product.id}
                  />
                }
              </TableCell>
              {/* <TableCell>
                {
                  <ProductSold
                    productName={product.productName}
                    orders={JSON.parse(JSON.stringify(orders))}
                  />
                }
              </TableCell> */}
              <TableCell>{product.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default ProductAnalytics;
