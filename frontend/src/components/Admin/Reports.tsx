import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { sendRequest } from '../../api';
import { useAuth } from '../../contexts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

interface Report {
    createdAt: string; 
    entityId: string;
    id: string
    reason: string;
    reportType: string;
    reporterId: string
}

const Reports: React.FC = () => {
    const navigate = useNavigate();

    const { accessToken } = useAuth();

    const [ reports, setReports ] = useState<Report[]>([]);

    async function fetchReports() {
        try {
            const response = await sendRequest({
                endpoint: "api/report/all",
                method: "GET",
                accessToken: accessToken as string
            }); 
    
            const data = await response.data;
    
            setReports(data);
        } catch {
            enqueueSnackbar('Failed to fetch reports', { variant: 'error' });
        }

    }

    async function resolveReport(id:string) {
        try {
            await sendRequest({
                endpoint: "api/report/" + id,
                method: "DELETE",
                accessToken: accessToken as string
            });

            const newReports = reports.filter(r => r.id != id);

            setReports(newReports);

            enqueueSnackbar('Report resolved ', { variant: 'success' });
            
   
        } catch {
            enqueueSnackbar('Failed to resolve report', { variant: 'error' });
        }

    }

    function capitalize(str: string) {
        if (!str) return ''; // Return empty string if input is falsy
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    useEffect(() => {
        fetchReports()
    }, [])
  
  return (
    <Box mt="1rem" > 
        <Typography variant="h6" mb="1rem">
            Reports
        </Typography>

        <Box
            display="flex"
            flexDirection="column"
            gap="1rem"
        >
            {reports && reports.length < 1 && <Typography>No Reports Found</Typography>}

            {reports && reports.length >= 1 && reports.map( r => (
                <Box key={r.id}>
                    <Typography
                        fontWeight="bold"
                    >{capitalize(r.reason)}</Typography>
                    <Typography
                    >{capitalize(r.reportType)} Report</Typography>
                    <Typography
                        mb="1rem"
                    >Report Date: {r.createdAt}</Typography>
                    {(r.reportType === "post" || r.reportType === "comment") && 
                        <Box
                            display="flex"
                            gap=".5rem"
                        >
                            <Button
                                onClick={() => navigate("/posts/" + r.entityId)}
                                // onClick={() => navigate("/posts/b53cdc2f-ef6e-4c73-82d8-a2754642253f")}
                                variant='outlined'
                            >
                                View {r.reportType}
                            </Button>

                            <Button 
                                variant='outlined'
                                color='error'
                                onClick={() => resolveReport(r.id)}
                            >Resolve</Button>
                        </Box>

                    }
                    {r.reportType === "community" && 
                        <Box
                            display="flex"
                            gap=".5rem"
                        >
                            <Button
                                onClick={() => navigate("/community/" + r.entityId)}
                                variant='outlined'
                            >
                                View {r.reportType}
                            </Button>

                            <Button 
                                variant='outlined'
                                color='error'
                            >Resolve</Button>
                        </Box>

                    }



                </Box>

            ))}

        </Box>
    </Box>

  );
};

export default Reports;
