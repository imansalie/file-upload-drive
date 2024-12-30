import { Folder } from "lucide-react";

interface FolderItem {
  id: string;
  name: string;
  created_at: string;
}

interface FolderListProps {
  folders: FolderItem[];
  onFolderClick: (folderId: string) => void;
}

export const FolderList = ({ folders, onFolderClick }: FolderListProps) => {
  return (
    <>
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onFolderClick(folder.id)}
        >
          <div className="flex items-center">
            <Folder className="h-6 w-6 text-blue-500 mr-2" />
            <span className="font-medium">{folder.name}</span>
          </div>
        </div>
      ))}
    </>
  );
};