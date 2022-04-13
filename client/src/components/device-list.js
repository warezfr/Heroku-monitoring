import React from "react";
import Grid  from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';

export default function Device (device) {
    return (
        <>
            <Grid className='component' item xs={4}>
                <Card>
                    <CardContent>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Value: {device.value}
                        </Typography>
                        <Typography variant="h5" component="div">
                            Al-{device.description}
                        </Typography>
                        <Button 
                            component={Link} 
                            to={`/deviceshistorial/${device.device_id}`} 
                            sx={{ my: 2 }}
                            className='boton'
                            style={{
                                    display: "flex",
                                    margin: "auto",
                                    marginBottom: "5px",
                                    padding: "15px 15px"
                            }}
                        >
                            Details
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
        </>
    );
}