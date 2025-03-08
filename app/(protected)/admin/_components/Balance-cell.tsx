import { formatPrice } from "@/components/shared/formatPrice";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";

const BalanceCell = async ({
  id,
  walletId,
}: {
  id: string;
  walletId: string;
}) => {
  const remainingBalance = await db.wallet.findUnique({
    where: {
      id: walletId,
    },
  });
  return formatPrice(
    remainingBalance?.balance ?? 0,
    remainingBalance?.currencyCode ?? ""
  );
};

export default BalanceCell;
