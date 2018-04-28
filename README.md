# easy-connect
A package makes life easier. Joking, it does the next best thing. It facilitates http requests and authentications, session caching and local caching and instantiaing instances in runtime in angular4.x, react.js and vue.js 2. The packages seeks to eleminate boilerplate code by inversion of control using containers and convenience annotations. It also uses easy-injectionjs as its dependency injection api to resolve depedencies in runtime and resolve nested depedencies in classes.

To install it:

#### npm i -S easy-connect

or

#### yarn add easy-connect

Defining a model:

```javascript
import { api, query, key, id, secure, cacheable } from 'easy-connect';

@api({
  baseUrl: 'your api url',
  getAll: 'your api route to get all' // can be something like 'all' or just ''.
  getById: 'your api route to get by id', // can be something like 'id' or just ''.
  create: 'your api route to create or post for your model', // can be 'anything' or just ''.
  update: 'your api route to update or put for your model', // can be 'anything' or just ''.
  updateById: 'your api route to update or put by id if use id to update for your model', // can be 'anything' or just ''.
  delete: 'your api route to delete for your model', // can be 'anything' or just ''.
  deleteById: 'your api route to delete by id if use id to delete for your model', // can be 'anything' or just ''.
})
// If you're using token auth use
@secure()
// If you want to cache your model use it cache data automatically
@cacheable()
@EasyPrototype()
export class Post {
  @query() // to query the api endpoint using a certain query key
	userId: number;
  @id // It is used to get data, delete data or update data by id
	@key({
    url: 'posts', // it is used to get data using a value other than the id.
    appendBase: true // appends the url to the baseUrl mentioned above.
  })
	id: number;
	title: string;
	body: string;
}
```
Both @key and @query can have names to be utilized by through out the application:

```javascript
import { api, query, key, id,  secure, cacheable } from 'easy-connect';

@api({
  baseUrl: 'your api url',
  getAll: 'your api route to get all' // can be something like 'all' or just ''.
  getById: 'your api route to get by id', // can be something like 'id' or just ''.
  create: 'your api route to create or post for your model', // can be 'anything' or just ''.
  update: 'your api route to update or put for your model', // can be 'anything' or just ''.
  updateById: 'your api route to update or put by id if use id to update for your model', // can be 'anything' or just ''.
  delete: 'your api route to delete for your model', // can be 'anything' or just ''.
  deleteById: 'your api route to delete by id if use id to delete for your model', // can be 'anything' or just ''.
})
// If you're using token auth use
@secure()
// If you want to cache your model use it cache data automatically
@cacheable()
@EasyPrototype()
export class Post {
  @query('USER_ID')
	userId: number;
  @id // It is used to get data, delete data or update data by id
	@key(key: 'POST_ID')
	id: number;
	title: string;
	body: string;
}
```

Both @key and @query can also have further configurations: like extented apir url and whether that url is part of the same api used:

```javascript
import { api, query, key, id,  secure, cacheable } from 'easy-connect';

@api({
  baseUrl: 'your api url',
  getAll: 'your api route to get all' // can be something like 'all' or just ''.
  getById: 'your api route to get by id', // can be something like 'id' or just ''.
  create: 'your api route to create or post for your model', // can be 'anything' or just ''.
  update: 'your api route to update or put for your model', // can be 'anything' or just ''.
  updateById: 'your api route to update or put by id if use id to update for your model', // can be 'anything' or just ''.
  delete: 'your api route to delete for your model', // can be 'anything' or just ''.
  deleteById: 'your api route to delete by id if use id to delete for your model', // can be 'anything' or just ''.
})
// If you're using token auth use
@secure()
// If you want to cache your model use it cache data automatically
@cacheable()
@EasyPrototype()
export class Post {
  @query({
    key: 'USER_ID', // a specific name to be used in queries
    url: 'query url', // a specific query url
    appendBase: true // appends the url to the baseUrl mentioned above.
  }) // to query the api endpoint using a certain query key
	userId: number;
  @id // It is used to get data, delete data or update data by id
	@key({
    key: 'POST_ID', // a specific name to be use in fetchin data
    url: 'posts', // it is used to get data using a value other than the id.
    appendBase: true // appends the url to the baseUrl mentioned above.
  })
	id: number;
	title: string;
	body: string;
}
```

### Using easy-injectionjs decorators with easy-connect to resolve nested dependencies:

#### Class Company:

```javascript
@EasyPrototype()
export class Company {
	name: string;
  catchPhrase: string;
  bs:string;

  public get sayBs(): string {
    return this.name + ' out catch phrase ' + this.catchPhrase + ' and Bs: ' + this.bs
  }
}
```

#### Class Address:

```javascript
import { Geo } from './geo'

@EasyPrototype()
export class Address {
	street: string;
  suite: string;
  city: string;
  zipcode: number;
  @Easy()
  geo: Geo;
}
```

#### Class User

```javascript
import {Company} from './company'
import { Address } from './address'

@container()
@api({
  baseUrl: 'https://jsonplaceholder.typicode.com',
  getAll: 'users',
  getById: '',
  
})
@cacheable()
@EasyPrototype()
export class User {
  @id
  id: number;
  @key(/*can be a url if given.*/)
  name: string;
  email: string;
  phone: string;
  website: string;
  public get awesome(): string {
    return this.name + this.email
  }
  @Easy()
  company: Company;
  @Easy()
  address: Address;
}
```
### easy-connect will resolve all nested classes dependencies in runtime using easy-injectionjs


### For angular 4.x:
### Using easy-connect as a service

In app.module.ts:
```javascript
import { EasyConnect } from 'easy-connect';
@NgModule({
  ........
  providers: [
  	...,
  	EasyConnect
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```javascript
import { Easy } from 'easy-connect';
import { EasyConnect } from './WhereEverYourModelIs'

export class SomeClass {
  constructor(private easy: EasyConnect) {}
  // or
  easy: EasyConnect;
  /*
  constructor() {
    this.easy = new EasyConnect();
  }
  */
  
  someMethod () {
    let id = 10;
    let key = 'Hola';
   /* returns an observable after it caches the data into the session 
   and cache if it cacheable it caches and updates it every 15 seconds */
    this.easy.getAll(User); // Observable of User[]
    this.easy.getById(User, id); // Observable of User
    this.easy.getByFilter(User,key); // Observable of User
    /* Or you can skip the the session storage 
    if your api updates faster that 15 seconds you can use */
    this.easy.getAll(User, true); // Observable of User[]
    this.easy.getById(User, id, true); // Observable of User
    this.easy.getByFilter(User,key, true); // Observable of User
    // to query
    this.easy.query(User, 'query argument'); // Observable of query
    // post, put and delete.
    this.easy.create(User, new User() /* or any User type */); // Oservable of any
    this.easy.update(User, new User() /* or any User type */); // Observable of any
    this.easy.updateById(User, new User() /* or any User type */); // Observable of any
    // You can also pass a different key for the id if need be
    this.easy.updateById(User, new User() /* or any User type */, id); // Observable of any
    this.easy.delete(User, someUser); // Observable of any
    this.easy.deleteDataById(User, someUser or null, id); Oservable of any
  }
}
```
##### All of Easy methods can take extra url params if u don't want to use @api urls

### Containers:

Containers are a key factor of inversion of control in easy-connect. You can use containers instead of Easy if all you need to do is use the api for typical rest api usage. list, search, create, update and delete.


##### In Model class:

```javascript
import { EasyPrototype, api, id, query, container, key, authConfig } from 'easy-connect'

@container()
@api({
	baseUrl: 'https://jsonplaceholder.typicode.com',
	getAll: 'posts',
	create: 'posts',
	updateById: 'posts',
	deleteById: 'posts'
})
@EasyPrototype()
export class Post {
  @query()
	userId: number;
  @id
	@key({
    url: 'posts',
    appendBase: true
  })
	id: number;
	title: string;
	body: string;
}
```
#### An angular component:

```javascript
import { Component, OnInit } from '@angular/core';
import { All, Get_All, 
         Add, Update,
         Delete, Get_Current,
         Get_Query, Query,
         Current } from 'easy-connect'
import { Post } from '../models/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  private _post: Post;
  constructor() { 
  }
  ngOnInit() {
  	Get_All(Post);
    this._post = new Post()
    this._post.userId = 20;
    this._post.id = 200;
    this._post.title = 'Sal says hi';
    this._post.body = 'Awesomeness overload';
  }

  public getQuery() {
    Get_Query(Post, 'userId', '1')
  }

  public getFirst() {
    if (this.posts)
      Get_Current(this.posts[1], 'id')
  }
  get post(): Post {
    return <Post> Current(Post)
  }

  get posts(): Post[] {
  	return All(Post)
  }

  get postQuery(): Post[] {
    return Query(Post)
  }

  public addPost() {
    Add(Post, this._post);
  }

  public updatePost() {
    this._post.title = 'Sal is always hungry :D'
    Update(Post, this._post);
  }

  public deletePost() {
    Delete(Post, this._post);
  }
}

```
##### Get_All method: requires a class. It is typically used to get data from the rest api.
##### All: requires a class. It returns an array of the class type, and that array is the same array fetched by Get_All.
##### Get_Query: requires a class, a query argument: it can be either the parameter name as in id or, if @query('ID') has a name like "ID", the name given in the @query, and a value for the query argument like the previous example.
#### Query: requres a class: It return an array of the Get_Query result.
#### Get_Current: can take an object or an object and an argument: if it only take an object, it will get the object by it's id, the @id decorated property, but if an argument is passed it will get the object a key decorated with the @key decorator. Much like the @query it can be used either with the property name if the @key doesn't have a name or the name given to the @key('ID').
#### Current: return the data returned by Get_Current.
#### Add: requires a class and an object. It posts the object to the api endpoint and updates the result set of All.
#### Update: requires a class and an object. It updates the object to the api endpoint and updates the result set of "All". If the class has "updateById" url, it will update the object by @id, else it with use the "update" url to update the object.
#### Delete: requires a class and an object. It deletes the object from the api end point and updates the result set of "All". If the class has "deleteById" url, it will delete the object by @id, else with the use of "delete" url.

### Authentication:

##### In any class or module:

###### Token authentication:

```javascript
import { EasyTokenAuth } from 'easy-connect';

class myClass {
  auth: EasyTokenAuth;
  constructor() {
    this.auth = new EasyTokenAuth({
      loginUrl: 'Your api login url',
      logoutUrl: 'Your api logout url',
      registerUrl: 'Your api registeration url',
      validateUrl: 'your api validation url',
      prefix: 'your api token prefix', // If empty it assumes that it is Bearer 
      key:'Your api token key in body if returned in the body'
    });
  }
}
```
###### Session or Cookie authentication:

###### The easiest way to configure authentication:

Create a class and decorate the class using @authConfig. It takes two parameters:

1- Authentication urls
2- Authentication type

The second parameter is optional:

Example (Token authentication):

```javascript
@authConfig(
 {
  loginUrl:'LOGIN_URL',
  logoutUrl: 'LOGOUT_URL',
  validateDataUrl: 'DATA_VALIDATION_URL',
  validateUrl: 'VALIDATION_URL',
  registerUrl:'REGISTERATION_URL',
  prefix: 'TOKEN_PREFIX', 
  key:'token', // if the token is returned in the response body
  tokenExpiry: 6480000 // how long to save the token in milliseconds
}, AuthType.TOKEN_AUTH)
class config {
}
```

Example (Session authentication):

```javascript
@authConfig(
 {
  loginUrl:'LOGIN_URL',
  logoutUrl: 'LOGOUT_URL',
  validateDataUrl: 'DATA_VALIDATION_URL',
  validateUrl: 'VALIDATION_URL',
  registerUrl:'REGISTERATION_URL',
})
class config {
}
```
###### Using this methods allows for the following usages for common authentication functionalities anywhere though out the application

```javascript
Login(/*Login params*/) // observable of any.
Logout() // observable of any.
Register(/*Register params*/) // observable of any.
Validate() // observable of any.
ValidateData(/*Data to be validated) // observable of any.
```

###### The more complicated way:


```javascript
import { EasyAuth } from 'easy-connect';

class myClass {
  auth: EasyAuth;
  constructor() {
    this.auth = new EasyAuth({
      loginUrl: 'Your api login url',
      logoutUrl: 'Your api logout url',
      registerUrl: 'Your api registeration url',
      validateUrl: 'your api validation url'
    });
  }
}
```

###### or

```javascript
import { EasyTokenAuth } from 'easy-connect';

class myClass {
  auth: EasyTokenAuth;
  constructor() {
    this.auth = new EasyAuth({
      loginUrl:'LOGIN_URL',
      logoutUrl: 'LOGOUT_URL',
      validateDataUrl: 'DATA_VALIDATION_URL',
      validateUrl: 'VALIDATION_URL',
      registerUrl:'REGISTERATION_URL',
      prefix: 'TOKEN_PREFIX', 
      key:'token', // if the token is returned in the response body
      tokenExpiry: 6480000 // how long to save the token in milliseconds
    });
  }
}
```

###### Both authentication types implement the following methods:
```javascript
this.auth.login(loginParams); // observable of any.
this.auth.logout(); // observable of any.
this.auth.register(registerParams); // observable of any.
this.auth.validate(); // observable of any.
```
##### @secure decorator on the models triggers these validations

#### Currently working on drivers for Angular 4.x, React.js and Vue.js to maintain the code structure of the respective frameworks.
#### The EasyAuth and EasyTokenAuth work for all three.

