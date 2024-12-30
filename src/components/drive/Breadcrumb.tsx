import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  currentFolder: string | null;
  folderName: string | null;
  onNavigate: (folderId: string | null) => void;
}

export const Breadcrumb = ({ currentFolder, folderName, onNavigate }: BreadcrumbProps) => {
  return (
    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center hover:text-gray-900"
      >
        <Home className="h-4 w-4 mr-1" />
        Home
      </button>
      {currentFolder && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">{folderName}</span>
        </>
      )}
    </div>
  );
};