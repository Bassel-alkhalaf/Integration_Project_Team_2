import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { EditPostFormData } from "../types/editPost.type"; // Import the Zod schema
import { editPostSchema } from "../schemas/editPost.schema";





interface EditPostDialogProps {
  isEditDialogOpen: boolean;
  setEditDialogOpen: (isOpen: boolean) => void;
  images?: string[];
  removeImage: (index: number) => void;
  handleEditSubmit: (data: EditPostFormData) => void;
  title: string;
  text: string;
  
}

const EditPostDialog: React.FC<EditPostDialogProps> = ({
  isEditDialogOpen,
  setEditDialogOpen,
  images,
  removeImage,
  handleEditSubmit,
  title,
  text
}) => {
  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: title,
      text: text,
      images: images || [],
    },
  });

  const imagesCount = (images ?? []).length;
  // Define the onSubmit handler with type-safe data
  const onSubmit: SubmitHandler<EditPostFormData> = (data: { title: string; text: string; images?: string[] }) => {
    handleEditSubmit(data);
    setEditDialogOpen(false);
  };

  return (
    <Dialog
      open={isEditDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      fullWidth
    >
      <DialogTitle>Edit Post</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            {...register("title")}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ""}
          />
          <TextField
            fullWidth
            label="Text"
            multiline
            {...register("text")}
            margin="normal"
            error={!!errors.text}
            helperText={errors.text ? errors.text.message : ""}
          />
          {imagesCount > 0 && ( 
            <div style={{ marginTop: 10 }}>
              {images?.map((imgUrl, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Post image ${index}`}
                    style={{ maxWidth: "100px", marginRight: 10 }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPostDialog;
