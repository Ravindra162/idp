import {auth} from "@/auth";
import React from "react";
import {db} from "@/lib/db";
import {formatPrice} from "@/components/shared/formatPrice";

const BalanceCard = async () => {
    const session = await auth();
    const wallets = await db.wallet.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            walletType: {
                select: {
                    currencyCode: true,
                },
            },
        },
    });

    const walletDetails = wallets
        .filter(wallet => wallet.walletType)
        .map(wallet => ({
            balance: wallet.balance,
            currencyCode: wallet.walletType.currencyCode,
        }));

    return (
        <div className="space-y-4">
            {walletDetails.map((wallet, idx) => (
                <div
                    key={idx}
                    className="flex justify-around flex-col mx-2 mt-2 w-full md:w-56 bg-gray-100 p-2 rounded-lg h-24 md:h-28"
                >
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Balance ({wallet.currencyCode})</span>
                    </div>
                    <p className="mt-3">{formatPrice(wallet.balance, wallet.currencyCode)}</p>
                </div>
            ))}
        </div>
    );
};

export default BalanceCard;
