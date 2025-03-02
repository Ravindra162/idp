import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import DomainsRemove from "./domains-remove";
import Link from "next/link";

type Domains = {
  id: string;
  name: string;
  description: string | null;
  base_url: string;
};

interface DomainDialogProps {
  walletTypeId: string;
  domains: Domains[];
}

const DomainDialog = ({ domains, walletTypeId }: DomainDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Panels
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Panel using this WalletType</DialogTitle>
        </DialogHeader>

        {/* Included Teams List in Table Format */}
        <Button className="text-sm w-auto ml-auto" asChild>
          <Link href={`/admin/wallet-types/panel/${walletTypeId}/add`} className="inline">
            Include a Panel
          </Link>
        </Button>
        <ScrollArea className="max-h-[300px] mt-4 border rounded-md p-4">
          {domains.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No Panels</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Panel Name</TableHead>
                  <TableHead>Panel Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell>{domain.name}</TableCell>
                    <TableCell>{domain.description}</TableCell>
                    <TableCell>
                      <DomainsRemove
                        walletTypeId={walletTypeId}
                        domainId={domain.id}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DomainDialog;
