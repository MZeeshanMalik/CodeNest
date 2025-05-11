import fs from "fs";
import path from "path";

/**
 * Delete a file from the server file system
 * @param filename The name of the file to delete
 * @param folder The folder where the file is located (relative to uploads directory)
 * @returns Promise that resolves to true if successful, or error message if failed
 */
export const deleteFile = async (
  filename: string,
  folder: string = "questionImages"
): Promise<boolean> => {
  try {
    // Handle full paths or just filenames
    let filePath;

    if (filename.includes("\\") || filename.includes("/")) {
      // It's a full path
      filePath = filename;
    } else {
      // It's just a filename
      filePath = path.join(__dirname, "..", "uploads", folder, filename);
    }

    console.log(`Attempting to delete file: ${filePath}`);

    // Debug - print current directory and file path
    console.log("Current directory:", __dirname);
    console.log("Full file path to delete:", filePath);
    console.log("File exists check:", fs.existsSync(filePath));

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      // Try an alternative path
      const altPath = path.join(
        process.cwd(),
        "src",
        "uploads",
        folder,
        filename
      );
      console.log(`Trying alternative path: ${altPath}`);

      if (fs.existsSync(altPath)) {
        console.log(`File found at alternative path: ${altPath}`);
        filePath = altPath;
      } else {
        console.log(`File not found at alternative path either: ${altPath}`);
        return false;
      }
    } // Delete the file
    fs.unlinkSync(filePath);
    console.log(`Successfully deleted file: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filename}:`, error);

    // Try one more alternative path
    try {
      const cwdPath = path.join(
        process.cwd(),
        "src",
        "uploads",
        folder,
        filename
      );
      console.log(`Trying one more path: ${cwdPath}`);

      if (fs.existsSync(cwdPath)) {
        fs.unlinkSync(cwdPath);
        console.log(`Successfully deleted file at CWD path: ${cwdPath}`);
        return true;
      }
    } catch (secondError) {
      console.error(`Error in second delete attempt:`, secondError);
    }

    return false;
  }
};

/**
 * Compare two arrays of filenames and delete any files that exist in the old array but not in the new array
 * @param oldFilenames Array of old filenames
 * @param newFilenames Array of new filenames
 * @param folder The folder where the files are located
 * @returns Array of successfully deleted filenames
 */
export const deleteRemovedFiles = async (
  oldFilenames: string[],
  newFilenames: string[],
  folder: string = "questionImages"
): Promise<string[]> => {
  // Handle empty arrays
  if (!oldFilenames || !newFilenames) {
    console.log("Warning: Empty filename arrays provided");
    return [];
  }

  // Clean up filenames to just the basename without path
  const cleanFilename = (filename: string): string => {
    if (!filename) return "";
    // Handle both forward and backward slashes for cross-platform compatibility
    return filename.split(/[\/\\]/).pop() || filename;
  };

  // Create arrays of clean filenames for comparison
  const oldClean = oldFilenames.map(cleanFilename);
  const newClean = newFilenames.map(cleanFilename);

  console.log("Comparing files:");
  console.log("Old files (clean):", oldClean);
  console.log("New files (clean):", newClean);

  // Find files that were removed (exist in old array but not in new array)
  const filesToDelete: string[] = [];

  // Compare based on the clean filename (without path)
  oldFilenames.forEach((oldFile, index) => {
    const cleanName = oldClean[index];
    if (!newClean.includes(cleanName)) {
      filesToDelete.push(oldFile);
    }
  });

  console.log(
    `Files marked for deletion: ${filesToDelete.length}`,
    filesToDelete
  );
  console.log(
    `Files marked for deletion: ${filesToDelete.length}`,
    filesToDelete
  );

  const deletedFiles: string[] = [];

  // Delete each file in the list
  for (const filename of filesToDelete) {
    try {
      const success = await deleteFile(filename, folder);
      if (success) {
        deletedFiles.push(filename);
        console.log(`Successfully deleted: ${filename}`);
      } else {
        console.log(`Failed to delete: ${filename}`);
      }
    } catch (error) {
      console.error(`Error while trying to delete ${filename}:`, error);
    }
  }

  console.log(
    `Successfully deleted ${deletedFiles.length}/${filesToDelete.length} files`
  );
  return deletedFiles;
};
