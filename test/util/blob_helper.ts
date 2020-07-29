/**
 * Helper function to transform blob into string
 * @param blob blob to be converted to string
 * @returns stringified blob
 */
export async function blobToString(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader: FileReader = new FileReader();

    reader.addEventListener('loadend', (e: ProgressEvent) => {
      const text = (e.target as FileReader).result;
      resolve(text as string);
    });

    reader.readAsText(blob);
  });
}
