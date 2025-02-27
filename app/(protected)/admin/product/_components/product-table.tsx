import React from "react";
import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductRemove from "./product-remove";
import PaginationBar from "../../../money/_components/PaginationBar";
import { formatPrice } from "@/components/shared/formatPrice";
import { revalidatePath } from "next/cache";
import DescriptionDialog from "../../_components/description-dialog";
import ProductTeamsDialog from "./product-teams-dialog";
import { includeTeamInProduct } from "@/actions/admin-product-teams";
import ProductPanelsDialog from "./product-panels-dialog";

export const revalidate = 3600;

const ProductTable = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 7;

  const totalItemCount = await db.product.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      userId: false,
      id: true,
      productName: true,
      price: true,
      stock: true,
      minProduct: true,
      maxProduct: true,
      description: true,
      sheetLink: true,
      sheetName: true,
      createdAt: true,
      includedDomains: {
        select: {
          id: true,
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
      },
      excludedDomains: {
        select: {
          id: true,
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
      },
      includedTeams: {
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
      },
      excludedTeams: {
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
      },
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

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

  const panels = await db.domain.findMany({
    select: {
      id: true,
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

  console.log(products);

  revalidatePath("/admin/product");

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Minimum</TableHead>
            <TableHead>Maximum</TableHead>
            <TableHead>Sheet Name</TableHead>
            <TableHead>Google Sheet link</TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>Domains</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No products found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="capitalize">
                {product.productName}
              </TableCell>
              <TableCell>
                <DescriptionDialog description={product.description} />
              </TableCell>
              <TableCell>{formatPrice(product.price, "")}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.minProduct}</TableCell>
              <TableCell>{product.maxProduct}</TableCell>
              <TableCell>{product.sheetName}</TableCell>
              <TableCell>
                <a
                  href={product.sheetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  View Sheet
                </a>
              </TableCell>
              <TableCell>
                <ProductTeamsDialog
                  teams={teams}
                  includedTeams={product.includedTeams}
                  excludedTeams={product.excludedTeams}
                  productName={product.productName}
                  productId={product.id}
                />
              </TableCell>
              <TableCell>
                <ProductPanelsDialog
                  panels={panels}
                  includedPanels={product.includedDomains}
                  excludedPanels={product.excludedDomains}
                  productName={product.productName}
                  productId={product.id}
                />
              </TableCell>
              <TableCell>
                <ProductRemove id={product.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </>
  );
};

export default ProductTable;
