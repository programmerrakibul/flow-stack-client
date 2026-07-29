import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2 } from "lucide-react";

interface FileUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  onFileSelect?: (file: File) => void;
  accept?: string;
  className?: string;
  isUploading?: boolean;
}

const FileUpload = ({
  value,
  onChange,
  onFileSelect,
  accept = "image/*",
  className,
  isUploading = false,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const handleRemove = useCallback(() => {
    setPreview(undefined);
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onChange]);

  if (preview) {
    return (
      <div className={`relative inline-block ${className ?? ""}`}>
        <img
          src={preview}
          alt="Preview"
          className="h-24 w-24 rounded-full object-cover border-2 border-border mx-auto"
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="size-5 animate-spin text-white" />
          </div>
        )}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-1 -right-1 size-5 rounded-full"
          onClick={handleRemove}
          disabled={isUploading}
        >
          <X className="size-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-input"
        disabled={isUploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="gap-2 w-full"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {isUploading ? "Uploading..." : "Choose image"}
      </Button>
    </div>
  );
};

export default FileUpload;
