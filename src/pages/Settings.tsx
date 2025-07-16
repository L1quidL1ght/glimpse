import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StaffUserTable } from '@/components/settings/StaffUserTable';
import { AddStaffUserDialog } from '@/components/settings/AddStaffUserDialog';
import { EditStaffUserDialog } from '@/components/settings/EditStaffUserDialog';
import { DeleteStaffUserDialog } from '@/components/settings/DeleteStaffUserDialog';
import { useStaffUsers } from '@/hooks/useStaffUsers';
import { toast } from '@/hooks/use-toast';

export interface StaffUser {
  id: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { data: staffUsers = [], isLoading, refetch } = useStaffUsers();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<StaffUser | null>(null);

  const handleUserAdded = () => {
    refetch();
    toast({
      title: "Success",
      description: "Staff user has been added successfully.",
    });
  };

  const handleUserUpdated = () => {
    refetch();
    toast({
      title: "Success", 
      description: "Staff user has been updated successfully.",
    });
  };

  const handleUserDeleted = () => {
    refetch();
    toast({
      title: "Success",
      description: "Staff user has been deleted successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/30 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="rounded-lg bg-primary/10 p-2">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage system configuration and staff users</p>
            </div>
          </div>
          <Link to="/dashboard">
            <Button variant="secondary" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>

        {/* Staff Users Section */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Staff Users</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage staff accounts and permissions
              </p>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </CardHeader>
          <CardContent>
            <StaffUserTable
              users={staffUsers}
              isLoading={isLoading}
              onEditUser={setEditingUser}
              onDeleteUser={setDeletingUser}
            />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AddStaffUserDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onUserAdded={handleUserAdded}
        />

        {editingUser && (
          <EditStaffUserDialog
            open={!!editingUser}
            onOpenChange={() => setEditingUser(null)}
            user={editingUser}
            onUserUpdated={handleUserUpdated}
          />
        )}

        {deletingUser && (
          <DeleteStaffUserDialog
            open={!!deletingUser}
            onOpenChange={() => setDeletingUser(null)}
            user={deletingUser}
            onUserDeleted={handleUserDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;