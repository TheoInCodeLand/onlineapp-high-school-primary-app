# School Application System Documentation

## Overview

This is a simple web application for managing school applications. It provides features for both users and administrators to interact with the system.

## Functionality

### Public Endpoints

1. **Guest View**
   - **Route:** `/guest`
   - **Method:** GET
   - **Description:** Displays information about schools for guest users.

2. **Signup**
   - **Route:** `/signup`
   - **Method:** GET
   - **Description:** Renders the signup page where users can create a new account.
   - **Method:** POST
   - **Description:** Processes the user's signup form.

3. **Login**
   - **Route:** `/signin`
   - **Method:** GET
   - **Description:** Renders the login page where users can log into their accounts.
   - **Method:** POST
   - **Description:** Processes the user's login form.

### Authenticated User Endpoints

4. **User Dashboard**
   - **Route:** `/userDashboard`
   - **Method:** GET
   - **Description:** Displays the user's dashboard with personalized information.

5. **Apply to School**
   - **Route:** `/apply/:schoolName`
   - **Method:** POST
   - **Description:** Allows users to apply to a specific school.

6. **Track Application**
   - **Route:** `/trackApplication`
   - **Method:** GET
   - **Description:** Displays the user's applications and their statuses.

### Admin Endpoints

7. **Admin Dashboard**
   - **Route:** `/adminDashboard`
   - **Method:** GET
   - **Description:** Displays the admin dashboard with a list of all applications.

8. **Update Application Status**
   - **Route:** `/updateStatus/:applicationId`
   - **Method:** POST
   - **Description:** Allows admins to update the status of a specific application.

### Static Pages

9. **Home Page**
   - **Route:** `/`
   - **Method:** GET
   - **Description:** Renders the home page.

10. **Guest Redirect**
    - **Route:** `/guest.html`
    - **Method:** GET
    - **Description:** Redirects to the guest view page (`/guest`).

11. **Login Redirect**
    - **Route:** `/login.html`
    - **Method:** GET
    - **Description:** Redirects to the login page (`/signin`).

## Application Logic

- **User Authentication:**
  - Users can sign up and log in to access personalized features.
  - Session management is implemented using `express-session`.

- **School Applications:**
  - Users can apply to schools, and their applications are stored in the `applications` array.
  - Each application has details such as the user, school, and status.

- **User Dashboard:**
  - Users can view their personalized dashboard with relevant information.
  - The dashboard may include details like user information and a link to track applications.

- **Admin Dashboard:**
  - Administrators can view a dashboard showing all applications.
  - Admins can update the status of applications through the `/updateStatus/:applicationId` route.

- **Static Pages:**
  - There are static pages for guests and login redirects.
  - Guest information is displayed through the `/guest` route.

- **Middleware:**
  - A middleware function (`requireLogin`) ensures that certain routes are only accessible to authenticated users.

## Future Improvements

- Implement a database for persistent data storage.
- Enhance security measures, such as password hashing.
- Implement error handling for better user experience.
- Add additional features based on specific application requirements.



## Accessing Admin Dashboard

To access the admin dashboard and manage school applications, follow these steps:

1. **Create an Admin Account:**
   - You need to have an admin account to access the admin dashboard.
   - You can create an admin account by signing up with specific admin credentials.

2. **Login as Admin:**
   - Use the admin credentials to log in to the system.
   - Visit the login page (`/signin`) and enter the admin username and password.

3. **Navigate to Admin Dashboard:**
   - After successfully logging in as an admin, you can navigate to the admin dashboard.
   - Visit the admin dashboard by going to the route `/adminDashboard`.

4. **View and Manage Applications:**
   - On the admin dashboard, you will see a list of all applications submitted by users.
   - Admins can update the status of each application using the provided interface.

## Example Admin Credentials

For testing purposes, you can use the following example admin credentials:

- **Username:** admin@example.com
- **Password:** adminPassword123
