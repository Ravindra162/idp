"use client";
import { formatPrice } from "@/components/shared/formatPrice";
import { Button } from "@/components/ui/button";
import React from "react";
import * as XLSX from "xlsx";

type Wallet = {
  walletName: string;
  balance: number;
  currencyCode: string;
  ordersTotal: number;
  totalOrdersMoney: number;
  totalMoney: number;
};

type User = {
  userId: string;
  email: string;
  userName: string;
  number: string;
  createdAt: Date;
  wallets: Wallet[];
};

type DownloadToExcelProps = {
  data: User[];
  fileName: string;
};

const DownloadToExcel: React.FC<DownloadToExcelProps> = ({
  data,
  fileName,
}) => {
  const maxWallets = Math.max(...data.map((user) => user.wallets.length));

  const modifiedData = data.map((user) => {
    let row: Record<string, any> = {
      Name: user.userName,
      "WhatsApp Number": user.number,
      "Created At": user.createdAt.toDateString(),
      Email: user.email,
    };

    user.wallets.forEach((wallet, index) => {
      row[`Wallet ${index + 1} Name`] = wallet.walletName;
      row[`Wallet ${index + 1} Balance`] = formatPrice(
        wallet.balance,
        wallet.currencyCode
      );
      row[`Wallet ${index + 1} Currency`] = wallet.currencyCode;
      row[`Wallet ${index + 1} Total Orders`] = wallet.ordersTotal;
      row[`Wallet ${index + 1} Total Orders Money`] = formatPrice(
        wallet.totalOrdersMoney,
        wallet.currencyCode
      );
      row[`Wallet ${index + 1} Total Money`] = formatPrice(
        wallet.totalMoney,
        wallet.currencyCode
      );
    });

    for (let i = user.wallets.length; i < maxWallets; i++) {
      row[`Wallet ${i + 1} Name`] = "-";
      row[`Wallet ${i + 1} Balance`] = "0.00";
      row[`Wallet ${i + 1} Currency`] = "-";
      row[`Wallet ${i + 1} Total Orders`] = "0.00";
      row[`Wallet ${i + 1} Total Orders Money`] = "0.00";
      row[`Wallet ${i + 1} Total Money`] = "0.00";
    }

    return row;
  });

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(modifiedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <Button type="button" onClick={handleDownload}>
      Export to Excel
    </Button>
  );
};

export default DownloadToExcel;
