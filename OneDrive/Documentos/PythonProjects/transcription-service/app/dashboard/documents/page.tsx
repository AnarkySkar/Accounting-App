"use client";
import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileIcon,
  DownloadIcon,
  FolderIcon,
  UploadIcon,
  Trash2Icon,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicComment from "@/components/shared/DynamicComment";
import { useDeleteLLCDocument, useGetLLC } from "@/queries/company-onboarding";
interface StorageFile {
  name: string;
  folder: string;
  created_at: string;
  id: string;
  last_accessed_at: string;
  metadata: any;
  updated_at: string;
  size?: number;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return <FileIcon className="h-10 w-10 text-red-500" />;
    case "doc":
    case "docx":
      return <FileIcon className="h-10 w-10 text-blue-500" />;
    case "xls":
    case "xlsx":
      return <FileIcon className="h-10 w-10 text-green-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FileIcon className="h-10 w-10 text-purple-500" />;
    default:
      return <FileIcon className="h-10 w-10 text-gray-500" />;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "Unknown size";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const StoragePage = () => {
  const supabase = createClient();
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const { data: llcData } = useGetLLC(); // Fetch LLC Data
  const { mutateAsync: deleteLLCDocument } = useDeleteLLCDocument();
  const { user } = useAuth();
  const { toast } = useToast();
  const loadFiles = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("documents")
        .list(`${user.id}/documents`, {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      console.log(data);

      if (error) throw error;

      if (data) {
        const filesWithFolder = data.map((file) => ({
          ...file,
          folder: "documents",
        }));
        setFiles(filesWithFolder);
      }
    } catch (err) {
      console.error("Error loading files:", err);
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to upload files",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      setUploadProgress(0);

      try {
        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i];
          const fileName = `${Date.now()}-${file.name}`;
          const filePath = `${user.id}/documents/${fileName}`;

          const { data, error } = await supabase.storage
            .from("documents")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) throw error;

          // const formData = new FormData();
          // formData.append("file", file);
          // formData.append("company_id", user.id);
          // formData.append("folder", "documents");

          // // Upload the file using a dedicated file upload endpoint
          // const uploadResponse = await fetch("/api/upload-file", {
          //   method: "POST",
          //   body: formData,
          // });

          // if (!uploadResponse.ok) {
          //   const errorData = await uploadResponse.json();
          //   throw new Error(errorData.message || "File upload failed");
          // }

          // const uploadResult = await uploadResponse.json();

          // Update progress
          const progress = ((i + 1) / acceptedFiles.length) * 100;
          setUploadProgress(progress);
        }

        toast({
          title: "Success",
          description: `Uploaded ${acceptedFiles.length} file(s)`,
        });

        // Reload files after upload
        loadFiles();
      } catch (err) {
        console.error("Error uploading file:", err);
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to upload file",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [user?.id, supabase, loadFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
  });

  const downloadFile = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(`${user?.id}/documents/${fileName}`);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading file:", err);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (fileId: string, fileName: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    const isLLCDocument = llcData.llc_documents.some(
      (doc: any) => doc.name === fileName
    );

    try {
      const { error } = await supabase.storage
        .from("documents")
        .remove([`${user?.id}/documents/${fileName}`]);

      if (error) throw error;

      //! UNCOMMENT THIS WHEN DELETE FUNCTIONALITY IS ADDED
      // if (isLLCDocument) {
      //   await deleteLLCDocument(fileName);
      // }

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      // Update files list
      setFiles(files.filter((file) => file.name !== fileName));
    } catch (err) {
      console.error("Error deleting file:", err);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const filterFilesByType = (fileType: string) => {
    if (fileType === "all") return files;

    const extensions: Record<string, string[]> = {
      documents: ["pdf", "doc", "docx", "txt"],
      images: ["jpg", "jpeg", "png", "gif", "svg"],
      spreadsheets: ["xls", "xlsx", "csv"],
    };

    return files.filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      return extensions[fileType]?.includes(extension);
    });
  };

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const filteredFiles = filterFilesByType(activeTab);

  return (
    <div className="p-4">
      <DynamicComment />

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 my-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <UploadIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
        <p className="text-lg font-medium">
          {isDragActive
            ? "Drop files here"
            : "Drag & drop files here, or click to select files"}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Supports images, PDFs, Word documents, and Excel spreadsheets
        </p>
      </div>

      {uploading && (
        <div className="mb-6">
          <p className="mb-2">Uploading files...</p>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="spreadsheets">Spreadsheets</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredFiles.length === 0 ? (
        <div className="text-center text-gray-500 p-10 border border-dashed rounded-lg">
          <FolderIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p className="text-lg font-medium">No files found</p>
          <p className="text-sm">
            Upload files by dragging and dropping them above
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file, i) => (
            <File
              key={file.id}
              file={file}
              downloadFile={downloadFile}
              deleteFile={deleteFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoragePage;

type FileProps = {
  file: StorageFile;
  downloadFile: (fileName: string) => Promise<void>;
  deleteFile: (fileId: string, fileName: string) => Promise<void>;
};

const File = ({ file, downloadFile, deleteFile }: FileProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadFile = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    await downloadFile(file.name);
    setIsDownloading(false);
  };

  return (
    <Card
      key={file.name}
      className="overflow-hidden hover:shadow-md transition-shadow"
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-center items-center h-24 bg-gray-50 rounded-md mb-2">
          {getFileIcon(file.name)}
        </div>
        <CardTitle className="text-sm font-medium truncate">
          {file.name.replace(/^\d+-/, "")} {/* Remove timestamp prefix */}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-gray-500">
          {new Date(file.created_at).toLocaleDateString()} •{" "}
          {formatFileSize(file.metadata?.size)}
        </p>
      </CardContent>
      <CardFooter className="p-2 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownloadFile}
          title="Download"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <DownloadIcon className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteFile(file.id, file.name)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          title="Delete"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
