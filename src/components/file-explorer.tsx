import {
 Breadcrumb,
 BreadcrumbItem,
 BreadcrumbEllipsis,
 BreadcrumbList,
 BreadcrumbSeparator,
 BreadcrumbLink,
 BreadcrumbPage
} from "@/components/ui/breadcrumb";
import {
 ResizablePanel,
 ResizablePanelGroup,
 ResizableHandle
} from "@/components/ui/resizable";
import { CodeView } from "./code-view/index";
import { TreeView } from "./tree-view";
import Hint from "./hints";
import { CopyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Fragment, useCallback, useMemo, useState } from "react";
import { convertFilesToTreeItems } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type FileCollection = {
 [path: string] : string;
};

function getLanguageFromExtension(filename: string): string {
const extension = filename.split('.').pop()?.toLowerCase();
return extension || "text";
}

interface FileExplorerProps {
files: FileCollection;
};

interface FileBreadCrumbProps{
filePath: string;
}

const FileBreadCrumb = ({ filePath }: FileBreadCrumbProps) => {
const parts = filePath.split('/');
const maxSegments = 4;
const pathSegments = parts.slice(-maxSegments);

return (
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
  className="flex-shrink-0 p-3 border-b border-gray-200 bg-gray-50/50"
>
<Breadcrumb>
<BreadcrumbList>
 {pathSegments.map((segment, index) => {
const isLast = index === pathSegments.length - 1;
return (
<Fragment key={index}>
<BreadcrumbItem>
 {isLast ? (
<BreadcrumbPage className="font-medium text-gray-900">
 {segment}
</BreadcrumbPage>
 ) : (
<span className="text-muted-foreground">{segment}</span>
 )}
</BreadcrumbItem>
 {!isLast && <BreadcrumbSeparator />}
</Fragment>
 );
 })}
</BreadcrumbList>
</Breadcrumb>
</motion.div>
 );
};

export const FileExplorer = ({ files }: FileExplorerProps) => {
const [selectedFile, setSelectedFile] = useState<string | null>(
 () => {
const fileKeys = Object.keys(files);
return fileKeys.length > 0 ? fileKeys[0] : null;
 }
);

const treeData = useMemo(() => {
return convertFilesToTreeItems(files);
}, [files]);

const handleFileSelect = useCallback((filePath: string) => {
if (files[filePath]) {
setSelectedFile(filePath);
 }
}, [files]);

return (
<div className="h-full overflow-hidden">
<ResizablePanelGroup direction="horizontal" className="h-full">
<ResizablePanel 
  defaultSize={30} 
  minSize={20} 
  collapsible 
  className="flex flex-col bg-sidebar border-r border-gray-200"
>
  <motion.div 
    className="p-3 border-b border-gray-200 bg-gray-50/30 flex-shrink-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="font-medium text-sm text-gray-700">Files</h3>
  </motion.div>
  <motion.div 
    className="flex-1 min-h-0 overflow-auto p-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.1 }}
  >
    <TreeView data={treeData} value={selectedFile} onSelect={handleFileSelect} />
  </motion.div>
</ResizablePanel>

<ResizableHandle withHandle className="bg-gray-200 hover:bg-blue-300 transition-colors duration-200" />

<ResizablePanel 
  defaultSize={70} 
  minSize={30} 
  className="flex flex-col bg-white min-h-0"
>
 <AnimatePresence mode="wait">
   {selectedFile && files[selectedFile] ? (
     <motion.div 
       key={selectedFile}
       className="flex flex-col h-full"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.2 }}
     >
       <FileBreadCrumb filePath={selectedFile} />
       
       <motion.div 
         className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50/30 flex-shrink-0"
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ duration: 0.3, delay: 0.1 }}
       >
         <span className="text-sm font-medium text-gray-700">
           {selectedFile.split('/').pop()}
         </span>
         <Hint text="Copy file content">
           <Button asChild
             variant="ghost"
             size="sm"
             onClick={() => {
               navigator.clipboard.writeText(files[selectedFile]);
             }}
             className="hover:bg-gray-100 transition-colors duration-200"
           >
             <CopyIcon className="h-4 w-4" />
           </Button>
         </Hint>
       </motion.div>

       <motion.div 
         className="flex-1 min-h-0 overflow-auto"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3, delay: 0.2 }}
       >
         <CodeView 
           code={files[selectedFile]} 
           language={getLanguageFromExtension(selectedFile)} 
         />
       </motion.div>
     </motion.div>
   ) : (
     <motion.div 
       className="flex items-center justify-center h-full text-gray-500"
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.3 }}
     >
       <div className="text-center">
         <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3, delay: 0.1 }}
         >
           <p className="text-lg font-medium">Select a file to view</p>
           <p className="text-sm text-gray-400 mt-1">Choose a file from the explorer</p>
         </motion.div>
       </div>
     </motion.div>
   )}
 </AnimatePresence>
</ResizablePanel>
</ResizablePanelGroup>
</div>
 );
};