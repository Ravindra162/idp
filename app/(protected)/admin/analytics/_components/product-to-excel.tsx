"use client";
import React from "react";
import { formatPrice } from "@/components/shared/formatPrice";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface Product {
  id: string;
  userId: string | null;
  productName: string;
  price: number;
  minProduct: number;
  maxProduct: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  orderId: string | null;
}

interface ProductOrdered {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderId: string;
  userId: string;
  name: string;
  walletId: string;
  domainId: string;
  products: ProductOrdered[];
  amount: number;
  reason: string | null;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

type ProductToExcelProps = {
  products: Product[];
  fileName: string;
  orders: Order[];
};

const ProductToExcel = ({
  products,
  fileName,
  orders,
}: ProductToExcelProps) => {
  const modifiedData = products.map((product) => ({
    "Product name": product.productName,
    "Total quantity sold": 
    orders.reduce((acc, order) => {
      const quantityProduct = order.products.find((prod) => {
        return prod.productId === product.id;
      });
      if (quantityProduct) {
        return acc + quantityProduct.quantity;
      }
      return acc;
    }, 0),
    "Current inventory": product.stock,
  }));

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(modifiedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <Button type="button" onClick={handleDownload}>
      Export to Excel
    </Button>
  );
};

export default ProductToExcel;
