
import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  level: string;
  contact: string;
  lastActive: string;
  anomalousActions: number;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Transform the data to match our User interface
        const formattedUsers = data.map(user => ({
          id: user.id,
          name: user.name || 'Unknown User',
          email: user.email || 'No email',
          status: 'active', // Default as active since this isn't in the table
          level: user.level || 'user',
          contact: user.contact || 'No contact',
          lastActive: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown',
          anomalousActions: Math.floor(Math.random() * 10), // Placeholder since this isn't in the table
        }));
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error fetching users",
          description: "Could not load users from the database.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      case "inactive":
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button>Add User</Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-64 flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="rounded-md border animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Anomalous Actions</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{user.level}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    {user.anomalousActions > 0 ? (
                      <div className="flex items-center">
                        <span className="font-medium text-rose-600">{user.anomalousActions}</span>
                        {user.anomalousActions > 5 && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-rose-500 animate-ping-slow"></span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="h-5 w-5 mb-2 text-muted-foreground" />
                    <p>No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
