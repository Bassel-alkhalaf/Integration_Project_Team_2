import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserInfoT } from "../../types";
import { grey } from "@mui/material/colors";

interface PropsI {
  user: UserInfoT;
}

export function UserSearchResultItem({ user }: PropsI) {
  const navigate = useNavigate();
  const { id, firstName, lastName, email, profileImageUrl, bio } = user;

  return (
    <ListItem
      onClick={() => navigate(`/user/${id}`)}
      sx={{
        transition: "0.5s",
        "&:hover": { bgcolor: grey[100], cursor: "pointer" },
      }}
      alignItems="flex-start"
    >
      {/* userAvatar */}
      <ListItemAvatar>
        <Avatar alt={`${firstName} ${lastName}`} src={profileImageUrl} />
      </ListItemAvatar>

      {/* userInfo */}
      <ListItemText
        primary={
          <Typography variant="h6">
            {firstName} {lastName}
          </Typography>
        }
        secondary={
          <Stack component={"span"} gap={1}>
            <Typography component="span" variant="body2">
              {email}
            </Typography>
            <Typography component="span" sx={{ color: "text.primary" }}>
              {bio || "No bio available"}
            </Typography>
          </Stack>
        }
      />
    </ListItem>
  );
}
