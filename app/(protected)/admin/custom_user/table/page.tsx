import { formatPrice } from "@/components/shared/formatPrice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import PaginationBar from "../../../money/_components/PaginationBar";
import TopBar from "../../../_components/Topbar";
import ReasonDialog from "@/components/shared/ReasonDialog";
import BadgeStatus from "@/app/(protected)/money/_components/BadgeStatus";
import ViewProducts from "@/app/(protected)/_components/view-products";
import Search from "@/components/shared/search";
import ViewModules from "../_components/view-modules";
import ModuleRemove from "../_components/module-remove";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {User} from "@prisma/client";

export const generateMetadata = () => {
  return {
    title: "Custom Users | GrowonsMedia",
    description: "Custom Users",
  };
};

type CustomUserProps = {
  searchParams: { page: string };
};

const CustomUserTable = async ({ searchParams }: CustomUserProps) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 12;
  const totalItemCount = await db.customRole.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const customRoles = await db.customRole.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const customUsersWithUser = await Promise.all(
      customRoles.map(async (role) => {
        const user = await db.user.findUnique({
          where: { id: role.userId },
        });

        return {
          ...role,
          user,
        };
      })
  );

  const customUsers = customUsersWithUser.filter(
      (item): item is typeof item & { user: User } => item.user !== null
  );

  return (
    <section className="my-2">
      <nav className="hidden md:block">
        <TopBar title="Custom Users" />
      </nav>
        <div className="m-1 p-1">
      <div className="flex justify-between items-center mb-4">
        <Button className="flex items-center " asChild>
          <Link href={`/admin/custom_user/add`} className="inline">
            <Image
              src="/svgs/plus.svg"
              alt="add money"
              width={20}
              height={20}
              className="h-6 w-6 mr-1"
            />
            Add Custom User
          </Link>
        </Button>
      </div>
        {/* <Search fileName="order-history" /> */}
      </div>
      <section className="space-y-4 md:overflow-auto md:max-h-[75vh] w-full md:w-[100%]">
        <Table>
          <TableCaption>A List of Custom Users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email ID</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {totalItemCount === 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No Custom Users found
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
          <TableBody>
            {customUsers?.map(async (customUser, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                  {customUser.user?.name ?? "N/A"}
                  </TableCell>
                  <TableCell>{customUser.user?.email ?? "N/A"}</TableCell>
                  <TableCell>
                    <ViewModules
                      modules={JSON.parse(JSON.stringify(customUser.modules))}
                    />
                  </TableCell>
                  <TableCell>
                    <ModuleRemove userId={customUser.userId} />
                  </TableCell>
                  <TableCell className="flex flex-col">
                    <span>{customUser.createdAt.toDateString()}</span>
                    <span>
                      {customUser.createdAt.toLocaleTimeString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        hour12: false,
                        timeZoneName: "shortGeneric",
                      })}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default CustomUserTable;
