import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCreateDocument } from "@/hooks/use-document-mutations";
import { useUploadFile } from "@/hooks/use-file-upload";
import { formatDate } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { toast } from "sonner";

// Mock data for documents
// const MOCK_DOCUMENTS = [
//   {
//     id: 1,
//     name: "Dynamic Logic Circuits",
//     type: "pdf",
//     createdAt: "2024-01-15T10:00:00Z",
//     updatedAt: "2024-01-15T10:00:00Z",
//   },
//   {
//     id: 2,
//     name: "System Architecture",
//     type: "docx",
//     createdAt: "2024-01-14T15:30:00Z",
//     updatedAt: "2024-01-14T15:30:00Z",
//   },
//   {
//     id: 3,
//     name: "Database Design Patterns",
//     type: "pdf",
//     createdAt: "2024-01-13T09:15:00Z",
//     updatedAt: "2024-01-13T09:15:00Z",
//   },
//   {
//     id: 4,
//     name: "Network Security Protocols",
//     type: "pdf",
//     createdAt: "2024-01-12T14:20:00Z",
//     updatedAt: "2024-01-12T14:20:00Z",
//   },
//   {
//     id: 5,
//     name: "Cloud Computing Fundamentals",
//     type: "docx",
//     createdAt: "2024-01-11T11:45:00Z",
//     updatedAt: "2024-01-11T11:45:00Z",
//   },
//   {
//     id: 6,
//     name: "Software Testing Methods",
//     type: "pdf",
//     createdAt: "2024-01-10T16:30:00Z",
//     updatedAt: "2024-01-10T16:30:00Z",
//   },
//   {
//     id: 7,
//     name: "API Documentation",
//     type: "docx",
//     createdAt: "2024-01-09T13:25:00Z",
//     updatedAt: "2024-01-09T13:25:00Z",
//   },
//   {
//     id: 8,
//     name: "Machine Learning Basics",
//     type: "pdf",
//     createdAt: "2024-01-08T10:10:00Z",
//     updatedAt: "2024-01-08T10:10:00Z",
//   },
//   {
//     id: 9,
//     name: "Project Requirements",
//     type: "docx",
//     createdAt: "2024-01-07T15:50:00Z",
//     updatedAt: "2024-01-07T15:50:00Z",
//   },
//   {
//     id: 10,
//     name: "Code Review Guidelines",
//     type: "pdf",
//     createdAt: "2024-01-06T12:40:00Z",
//     updatedAt: "2024-01-06T12:40:00Z",
//   },
// ];

type DocumentDrawerProps = {
  documents: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    url: string;
  }[];
  knowledgeBaseId: string;
};

export function DocumentDrawer({
  documents,
  knowledgeBaseId,
}: DocumentDrawerProps) {
  const hasDocuments = documents.length > 0;
  const createDocument = useCreateDocument({ knowledgeBaseId });
  const { onUpload, progresses, isUploading } = useUploadFile("pdfUploader");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Add Documents</Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-7xl mx-auto h-[calc(80vh)]">
        <div className="h-full overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Documents</DrawerTitle>
            <DrawerDescription>
              Add documents to your knowledge base
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6 space-y-4">
            <FileUploader
              onUpload={async (files: File[]) => {
                const uploadedFiles = await onUpload(files);
                if (!uploadedFiles) {
                  return console.error("No files uploaded");
                }
                toast.promise(
                  createDocument.mutateAsync({
                    documents: uploadedFiles.map((file) => ({
                      name: file.name,
                      url: file.url,
                    })),
                  }),
                  {
                    loading: "Adding documents in knowledge base...",
                    success: "Documents added successfully",
                    error: "Failed to add documents",
                  }
                );
              }}
              maxFileCount={3}
              progresses={progresses}
              disabled={isUploading}
              multiple
            />

            {hasDocuments ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Your Documents
                    </span>
                  </div>
                </div>

                <div>
                  <div className="grid gap-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <FileIcon className="h-7 w-7 text-gray-400 mr-4" />
                        <div className="flex-1">
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-sm text-gray-500">
                            Uploaded {formatDate(new Date(doc.createdAt))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 h-full">
                <FileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No documents yet
                </h3>
                <p className="text-sm text-gray-500">
                  Upload your first document using the file uploader above
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
