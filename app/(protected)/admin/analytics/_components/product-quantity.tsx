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
  name: string;
  walletId: string;
  domainId: string;
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
  productId : string;
};

const ProductQuantity = ({ orders, productName, productId }: ProductProps) => {
  const quantitySold = orders.reduce((acc, order) => {
    if (order.status === "SUCCESS") {
      const quantityProduct = order.products.find((product) => {
        return product.productId === productId;
      });
      if (quantityProduct) {
        return acc + quantityProduct.quantity;
      }
    }
    return acc;
  }, 0);
  return <span className="text-center">{quantitySold}</span>;
};

export default ProductQuantity;
