import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";

interface FileUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  accept?: string;
  className?: string;
}

const FileUpload = ({
  value,
  onChange,
  accept = "image/*",
  className,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(url);
    },
    [onChange],
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
          className="h-24 w-24 rounded-full object-cover border-2 border-border"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-1 -right-1 size-5 rounded-full"
          onClick={handleRemove}
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
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="gap-2"
      >
        <Upload className="size-4" />
        Choose image
      </Button>
    </div>
  );
};

export default FileUpload;
