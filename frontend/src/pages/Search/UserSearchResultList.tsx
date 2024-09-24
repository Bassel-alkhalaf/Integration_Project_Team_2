import { Alert, Divider, List, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Loading } from "../../components";
import { useSearchUsers } from "../../hooks/apiHooks/search/userSearchUsers";
import { TextField } from "@mui/material";
import { UserSearchResultItem } from "./UserSearchResultItem";

export function UserSearchResultList() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: results,
    refetch,
    isLoading,
    isError,
  } = useSearchUsers(searchTerm);

  useEffect(() => {
    if (searchTerm) {
      refetch();
    }
  }, [searchTerm, refetch]);

  if (isLoading) return <Loading />;

  if (isError) return <Alert severity="error">An error occurred.</Alert>;

  if (!results?.length) return <Alert severity="info">No users found.</Alert>;

  return (
    <>
      <TextField
        label="Search Users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Typography gutterBottom>
        {results?.length || 0} {results?.length > 1 ? "results" : "result"} for
        "{searchTerm}":
      </Typography>

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {results.map((user, index) => (
          <Fragment key={user.id}>
            <UserSearchResultItem user={user} />
            {index !== results.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>
    </>
  );
}
