import {
    Button,
} from "@mui/material";

import { enqueueSnackbar } from 'notistack';
import { sendRequest } from "../../api";

interface AddFriendsProps {
    senderId: string;
    recieverId: string;
    authToken: string;
}

const AddFriendBtn = ({ senderId, recieverId, authToken }: AddFriendsProps) => {

    async function handleBtnClick() {
        const friendRequestInfo = {
            SenderId: senderId,
            ReceiverId: recieverId
        };
    
        try {
            const response = await sendRequest({
                endpoint: "api/friendrequest",
                method: 'POST',
                accessToken: authToken,
                body: friendRequestInfo
            });
    
            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar("Friend successfully added!", { variant: 'success' });
            }
        } 
        catch (e) {
            const err = e as Error;
            enqueueSnackbar(err.message, { variant: 'error' });
        }
    
    }

    return (  
        <Button 
            variant="contained"
            color="primary"
            onClick={handleBtnClick}
        >Add Friend</Button>
    );
}
 
export default AddFriendBtn;