"use server";
import axios from "axios";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { revalidatePath } from "next/cache";

function generateSpecialCharacterString(
  length: number,
  specialCharacters?: string
): string {
  const defaultSpecialCharacters = "!@#$%^&*()-_=+[]{}|;:',.<>?/`~";
  const characters = specialCharacters || defaultSpecialCharacters;

  if (characters.length === 0) {
    throw new Error("Special characters set cannot be empty.");
  }

  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export const createPaymentRequest = async (formData: FormData) => {
  const amount = formData.get("amount")?.toString();
  const userId = formData.get("userId")?.toString();

  if (
    !amount ||
    isNaN(Number(amount)) ||
    Number(amount) <= 0 ||
    Number(amount) > 100000
  ) {
    return { error: "Amount should be in range 1 ~ 1,00,000" };
  }

  if (!userId) {
    return { error: "User ID is required" };
  }

  const user = await getUserById(userId);
  if (!user) {
    return { error: "User not found" };
  }

  if (user?.role === "BLOCKED") {
    return {
      error: "You have been blocked by the admin. contact admin know more",
    };
  }

  try {
    const wallet = await db.wallet.findUnique({
      where : {
        id : ""
      }
    })
    const walletFlow = await db.walletFlow.findMany({
      where: {
        userId: userId,
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
        where: { id: userId },
        data: {
          role: "BLOCKED",
        },
      });

      await db.wallet.update({
        where : {
          id : ""
        },
        data : {
          balance : calculateTotalMoney
        }
      })

      return {
        error: "You have been blocked by the admin. contact admin know more",
      };
    }

    const requestPayload = {
      mid: "GROWONSMED",
      amount: amount,
      merchantReferenceId: `ref${userId}-${Date.now()}`,
      customer_name: user.name,
      customer_email: user.email,
      customer_mobile: user.number,
    };

    const currentDate = new Date();
    const paymentMetadata = await db.paymentMetaData.findFirst({
      where: {
        expiry: { gt: currentDate },
      },
      orderBy: { createdAt: "asc" },
    });

    const token =
      paymentMetadata?.authToken ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaWQiOiJHUk9XT05TTUVEIiwiX2lkIjoiNjc2MWFkNmI2MzQyYzRmYjUyZTAzNWM5IiwiaWF0IjoxNzM0OTI2NzI0LCJleHAiOjE3Mzc1MTg3MjR9.YggJxjig6BVg3-euCnuNIPUhmqY7CE2YKC9JxgT446g";

    const response = await axios.post(
      "https://server.paygic.in/api/v2/createPaymentRequest",
      requestPayload,
      {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );

    const paymentResponse = response.data;

    if (!paymentResponse.status) {
      return { error: "Failed to create payment request. Please try again." };
    }

    const {
      intent,
      gpay,
      paytm,
      phonePe,
      dynamicQR,
      merchantReferenceId,
      expiry,
    } = paymentResponse.data;

    await db.money.create({
      data: {
        amount,
        walletId: "",
        secure_url: "https://img.icons8.com/ios/50/invoice.png",
        public_id: generateSpecialCharacterString(10),
        transactionId: merchantReferenceId,
        upiId: formData.get("upiid")?.toString() || "",
        accountNumber: formData.get("accountNumber")?.toString() || "",
        userId,
        paymentMode:
          "PAYMENT_GATEWAY",
        paymentProces: false,
        name: user.name || "",
        purpose: "ADD_MONEY",
        payment_method_id: "",
        status: "PENDING",
        domainId: process.env.NEXT_PUBLIC_DOMAIN_ID ?? "",
      },
    });

    await db.walletFlow.create({
      data: {
        amount: Number(amount),
        walletId: "",
        moneyId: merchantReferenceId,
        purpose: "ADD_MONEY",
        userId,
        status: "PENDING",
      },
    });

    return {
      success: "Payment request created. Please complete the payment.",
      paymentLinks: { intent, gpay, paytm, phonePe, dynamicQR },
      merchantReferenceId: merchantReferenceId,
      expiry: expiry,
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    if (error.response && error.response.data) {
      return {
        error:
          error.response.data.msg ||
          "An error occurred while creating the payment request.",
      };
    }
    return { error: "An error occurred while creating the payment request." };
  }
};

export const createCollectRequest = async (formData: FormData) => {
  const amount = formData.get("amount")?.toString();
  const userId = formData.get("userId")?.toString();
  const walletId = formData.get("walletId")?.toString();
  const paymentModelId = formData.get("paymentModelId")?.toString();
  const user = await getUserById(userId ?? "");

  try {
    const wallet = await db.wallet.findUnique({
      where: {
        id: walletId,
      },
    });
  
    const walletType = await db.paymentTypeModel.findUnique({
      where: {
        id: paymentModelId,
      }
    });
  
    if (!user) {
      return { error: "User not found." };
    }

    if (user.role === "BLOCKED") {
      return {
        error:
          "You have been blocked by the admin. Contact the admin for more information.",
      };
    }

    const requestPayload = {
      mid: "GROWONSMED",
      amount: amount,
      merchantReferenceId: `ref${userId}-${Date.now()}`,
      customer_name: user.name,
      customer_email: user.email,
      customer_mobile: user.number,
      vpa: formData.get("vpa")?.toString(),
      remark: "ADD_MONEY",
    };

    const currentDate = new Date();
    const paymentMetadata = await db.paymentMetaData.findFirst({
      where: {
        expiry: { gt: currentDate },
      },
      orderBy: { createdAt: "asc" },
    });

    const token =
      paymentMetadata?.authToken ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaWQiOiJHUk9XT05TTUVEIiwiX2lkIjoiNjc2MWFkNmI2MzQyYzRmYjUyZTAzNWM5IiwiaWF0IjoxNzM0OTI2NzI0LCJleHAiOjE3Mzc1MTg3MjR9.YggJxjig6BVg3-euCnuNIPUhmqY7CE2YKC9JxgT446g";

    console.log(requestPayload);
    const response = await axios.post(
      "https://server.paygic.in/api/v2/createCollectRequest",
      requestPayload,
      {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );

    console.log(response.data);
    const paymentResponse = response.data;

    if (!paymentResponse.status) {
      return { error: "Failed to create collect request. Please try again." };
    }

    const { expiry, merchantReferenceId } = paymentResponse.data;
    console.log(merchantReferenceId);

    await db.money.create({
      data: {
        amount,
        secure_url: "https://img.icons8.com/ios/50/invoice.png",
        public_id: generateSpecialCharacterString(10),
        transactionId: merchantReferenceId,
        upiId: formData.get("upiid")?.toString() || "",
        accountNumber: formData.get("accountNumber")?.toString() || "",
        userId : userId ?? "",
        walletId : walletId ?? "",
        paymentMode:
          walletType?.paymentTypeMethod === "MANUAL" ? "MANUAL" : "PAYMENT_GATEWAY",
        paymentProces: false,
        purpose: "ADD_MONEY",
        name: user.name || "",
        status: "PENDING",
        domainId: process.env.NEXT_PUBLIC_DOMAIN_ID ?? "",
        payment_method_id: "",
      },
    });

    await db.walletFlow.create({
      data: {
        amount: Number(amount),
        moneyId: merchantReferenceId,
        purpose: "ADD_MONEY",
        userId,
        walletId: walletId ?? "",
        status: "PENDING",
      },
    });

    return {
      success: "Collect request created successfully.",
      details: { expiry, merchantReferenceId },
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    return { error: "An error occurred while creating the collect request." };
  }
};

export const checkPaymentStatus = async (
  merchantReferenceId: string,
  userId: string,
  walletId: string,
  paymentModelId : string
) => {
  try {
    const moneyRecord = await db.money.findFirst({
      where: { transactionId: merchantReferenceId },
    });

    if (
      moneyRecord?.paymentProces === false &&
      moneyRecord?.status != "SUCCESS"
    ) {
      const requestPayload = {
        mid: "GROWONSMED",
        merchantReferenceId,
      };

      const currentDate = new Date();
      const paymentMetadata = await db.paymentMetaData.findFirst({
        where: {
          expiry: { gt: currentDate },
        },
        orderBy: { createdAt: "asc" },
      });

      const token =
        paymentMetadata?.authToken ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaWQiOiJHUk9XT05TTUVEIiwiX2lkIjoiNjc2MWFkNmI2MzQyYzRmYjUyZTAzNWM5IiwiaWF0IjoxNzM0OTI2NzI0LCJleHAiOjE3Mzc1MTg3MjR9.YggJxjig6BVg3-euCnuNIPUhmqY7CE2YKC9JxgT446g";

      const response = await axios.post(
        "https://server.paygic.in/api/v2/checkPaymentStatus",
        requestPayload,
        {
          headers: {
            "Content-Type": "application/json",
            token:
              token ||
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaWQiOiJHUk9XT05TTUVEIiwiX2lkIjoiNjc2MWFkNmI2MzQyYzRmYjUyZTAzNWM5IiwiaWF0IjoxNzM0OTI2NzI0LCJleHAiOjE3Mzc1MTg3MjR9.YggJxjig6BVg3-euCnuNIPUhmqY7CE2YKC9JxgT446g",
          },
        }
      );

      const { status, statusCode, txnStatus, msg, data } = response.data;

      console.log(status);
      console.log(statusCode);

      if (statusCode !== 200) {
        if (statusCode === 300) {
          return { error: "Transaction not found. Please check the details." };
        }
        return { error: msg || "Failed to check payment status." };
      }

      if (txnStatus === "SUCCESS") {
        const bankDetails = await db.walletTypePayment.findFirst({
          orderBy: { createdAt: "desc" },
          include : {
            paymentModel : true
          }
        });

        if (!bankDetails) {
          return {
            error: "Bank details not found for processing the transaction.",
          };
        }

        const formData = new FormData();
        formData.set("transactionId", data?.UTR || "");
        formData.set("amount", data?.amount?.toString() || "0");
        formData.set("userId", userId);
        // formData.set("upiId", bankDetails?.paymentModel?.upiId || "");
        // formData.append("accountNumber", bankDetails?.accountDetails || "");
        formData.set("merchantReferenceId", merchantReferenceId);

        const addMoneyResult = await AddMoney(formData);

        if (addMoneyResult.error) {
          return { error: addMoneyResult.error };
        }

        revalidatePath("/money/record");
        return { success: "Transaction successful and money added!" };
      } else if (txnStatus === "REJECT") {
        return { error: "Transaction rejected. Please try again." };
      } else {
        return { error: "Transaction is pending. Waiting for your payment." };
      }
    } else if (moneyRecord?.status === "SUCCESS") {
      return { success: "Money added successfully!" };
    } else {
      return {
        error:
          "Transaction failed. Please try again after 5 minutes or contact admin.",
      };
    }
  } catch (error: any) {
    console.error("Error during payment status check:", error.message);
    return { error: "An error occurred while checking payment status." };
  }
};

export const AddMoney = async (formData: FormData) => {
  const transactionId = formData.get("transactionId")?.toString() || "";
  const userId = formData.get("userId")?.toString();
  const amount = formData.get("amount")?.toString();
  const merchantReferenceId = formData.get("merchantReferenceId")?.toString();

  if (!userId || !transactionId || !amount) {
    return { error: "Invalid form data provided." };
  }

  try {
    const redundantId = await db.money.findUnique({
      where: { transactionId },
    });

    if (redundantId) {
      return { error: "This transaction ID already exists." };
    }

    const updatedMoney = Number(amount);

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {  name: true },
    });

    const wallet = await db.wallet.findUnique({
      where : {
        id : ""
      }
    });

    if (!user) {
      return { error: "User not found." };
    }

    const totalMoney = Number(wallet?.balance);

    await db.wallet.update({
      where: { id: "" },
      data: { balance: totalMoney + updatedMoney },
    });

    await db.walletFlow.update({
      where: { moneyId: merchantReferenceId },
      data: {
        status: "SUCCESS",
      },
    });

    await db.money.update({
      where: { transactionId: merchantReferenceId },
      data: {
        paymentProces: false,
        status: "SUCCESS",
      },
    });

    return { success: "Money added successfully!" };
  } catch (error: any) {
    console.error("Error adding money:", error.message);
    return { error: "An error occurred. Please try again later." };
  }
};
