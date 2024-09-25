import {
    Button
} from "@mui/material";

import { useAuth } from "../../contexts";

import { enqueueSnackbar } from 'notistack';

import { sendRequest } from "../../api";

interface btnProps {
    blockedUserId: string;
}

const BlockUserBtn = ({blockedUserId}: btnProps ) => {

    const { accessToken } = useAuth();

    async function handleBlock() {
        try {
            const response = await sendRequest({
                endpoint: `api/UserBlock/block/${blockedUserId}`,
                method: "POST",
                accessToken: accessToken as string
            });

            enqueueSnackbar(response.data.message, { variant: 'success' });

        } catch (error) {
            const e = error as Error;
            enqueueSnackbar(e.message, { variant: 'error' });
        }
    }

    return (  
        <Button 
            variant="outlined" 
            color="error"
            onClick={handleBlock}
        >Block User</Button>
    );
}
 
export default BlockUserBtn;