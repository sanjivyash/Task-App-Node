# Task-Manager API
This API is a personal project powered by **NodeJS** and **MongoDB** on the backend with a bunch of libraries mentioned in the ```package.json``` file in the root directory. It has been hosted on Heroku over [here](https://task-manager-yash.herokuapp.com).   

 Some of its features are as follows:
* A production-suitable security system, with authentication, hashed passwords as well as web-tokens set up for a period of 1 hour.
* Users have to register or login to view other users or create their task list. However, profile pictures can be viewed without authentication (if one can find the user primary keys, which is impossible for ```MongoDB```).
* The database has been hosted on ```Mongo Atlas``` and can support 512 MB of data, which is enough for text and profile pics.
* Tasks have a completed property set to ```False``` by default, but can be set by the user.
* Filtering tasks based on various aspects has been included.
* CRUD operations have been implemented for both user and task models.

## Setting up the Application
It is assumed that you already have ```NodeJS``` and ```npm``` module set up on your machine. You also need ```MongoDB``` to set up the database. It is your preference whether you wush to set it up locally or on **Atlas**. Please note that you would have to set it up on ```Atlas``` for production.
Please take the following steps to set up the application on your local machine:
* Create a folder for the application, then use the following commands in your command line
```
git clone https://github.com/sanjivyash/Task-App-Node.git
npm install
```
* Now the packages are installed. However you have to configure the environment variables. Create a ```config``` folder in the root directory and create a file ```dev.env``` inside it. Now set up the following variables inside this file:
```
PORT=3000
JWT_SECRET=aiho883uefh849ohfiha
DATABASE_URL=mongodb://127.0.0.1:27017/task-manager
```
* Honestly you can setup any JWT Secret key but keep it complicated to enhance security. The ```DATABASE_URL``` is given for a local ```MongoDB``` setup. For an **Atlas** setup, please use the URL provided there.
* Now run the following command on your command line
```
npm run dev
``` 
and you should be all set on your local machine. 
* Just set up **Postman** or some other request client and check out your application.