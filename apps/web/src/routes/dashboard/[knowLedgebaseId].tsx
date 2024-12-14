import { FileUploader } from "../../components/file-uploader";
import { useUploadFile } from "../../hooks/use-file-upload";

export function BasicUploaderDemo() {
  const { onUpload, progresses, isUploading } = useUploadFile("pdfUploader", {
    defaultUploadedFiles: [],
  });

  return (
    <div className="flex flex-col gap-6">
      <FileUploader
        maxFileCount={4}
        maxSize={4 * 1024 * 1024}
        progresses={progresses}
        onUpload={onUpload}
        disabled={isUploading}
      />
    </div>
  );
}
