# Welcome to Finance Manager  

A modern web application to manage and track assets efficiently.  

![Project Preview](https://via.placeholder.com/1200x600.png?text=Project+Screenshot)  

## Table of Contents 
0. [About](#about)   
1. [Features](#features)  
2. [Tech-Stack](#tech-stack)  
3. [Getting Started](#getting-started)  
4. [AI Usage](#ai-usage)
5. [Screenshots](#screenshots)


## About

## Features  
- Create, Read, Update, Delete Assets (CRUD)
- Confirmation modals to prevent accidental deletions 
- Form Validation
- Real-time search and filtering for assets by: 
    - asset
    - category
    - purchase day
    - purchase month 
    - purchase year
- Interactive Charts and Dashboard 
- Download Dashboard as PDF Funcionality
- Automatic and dynamic Dashboard updates when asset-table entries change 
- Responsive Bootstrap UI   

## Tech Stack  
- **Frontend:** Angular, TypeScript, HTML, CSS
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL, Ocean Server  
- **CSS-Framework:** Bootstrap, Chart.js   
- **Other:** RxJS, Form Validation  

## Getting Started  

### Pre-Requisites
- Install Angluar CLI
- Install [Node.js](https://nodejs.org/en/) at least version 20.12.1
- You can check your version with
```
node -v
```
- OpenVPN Connect to access the HTW Net
### Clone the Repositories
```
git clone https://github.com/melisa-cihan/frontend-webtech.git

git clone https://github.com/melisa-cihan/backend-webtech.git
```

### Start the Backend
```
cd backend-webtech
npm install
```
#### Connect to Database
- Connect to the HTW OpenVPN

- In the 'backend-webtech' folder create a .env file to connect to the  Database on the Ocean Server
- unfortunateley I can not give you my password 
```
PGUSER=s0587247
PGHOST=psql.f4.htw-berlin.de
PGPASSWORD=🔑
PGDATABASE=assets_s0587247
PGPORT=5432
```
#### Run the Backend
```
npm run start
```
### Start the Frontend
```
cd frontend frontend-webtech/frontend
npm install
```

### Install Dependencies
## AI Usage  
-

Clone the repository and install dependencies:  

```sh
git clone https://github.com/yourusername/assets-management.git
cd assets-management
npm install

