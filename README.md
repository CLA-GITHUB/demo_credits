# Demo Credit (Lendsqr Backend Engineer Assessment)

This is the documentation for my Demo Credit API implementation. 
1. It allows users to sign up and log in.
2. Users can fund their account
3. Users can transfer funds to another user’s account
4. Users can withdraw funds from their account.

## Planning
This API is implemented using
+ MRS(Model-Repository-Service) Software architecture which provides a modular and scalable approach to building software systems. By separating the business logic from the data access, it allows for easier maintenance, testing, and reuse of components. It also enables developers to easily swap out different data storage technologies without affecting the core business logic.
+ OOP(Object Oriented Programming) programming paradigm which focuses on modeling software systems as objects that interact with each other. In OOP, objects encapsulate data and behavior, and classes provide a blueprint for creating objects.
+ Top-Dowm Database Design method which starts from the general conception and moves to the specific.
### ER Diagram
![alt text](https://raw.githubusercontent.com/CLA-GITHUB/demo_credits/main/er_demo_credit.png "ERD")

## Getting Started

Production URL
`https://livingstone-christwealth-lendsqr-be-test.up.railway.app/`

To use this API, you'll need to have Node.js and npm installed on your computer. You can download them from the official Node.js website: https://nodejs.org/en/.

Clone repo
```git
git clone <repository-link>
```
To install the dependencies for this project, run the following command in your terminal:
```yarn
cd <cloned-dir>
yarn
yarn dev
```
The server will be running at `http://localhost:8080`.

## Routes

The structure of the response body. Some fields are omitted depending on the status of the response.
```typescript
 type ResponseBodyObject = {
  message?: string;
  success?: boolean;
  errors?: string[];
  payload?: {
    [key: string]: User | Account | Transaction | Transaction[];
  }
```
1. Authentication routes
+ `/auth/signup` route to create user

signup route takes the user's name, email and password(which is hashed) then stores it to the database
```json
{
  "name": "user1"
  "email": "user1@email.com"
  "password": "123456"
}
```

and returns this
```json
{
  "message": "user created"
  "success": "true"
}
```
+ `/auth/login`  route to login user(creates and set token to http cookie)

Login route takes the user's email and password(which is hashed) then creates an http cookie with a token to identify the user
```json
{
  "email": "user1@email.com"
  "password": "123456"
}
```

and returns this a 200 status code OK
```http
200
```

2. Account routes
+ `/account/fund` funds user account and creates a transaction record with type deposite

```json
{
    "amount":1200
}
```

returns
```json
{
    "message":"Deposit successful"
    "success": true
}
```

+ `/account/transfer` transfers funds from a user(sender) to another user(reciever). Knex Transaction is used to rollback changes in the database if any operation fails

```json
{
    "receiver":"2563031904",
    "amount":1200
}
```

returns
```json
{
        "message": "transfer to user2 was successful",
        "success": true,
 }
```
+ `/account/withdraw-funds` 
```json
{
    "amount":1200
}
```

returns
```json
{
        "message": "Withdrawal issued and successful",
        "success": true,
}
```

3. User routes
+ `/user/getMe` GET route to get the logged in user (does so by decoding http cookie to get userId)

returns
```json
{
    "payload": {
        "user": {
            "id": "b09cbb8d-5eac-4b5e-b4af-956b9bc2e4e1",
            "name": "user2",
            "email": "user2@email.com",
            "password": "",
            "created_at": "2023-04-05 10:41:51",
            "updated_at": "2023-04-05 10:41:51"
        },
        "account": {
            "id": "74d90eb6-c9b8-458d-995f-3f2ed4b219b8",
            "account_number": "5398874659",
            "balance": 100,
            "user_id": "b09cbb8d-5eac-4b5e-b4af-956b9bc2e4e1",
            "created_at": "2023-04-05 10:41:51",
            "updated_at": "2023-04-05 10:41:51"
        }
    }
}
```
+ `/transactions` returns all of an authorized user's transaction
+ `/transactions/:id` returna a user transaction with a specified id
