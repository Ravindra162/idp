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

export const generateMetadata = () => {
  return {
    title: "Admin Orders History | GrowonsMedia",
    description: "Admin Orders",
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

  const customUsers = await db.customRole.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  return (
    <section className="my-2">
      <nav className="hidden md:block">
        <TopBar title="Admin Orders" />
      </nav>
      <div className="m-1 p-1">
        <Search fileName="order-history" />
      </div>
      <section className="space-y-4 md:overflow-auto md:max-h-[75vh] w-full md:w-[100%]">
        <Table>
          <TableCaption>A Custom Users.</TableCaption>
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
                    {customUser.user.name}
                  </TableCell>
                  <TableCell>{customUser.user.email}</TableCell>
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
