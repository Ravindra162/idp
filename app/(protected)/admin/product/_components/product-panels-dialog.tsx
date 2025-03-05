"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import IncludedPanelRemove from "./included-panel-remove";
import ExcludedPanelRemove from "./excluded-panel-remove";

interface Panel {
  id: string;
  name: string;
  products: {
    productId: string;
    name: string;
    Price: number;
    Max: number;
    Min: number;
  }[];
}

interface ProductPanelsDialogProps {
  panels: Panel[];
  includedPanels: Panel[];
  excludedPanels: Panel[];
  productName: string;
  productId: string;
}

const ProductPanelsDialog = ({
  panels,
  includedPanels,
  excludedPanels,
  productName,
  productId,
}: ProductPanelsDialogProps) => {
  console.log(productId);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Panels
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        {/* Included Teams List in Table Format */}
        <Button className="text-sm w-auto ml-auto" asChild>
          <Link
            href={`/admin/product/panel-quantity/${productId}/add`}
            className="inline"
          >
            Include a Panel
          </Link>
        </Button>
        <DialogTitle>
          Panel having special access{" "}
          {productName.charAt(0).toUpperCase() + productName.slice(1)}
        </DialogTitle>
        <ScrollArea className="max-h-[300px] mt-4 border rounded-md p-4">
          {includedPanels.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No Panels are using this product
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Panel Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Min</TableHead>
                  <TableHead>Max</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {includedPanels.map((panel) => {
                  const productDetails = panel.products.find(
                    (p) => p.productId === productId
                  );
                  return productDetails ? (
                    <TableRow key={panel.id}>
                      <TableCell>{panel.name}</TableCell>
                      <TableCell>{productDetails.Price}</TableCell>
                      <TableCell>{productDetails.Min}</TableCell>
                      <TableCell>{productDetails.Max}</TableCell>
                      <TableCell>
                        <IncludedPanelRemove
                          id={productId}
                          domainId={panel.id}
                        />
                      </TableCell>
                    </TableRow>
                  ) : null;
                })}
              </TableBody>
            </Table>
          )}
        </ScrollArea>

        <Button className="text-sm w-auto ml-auto" asChild>
          <Link
            href={`/admin/product/panel-quantity/${productId}/exclude-add`}
            className="inline"
          >
            Exclude a Panel
          </Link>
        </Button>

        <DialogTitle>
          Panel that doesnot have access to{" "}
          {productName.charAt(0).toUpperCase() + productName.slice(1)}
        </DialogTitle>

        <ScrollArea className="max-h-[300px] mt-4 border rounded-md p-4">
          {excludedPanels.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No Panels are using this product
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Panel Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {excludedPanels.map((panel) => (
                  <TableRow key={panel.id}>
                    <TableCell>{panel.name}</TableCell>
                    <TableCell>
                      <ExcludedPanelRemove panelId={panel.id} productId={productId} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPanelsDialog;
