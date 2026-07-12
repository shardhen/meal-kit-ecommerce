# Meal Kit E-commerce

## 📌 About The Project

Meal Kit E-commerce is a full-stack web application that allows customers to browse meal kits, create an account, log in, manage a shopping cart, and place orders.

The project also includes a clerk/admin role for managing meal kit products. Clerks can add, edit, and delete meal kits, including product details and images.

The main purpose of this project is to demonstrate full-stack web development skills using Node.js, Express.js, EJS, MongoDB, and JavaScript. It also demonstrates authentication, session management, role-based access control, CRUD operations, file uploads, email integration, and cloud deployment.



## 📌 Live Demo

[https://meal-kit-webpage.vercel.app/](https://meal-kit-webpage.vercel.app/)

---

## ⚙️ How It Works

### User Browsing

Customers can browse available meal kits through server-rendered EJS pages. Meal kit data is loaded from MongoDB and displayed dynamically on the website.

### Authentication & Sessions

Users can create an account and log in. The application stores user data in MongoDB and uses sessions to keep users logged in during their visit.

### Role-Based Access

The application supports different user roles:

- Customers can browse meal kits, add items to the cart, and place orders.
- Clerks can manage meal kit products through admin pages.

### Product Management

Clerks can create, edit, and delete meal kits. Product information is stored in MongoDB using Mongoose schemas.

### Cart & Checkout

Customers can add meal kits to a session-based shopping cart. The cart tracks item quantity, subtotal, tax, and final total.

### Email Notification

Mailgun is used to send transactional emails, including welcome emails and order confirmation emails.

### Deployment

The project is deployed with Vercel. Sensitive configuration values such as database credentials, session secrets, and API keys are managed through environment variables.

---

## 🔁 Architecture / Flow

### Overall Application Flow

```text
User visits website
      ↓
Express route handles request
      ↓
Controller retrieves data from MongoDB
      ↓
EJS template renders page
      ↓
User browses meal kits or logs in
      ↓
Session stores user state
      ↓
Cart / Order / Product actions are processed
      ↓
MongoDB is updated
      ↓
Confirmation page or email is sent
```

### Customer Order Flow

```text
Browse meal kits
      ↓
Select meal kit
      ↓
Add to cart
      ↓
View cart
      ↓
Calculate subtotal, tax, and total
      ↓
Place order
      ↓
Send order confirmation email
```

### Clerk Product Management Flow

```text
Clerk logs in
      ↓
Role is verified
      ↓
Access product management dashboard
      ↓
Add / Edit / Delete meal kit
      ↓
Upload image if needed
      ↓
Save changes to MongoDB
      ↓
Updated product appears on website
```

---

## ✨ Key Features

- Full-stack meal kit e-commerce web application
- Server-side rendering with EJS templates
- Customer sign-up and log-in
- Session-based authentication
- Role-based access control for customers and clerks
- MongoDB Atlas cloud database integration
- Mongoose schema-based data modeling
- Meal kit CRUD operations
- Image upload functionality for meal kit products
- Session-based shopping cart
- Cart subtotal, tax, and total calculation
- Order placement workflow
- Mailgun welcome and order confirmation emails
- Basic error handling and protected routes
- Vercel deployment
- Environment variable configuration

---

## 🧰 Tech Stack

- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Template Engine:** EJS
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Language:** JavaScript
- **Frontend:** HTML, CSS, Bootstrap
- **Authentication / Session:** express-session
- **File Upload:** express-fileupload
- **Email API:** Mailgun
- **Deployment:** Vercel
- **Environment Variables:** dotenv / Vercel environment settings

---

## 🧩 Core Components

The project is organized around common full-stack web application responsibilities: routing, database models, server-rendered views, authentication, session management, cart logic, and admin product management.

### Express Server — Application Controller

The Express server handles incoming HTTP requests, connects routes to business logic, serves static files, renders EJS templates, and manages middleware such as sessions and file uploads.

Main responsibilities:

```text
Receive request
      ↓
Apply middleware
      ↓
Run route logic
      ↓
Read or update MongoDB
      ↓
Render EJS page or redirect user
```

---

### EJS Views — Server-Side Rendering Layer

EJS templates are used to render dynamic HTML pages on the server. The application displays meal kit data, cart contents, forms, and role-specific pages using data passed from Express routes.

This approach keeps the application simple and clear while still supporting dynamic content.

---

### MongoDB & Mongoose — Data Layer

MongoDB Atlas stores application data such as users and meal kits. Mongoose is used to define schemas and interact with the database in a structured way.

The database supports:

- User account data
- Meal kit product data
- Product title, description, category, price, servings, cooking time, featured status, and image path
- CRUD operations for clerk/admin product management

---

### Authentication & Session Management

The application supports user registration and login. After login, the user’s session stores authentication state and role information.

This allows the application to show different functionality depending on whether the user is a customer or clerk.

---

### Role-Based Access Control

Role-based access control separates customer and clerk features.

```text
Customer
      ↓
Browse products
      ↓
Add to cart
      ↓
Place order

Clerk
      ↓
Access product management
      ↓
Add / Edit / Delete meal kits
```

This prevents regular customers from accessing product management features.

---

### Shopping Cart System

The cart is stored in the user session while the user is active. Customers can add items, remove items, view selected products, and place an order.

The cart calculates:

- Item quantity
- Subtotal
- Tax
- Final total

---

### Image Upload System

Clerks can upload meal kit images using `express-fileupload`. Uploaded image files are saved to the public image directory, and the image path is stored in MongoDB.

This allows newly added or updated meal kits to display uploaded images dynamically on the website.

---

### Mailgun Email Integration

Mailgun is used to send transactional emails.

The application sends:

- Welcome email after user registration
- Order confirmation email after checkout

This demonstrates integration with a third-party email API in a full-stack web application.

---

## 💡 Problem Solving & Challenges

### 1. Implementing Role-Based Access Control

**Problem:**  
The application needed to support different user experiences for customers and clerks. Customers should be able to shop, but only clerks should be able to manage products.

**Solution:**  
I added role-based logic using session data. After login, the user role is stored in the session. Protected routes check the user role before allowing access to clerk/admin product management pages.

```text
User logs in
      ↓
Session stores role
      ↓
Protected route checks role
      ↓
Allow or block access
```

---

### 2. Managing Product Data with MongoDB

**Problem:**  
Meal kit products needed to be loaded dynamically, updated by clerks, and stored persistently instead of being hard-coded.

**Solution:**  
I used MongoDB Atlas with Mongoose schemas to store product data. Clerk/admin forms allow product creation, editing, and deletion, and the website displays updated product data from the database.

---

### 3. Handling Shopping Cart State

**Problem:**  
Customers needed to add products to a cart and keep those items available while browsing the site.

**Solution:**  
I implemented a session-based shopping cart. Cart items are stored in the user session, allowing the app to maintain cart state across pages without requiring a separate cart database table.

```text
Add item to cart
      ↓
Store item in session
      ↓
Display cart contents
      ↓
Calculate subtotal / tax / total
```

---

### 4. Supporting Image Uploads for Products

**Problem:**  
Clerks needed to upload images when adding or editing meal kits, and those images needed to display dynamically on the website.

**Solution:**  
I used `express-fileupload` to receive image files, saved them to the public image directory, and stored the image path in MongoDB. This allowed uploaded images to be displayed with the correct meal kit product.

---

### 5. Sending Transactional Emails

**Problem:**  
The application needed to send emails after user registration and order placement.

**Solution:**  
I integrated Mailgun to send welcome emails and order confirmation emails. This added a real-world transactional feature commonly used in e-commerce applications.

---

### 6. Managing Sensitive Configuration During Deployment

**Problem:**  
The project required sensitive values such as the MongoDB connection string, session secret, and Mailgun API key. These values should not be hard-coded or committed to GitHub.

**Solution:**  
I used environment variables for sensitive configuration and configured them in the deployment environment. This made the application safer and easier to deploy.

---

## 🚀 Setup / Run Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd meal-kit-ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env` file in the project root and add the required values:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

The exact variable names may depend on the project implementation.

### 4. Run the Application Locally

```bash
npm start
```

or, depending on the script configuration:

```bash
node server.js
```

### 5. Open in Browser

```text
http://localhost:3000
```

---

## ⚠️ Limitations / Future Improvements

### Limitations

- The project is a learning and portfolio application.
- Payment processing is not implemented.
- The shopping cart is session-based and may not persist after the session ends.
- Admin functionality is designed for demonstration and could be expanded with stronger validation and audit logging.
- Error handling is basic and could be improved for production use.

### Future Improvements

- Add payment integration such as Stripe
- Add persistent order history
- Add password hashing and stronger authentication security
- Add input validation and sanitization improvements
- Add product search and filtering
- Add customer profile pages
- Add order status tracking
- Add admin dashboard analytics
- Improve image storage using cloud storage
- Add automated tests
- Improve responsive UI and accessibility
- Add logging and monitoring for production deployment

---

## 🧪 Example User Flow

```text
Customer visits website
      ↓
Browses meal kits
      ↓
Creates account or logs in
      ↓
Adds meal kit to cart
      ↓
Reviews cart total
      ↓
Places order
      ↓
Receives confirmation email
```
---

## 📌 Disclaimer

This project was created for educational and portfolio purposes. Some meal kit product images used in the application are AI-generated or sample images, and they are included only to demonstrate the e-commerce layout and product display functionality.