# Ravn-Challenge-V2-WalterValdivia

Challenge for interview RAVN


## 💡 GETTING STARTED

You can get started with Tiny Store immediately with the hosted service at app.amplication.com

Alternatively you can set up a local development environment with the instructions below

See the Amplication Website or Amplication Docs for more details.


```bash
ravn-challenge-v2-waltervaldivia-production.up.railway.app
      
```


## 💡 INITIAL USERS

* User with role Client
```bash
  localhost:4000/api/signIn
      
```

* User with role Manager
```bash
{
	"email":"manager@ravn.com",
	"password":"prueba"
}
  
```
## 💡API REST FUNCTIONS

In this project, we use API REST only for specific functions.

* Sign In Function POST
```bash
  localhost:4000/api/signIn
```

* Uplad Image Function, we can use MULTIPART FORM 
```bash
  name  : data /* required */
  value : File Chosen
```

## 🌟 Features

- To enforce code style, we use ESLINT standard as code style.

- Authorization based on RBAC with two roles: CUSTOMER & MANAGER
- Clean folder structure, commented code & API documentation with Swagger
- Prisma Global Module, Singletons for S3 Upload Service & various utilities
- Managers can create, read, update & delete Products. Clients can read visible products
