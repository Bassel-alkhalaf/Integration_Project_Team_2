import {
    IconButton
} from "@mui/material";
import { RemoveCircleOutline} from "@mui/icons-material";

import { useAuth } from "../../contexts";
import { useBlockContext } from "../../contexts/useBlockContext";

import { enqueueSnackbar } from 'notistack';

import { sendRequest } from "../../api";

interface btnProps {
    blockedUserId: string;
}

const BlockUserBtn = ({blockedUserId}: btnProps ) => {

    const { blockUser } = useBlockContext();

    const { accessToken } = useAuth();

    async function handleBlock() {
        try {
            const response = await sendRequest({
                endpoint: `api/UserBlock/block/${blockedUserId}`,
                method: "POST",
                accessToken: accessToken as string
            });

            blockUser(blockedUserId)

            enqueueSnackbar(response.data.message, { variant: 'success' });

        } catch (error) {
            const e = error as Error;
            enqueueSnackbar(e.message, { variant: 'error' });
        }
    }

    return (  
        <IconButton color="error" onClick={handleBlock}>
            <RemoveCircleOutline />
        </IconButton>
    );
}
 
export default BlockUserBtn;