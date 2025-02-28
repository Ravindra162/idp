import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Link } from "lucide-react";
import DomainsRemove from "./domains-remove";

type Domain = {
    id: string;
    createdAt: Date;
    name: string;
    description: string | null;
    base_url: string;
    includedInIds: string[];
    excludedFromIds: string[];
    settingsId: string;
  };

interface DomainDialogProps{
    walletTypeId : string;
    domains : Domain[];
}

const DomainDialog = ({
    domains,
    walletTypeId,
  }: DomainDialogProps) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Panels
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader></DialogHeader>
  
          {/* Included Teams List in Table Format */}
          <Button className="text-sm w-auto ml-auto" asChild>
            <Link href={`/admin/product/team-quantity/`} className="inline">
              Include a Panel
            </Link>
          </Button>
          <DialogTitle>Panel</DialogTitle>
          <ScrollArea className="max-h-[300px] mt-4 border rounded-md p-4">
            {domains.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No Panels 
              </p>
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
                        <DomainsRemove walletTypeId={walletTypeId} domainId={domain.id} />
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
  