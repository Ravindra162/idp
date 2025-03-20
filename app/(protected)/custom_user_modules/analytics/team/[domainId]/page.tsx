import { formatPrice } from "@/components/shared/formatPrice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import DownloadToExcel from "../../_components/download-user-to-excel";
import { revalidatePath } from "next/cache";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";
import DateRangeFilter from "../../_components/date-range-filter";
import Search from "@/components/shared/search";
import { format } from "date-fns";
import ViewWallets from "../../_components/view-wallets";

const UserAnalytics = async ({
  searchParams,
  params,
}: {
  searchParams: { page: string; startDate: Date; endDate: Date };
  params: { domainId: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 7;
  const startDate = searchParams.startDate || new Date("1983-01-01");
  const endDate = searchParams.endDate
    ? new Date(
        new Date(searchParams.endDate).setDate(
          new Date(searchParams.endDate).getDate() + 1
        )
      )
    : new Date(new Date().setDate(new Date().getDate() + 1));

  const users = await db.user.findMany({
    where: {
      domainId: params.domainId,
      createdAt: {
        lte: endDate,
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  
  const userData = await Promise.all(
    users.map(async (user) => {
      const wallets = await db.wallet.findMany({
        where: { userId: user.id },
      });
      
      const walletData = await Promise.all(
        wallets.map(async (wallet) => {
          const orders =
          (await db.order.findMany({
            where: {
              userId: user.id,
              walletId: wallet.id,
              status: "SUCCESS",
            },
          })) || [];
          
          const totalOrders = orders.length;
          const totalOrdersMoney = orders.reduce(
            (sum, order) => sum + order.amount,
            0
          );
          
          return {
            walletName: wallet.walletName,
            balance: wallet.balance,
            currencyCode: wallet.currencyCode,
            ordersTotal: totalOrders,
            totalOrdersMoney: totalOrdersMoney,
            totalMoney: wallet.balance + totalOrdersMoney,
          };
        })
      );
      
      return {
        userName: user.name,
        userId: user.id,
        number: user.number,
        createdAt: user.createdAt,
        email: user.email,
        dateOfJoining: user.createdAt,
        wallets: walletData,
      };
    })
  );
  
  const totalUserCount = await db.user.count({
    where: {
      domainId: params.domainId,
      createdAt: {
        lte: endDate,
        gte: startDate,
      },
    },
  });

  const totalPages = Math.ceil(totalUserCount / pageSize);
  
  const exportUsers = await db.user.findMany({
    where: {
      domainId: params.domainId,
      createdAt: {
        lte: endDate,
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const exportUserData = await Promise.all(
    exportUsers.map(async (user) => {
      const wallets = await db.wallet.findMany({
        where: { userId: user.id },
      });
      
      const walletData = await Promise.all(
        wallets.map(async (wallet) => {
          const orders =
          (await db.order.findMany({
            where: {
              userId: user.id,
              walletId: wallet.id,
              status: "SUCCESS",
            },
          })) || [];
          
          const totalOrders = orders.length;
          const totalOrdersMoney = orders.reduce(
            (sum, order) => sum + order.amount,
            0
          );
          
          return {
            walletName: wallet.walletName,
            balance: wallet.balance,
            currencyCode: wallet.currencyCode,
            ordersTotal: totalOrders,
            totalOrdersMoney: totalOrdersMoney,
            totalMoney: wallet.balance + totalOrdersMoney,
          };
        })
      );
      
      return {
        userName: user.name,
        userId: user.id,
        number: user.number,
        createdAt: user.createdAt,
        email: user.email,
        dateOfJoining: user.createdAt,
        wallets: walletData,
      };
    })
  );

  const formattedStartDate = format(startDate, "yyyy-MM-dd"); // e.g., "2024-12-01"
  const formattedEndDate = format(endDate, "yyyy-MM-dd"); // e.g., "2024-12-26"
  const excelFileName = `Users - ${formattedStartDate} to ${formattedEndDate}`;

  revalidatePath("/admin/analytics/user");
  return (
    <section className="m-2">
      <div className="flex items-center justify-between gap-x-2 p-1 md:hidden">
        <DownloadToExcel data={exportUserData} fileName={excelFileName} />
        <Search fileName="user" />
      </div>
      <div className="md:flex md:items-center md:justify-between md:gap-x-2">
        <div className="hidden md:flex items-center justify-between  gap-x-3">
          <DownloadToExcel data={exportUserData} fileName={excelFileName} />
          <Search fileName="user" />
        </div>
        <div className="mt-1 flex items-center justify-around gap-x-2 w-fit">
          <DateRangeFilter />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UserName</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Wallets</TableHead>
            <TableHead>Date of Joining</TableHead>
          </TableRow>
        </TableHeader>
        {totalUserCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {userData.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.number}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <ViewWallets wallets={user.wallets} />
              </TableCell>
              <TableCell>{user.createdAt.toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default UserAnalytics;
