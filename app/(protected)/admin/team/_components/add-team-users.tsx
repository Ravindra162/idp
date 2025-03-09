"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchTeamMembers, addMember, removeMember, searchUsers } from "@/actions/admin-member-team";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
}

interface SearchUser {
  id: string;
  name: string;
  email: string;
  number?: string;
}

const ModifyTeamMembersForm = ({ teamId, domainId }: { teamId: string; domainId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchTeamDetails = useCallback(async () => {
    setLoading(true);
    try {
      const members = await fetchTeamMembers(teamId);
      setMembers(members);
    } catch (error) {
      console.error("Failed to fetch team details:", error);
      toast.error("Error fetching team members.");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchUsers(query);
      setSearchResults(response);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to add.");
      return;
    }
    try {
      const result = await addMember(teamId, selectedUsers.map(user => user.id));
      if (result.success) {
        toast.success(result.message);
        setSelectedUsers([]);
        setSearchResults([]);
        setSearchQuery("");
        setIsDialogOpen(false);
        fetchTeamDetails();
      } else {
        toast.error(result.message || "Failed to add members.");
      }
    } catch (error: any) {
      console.error("Error adding members:", error);
      toast.error("Error adding members.");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      const response = await removeMember(teamId, userId);
      if (response.success) {
        toast.success("Member removed successfully!");
        fetchTeamDetails();
      } else {
        toast.error("Failed to remove member.");
      }
    } catch (error: any) {
      console.error("Error removing member:", error);
      toast.error("Error removing member.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-semibold">Team Members</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Pro Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length > 0 ? (
              members.map(member => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.isPro ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <button className="text-red-500 hover:underline" onClick={() => handleRemoveMember(member.id)}>
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No team members found.
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </TableBody>
        </Table>
      )}

      <div className="mt-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Members</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Members</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Label htmlFor="searchUsers">Search Users</Label>
              <Input
                id="searchUsers"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, email, or mobile"
              />
              {isSearching && <p className="text-sm text-gray-500">Searching...</p>}
              {searchResults.length > 0 && searchResults.map(user => (
                <div key={user.id} className="flex items-center space-x-3 p-3">
                  <Checkbox checked={selectedUsers.some(u => u.id === user.id)} onCheckedChange={() => setSelectedUsers([...selectedUsers, user])} />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
              <Button onClick={handleAddMembers}>Add Selected</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ModifyTeamMembersForm;
