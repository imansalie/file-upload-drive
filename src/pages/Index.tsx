import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Toolbar } from "@/components/drive/Toolbar";
import { FolderList } from "@/components/drive/FolderList";
import { FileList } from "@/components/drive/FileList";
import { Breadcrumb } from "@/components/drive/Breadcrumb";

interface Folder {
  id: string;
  name: string;
  created_at: string;
}

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      loadFolders();
      loadFiles();
    }
  }, [currentFolder, userId]);

  useEffect(() => {
    if (currentFolder) {
      loadCurrentFolderName();
    } else {
      setCurrentFolderName(null);
    }
  }, [currentFolder]);

  const loadCurrentFolderName = async () => {
    if (!currentFolder) return;
    
    const { data, error } = await supabase
      .from("folders")
      .select("name")
      .eq('id', currentFolder)
      .single();

    if (error) {
      console.error("Error loading folder name:", error);
      return;
    }

    if (data) {
      setCurrentFolderName(data.name);
    }
  };

  const loadFolders = async () => {
    console.log("Loading folders for folder:", currentFolder);
    let query = supabase
      .from("folders")
      .select("*")
      .eq('user_id', userId)
      .order("name");

    if (currentFolder === null) {
      query = query.is('parent_folder_id', null);
    } else {
      query = query.eq('parent_folder_id', currentFolder);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error loading folders:", error);
      toast({
        title: "Error",
        description: "Failed to load folders",
        variant: "destructive",
      });
      return;
    }
    setFolders(data || []);
  };

  const loadFiles = async () => {
    console.log("Loading files for folder:", currentFolder);
    let query = supabase
      .from("files")
      .select("*")
      .eq('user_id', userId)
      .order("name");

    if (currentFolder === null) {
      query = query.is('folder_id', null);
    } else {
      query = query.eq('folder_id', currentFolder);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error loading files:", error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
      return;
    }
    setFiles(data || []);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !userId) return;

    const { error } = await supabase.from("folders").insert({
      name: newFolderName,
      parent_folder_id: currentFolder,
      user_id: userId
    });

    if (error) {
      toast({
        title: "Error creating folder",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setNewFolderName("");
    setIsNewFolderDialogOpen(false);
    loadFolders();
    toast({
      title: "Folder created",
      description: "Your folder has been created successfully.",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast({
          title: "Error uploading file",
          description: uploadError.message,
          variant: "destructive",
        });
        return;
      }

      const { error: dbError } = await supabase.from("files").insert({
        name: file.name,
        size: file.size,
        type: file.type,
        storage_path: filePath,
        folder_id: currentFolder,
        user_id: userId
      });

      if (dbError) {
        await supabase.storage.from('files').remove([filePath]);
        console.error("Database error:", dbError);
        toast({
          title: "Error saving file metadata",
          description: dbError.message,
          variant: "destructive",
        });
        return;
      }

      loadFiles();
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Unexpected error during file upload:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while uploading the file.",
        variant: "destructive",
      });
    }
  };

  const handleFolderNavigation = (folderId: string | null) => {
    setCurrentFolder(folderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Toolbar
          onCreateFolder={handleCreateFolder}
          onFileUpload={handleFileUpload}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          isNewFolderDialogOpen={isNewFolderDialogOpen}
          setIsNewFolderDialogOpen={setIsNewFolderDialogOpen}
        />

        <Breadcrumb 
          currentFolder={currentFolder}
          folderName={currentFolderName}
          onNavigate={handleFolderNavigation}
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FolderList 
              folders={folders} 
              onFolderClick={handleFolderNavigation}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FileList files={files} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;