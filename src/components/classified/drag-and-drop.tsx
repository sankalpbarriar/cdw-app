import { MAX_IMAGE_SIZE, MAX_IMAGES } from "@/config/constants";
import { ClassifiedImages } from "@/config/types";
import { cn, convertToMb } from "@/lib/utils";
import { ImagePlus, Loader2 } from "lucide-react";
import { ChangeEvent, useCallback, useRef, useState, useEffect } from "react";

interface DragAndDropProps {
    isUploading: boolean;
    setIsUploading: (loading: boolean) => void;
    items: ClassifiedImages;
    setFiles: (validFile: File[]) => void;
}

export const DragAndDrop = (props: DragAndDropProps) => {
    const { isUploading, setIsUploading, items, setFiles } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const [filesRejected, setFilesRejected] = useState<string[]>([]);
    const [isError, setIsError] = useState({ status: false, message: "" });
    const [isDraggingOver, setDraggingOver] = useState(false);

    const clearError = useCallback(() => {
        setIsError({ status: false, message: "" });
    }, []);

    const handleFilesRejected = useCallback((fileSizeTooBig: string[]) => {
        if (fileSizeTooBig.length) {
            setFilesRejected((prev) => [...prev, ...fileSizeTooBig]);
        }
    }, []);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        clearError();
        setFilesRejected([]);

        if (e.target.files && e.target.files.length > 0) {
            if (MAX_IMAGES < e.target.files.length + items.length) {
                setIsError({
                    status: true,
                    message: `You can upload only upload maximum of ${MAX_IMAGES} images`,
                });
                return;
            }

            const fileSizeTooBig = Array.from(e.target.files)
                .filter((file) => file.size > MAX_IMAGE_SIZE)
                .map((file) => file.name);

            handleFilesRejected(fileSizeTooBig);

            const validFiles = Array.from(e.target.files).filter((file) => file.size <= MAX_IMAGE_SIZE);

            if (validFiles.length) {
                setIsUploading(true);
                setFiles(validFiles);
            }
        }

        e.target.value = "";
    };

    const handleClick = () => inputRef.current?.click();

    const stopEvent = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingOver(false);
    clearError();
    setFilesRejected([]);

    // Use setTimeout to let browser finish default drop cycle before accessing file system
    setTimeout(() => {
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            if (MAX_IMAGES < files.length + items.length) {
                setIsError({
                    status: true,
                    message: `You can upload only upload maximum of ${MAX_IMAGES} images`,
                });
                return;
            }

            const fileSizeTooBig = Array.from(files)
                .filter((file) => file.size > MAX_IMAGE_SIZE)
                .map((file) => file.name);

            handleFilesRejected(fileSizeTooBig);

            const validFiles = Array.from(files).filter((file) => file.size <= MAX_IMAGE_SIZE);

            if (validFiles.length) {
                setIsUploading(true);
                setFiles(validFiles);
            }
        }
    }, 0);
};


    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        stopEvent(e);
        setDraggingOver(true);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        stopEvent(e);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        stopEvent(e);
        setDraggingOver(false);
    };

    useEffect(() => {
        if (filesRejected.length) {
            setIsError({
                status: true,
                message: `${filesRejected.length} image${filesRejected.length > 1 ? "s" : ""} exceeded ${convertToMb(MAX_IMAGE_SIZE)} limit: \n${filesRejected.join(",\n")}`,
            });
        }
    }, [filesRejected]);

    return (
        <>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDragEnter={handleDragEnter}
                className={cn(
                    "relative flex h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted/75",
                    isError.status && "border-red-500",
                    isUploading && "pointer-events-none"
                )}
            >
                <input
                    disabled={isUploading}
                    multiple
                    type="file"
                    ref={inputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                />

                <div
                    onClick={handleClick}
                    className={cn(
                        "flex w-full h-full flex-col items-center justify-center text-center font-medium",
                        isUploading || (isDraggingOver && "opacity-75")
                    )}
                    onKeyDown={handleClick}
                >
                    <ImagePlus className="mx-auto mb-3 h-auto w-9 text-gray-400 " />
                    <p className="mb-1">
                        <span className="text-primary">Upload Files</span>
                        <span className="ml-1 text-muted/75">or drag and drop</span>
                    </p>
                    <p className="text-xs text-muted/75">PNG, JPG, WEBP, up to {convertToMb(MAX_IMAGE_SIZE)} each</p>
                </div>

                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
            </div>

            {isError.status && (
                <div className="flex w-full flex-wrap justify-between md:mt-3">
                    <span className="text-sm font-medium text-red-500 whitespace-pre-line">
                        {isError.message}
                    </span>
                </div>
            )}
        </>
    );
};
