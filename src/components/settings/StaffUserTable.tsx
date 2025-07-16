import React from 'react';
import { StaffUser } from '@/pages/Settings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Shield, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface StaffUserTableProps {
  users: StaffUser[];
  isLoading: boolean;
  onEditUser: (user: StaffUser) => void;
  onDeleteUser: (user: StaffUser) => void;
}

export const StaffUserTable: React.FC<StaffUserTableProps> = ({
  users,
  isLoading,
  onEditUser,
  onDeleteUser,
}) => {
  const getRoleIcon = (role: string) => {
    return role === 'admin' ? (
      <Shield className="h-4 w-4" />
    ) : (
      <Users className="h-4 w-4" />
    );
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'admin' ? 'default' : 'secondary';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No staff users found</h3>
        <p className="text-muted-foreground">Add your first staff user to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead className="text-foreground">Name</TableHead>
            <TableHead className="text-foreground">Role</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Created</TableHead>
            <TableHead className="text-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-border/50">
              <TableCell>
                <div>
                  <div className="font-medium text-foreground">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.id}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={getRoleBadgeVariant(user.role)}
                  className="flex items-center space-x-1 w-fit"
                >
                  {getRoleIcon(user.role)}
                  <span className="capitalize">{user.role}</span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={user.is_active ? "default" : "secondary"}
                  className={user.is_active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteUser(user)}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};