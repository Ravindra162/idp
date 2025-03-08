"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { OrderSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { getFinalFilteredProducts } from "./user-products-fetch";
import { use } from "react";

type ProductError = {
  error: string;
};

interface OrderProduct {
  name: string;
  quantity: number;
  productPrice: number;
}

export const addOrder = async (values: z.infer<typeof OrderSchema>) => {
  const validatedFields = OrderSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { id, walletId, products, price } = validatedFields.data;

  const user = await getUserById(id);

  const subUser = await db.proUser.findUnique({
    where: {
      userId: id,
    },
  });

  const wallet = await db.wallet.findUnique({
    where: {
      id: walletId,
    },
  });

  const existingProducts = await getFinalFilteredProducts(
    user?.domainId ?? "",
    user?.id ?? "",
    user?.teamId ?? "",
    wallet?.walletTypeId ?? ""
  );

  const orderId = Date.now() + Math.floor(Math.random() * 100000);
  if (!user) return { error: "User not found" };

  const money = wallet?.balance ?? 0;

  if (!user || user.role === "BLOCKED") {
    return { error: "You have been blocked contact admin to know more" };
  }

  const walletFlow = await db.walletFlow.findMany({
    where: {
      userId: id,
    },
  });

  const calculateTotalMoney = walletFlow.reduce((acc, flow) => {
    const amount =
      flow.purpose?.toLowerCase() === "add_money"
        ? flow.status === "SUCCESS"
          ? Math.abs(flow.amount)
          : 0
        : flow.purpose?.toLowerCase() === "admin"
        ? flow.status === "SUCCESS"
          ? Math.abs(flow.amount)
          : 0
        : flow.status === "SUCCESS" || flow.status === "PENDING"
        ? -Math.abs(flow.amount)
        : 0;

    return acc + amount;
  }, 0);

  const isAmountMatching = calculateTotalMoney === wallet?.balance;

  if (!isAmountMatching) {
    await db.user.update({
      where: { id: id },
      data: {
        role: "BLOCKED",
      },
    });

    await db.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: calculateTotalMoney,
      },
    });

    return {
      error: "You have been blocked by the admin. contact admin know more",
    };
  }

  const errors: ProductError[] = [];

  const allProducts = products.map((product) => {
    const existingProduct = existingProducts.find(
      (p) => p.id === product.productId
    );

    //@ts-ignore

    return {
      productId: product.productId,
      name: product.name,
      quantity: product.quantity,
      stock: existingProduct?.stock ?? 0,
      minProduct: existingProduct?.minProduct ?? 1,
      maxProduct: existingProduct?.maxProduct,
      price: existingProduct?.price,
    };
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const orders = await db.order.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: today,
      },
      OR: [{ status: "PENDING" }, { status: "SUCCESS" }],
    },
    select: {
      products: true,
    },
  });
  //@ts-ignore
  const allOrders: OrderProduct[] = orders.flatMap((order) => order.products);
  const orderProducts: { name: string; totalQuantity: number }[] = [];

  allProducts.forEach((product) => {
    const productOrder = allOrders.filter(
      (orderProduct) => orderProduct.name === product.name
    );

    if (productOrder.length > 0) {
      const totalQuantity = productOrder.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
      orderProducts.push({
        name: product.name,
        totalQuantity: totalQuantity + product.quantity,
      });
    } else {
      orderProducts.push({
        name: product.name,
        totalQuantity: 0 + product.quantity,
      });
    }
  });

  allProducts.forEach((product) => {
    if (product.stock === 0) {
      errors.push({
        error: `${product.name} is out of stock`,
      });
      return;
    }

    if (product.quantity > product.stock) {
      errors.push({
        error: `${product.name} is stock not available`,
      });
      return;
    }

    if (user.role === "PRO") {
      if (product.quantity < 1) {
        errors.push({
          error: `${product.name} must be at least 1`,
        });
      }

      if (product.quantity < product.minProduct) {
        errors.push({
          error: `${product.name} must be at least ${product.minProduct} `,
        });
      }

      orderProducts.forEach((orderProduct) => {
        if (orderProduct.name === product.name) {
          if (orderProduct.totalQuantity > product.maxProduct) {
            errors.push({
              error: `you have already ordered ${
                orderProduct.totalQuantity - product.quantity
              } of ${product.name} and you can order at most ${
                product.maxProduct
              } per day`,
            });
          }
        }
      });

      if (product.maxProduct && product.quantity > product.maxProduct) {
        errors.push({
          error: `${product.name} must be at most ${product.maxProduct}`,
        });
      }
    } else {
      if (product.quantity < 1) {
        errors.push({
          error: `${product.name} must be at least 1 `,
        });
      }

      if (product.quantity > product.stock) {
        errors.push({
          error: `${product.name} must be at most ${product.stock} `,
        });
      }

      if (product.quantity < product.minProduct) {
        errors.push({
          error: `${product.name} must be at least ${product.minProduct} `,
        });
      }

      orderProducts.forEach((orderProduct) => {
        if (orderProduct.name === product.name) {
          if (orderProduct.totalQuantity > product.maxProduct) {
            errors.push({
              error: `you have already ordered ${
                orderProduct.totalQuantity - product.quantity
              } of ${product.name} and you can order at most ${
                product.maxProduct
              } per day`,
            });
          }
        }
      });
    }
  });

  if (errors.length > 0) {
    const errorMessages = errors.map((err) => err.error).join(", ");
    return { error: errorMessages };
  }

  if (wallet.balance === price || wallet.balance > price) {
    try {
      const order = db.order.create({
        data: {
          userId: id,
          domainId: user?.domainId ?? process.env.NEXT_PUBLIC_DOMAIN_ID ?? "",
          walletId: wallet.id,
          orderId: orderId.toString().slice(-10),
          products: {
            create: allProducts.map((product) => ({
              name: product.name,
              productId: product.productId,
              quantity: product.quantity,
              price: product.price,
            })),
          },
          amount: price,
          name: user.name,
        },
        include: {
          products: true,
        },
      });

      const stock_updation = allProducts.forEach(async (product) => {
        await db.product.update({
          where: { productName: product.name },
          data: { stock: product.stock - product.quantity },
        });
      });
      const money_updation = db.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: wallet.balance - price,
        },
      });

      const walletFlow_creation = db.walletFlow.create({
        data: {
          amount: Number(price),
          walletId: walletId,
          moneyId: orderId.toString().slice(-10),
          purpose: "ORDER",
          userId: id,
          status: "PENDING",
        },
      });

      await Promise.all([
        order,
        stock_updation,
        money_updation,
        walletFlow_creation,
      ]);

      revalidatePath(`/admin/orders`);
      return { success: "Order added successfully!" };
    } catch (error) {
      return { error: "Error while adding order!" };
    }
  }

  if (wallet.balance < price && user.role === "USER") {
    return { error: "You don't have enough money!" };
  }

  if (wallet.balance < price && user.role === "PRO") {
    if (!subUser) {
      return { error: "You are not a proUser!" };
    }
    if (Math.sign(wallet.balance) === -1) {
      let userTotalMoney = Math.abs(wallet.balance);
      if (userTotalMoney + price > subUser.amount_limit) {
        console.log("You don't have enough money!");
        return { error: "You don't have enough money!" };
      }
    }
    if (Math.sign(wallet.balance) === 1) {
      if (wallet.balance < price) {
        if (wallet.balance + subUser.amount_limit < price) {
          return { error: "You don't have enough money!" };
        }
      }
    }

    if (Math.sign(wallet.balance) === 0) {
      if (price > subUser.amount_limit) {
        return { error: "You don't have enough money!" };
      }
    }
  }
  console.log("I am here");
  if (money < price && user.role === "PRO") {
    if (!subUser) {
      return { error: "You are not a proUser!" };
    }
    if (
      Math.abs(money) + subUser?.amount_limit > price ||
      Math.abs(money) + subUser?.amount_limit === price
    ) {
      try {
        const remainingPrice = money - price;
        const orderCreation = db.order.create({
          data: {
            userId: id,
            domainId: user?.domainId ?? process.env.NEXT_PUBLIC_DOMAIN_ID ?? "",
            orderId: orderId.toString().slice(-10),
            walletId: wallet.id,
            products: {
              create: allProducts.map((product) => ({
                name: product.name,
                productId: product.productId,
                quantity: product.quantity,
                price: product.price,
              })),
            },
            amount: price,
            name: user.name,
          },
          include: {
            products: true,
          },
        });

        const stock_updation = allProducts.forEach(async (product) => {
          await db.product.update({
            where: { productName: product.name },
            data: { stock: product.stock - product.quantity },
          });
        });

        const user_money_updation = db.wallet.update({
          where: {
            id: walletId,
          },
          data: {
            balance: remainingPrice,
          },
        });

        const walletFlow_updation = db.walletFlow.create({
          data: {
            amount: Number(price),
            walletId: walletId,
            moneyId: orderId.toString().slice(-10),
            purpose: "ORDER",
            userId: id,
          },
        });

        await Promise.all([
          orderCreation,
          stock_updation,
          user_money_updation,
          walletFlow_updation,
        ]);
      } catch (error) {
        console.log("Error in createOrder");
      }
      revalidatePath(`/admin/orders`);
      return { success: "Order added successfully!" };
    }
  }
};
