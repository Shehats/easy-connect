# easy-connect
A package makes life easier. Joking, it does the next best thing. It facilitates http requests and authentications, session caching and local caching in angular4.x, react.js and vue.js 2. The packages seeks to eleminate boilerplate code by inversion of control using containers and convenience annotations:

To install it:

#### npm i -S easy-connect

or

#### yarn add easy-connect

Defining a model:

```javascript
import { api, query, secure, cacheable } from 'easy-connect';

@api({
  baseUrl: 'your api url',
  getAll: 'your api route to get all' // can be something like 'all' or just ''.
  getById: 'your api route to get by id', // can be something like 'id' or just ''.
  create: 'your api route to create or post for your model', // can be 'anything' or just ''.
  update: 'your api route to update or put for your model', // can be 'anything' or just ''.
  updateById: 'your api route to update or put by id if use id to update for your model', // can be 'anything' or just ''.
  delete: 'your api route to delete for your model', // can be 'anything' or just ''.
  deleteById: 'your api route to delete by id if use id to delete for your model', // can be 'anything' or just ''.
  id: 'id' // the parameter that your model uses as an id can be 'id' or 'username' or 'email' it has to be in the model.
})
// to use it with queries
@query({
  queryKey: 'anything', // can be anything your query requires '?key='
  queryUrl: 'your api query route', // your query route, if not provided it will use base url
  appendBase: true // If your using a different api for queries set it to false
})
// If you're using token auth use
@secure()
// If you want to cache your model use it cache data automatically
@cacheable()
export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
```
Or You can have separate api's for all you can get rid of baseUrl.

For angular 4.x:

To use it as a service:

In app.module.ts:
```javascript
import { Easy } from 'easy-connect';
@NgModule({
  ........
  providers: [
  	...,
  	Easy
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```javascript
import { Easy } from 'easy-connect';
import { User } from './WhereEverYourModelIs'

export class SomeClass {
  constructor(private easy: Easy) {}
  // or
  easy: Easy;
  /*
  constructor() {
    this.easy = new Easy();
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


##### In any class or view you can:

```javascript
import { Container } from 'easy-connect';

class myView {
  // that can be in the constructor, the body or a method
  container: Container<User> = new Container(User);
  users: User[] = this.container.All; // automatically sync
  query: User[] = this.container.Query; // automatically sync
  
  // in any method or methods or any where in the code.
  mymethod () {
    this.container.query('query'); // Queries the user from the @query urls and updates the query list.
    this.container.add(new User()/* or someUser */); // posts a user to your api and updates the list;
    this.container.update(someUser); // updates the user both in the api and the list.
    this.container.delete(someUser); // deletes the user both from the api and the list
  }
}
```
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
