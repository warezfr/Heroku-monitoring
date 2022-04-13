
## Available routes

- Get All Companies: GET http://localhost:8080/api/v1/companies

<p> (Can use query parameters for name and razon_social: e.g. "/companies?razon_social=S.A." to search company with S.A.)</p>

- Get Company by Name: GET http://localhost:8080/api/v1/companies/name
```json
{
	"name":"Cetys"
}
```
  
- Get Users by Company: GET http://localhost:8080/api/v1/companies/users/
```json
{
	"name":"Cetys"
}
```

- Get Devices by Company: GET http://localhost:8080/api/v1/companies/devices/
```json
{
	"name":"UABC"
}
```


- Get Records by Company: GET http://localhost:8080/api/v1/companies/records/
```json
{
	"name":"UABC"
}
```

- Add User: POST http://localhost:8080/api/v1/companies/CRUD 
<p> (Cannot post a new company with an already existing name in the collections. Company ID autogenerates and is uneditable)</p>

```json
{
    "name":"Tango",
    "location" : [32.66634681147327, -115.4687826297952],
    "razon_social": "S.A."
}
```

- Update Company: PUT http://localhost:8080/api/v1/companies/CRUD 

<p> (Can update a company info except for name, which are needed for authentication) </p>

```json
{
    "name":"AA Solutions",
    "location" : [-20.6563877497862, -100.40888380189489],
    "razon_social": "S.A."
}
```

- Delete Company: DELETE http://localhost:8080/api/v1/companies/CRUD
<p> (Can soft delete a company. name and razon_social are needed for identification) </p>

```json
{
    "name":"AA Solutions",
    "razon_social": "S.A."
}
```

<br>

## Dummy JSON values
```json
{
    "name":"Cetys",
    "location" : [32.6563877497862, -115.40888380189489],
    "razon_social": "S.A.", 
        
    "name":"UABC",
    "location" : [32.66634681147327, -115.4687826297952],
    "razon_social": "S.A.", 
        
    "name":"AA Solutions",
    "location" : [-20.6563877497862, -100.40888380189489],
    "razon_social": "S.A.",
        
    "name":"Tango",
    "location" : [32.66634681147327, -115.4687826297952],
    "razon_social": "S.A."
}
```
