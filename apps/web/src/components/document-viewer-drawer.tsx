import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { buttonVariants } from "./ui/button";
type DocumentViewerDrawerProps = {
  document: {
    name: string;
    url: string;
  };
  page?: number;
  children: React.ReactNode;
};

export function DocumentViewerDrawer({
  document,
  children,
  page,
}: DocumentViewerDrawerProps) {
  let pdfObjData = document.url;
  if (page) {
    pdfObjData = `${pdfObjData}#page=${page}`;
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{document.name}</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto h-[80vh]">
          <object
            data={pdfObjData}
            type="application/pdf"
            className="w-full h-full"
            id="pdfViewer"
          >
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p>Your browser does not support viewing PDFs!</p>
              <a
                href={pdfObjData}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants()}
              >
                Download PDF
              </a>
            </div>
          </object>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
