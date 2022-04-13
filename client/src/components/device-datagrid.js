import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DevicesDataServices from '../services/devices'
import Grid  from '@mui/material/Grid';
import { Container, Button } from "@mui/material";
import { StyledEngineProvider,styled } from '@mui/material/styles';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
  } from '@mui/x-data-grid';

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

const SelectionButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#FFFFFF',
    borderColor: '#0063cc',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
        backgroundColor: '#F5F5F5',
        borderColor: '#0062cc',
        boxShadow: 'none',
    },
    '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
});

export default function DeviceDatagrid () {
    let {id} = useParams();
    let navigate = useNavigate();

    var deviceInfo = {
        device_id: parseInt(id),
        start_date: new Date(-8640000000000000),
        end_date: new Date(),
    }

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'description', headerName: 'Device Name', width: 300},
        { field: 'value', headerName: 'Value', width: 200},
        { 
            field: 'time_stamp', 
            headerName: 'Time Stamp',
            width: 300,
        },
    ]

    const [data,setData] = useState([]);
    const [filterID,setFilterID] = useState(0);

    const getDeviceHistorial = () => {
        console.log('Historial runned');
        deviceInfo.end_date = new Date();
        DevicesDataServices.getHistorial(deviceInfo)
        .then(response => {
            setData(response.data.records.map(function(data) 
                {
                    let record = {}
                    const f = new Date(data.time_stamp);
                    let time = '';
                    if (f.getHours() === 12) {
                        time = `${f.getHours()}:${f.getMinutes()}:${f.getSeconds()} PM`
                    } else if (f.getHours() === 0) {
                        time = `${f.getHours() + 12}:${f.getMinutes()}:${f.getSeconds()} AM`
                    } else if (f.getHours() > 12) {
                        time = `${f.getHours() - 12}:${f.getMinutes()}:${f.getSeconds()} PM`
                    } else {
                        time = `${f.getHours()}:${f.getMinutes()}:${f.getSeconds()} AM`
                    }
                    record.id = data.record_id;
                    record.description = response.data.description;
                    record.value = data.value;
                    record.time_stamp = `${f.getDate()}-${f.getMonth() + 1}-${f.getFullYear()} ${time}`;
                    return record; 
                }
            ));
        })
        .catch(e => {
            console.log(e);
        });
    };

    useEffect(() => {
        console.log(filterID);
        switch (filterID) {
            case 24:
                deviceInfo.start_date = new Date(new Date().getTime() - 24*60*60*1000);
                getDeviceHistorial();
                break;
            case 7:
                deviceInfo.start_date = new Date(new Date().getTime() - 7*24*60*60*1000);
                getDeviceHistorial();
                break;
            case 30:
                deviceInfo.start_date = new Date(new Date().getTime() - 30*24*60*60*1000);
                getDeviceHistorial();
                break;
            case 90:
                deviceInfo.start_date = new Date(new Date().getTime() - 90*24*60*60*1000);
                getDeviceHistorial();
                break;
            default:
                deviceInfo.start_date = new Date(-8640000000000000);
                getDeviceHistorial();
                break;
        }
        const intervalID = setInterval(() => {
            console.log(filterID);
            switch (filterID) {
                case 24:
                    deviceInfo.start_date = new Date(new Date().getTime() - 24*60*60*1000);
                    getDeviceHistorial();
                    break;
                case 7:
                    deviceInfo.start_date = new Date(new Date().getTime() - 7*24*60*60*1000);
                    getDeviceHistorial();
                    break;
                case 30:
                    deviceInfo.start_date = new Date(new Date().getTime() - 30*24*60*60*1000);
                    getDeviceHistorial();
                    break;
                case 90:
                    deviceInfo.start_date = new Date(new Date().getTime() - 90*24*60*60*1000);
                    getDeviceHistorial();
                    break;
                default:
                    deviceInfo.start_date = new Date(-8640000000000000);
                    getDeviceHistorial();
                    break;
            }
        }, 60000)
        return () => clearInterval(intervalID);
    },[filterID])

    return (
        <StyledEngineProvider injectFirst>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={1}>
                        <div>
                            <Button onClick={() => navigate(-1)} sx={{ my: 2, display: 'block', marginTop:0 }}>
                                Return
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={2} />
                    <Grid item container xs={12} md={6}
                        direction="column"
                        alignItems="center"
                        justifyContent="center">
                        <div className='filter'>
                            <SelectionButton variant="outlined" onClick={() =>setFilterID(24)} sx={{ my: 2, display: 'block', marginTop:0, marginBottom:0, }}>
                                24 Hours
                            </SelectionButton>
                            <SelectionButton variant="outlined" onClick={() => setFilterID(7)} sx={{ my: 2, display: 'block', marginTop:0, marginBottom:0, }}>
                                7 Days
                            </SelectionButton>
                            <SelectionButton variant="outlined" onClick={() => setFilterID(30)} sx={{ my: 2, display: 'block', marginTop:0, marginBottom:0, }}>
                                30 Days
                            </SelectionButton>
                            <SelectionButton variant="outlined" onClick={() => setFilterID(90)} sx={{ my: 2, display: 'block', marginTop:0, marginBottom:0, }}>
                                90 Days
                            </SelectionButton>
                            <SelectionButton variant="outlined" onClick={() => setFilterID(0)} sx={{ my: 2, display: 'block', marginTop:0, marginBottom:0, }}>
                                All Records
                            </SelectionButton>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3} >

                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ height: 700, width: '100%'}}>
                            <DataGrid
                                rows={data}
                                columns={columns}
                                components={{
                                    Toolbar: CustomToolbar,
                                }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </StyledEngineProvider>
    );
}