# SpaceX Missions Application

## Overview
This project is a full-stack web application built with:

- .NET 8 Web API

- MySQL Server

- Angular (Latest)

- JWT Authentication

- SpaceX Public API Integration 

## Setup & Run Instructions

Follow the steps below to run the application successfully.

---

## Create the MySQL Database

Before starting the backend, create a new database in MySQL:

```sql
CREATE DATABASE auth_spacex;
```
Then ensure the database name matches the one defined in appsettings.json.
```json
"ConnectionStrings": {
  "Default": "Server=localhost;Port=3306;Database=auth_spacex;User=root;Password=YOUR_PASSWORD;"
}
```
## Initialize Database Tables

After creating the database:

1. Start the backend API.

2. Call the initialization endpoint from InitialController using the API key stored in appsettings.json.

After this make sure the API starts successfully before running the Angular application. 

## Run the Angular App

Navigate to the Angular project folder and run: npm install.

Then start the Angular development server: ng s -o

## Run the Angular App

Go to the Sign-Up page and submit the form to create your account. Then sign-in on the application and after successfull authentication, JWT token will be generated. This token is required to access the protected SpaceX endpoints.  

## Access SpaceX Missions Data

After successfully login you can view the Dashboard component with the: latest, upcoming, and past launches