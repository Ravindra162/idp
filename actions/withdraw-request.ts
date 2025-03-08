"use server";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { revalidatePath } from "next/cache";
import { validate } from "uuid";

export const RequestWithdrawal = async (formData: FormData) => {
  const userId = formData.get("userId")?.toString() ?? "";
  const user = await getUserById(userId);
  const username = user?.name;
  const walletId = formData.get("walletId")?.toString();

  console.log(walletId)
  if (!user) {
    return { error: "User not found" };
  }

  try {
    if (user.role === "BLOCKED") {
      return {
        error:
          "You have been blocked by the admin. Contact admin for more details.",
      };
    }

    const wallet = await db.wallet.findUnique({
      where: {
        id: walletId,
      },
    });

    const walletFlow = await db.walletFlow.findMany({
      where: {
        userId: userId,
        walletId: walletId,
      },
    });

    console.log(walletFlow);

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
        where: { id: walletId },
        data: {
          balance: calculateTotalMoney,
        },
      });

      return {
        error: "You have been blocked by the admin. contact admin know more",
      };
    }

    const withdrawAmount = formData.get("withdrawAmount")?.toString() ?? "0";
    if (wallet.balance < parseInt(withdrawAmount, 10)) {
      return { error: "Insufficient funds for withdrawal" };
    }

    await db.withdrawalRequest.create({
      data: {
        accountNumber: formData.get("accountNumber")?.toString() ?? "",
        ifscCode: formData.get("ifscCode")?.toString() ?? "",
        beneficiaryName: formData.get("beneficiaryName")?.toString() ?? "",
        withdrawAmount: withdrawAmount,
        secure_url: "",
        public_id: "",
        transactionId: "",
        purpose: "WITHDRAWAL",
        userId: userId,
        name: username ?? "",
        status: "PENDING",
        walletId: walletId ?? "",
        domainId: process.env.NEXT_PUBLIC_DOMAIN_ID ?? "",
      },
    });
  } catch (err: any) {
    console.log(err);
    return { error: "An error occurred. Please try again later." };
  }

  revalidatePath("/withdrawals/record");
  return { success: "Withdrawal request submitted!" };
};
