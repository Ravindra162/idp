"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IncludedTeamRemove from "./included-team-remove";
import ExcludedTeamRemove from "./excluded-team-remove";
import Link from "next/link";

interface Team {
  id: string;
  teamId: string;
  name: string;
  products: {
    productId: string;
    name: string;
    Price: number;
    Max: number;
    Min: number;
  }[];
}

interface ProductTeamsDialogProps {
  teams: Team[];
  includedTeams: Team[];
  excludedTeams: Team[];
  productName: string;
  productId: string;
}

const ProductTeamsDialog = ({
  teams,
  includedTeams,
  excludedTeams,
  productName,
  productId,
}: ProductTeamsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Teams
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader></DialogHeader>

        {/* Included Teams List in Table Format */}
        <Button className="text-sm w-auto ml-auto" asChild>
          <Link
            href={`/admin/product/team-quantity/${productId}/add`}
            className="inline"
          >
            Include a Team
          </Link>
        </Button>
        <DialogTitle>
          Team having special access{" "}
          {productName.charAt(0).toUpperCase() + productName.slice(1)}
        </DialogTitle>
        <ScrollArea className="max-h-[300px] mt-4 border rounded-md p-4">
          {includedTeams.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No teams are using this product
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team ID</TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Min</TableHead>
                  <TableHead>Max</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {includedTeams.map((team) => {
                  const productDetails = team.products.find(
                    (p) => p.productId === productId
                  );
                  console.log(productDetails);
                  return productDetails ? (
                    <TableRow key={team.id}>
                      <TableCell>{team.teamId}</TableCell>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{productDetails.Price}</TableCell>
                      <TableCell>{productDetails.Min}</TableCell>
                      <TableCell>{productDetails.Max}</TableCell>
                      <TableCell>
                        <IncludedTeamRemove
                          id={productId}
                          teamId={team.teamId}
                        />
                      </TableCell>
                    </TableRow>
                  ) : null;
                })}
              </TableBody>
            </Table>
          )}
        </ScrollArea>

        <Button className="text-sm w-auto ml-auto" asChild>
          <Link
            href={`/admin/product/team-quantity/${productId}/exclude-add`}
            className="inline"
          >
            Exclude a Team
          </Link>
        </Button>

        <DialogTitle>
          Team that doesnot have access to{" "}
          {productName.charAt(0).toUpperCase() + productName.slice(1)}
        </DialogTitle>

        <ScrollArea className="max-h-[300px] mt-4 border rounded-md p-4">
          {excludedTeams.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No teams are using this product
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team ID</TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {excludedTeams.map((team) => (
                  <TableRow key={team.teamId}>
                    <TableCell>{team.teamId}</TableCell>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>
                      <ExcludedTeamRemove id={productId} teamId={team.teamId} />
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

export default ProductTeamsDialog;
