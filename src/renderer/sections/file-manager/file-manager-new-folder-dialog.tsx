import type { DialogProps } from "@mui/material/Dialog";

import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { Upload } from "../../components/upload";
import { Iconify } from "../../components/iconify";
import { SettingType } from "../../../main/types/setting/setting-type";
import { toast } from "sonner";

// ----------------------------------------------------------------------

type Props = DialogProps & {
  open: boolean;
  type: SettingType;
  title?: string;
  folderName?: string;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FileManagerNewFolderDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  title = "Upload files",
  type,
  ...other
}: Props) {
  const [file, setFile] = useState<File | string | null>(null);
  const [files, setFiles] = useState<(File | string)[]>([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];
    setFile(newFile);
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleUpload = async (inputFiles: (string | File)[]) => {
    onClose();
    if (inputFiles.every((file) => file instanceof File)) {
      try {
        const paths: string[] = inputFiles.map((inputFile) => inputFile.path);
        await window.electron.ipcRenderer.uploadSettingFile(type, paths);
        toast.success("Success!");
      } catch (error) {
        toast.error("Upload failed");
      }
      // for (const result of results) {
      //   toast.info(result);
      // }
      // await window.electron.ipcRenderer.uploadFile(paths);
    }
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={[(theme) => ({ p: theme.spacing(3, 3, 2, 3) })]}>
        {title}
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: "none" }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        {/* <Upload
          value={file}
          onDrop={handleDropSingleFile}
          onDelete={() => setFile(null)}
        /> */}

        <Upload
          multiple
          value={files}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={() => handleUpload(files)}
        >
          Upload
        </Button>

        {!!files.length && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleRemoveAllFiles}
          >
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Box
            sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
          >
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? "Save" : "Create"}
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}
