import { FileUploader } from "@/components/file-uploader";
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
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FileIcon } from "lucide-react";
import { toast } from "sonner";
import { DocumentViewerDrawer } from "./document-viewer-drawer";

type DocumentDrawerProps = {
  documents: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    url: string;
  }[];
  knowledgeBaseId: string;
  children?: React.ReactNode;
};

/**
 * !ALERT: I wasn't able make this work it in cloudflare workers so we chunk the documents in the browser (this is not ideal)
 * Converts a PDF file to chunks of text We are using the WebPDFLoader from Langchain to load the PDF file and then splitting the documents into chunks
 * @param file File to convert
 * @returns Array of chunks
 */
async function pdfToChunks(file: File) {
  const pdfBlob = new Blob([file], { type: "application/pdf" });

  const loader = new WebPDFLoader(pdfBlob, {
    pdfjs: () => import("pdfjs-dist/legacy/build/pdf.mjs"),
  });
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  return chunks;
}

export function DocumentDrawer({
  documents,
  knowledgeBaseId,
  children,
}: DocumentDrawerProps) {
  const hasDocuments = documents.length > 0;
  const createDocument = useCreateDocument({ knowledgeBaseId });
  const { onUpload, progresses, isUploading } = useUploadFile("pdfUploader");

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="max-w-7xl mx-auto h-[80vh]">
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
                const loadingToast = toast.loading("Chunking documents...");
                const chunks = await Promise.all(
                  files.map((file) => pdfToChunks(file))
                ).catch((error) => {
                  console.error(error);
                  toast.error("Failed to chunk documents");
                  toast.dismiss(loadingToast);
                  throw error;
                });
                toast.dismiss(loadingToast);
                const uploadedFiles = await onUpload(files);
                if (!uploadedFiles) {
                  return console.error("No files uploaded");
                }
                toast.promise(
                  createDocument.mutateAsync({
                    documents: uploadedFiles.map((file, i) => ({
                      name: file.name,
                      url: file.url,
                      embeddings: chunks[i],
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
                      <DocumentViewerDrawer
                        key={doc.id}
                        document={{ name: doc.name, url: doc.url }}
                      >
                        <button className="flex items-center justify-start p-4 border rounded-lg hover:bg-gray-50">
                          <FileIcon className="h-7 w-7 text-gray-400 mr-4" />
                          <div className="flex flex-col items-start">
                            <h3 className="font-medium">{doc.name}</h3>
                            <p className="text-sm text-gray-500">
                              Uploaded {formatDate(new Date(doc.createdAt))}
                            </p>
                          </div>
                        </button>
                      </DocumentViewerDrawer>
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
