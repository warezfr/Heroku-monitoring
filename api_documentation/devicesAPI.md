
## Available routes

- Get All Devices: GET http://localhost:8080/api/v1/devices

<p> (Can use query parameters for description, company_id and device_id: e.g. "devices?company_id=1000001" to search devices in company with id 1000001)</p>

- Get Records by Device: GET http://localhost:8080/api/v1/devices/records
```json
{
    "device_id": 1000000,
}
```

- Add Device: POST http://localhost:8080/api/v1/devices/CRUD
<p> ( Device ID autogenerates and is uneditable)</p>

```json
{
    "description":"Temperature device",
    "company": 1000001,
    "alert":true,
    "alert_message": "Temperature high level", 
    "max_value":"60psi",
    "min_value": "60psi"
}
```

- Update Device: PUT http://localhost:8080/api/v1/devices/CRUD

<p> (Can update a device info except for company_id and device_id, which are needed for authentication) </p>

```json
{
    "device_id": 1000001,
    "description":"Current device",
    "company": 1000001,
    "alert":false,
    "alert_message": "", 
    "max_value":"60psi",
    "min_value": "60psi"
}
```

- Delete Device: DELETE http://localhost:8080/api/v1/devices/CRUD
<p> (Can soft delete a device. company_id and device_id are needed for identification) </p>

```json
{
    "device_id": 1000001,
    "company": 1000001
}
```

<br>

## Dummy JSON values
```json
{
    "description":"Temperature device",
    "company": 1000001,
    "alert":true,
    "alert_message": "Temperature high level", 
    "max_value":"60psi",
    "min_value": "60psi",
        
    "description":"Current device",
    "company": 1000001,
    "alert":false,
    "alert_message": "", 
    "max_value":"60psi",
    "min_value": "60psi",
        
    "description":"Resistence device",
    "company": 1000001,
    "alert":false,
    "alert_message": "", 
    "max_value":"60psi",
    "min_value": "60psi"
}

```
