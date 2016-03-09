`http://localhost:8080/setup` we can create a sample user in our new database.

`POST` `http://localhost:8080/api/authenticate` Check name and password against the database and provide a token if authentication successful. This route will not require a token because this is where we get the token.

`GET` `http://localhost:8080/api` This route is protected and will require a token.

`GET` `http://localhost:8080/api/users` List all users. This route is protected and will require a token.

#### Running

Just: `npm start`

#### Check this out

Using [httpie](https://github.com/jkbrzt/httpie)
```
> http -f :8080/api/authenticate name='Rember Johrdan' password=wrong
> http -f :8080/api/authenticate name=wrong password=xpew!
> http -f :8080/api/authenticate name='Rember Johrdan' password=xpew!
```
or use [Postman](http://www.getpostman.com/) instead.
