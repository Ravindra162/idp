"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { searchTeams, includeTeamInProduct, excludeTeamFromProduct } from "@/actions/admin-product-teams";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

interface Team {
  id: string;
  name: string;
  leader: {
    name: string;
  };
}

interface ProductTeamsDialogProps {
  teams: Team[];
  productName: string;
  productId: string;
}

const ProductTeamsDialog = ({ teams: initialTeams, productName, productId }: ProductTeamsDialogProps) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { teams } = await searchTeams(query, productId);
      setSearchResults(teams);
    } catch (error) {
      toast.error("Failed to search teams");
    } finally {
      setIsSearching(false);
    }
  };

  const handleIncludeTeam = async (teamId: string, teamName: string) => {
    setIsProcessing(true);
    try {
      const result = await includeTeamInProduct(productId, teamId);
      if (result.success) {
        const selectedTeam = searchResults.find(team => team.id === teamId);
        if (selectedTeam) {
          setTeams(prev => [...prev, selectedTeam]);
        }
        setSearchResults(prev => prev.filter(team => team.id !== teamId));
        setSearchQuery("");
        toast.success(`Added ${teamName} to product`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to add team");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExcludeTeam = async (teamId: string, teamName: string) => {
    setIsProcessing(true);
    try {
      const result = await excludeTeamFromProduct(productId, teamId);
      if (result.success) {
        setTeams(prev => prev.filter(team => team.id !== teamId));
        toast.success(`Removed ${teamName} from product`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to remove team");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Teams ({teams.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Teams Using {productName}</DialogTitle>
        </DialogHeader>

        {/* Search Section */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search teams to add..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={isProcessing}
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 absolute right-3 top-3 animate-spin" />
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <ScrollArea className="max-h-[200px] border rounded-md p-2">
              {searchResults.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                >
                  <div>
                    <p className="font-medium">{team.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Leader: {team.leader.name}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleIncludeTeam(team.id, team.name)}
                    disabled={isProcessing}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>

        {/* Current Teams List */}
        <ScrollArea className="max-h-[300px] mt-4">
          {teams.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No teams are using this product
            </p>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div>
                    <h4 className="font-semibold">{team.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Team Leader: {team.leader.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExcludeTeam(team.id, team.name)}
                    disabled={isProcessing}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductTeamsDialog;
