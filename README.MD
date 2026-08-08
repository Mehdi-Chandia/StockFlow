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