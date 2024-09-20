import {
    Box,
    TextField,
    Button,
    Stack,
    FormControl,
    Link,
    Select,
    MenuItem,
    InputLabel,
} from "@mui/material"

import { FormEvent, useState } from "react";

import axios from 'axios';

const Register = () => {
    // form inputs
    const [fnInput, setFnInput ] = useState<string>("");
    const [lnInput, setLnInput ] = useState<string>("");
    const [eInput, setEInput ] = useState<string>("");
    const [pInput, setPInput ] = useState<string>("");
    const [cpInput, setCpInput ] = useState<string>("");
    const [ aInput, setAInput ] = useState<string>("");
    const [ gInput, setGInput ] = useState<string>("");
    const [ bInput, setBInput ] = useState<string>("");

    const [ formError, setFormError ] = useState<string>();


    async function handleRegister(e:FormEvent) {
        e.preventDefault();

        try {
            if (
                fnInput.trim() === "" ||
                lnInput.trim() === "" ||
                eInput.trim() === "" ||
                pInput.trim() === "" ||
                cpInput.trim() === "" ||
                aInput.trim() === "" ||
                gInput.trim() === ""
            ) {
                throw new Error("Please fill out all fields.");
            }

            if (pInput !== cpInput) {
                throw new Error("Passwords do not match.")
            }

            // To DO email regex 

            const newUser = {
                name: `${fnInput} ${lnInput}`,
                email: eInput,
                password: pInput,
                age: aInput,
                bio: bInput,
                createAt: Date.now()
            }
            
            const response = await axios.post('/api/user', newUser);

            console.log(response.data);
    

        } catch (error) {
            const e = error as Error
            setFormError(e.message)

        }
    }


    return (  
        <Box
            my="2rem"
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="1rem"
            justifyContent="center"
        >
            <h2>Register</h2>

            <h3>{formError}</h3>

            <Box
                width="50%" 
            >
                <form
                    onSubmit={handleRegister}
                >

                    <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                        <TextField
                            type="text"
                            variant='outlined'
                            color='primary'
                            label="First Name"
                            onChange={e => setFnInput(e.target.value)}
                            value={fnInput}
                            fullWidth
                            required
                        />
                        <TextField
                            type="text"
                            variant='outlined'
                            color='primary'
                            label="Last Name"
                            onChange={e => setLnInput(e.target.value)}
                            value={lnInput}
                            fullWidth
                            required
                        />
                    </Stack>
                    <TextField
                        type="email"
                        variant='outlined'
                        color='primary'
                        label="Email"
                        onChange={e => setEInput(e.target.value)}
                        value={eInput}
                        fullWidth
                        required
                        sx={{mb: 4}}
                    />
                    <TextField
                        type="password"
                        variant='outlined'
                        color='primary'
                        label="Password"
                        onChange={e => setPInput(e.target.value)}
                        value={pInput}
                        required
                        fullWidth
                        sx={{mb: 4}}
                    />
                    <TextField
                        type="password"
                        variant='outlined'
                        color='primary'
                        label="Comfirm Password"
                        onChange={e => setCpInput(e.target.value)}
                        value={cpInput}
                        required
                        fullWidth
                        sx={{mb: 4}}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="gender">Gender</InputLabel>
                        <Select
                            labelId="gender"
                            variant='outlined'

                            color='primary'
                            onChange={e => setAInput(e.target.value)}
                            value={aInput}
                            label="Gender"
                            required
                            fullWidth
                            sx={{mb: 4}}
                        >
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        type="number"
                        variant='outlined'
                        color='primary'
                        label="Age"
                        onChange={e => setGInput(e.target.value)}
                        value={gInput}
                        required
                        fullWidth
                        sx={{mb: 4}}
                    />
                    <TextField
                        multiline
                        type="number"
                        variant='outlined'
                        color='primary'
                        label="Bio (Optional)"
                        onChange={e => setBInput(e.target.value)}
                        value={bInput}
                        fullWidth
                        rows={4}
                        sx={{mb: 4}}
                    />

                    

                    <Box
                        display="flex"
                        justifyContent="center"
                    >
                        <Button 
                            variant="contained" 
                            color="primary" 
                            type="submit"
                        >Register</Button>
                    </Box>
                </form>
            </Box>

            <h3>Already have an account? <Link>Login Here</Link></h3>

        </Box>
    );
}
 
export default Register;