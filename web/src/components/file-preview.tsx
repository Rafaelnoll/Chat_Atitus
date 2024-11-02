import { FileText, Film, X } from "lucide-react";
import { Button } from "./button";

export const FilePreview = ({ file, onRemove }: { file: File, onRemove: () => void }) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isDocument = !isImage && !isVideo;

    return (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center text-slate-900">
            {isImage && (
              <div className="w-10 h-10 mr-2 rounded overflow-hidden">
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
              </div>
            )}
            {isVideo && (
              <div className="w-10 h-10 mr-2 rounded overflow-hidden bg-black flex items-center justify-center">
                <Film className="h-6 w-6 text-white" />
              </div>
            )}
            {isDocument && <FileText className="h-6 w-6 mr-2" />}
            <span className="text-sm">{file.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemove} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )
}