import { Button } from "@/components/ui/button";
import { Upload, FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ToolbarProps {
  onCreateFolder: (name: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  isNewFolderDialogOpen: boolean;
  setIsNewFolderDialogOpen: (open: boolean) => void;
}

export const Toolbar = ({
  onCreateFolder,
  onFileUpload,
  newFolderName,
  setNewFolderName,
  isNewFolderDialogOpen,
  setIsNewFolderDialogOpen,
}: ToolbarProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">My Files</h1>
      <div className="flex gap-2">
        <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button onClick={() => onCreateFolder(newFolderName)}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
        <label>
          <input
            type="file"
            className="hidden"
            onChange={onFileUpload}
          />
          <Button variant="default" asChild>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
};