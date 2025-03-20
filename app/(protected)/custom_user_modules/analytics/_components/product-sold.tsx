import { formatPrice } from "@/components/shared/formatPrice";
import React from "react";

interface Product {
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
  products: Product[];
  amount: number;
  reason: string | null;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

type ProductProps = {
  orders: Order[];
  productName: string;
};

const ProductSold = ({ orders, productName }: ProductProps) => {
  const quantitySold = orders.reduce((acc, order) => {
    const quantityProduct = order.products.find((product) => {
      // return product.productId === productId;
    });
    if (quantityProduct) {
      return acc + quantityProduct.price * quantityProduct.quantity;
    }
    return acc;
  }, 0);
  return <span className="font-semibold">{formatPrice(quantitySold, "")}</span>;
};

export default ProductSold;
