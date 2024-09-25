import { Alert, Divider, List, Typography } from "@mui/material";
import { Fragment } from "react";
import { Loading } from "../../components";
import { useSearchUsers } from "../../hooks";
import { UserSearchResultItem } from "./UserSearchResultItem";

interface PropsI {
	query: string;
}

export function UserSearchResultList({ query }: PropsI) {
  const {
    data: results,
    isLoading,
    isError,
  } = useSearchUsers(query);

  if (isLoading) return <Loading />;

  if (isError) return <Alert severity="error">An error occurred.</Alert>;

  if (!results?.length) return <Alert severity="info">No users found.</Alert>;

  return (
    <>
      <Typography gutterBottom>
        {results?.length || 0} {results?.length > 1 ? "results" : "result"} for
        "{query}":
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
