import { auth } from "@/lib/auth";
import TopBar from "@/app/(protected)/_components/Topbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { TeamTable } from "../../_components/team-table-component";

export const generateMetadata = () => {
  return {
    title: "Teams | GrowonsMedia",
    description: "View and manage your teams",
  };
};

const Page = async ({
  searchParams,
  params,
}: {
  searchParams: { page: string };
  params: { domainId: string };
}) => {
  const session = await auth();
  const userId = session?.user.id || "";

  if (!userId) {
    return <p className="text-center text-red-500">Unauthorized</p>;
  }

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Teams" />
      </nav>
      <section>
        <div className="m-2">
          <div className="flex justify-between items-center">
            <Button className="flex items-center " asChild>
              <Link href={`/admin/team/add/${params.domainId}`} className="inline">
                <Image
                  src="/svgs/plus.svg"
                  alt="add payment method"
                  width={20}
                  height={20}
                  className="h-6 w-6 mr-1"
                />
                Add Team
              </Link>
            </Button>
          </div>
          <TeamTable searchParams={searchParams} domainId={params.domainId} />
        </div>
      </section>
    </>
  );
};

export default Page;
