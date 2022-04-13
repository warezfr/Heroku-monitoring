
## Available routes

- Get All Users: GET http://localhost:8080/api/v1/users 
<p> (Can use query parameters for role, company and username: e.g. "/users?company=cetys" to search user in Cetys)</p>

- Get User by Username: GET http://localhost:8080/api/v1/users/username
```json
{
	"username": "Manuel-Alejandro"
}
```


- Add User: POST http://localhost:8080/api/v1/users/login 

<p> (Cannot post a new user with an already existing email in the collections)</p>

```json
{
	"username":"Rafael Donatelo",
	"email" : "rd@gmail.com",
	"password" : "User1234",
	"role" : "uSEr",
	"company" : "UABC"
}
```

- Update User: PUT POST http://localhost:8080/api/v1/users/login 

<p> (Can update a user info except for email and password, which are needed for authentication)</p>

```json
{
	"username":"Rafael Miguel Angelo",
	"email" : "rd@gmail.com",
	"password" : "User1234",
	"role" : "developer",
	"company" : "UABC"
}
```

- Delete User: DELETE http://localhost:8080/api/v1/users/login
<p> (Can soft delete a user. email and password are needed for identification) </p>

```json
{
	"email" : "rd@gmail.com",
	"password" : "User1234"
}
```
### ***NOTE:*** email and role inputs gets automatically lowercased for insertion and checking. :exclamation:

<br>

## Dummy JSON values
```json
{
	"username": "Manuel-Alejandro",
	"email": "manuelrm@gmail.com",
	"password": "password123",
	"role": "developer",
	"company": "Cetys",

	"username": "Oscar",
	"email": "oscarrb@gmail.com",
	"password": "developer123",
	"role": "administrator",
	"company": "Cetys",

	"username": "oscar-rosete",
	"email": "oscar.rosete@tango.io",
	"password": "admin123",
	"role": "Developer",
	"company": "Tango",
		
	"username":"Rafael Donatelo",
	"email" : "rd@gmail.com",
	"password" : "User1234",
	"role" : "uSEr",
	"company" : "UABC"
}
```
