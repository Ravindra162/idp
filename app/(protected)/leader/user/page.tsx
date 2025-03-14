import React from "react";
import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationBar from "../../money/_components/PaginationBar";
import { revalidatePath } from "next/cache";
import ProUser from "../_components/upgrade-to-pro";
import TopBar from "../../_components/Topbar";
import Search from "@/components/shared/search";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { removeMember } from "@/actions/admin-member-team";
import { toast } from "sonner";
import TeamUserRemove from "./_components/user-remove";

const UserTable = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const session = await auth();
  const userDetails = await db.user.findUnique({
    where: { id: session?.user.id },
  });

  const handleRemoveMember = async (userId: string) => {};

  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 7;

  const totalItemCount = await db.user.count({
    where: {
      teamId: userDetails?.teamId,
      role: {
        in: ["USER", "BLOCKED", "PRO"],
      },
    },
  });

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const users = await db.user.findMany({
    where: {
      teamId: userDetails?.teamId,
      role: {
        in: ["USER", "BLOCKED", "PRO"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath("/leader/user");

  return (
    <>
      <nav className="hidden md:block">
        <TopBar title="User Management" />
      </nav>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UserName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined on</TableHead>
            <TableHead colSpan={2}>
              <Search fileName={"user-management"} />
            </TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className={user.role === "BLOCKED" ? "text-red-500" : ""}
            >
              <TableCell className="capitalize">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.createdAt.toDateString()}</TableCell>
              {user.role !== "BLOCKED" && (
                <TableCell>
                  <TeamUserRemove
                    userId={user?.id}
                    teamId={user?.teamId ?? ""}
                    userRole={user?.role}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </>
  );
};

export default UserTable;
