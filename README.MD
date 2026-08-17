# StockFlow



## Daily Development Log

### Day 1

- This is the day of dev of stockflow the biggest project of my learning journey so far.
- project setup and and folder structure 
- this is my first project in TypeScript so it will be challenging becasue this project is already huge and with TS it becomes more complicated 
- after two days of all the documentation and understanding of the project today i officailly started building it.
- first of all connected to database 
- setup express and configure it
- then created the user model schema with proper TS interfaces and enums


**In Progress:** user's modle and validation

**Challenges:** As this is my project with TypeScript so it was a little bit of confusing i will say
the interfaces and the generics and then the types of different packages like mongooose bcrypt express etc.

---


### Day 2

- started it off from the user validation added the zod validation for user.
- added the email service provider using Brevo service to send email to employees for their verification and other things
- added two util function one to generate random Id for employee and one to generate temporary password for employees this will be temporary password which will be changed instantly once user is created by Admin.
- wrote a seed script to add Admin user manually 
- added few more util files like AsyncHandler, ApiResponse and ApiError handler


**In Progress:** Tomorrow i will finally write my first controller the user registration controller after that long setup and configuration

**Challenges:** I wouldn't say challenging but TS is a bit confusing for me right now.

---

### Day 3 

- I was suppose to start with register controller but then i hit that for register controller only admin can create user and for it we will have to protect that route to check token and is the login user admin or not so, i decided to start with login controller first.
- created the login controller and added another utility function to generate OTP code 
- I added MFA after login the user will also be verified with otp so i wrote an otp handler to verify that otp 
- also created two html templates to send emails 
- after verifying created the token and set cookies 
- then added two middlewares one to verify token and set user in req.user second to check admin and one more error middleware to handle errors globally 


**In Progress:** the login and OTP verification controllers are working perfectly now finally tomorrow i will test the create user controller the function is ready just need to test it in postman.

**Challenges:** Today i learned few more things about why TS is good for development i was writing the function ot verify token then adding the user to req object but TS doesn't allow because there is no user in res object plain JS allows this because it modifies the objects globally without telling us but TS prevents this it says firs Modify the request object manually then use this. 

---


### Day 4

- Started with the testing of create User controller and it worked perfectly.
- so now more than half of authentication is complete.
- I added two more controllers for forgot password one will create a reset link and also generate a token and its expiry and save to db and then send that reset link to user via email
- the second controller will receive that token and new password from user the token will come from the url the controller will validate the token and then password also checks the expiry time after all the validation it updates the password
- for tokens i added a simple token which lives for 5 days but its not a good approach for production so now im moving to access and refresh token 
- added two functions in utils to generate both tokens 
- then in otpVerify controller instead of setting one token i set two tokens in cookies one access and other refresh token


**In Progress:** The access and refresh token is in progress will complete it tomorrow 

**Challenges:** No challenges but a new concept to learn. I never used access and refresh tokens concept before so its a new thing to learn 

---

### Day 5

- Finally wrapped up the Complete Authentication
- finished the Access and Refresh token for now i was just doing like add two tokens after OTP is verified
- But now i updated few things to make it like production level i added a new schema/model for refreshSession becasue i wanna use token rotation functionality
- changed the refresh toeken generator function now it returns a new jti an unique id which i will use in refreh token controller for security purpose
- now after otp and email is verified we generate two tokens add to cookies but before store the refresh token session in db
- Added a new controller To refreh tokens now whenever the access token is expired frontend auto hits that refresh API it checks the refresh-token validate it and then revoke that token and create and add two new tokens and also add a new session doc for new refresh token 
- added token rotation and token reuse detection i added a new field familyId in refreshSession
now whenever user logs in this field is there inside session 
- and now whenever refresh endpoint hits it will generate new tokens and add a new document of refreshSession but with same familyId because we will use that familyId whenever revoked token reuse detected we will revoke all the tokens with that particular familyId
- added a changePassword controller and a logout cntroller when user logsOut we will also revoke the refresh token in db as well and clear both cookies.


**In Progress:** Finally wrapped up the Auth flow a production level auth control

**Challenges:** It was a great expereince to implement an Access and Refresh token control learned many new concepts in the process.

---


### Day 6

- Today i started with a new module as our user Auth module was completed, so today i started with wareHouse module
- first of all design its DB structure and implement it
- added its zod validation and a util file to generate unique code names for our wareHouses
- added controllers like create wareHouse and getAll WH, update status or multiple fields
- Define routes for these particular controllers, and only admin can access these routes



**In Progress:** WareHouse module it was a short but very important module which i completed today.

**Challenges:** Today i learned a few new things as well like that code generator and that regex to match in the DB
---

### Day 7

- Started with a new module the most important product module
- added its schema and the zod validation
- created two util functions one to generate sku for products and other to format zod errors
- setup cloudinary and multer to handle the images of products
- added the controllers for now i only added five controllers to create product, get all or single product
update status and update all filds or few fields controller
- added routes for particular controllers
- added inventory model and its zod validation


**In Progress:** Module three the product module is completed, and the inventory module is in its initial phase.

**Challenges:** at first the cloudinary was giving error it was a credential error which i fixed and other issue was the zod it was giving weird errors so i fixed it by adding a function which formats those errors
---

### Day 8

- Moved to fourth module inventory 
- started with the inventory controllers added createn Inventory, get inventory by product ID and get by
warehouse ID and update status and reorder level
- also added a special route to adjust quantity of inventory
- added routes and tested them in postman
- now moved to the most interesting module of this project the stock movement module
- this module will log every movement of stock inside warehouse any product sold arrived or moved it will keep its record who moved it how much and why everything
- added its schema and enums

**In Progress:** Stock movement is in progress for now and this is the most interesting part of this project.

**Challenges:** No challenges for now but learning a lot of new concepts.
---
