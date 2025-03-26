# Welcome to Finance Manager  
A modern web application to manage and track assets efficiently.  

![Dashboard Screenshot](frontend/src/assets/Logo.png)

## Table of Contents 
0. [About](#about)   
1. [Features](#features)  
2. [Tech-Stack](#tech-stack)  
3. [Getting Started](#getting-started)  
4. [Deployment](#deployment)
5. [AI Usage](#ai-usage)
6. [Author](#author)  

## About
Finance Manager is your go-to application for tracking and managing assets with ease. Whether you're handling stocks, real estate, or other investments, this tool provides a seamless experience to keep your portfolio organized. With powerful search, filtering, and real-time dashboard updates, Finance Manager ensures you always have an up-to-date view of your financial landscape. Stay in control, make data-driven decisions, and manage your assets like a pro.

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
- User friendly zoomable buttons 

##  Tech Stack  
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
#### Connect to the Database
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

#### Generate Dummy Data via Postman
In Postman run 
```
GET localhost:3000/init
```
### Start the Frontend
```
cd frontend frontend-webtech/frontend
npm install
```
#### Run the Frontend
```
ng serve
```
#### Open the Application in your Browser
https://localhost:4200

## Deployment
### Backend

https://backend-webtech-fzkq.onrender.com

### Limitations
The Deployment is only connected to the Server not to the Database. Due to the free-tier, I can not add the HTW Sub Net
## AI Usage  
| AI Tool  | Usage 
|----------|----------
| Open AI Chat GPT  | Refactoring, CSS-Styling, Generating Dummy Data,   Bug Fixing           
| Google Gemini    | CSS-Styling 

## Author
### Melisa Cihan

