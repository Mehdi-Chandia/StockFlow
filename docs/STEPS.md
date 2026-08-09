1. create the user login controller also add otp and its expiry in that contrller
2. write the otpCode function then create a token inside it and set cookies
3. then write a verifyToken middleware jus set req.user
4. then create email template for welcome and otp messages

## what learned so far in these controllers 
- Date.now() always gives number use new Date() insteasd
- always create a interface or type for jwt payload because without it Ts dont know is there any id or data
- imp thing learned today with TS the req.user like we attach the user details in this req.user obj after verifying the token but in ts is is undefined we do this in plain JS without any error because js can modify objects globally like this req.user it modifies the req object but in TS it is diff TS doesn't allow this until you add it in express Request object using the global types declaration

## forgot password functionality

- user clicks on forgot password take him to a new tab and ask him to enter his registered email
- backend receives it checks if that password is in db or not if not throw error that if email exists then reset link is sent 
- if email exist create a token hash it and an expiry time for token save to db and create that url/link and mail it to the user
- now for reset password receive newpassword and that token from params compare that token from token
- give error if that token is invalid or expired otherwise hash that new password and save it to db
- send the response to the user of success 

