import React from "react";
import { useState } from "react";
import { StyledEngineProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid  from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import DevicesDataServices from '../services/devices';
import Device from "./device-list";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function Company(prop) {
    let companyDevices = {
        company_id: 0,
        devices: [{
            description: 'device',
            value: 0,
            device_id: 0
        }],
        location: [],
        name: ""
    }

    const [name,setName] = useState({name: "Company name"});
    const [company,setCompany] = useState(companyDevices);

    const handleChange = (event) => {
        const value = event.target.value;
        setName({
            ...name,
            [event.target.name]: value
        });
    };

    const getDevices = () => {
        DevicesDataServices.get(name)
            .then(response => {
                setCompany(response.data);
            })
            .catch(e => {
                console.log(e);
            })
    };

    return (
        <>            
        <StyledEngineProvider injectFirst>
            <Container>
                <Grid container rowSpacing={3}>
                    <Grid item xs={12} md={12} paddingTop={2}>
                        <Typography variant="h1" className="title"> Company: </Typography>
                        <TextField 
                            className='text-field'
                            value={name.name}
                            name="name"
                            onChange={handleChange}
                        />
                        <Button 
                            onClick={getDevices}
                            variant='contained' 
                            className='boton'
                            style={{
                                    display: "flex",
                                    margin: "auto",
                                    padding: "15px 15px"
                                }}
                            >
                          Get Devices
                        </Button>
                    </Grid>
                    <Grid item container xs={12}>
                    {
                        company.devices.map((device, index) => (
                            <Device {...device} key={index} />
                        ))
                    }
                    </Grid>
                </Grid>
            </Container>
        </StyledEngineProvider>
        </>
    );
}

export default Company;