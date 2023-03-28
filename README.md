# Ravn-Challenge-V2-WalterValdivia

Challenge for interview RAVN

* USER WITH ROLE CLIENT
```bash
  localhost:4000/api/signIn
      
```

* USER WITH ROLE MANAGER
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

* Uplad Image Function, we can user MULTIPART FORM 
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
