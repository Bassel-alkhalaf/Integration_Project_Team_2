import { Box } from "@mui/material";

import UnBlockUserBtn from "../components/common/UnBlockUserBtn";
import BlockUserBtn from "../components/common/BlockUserBtn";

const Blocking = () => {
    return (  
        <Box>
            <BlockUserBtn blockedUserId={"YN3pnFsVZ9eakf5x18jofcyKlCD2"} />
            <UnBlockUserBtn blockedUserId={"YN3pnFsVZ9eakf5x18jofcyKlCD2"} />
        </Box>
    );
}
 
export default Blocking;