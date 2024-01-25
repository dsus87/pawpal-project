
# Project Name

## [See the App!](https://pawpal-pet-sitters.onrender.com/)

![App Logo](/images/pawpal-logo.png)

## Description

Pawpal, your go-to platform for pet care, connects pet owners with local, trusted pet sitters for sitting, boarding, and walking services.
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **events list** - As a user I want to see all the events available so that I can choose which ones I want to attend
- **events create** - As a user I want to create an event so that I can invite others to attend
- **user-profile** - As a user I want to check my profile information and be able to edit it. Also, to go back to the home page if I don't want to see the profile anymore.

## Backlog Functionalities

- Paymment Methods
- Chat for Pet Sitters and Pet owners could interact

## Technologies used

- HTML
- CSS
- Javascript
- Node
- Express
- Handlebars
- Sessions & Cookies
- MongoDB
- Cloudinary


## (Optional) Routes

- GET /
    - Renders index.hbs
- GET /signup
    - Renders signup.hbs
    - redirects to / if user logged in
- POST /signup
    - renders to auth/profile if user logged in
    - Body:
        - username
        - email
        - password
        - name
        - location
        - role
        - availability   
- GET /auth/profile/:username
    - renders to profile.hbs
- POST /update-profile
    - renders to profile.hbs
    - redirects to profile.hbs when user updates profile
    - body:
        - username
        - email
        - password
        - name
        - location
        - role
        - about
        - availability
        - price
- GET /profile/:username
    renders public-profile.hbs
- GET /login
    renders to login.hbs
- POST /login
    - body:
        - email
        - password
    - renders login.hbs
    - redirects index.hbs
- POST /logout
    - redirects to index.hbs
- GET /pet/:_id
    - renders public-pet-profile.hbs
- GET /auth/pet-signup
    - renders to pet-signup.hbs for user to create a new pet
- POST /auth/pet-signup
    - body:
        - name
        - animal
        - breed
        - age
        - temperament
        - about
        - health and diet
        - location
    - redirects to public-pet-profile.hbs with the new pet
- GET /auth/pet-profile/:_id
    - renders to the private pet profile, which is pet-profile.hbs
- POST /auth/pet-profile
    - body:
        - name
        - animal
        - breed
        - age
        - temperament
        - about
        - health and diet
        - location
    - redirects to pet-profile.hbs when the user edits the pet's private page
- GET /auth/delete-pet/:_id
    - redirects to profile.hbs of the user if user presses delete buttom
- GET /all-sitters
    - renders to all-pet-sitters.hbs to display all pet sitters
- GET /find-my-pet
    - renders do find-my-pet.hbs to display all pets
- POST /profile/:username/comment
    - body:
        - content
        - rating
    - redirects to public-profile.hbs when users press buttom to comment
- POST /pet/:petId/comment
    - body:
        - content
        - rating
    - redirects to public-pet-profile.hbs when users press buttom to comment



## Models

- Comment Model:
    - commentSchema new Schema({author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, relatedPet: { 
    type: Schema.Types.ObjectId, ref: 'Pet' , required: true }, content: { type: String,}, rating: {type: Number,
    min: 0, max: 5, required: true },});
- Pet Model:
    - petSchema new Schema({name: String, animal: { type: String, enum: ['Dog', 'Cat'] }, breed: String, age: number, temperament: { type: String, enum: ['Playful', 'Energetic', 'Couch Potato'] }, about: { type: String,},
    photo: {type: String}, healthAndDiet: String, comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],location: { type: String, enum: ['Berlin', 'Amsterdam', 'Lisbon'],}, });
- User Model: 
    - userSchema new Schema({username: {type: String, required: [true, "Email is required."],unique: true, lowercase: true,
      trim: true,}, email: {type: String, required: [true, "Email is required."], unique: true, lowercase: true,
      trim: true,}, password: { type: String, required: [true, "Password is required."],}, name: {type: String,}, location: { type: String, enum: ['Berlin', 'Amsterdam', 'Lisbon'],}, photo:{type: String,}, role: [{type: String, enum: ['Pet Sitter', 'Pet Owner'],},], about: {type: String,}, availability: {type: Boolean,}, services: [{type: String, enum: ['Pet Boarding', 'Dog Walking', 'Pet Sitting'],}], price: { type: Number,},pets: [{ type: Schema.Types.ObjectId, ref: 'Pet'}], reviews: [{ type: Schema.Types.ObjectId, ref: 'Comment'}]},{timestamps: true,});




## Links

## Collaborators

[Daniel](https://github.com/dsus87)

[Ana Filipa](https://github.com/anafilipareis)

### Project

[Repository Link](https://github.com/dsus87/pawpal-project)

[Deploy Link](https://pawpal-pet-sitters.onrender.com/)

### Trello

[Link to your trello board](https://trello.com/b/rcYiXb8y/pawpal)

### Slides

[Slides Link](https://docs.google.com/presentation/d/17wE6C-ZyHBZbWrcE6cyPLkPz7cKai1Yjh1A2Qk1C5qU/edit?usp=sharing)
