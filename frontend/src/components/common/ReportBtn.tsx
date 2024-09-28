import {Button, Box, FormControl, Select, InputLabel, MenuItem, Typography} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { useState } from "react";
import { sendRequest } from '../../api';
import { useAuth } from '../../contexts';



type Props = {
    type: "comment" | "comunity" | "post";
    id: string;
}

export const ReportBtn = ({ type, id }: Props) => {
    const { accessToken } = useAuth();
    const [ reportReason, setReportReason ] = useState("");
    const [ reportError, setReportError ] = useState<null | string>(null);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
        setReportReason("");
        setOpen(false);
        setReportError("");
    };

    async function handleReport() {
        try {
            setReportError("");

            if ( reportReason === "" ) {
                throw new Error("Please choose a reason");
            }

            const report = {
                ReportType: type,
                EntityId: id,
                Reason: reportReason
            }

            await sendRequest({
                endpoint: "api/report",
                method: "POST",
                accessToken: accessToken as string,
                body: report
            });

            handleClose();
            enqueueSnackbar("Reported Successfully", { variant: 'success' });

        } catch (error) {
            const err = error as Error;
            setReportError(err.message);

        }
    }
  
    return (
      <Box>
        <Button variant="contained" color='error' onClick={handleClickOpen}>
          Report {type}
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>Report {type}</DialogTitle>
          <DialogContent>
            <DialogContentText
                mb="2rem"
            >
                We're here to keep the community safe. Please let us know why you're reporting this content.
            </DialogContentText>
            <Typography color='error'>{reportError}</Typography>
            <FormControl fullWidth>
                <InputLabel>Reason</InputLabel>
                <Select
                    value={reportReason}
                    label="Report"
                    onChange={e => setReportReason(e.target.value)}
                >
                    <MenuItem value="Spam">Spam</MenuItem>
                    <MenuItem value="Harassment or Bullying">Harassment or Bullying</MenuItem>
                    <MenuItem value="Hate Speech or Discrimination">Hate Speech or Discrimination</MenuItem>
                    <MenuItem value="Offensive Content">Offensive Content</MenuItem>
                    <MenuItem value="Misinformation">Misinformation</MenuItem>
                    <MenuItem value="Illegal Activity">Illegal Activity</MenuItem>
                </Select>
                </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='error'>Cancel</Button>
            <Button
                onClick={handleReport}
                color="error"
                variant='contained'
            >Report</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
}