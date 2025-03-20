import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationBar from "../../../money/_components/PaginationBar";
import { revalidatePath } from "next/cache";
import ModifyTeam from "./team-modify";
import CopyButton from "@/components/shared/copy-button";

type TeamTableProps = {
  searchParams: { page: string };
  domainId : string;
};

export async function TeamTable({ searchParams, domainId }: TeamTableProps) {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  // Fetch total count for pagination
  const totalItemCount = await db.team.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  // Fetch team records with pagination and leader details
  const teams = await db.team.findMany({
    where : {
        domainId : domainId
    },
    include: {
      leader: true, // Fetch leader details
    },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath(`/admin/team/table/${domainId}`);

  return (
    <section>
      <div className="ml-2 mt-4 space-y-4 md:overflow-auto md:max-h-[75vh] w-full md:w-[100%] p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableCell>Team Description</TableCell>
              <TableHead>Referral Code</TableHead>
              <TableHead>Leader Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {totalItemCount === 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No teams found
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.description || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span>{team.referralCode}</span>
                    <CopyButton text={team.referralCode} />
                  </div>
                </TableCell>
                <TableCell>{team.leader?.email || "N/A"}</TableCell>
                <TableCell>
                  <ModifyTeam domainId={team.domainId ?? ""}  teamId={team.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
}
