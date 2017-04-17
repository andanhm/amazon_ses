# Amazon SES with handling Bounces and Complaints 

> This is a dome project to send email with attachment using Amazon SES and handling email matrix with SQS 

## APIs
All the APIs that are expose can be found in `routes`.

### Environment settings

To run the project in development mode (environment: development), you need to configure environment variable in your startup file (like **.bash_profile** or **.profile**)

```
$ npm start
```

## Check Queue-Man API Status
Determines the SES API is up and running with ok response


```curl
$ curl -X GET -H "Cache-Control: no-cache" "http://localhost/status"
```
**Response**

```json
{
  "app": "amazon_ses",
  "version": "1.0.0"
}
```

## HTTP Response code

Current API entry format:

| HTTP Status Code | Description |
| --- | --- |
| OK (200) | This is the generic status code for a successfully processed request. |
| Created (201) | This is the generic status code for a successfully processed request. |
| No content (204) | This is the generic status code for a successfully processed request but no content found |
| Bad Request (400) | The service is unable to understand and process the request. |
| Not Found (404) | No results were found (on a search request), or object specified in URI does not exist. |
| Bad Request (422) | The request is well formed, but was unable to be completed or validated due to business logic constraints, missing data, etc.  |
| Internal Server Error (500) | The server encountered an unexpected condition which prevented it from fulfilling the request. |

# Queue API

## HTTP Response
```json
{
  "error":{
    "code": "Unique error code defined in order to debug error easily(CQ01)",
    "errSource": "File from where error occurred (app.js)",  
    "function": "Function name (sendEmail)", 
    "message": "Message of the error (Unable to fetch the queue information)", 
    "description": "Description of the error message in detail", 
    "time": "Error occurred time in ISO format (2016-12-19T19:23:59.617Z)"
  },
  "data":{},
  "version": "1.0.0"
}
```
## Unit Test

### Mocha
Mocha is a feature-rich JavaScript test framework running on Node.js
Allows unit test all the system APIs


```sh
$ npm test
```


## Load test script
### Artillery
Artillery is a simple but powerful load testing toolkit.

```sh
$ sudo npm install -g artillery
```

**Sending email**


Artillery scripts folder structure

```
- scripts /
    |__ artillery /
            |__ send /
                    |__ payload.csv
	    	    	      |__ send-email.json
```

### Postman
Postman Queue-Man API collection

```
- scripts /
    |__ postman /
            |__ Amazon-SES.postman_collection
```

## Directory structure
```
- docker /
    |__ DockerFile
- scripts /
    |__ artillery /
            |__ send /
                    |__ payload.csv
	    	    	      |__ send-email.json
    |__ postman /
            |__ Amazon-SES.postman_collection
- src/
  |__ index.js
  |__ app.js
  |__ public /
  |__ config /
      |__ development.json
      |__ production.json
      |__ testing.json 
  |__ controllers /
  |__ handlers
          |__ mongo /
                |__ mongoClient.js
          |__ logs.js
  |__ service /
  |__ routes.js    
  |__ routes /
        |__ queueRoutes.js
        |__ clientRoutes.js
  |__ test /
	      |__ test.apiHealth.js     
	      |__ test.category.js     
	      |__ test.manage.js     
	      |__ test.withoutCategory.js     
  |__ gulpfile.js
  |__ cleanup.js
  |__ package.json
    
```
## Problem encountered



### Tech
Amazon ses uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - Evented I/O for the backend
* [Express] - fast node.js network app framework
* [MongoDB] - MongoDB is a free and open-source cross-platform document-oriented database program.

### Dev Tech
Amazon SES uses a number of open source projects to make development faster, efficient and automate the build process:

* [eslint] - A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript. Maintain your code quality with ease.!
* [gulp] - Gulp is a toolkit for automating painful or time-consuming tasks in your development work flow, so you can stop messing around and build something.
* [mocha] - A test framework running on node.js and the browser which runs tests serially, mapping uncaught exceptions to the correct test cases.
* [nodemon] - Nodemon is a utility that will monitor for any changes in your source and automatically restart your server.
* [should] - should is an expressive, readable, framework-agnostic assertion library.
* [supertest] - Super-agent driven library for testing node.js HTTP servers using a fluent API
* [istanbul] - A JavaScript code coverage tool written in JS

### Installation - Testing

* Clone the branch from [github]().
* Install MongoDB.
* Config the all the server details into one of the `config file`.

Install the dependencies and dev dependencies and start the server.

```sh
$ cd queue-man\src
$ npm install
$ npm start
```

### For development build we can use gulp
Install the gulp command

```sh
$ npm install --global gulp-cli
```

Runs run gulp automatically rebuilds and check for eslint code quality

```sh
$ gulp
```

## TODO
* User priority checking API need to be implemented
* TS / IS an API check whether user came from queue system or not 
* Who is consuming queue data after dumping data in to the Redis?

License
----
© 

[node.js]: <http://nodejs.org>
[Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
[Express]: <http://expressjs.com>
[MongoDB]: <https://docs.mongodb.com/>
[AngularJS]: <http://angularjs.org>
[Redis]: <https://redis.io/>
[RabbitMQ]: <https://www.rabbitmq.com/>
[eslint]: <http://eslint.org/>
[gulp]: <http://gulpjs.com/>
[mocha]: <https://mochajs.org/>
[nodemon]: <https://nodemon.io/>
[should]: <https://shouldjs.github.io/>
[supertest]: <https://github.com/visionmedia/supertest>
[istanbul]:<http://gotwarlost.github.io/istanbul/>
[rabbitmq-node]:<https://stash.bms.bz/projects/LIB/repos/queuelib-node/>