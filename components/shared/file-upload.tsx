"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Cloud, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: File;
  onChange?: (file?: File) => void;
  className?: string;
}

export function FileUpload({ value, onChange, className }: FileUploadProps) {
  const [file, setFile] = useState<File | undefined>(value);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onChange?.(selectedFile);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  const removeFile = useCallback(() => {
    setFile(undefined);
    onChange?.(undefined);
  }, [onChange]);

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition cursor-pointer",
          isDragActive && "border-primary",
          "dark:border-gray-800 dark:hover:border-gray-700"
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="ml-auto hover:opacity-75 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <Cloud className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop a file here or click
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
