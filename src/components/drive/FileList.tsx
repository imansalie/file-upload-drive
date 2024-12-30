import { Button } from "@/components/ui/button";
import { File, Share2, Trash2 } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
}

interface FileListProps {
  files: FileItem[];
}

export const FileList = ({ files }: FileListProps) => {
  return (
    <>
      {files.map((file) => (
        <div
          key={file.id}
          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-6 w-6 text-gray-500 mr-2" />
              <div>
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};