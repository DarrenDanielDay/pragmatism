type DirectoryMode = "read" | "readwrite";
type WellKnownDirectory = "desktop" | "documents" | "music" | "pictures" | "videos";
interface FilePickerType {
  description?: string;
  /**
   * MIME type => array of extensions
   */
  accept?: {
    [MIME: string]: string[];
  };
}

declare global {
  interface Window {
    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker) */
    showDirectoryPicker(options?: {
      id?: string;
      mode?: DirectoryMode;
      startIn?: FileSystemHandle | WellKnownDirectory[] | string[];
    }): Promise<FileSystemDirectoryHandle>;
    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker) */
    showOpenFilePicker(options?: {
      multiple?: boolean;
      excludeAcceptAllOption?: boolean;
      types?: FilePickerType[];
    }): Promise<FileSystemFileHandle[]>;
    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker) */
    showSaveFilePicker(options?: {
      excludeAcceptAllOption?: boolean;
      suggestedName?: string;
      types?: FilePickerType[];
    }): Promise<FileSystemFileHandle>;
  }
  interface DataTransferItem {
    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFileSystemHandle) */
    getAsFileSystemHandle(): Promise<FileSystemFileHandle | FileSystemDirectoryHandle>;
  }
}

export const readFileAsText = async (handle: FileSystemFileHandle) => {
  const file = await handle.getFile();
  const content = await file.text();
  return content;
};

export const readFileAsJSON = async <T>(handle: FileSystemFileHandle): Promise<T> => {
  const content = await readFileAsText(handle);
  return JSON.parse(content);
};

export const writeFile = async (file: FileSystemFileHandle, content: FileSystemWriteChunkType) => {
  const stream = await file.createWritable({ keepExistingData: false });
  try {
    await stream.write(content);
  } finally {
    await stream.close();
  }
};
