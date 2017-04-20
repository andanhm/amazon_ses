# Amazon SES with handling Bounces and Complaints 

> This is a dome project to send email with attachment using Amazon SES and handling email matrix (Bounces,Complaints and Delivery) by configuring Amazon SNS consuming through SQS

Handling Bounces and Complaints:

![img](http://d1rzytnzenov8d.cloudfront.net/ses_process_bounce_complaints_2.png)

- Monitor your bounces and complaints and remove any bounced or complained recipient addresses from your mailing list.
- Dashboard to see the status email delivery 
- Dashboard to control and managing the blacklist 

**For technical details and configuring the sqs for handing the email delivery status watch below video**

[![IMAGE ALT Handling Bounces and Complaints with Amazon Simple Email Service](https://i.ytimg.com/vi/n3Fr0bCsIvo/maxresdefault.jpg)](https://www.youtube.com/watch?v=n3Fr0bCsIvo)

**Note**
- Update the accessKeyId,secretAccessKey,region and 3 SQS queue url in config->developed.json

**The flow of Bounce and Complaint handling in AWS using SNS**
- 1) First, we need to create an SNS Topic. An SNS Topic is a communication channel to send messages and subscribe to notifications. It provides an access point for publishers and subscribers to communicate with each other. The following code snippet will create an SNS Topic called 'bounce-complaint-topic'.
- 2) After creating the topic we'll now create a subscription request at Amazon SQS queue that can receive notification messages from Amazon SNS. Once you subscribe an endpoint to a topic and the subscription is confirmed, the endpoint will receive all messages published to that topic. 
- 3) After confirming the subscription we'll now set the notifications types that will be published to the specified Amazon SNS topic,

```
ses-bounces-email (topic) to ses-bounces-email (queue)
ses-complaints-email (topic) to ses-complaints-email (queue)
ses-delivery-email (topic) to ses-delivery-email (queue)
```

## APIs
All the APIs that are expose can be found in `routes`.

### Environment settings

To run the project in development mode (environment: development), you need to configure environment variable in your startup file (like **.bash_profile** or **.profile**)

```
$ npm start
```

## Check Amazon SES API Status
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

# Amazon SES API

## HTTP Response
```json
{
  "error":{
    "code": "Unique error code defined in order to debug error easily(CQ01)",
    "errSource": "File from where error occurred (app.js)",  
    "function": "Function name (sendEmail)", 
    "message": "Message of the error (Unable to fetch the blacklist information)", 
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


### Postman
Postman Amazon SES API collection

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
    |__ postman /
            |__ Amazon-SES.postman_collection
- src/
  |__ index.js
  |__ app.js
  |__ cleanup.js
  |__ public /
  |__ config /
      |__ development.json
      |__ production.json
  |__ controllers /
  |__ handlers
          |__ mongo /
                |__ mongoClient.js
          |__ logs.js
  |__ service /
          |__ sqsMatrixService.js
  |__ router.js    
  |__ tests /
	    |__ test.email.js
	    |__ test.blacklist.js
  |__ gulpfile.js
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

### Development Tech
Amazon SES uses a number of open source projects to make development faster, efficient and automate the build process:
* [SES] - Amazon Simple Email Service (Amazon SES) is a cost-effective email service built on the reliable and scalable infrastructure that Amazon.com developed to serve its own customer base
* [SNS] - Amazon Simple Notification Service (Amazon SNS) is a fast, flexible, fully managed push notification service that lets you send individual messages or to fan-out messages to large numbers of recipients.
* [SQS] - Amazon Simple Queue Service (SQS) is a fully-managed message queuing service for reliably communicating among distributed software components and microservices - at any scale. 
* [async] - Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.
* [Nodemailer] - Nodemailer is a module for Node.js applications to allow easy as cake email sending. 
* [eslint] - A plumbable and configurable linter tool for identifying and reporting on patterns in JavaScript. Maintain your code quality with ease.!
* [gulp] - Gulp is a toolkit for automating painful or time-consuming tasks in your development work flow, so you can stop messing around and build something.
* [mocha] - A test framework running on node.js and the browser which runs tests serially, mapping uncaught exceptions to the correct test cases.
* [nodemon] - Nodemon is a utility that will monitor for any changes in your source and automatically restart your server.
* [should] - should is an expressive, readable, framework-agnostic assertion library.
* [supertest] - Super-agent driven library for testing node.js HTTP servers using a fluent API

### Installation - Testing

* Clone the branch from [github](https://github.com/andanhm/amazon_ses).
* Install MongoDB.
* Config the all the server details into one of the `config file`.

Install the dependencies and dev dependencies and start the server.

```sh
$ cd src
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
* Need to need high efficiency of sending email use RabbitMQ 
* Charts to see the success / failure email delivery status  

[SES]: <https://aws.amazon.com/ses/>
[SQS]: <https://aws.amazon.com/sqs/>
[SNS]: <https://aws.amazon.com/sns/>
[node.js]: <http://nodejs.org>
[Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
[Express]: <http://expressjs.com>
[MongoDB]: <https://docs.mongodb.com/>
[AngularJS]: <http://angularjs.org>
[eslint]: <http://eslint.org/>
[gulp]: <http://gulpjs.com/>
[mocha]: <https://mochajs.org/>
[nodemon]: <https://nodemon.io/>
[should]: <https://shouldjs.github.io/>
[supertest]: <https://github.com/visionmedia/supertest>
[Nodemailer]:<https://nodemailer.com/>
[async]:<https://caolan.github.io/async/docs.html>