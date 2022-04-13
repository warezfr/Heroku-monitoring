
## Available routes

- Get All Records: GET http://localhost:8080/api/v1/records
  
<p> (Can use query parameters for device_id: e.g. "records?device_id=1000000" to search records in device with id 1000000)</p>

- Add Record: POST http://localhost:8080/api/v1/records/CRUD
<p> (Adds a record to device. Time_stamp auto generates with new Date() function)</p>

```json
{
	"device_id": 1000001,
	"value":"1000"
}
```

- Delete Records: DELETE http://localhost:8080/api/v1/records/CRUD
<p> (Can soft delete multiple records. start_date, end_date and device_id is needed for identification) </p>

```json
{
    "start_date":"2022-03-15T21:09:50.231Z",
    "end_date":  "2022-03-15T21:10:15.279Z",
    "device_id": 1000000
}
```

<br>

## Dummy JSON values
```json
{
	"device_id": 1000001,
	"value":"60",
	
	"device_id": 1000000,
	"value":"50",
	
	"device_id": 1000000,
	"value":"70",
	
	"device_id": 1000000,
	"value":"900",
	
	"device_id": 1000001,
	"value":"1000"
}
```
