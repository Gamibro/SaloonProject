<img src="https://capsule-render.vercel.app/api?type=waving&color=0:ff6b9d,100:c44569&height=200&section=header&text=Salon+Management+System&fontSize=40&fontColor=ffffff&fontAlignY=38&desc=Smart+Appointment+and+Salon+Operations+Platform&descAlignY=58&descSize=16&animation=fadeIn" width="100%"/>

<div align="center">

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![C#](https://img.shields.io/badge/C%23_ASP.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![SMS](https://img.shields.io/badge/SMS_Integration-FF6B6B?style=for-the-badge&logo=twilio&logoColor=white)]()

</div>

---

## 📌 Overview

The **Salon Management System** is a full-stack web application designed to manage the day-to-day operations of a salon business. The system supports two user roles — **Admin** and **Customer** — both of which access the platform through a secure **phone-based OTP login system**. Customers can browse stylists, book appointments, and track their visit history, while Admins have full control over appointments, stylists, makeup styles, and payment receipts.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | C# ASP.NET |
| Database | MySQL |
| Authentication | Phone-based OTP + JWT |
| Notifications | SMS Integration (Receipt Delivery) |

---

## 🔐 Authentication — Phone-Based OTP Login

Both the Admin and Customer access the system through a **phone number-based OTP (One-Time Password)** authentication flow. There are no traditional username/password credentials — access is verified entirely through the user's registered phone number.

**Login Flow:**

```
1. User enters their phone number
        ↓
2. System sends an OTP code via SMS to that number
        ↓
3. User enters the OTP code on the verification screen
        ↓
4. System verifies the OTP and logs the user into their specific portal
        ↓
5. Admin → Admin Dashboard | Customer → Customer Dashboard
```

This approach ensures a **passwordless, secure, and user-friendly** login experience for all users.

---

## 👥 User Roles

---

### 🛠️ Admin

The Admin is the primary operator of the salon system with full control over appointments, staff, services, and customer communications.

**📅 Appointment Management**
- 👁️ View all salon appointments across all stylists and customers
- 🔄 Update the status of any appointment through the full lifecycle:

```
PENDING  ──→  COMPLETED
         ──→  CANCELLED
```

**💳 Payment Receipt Management**
- 📤 Once a styling session is completed, the Admin can upload and send the **payment receipt directly to the customer's phone number via SMS**
- Customers receive their receipt instantly without needing to be physically present at the counter

**💇 Stylist Management**
- ➕ Add new stylists / designers to the salon system
- 📋 Manage stylist profiles visible to customers when booking appointments

**💄 Makeup & Style Management**
- ➕ Add new makeup styles and salon services to the system
- 🗂️ Maintain an up-to-date catalogue of styles available for customers to choose from when booking

---

### 👤 Customer

The Customer has access to a clean self-service portal to discover stylists, book appointments, and track their salon visits.

**📅 Booking Appointments**
- 🗓️ Book appointments with a selected salon designer / stylist of their choice
- 📌 Newly created appointments are set to **Pending** by default until confirmed or updated by the Admin
- Customers can choose from available stylists listed on the platform

**👁️ View Appointments**
- 📂 View a full list of all their current and past salon appointments
- 📊 Track the status of each appointment — Pending, Completed, or Cancelled

**💇 View Salon Stylists**
- 👥 Browse all available salon designers and stylists currently registered in the system
- View stylist profiles to help make an informed booking decision

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or above)
- [npm](https://www.npmjs.com/)
- [Visual Studio](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)
- [MySQL](https://www.mysql.com/) database server

---

### ⚙️ Frontend Setup (React)

**1. Navigate to the frontend directory**
```bash
cd frontend
```

**2. Install all dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm start
```

The app will run at **http://localhost:3000** by default.

---

### 🖥️ Backend Setup (C# ASP.NET)

**1. Open the backend project in Visual Studio**

**2. Configure your database connection string in `appsettings.json`**
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=SalonDB;User=root;Password=yourpassword;"
}
```

**3. Apply database migrations**
```bash
Update-Database
```

**4. Run the backend server**
```bash
dotnet run
```

The API will run at **http://localhost:5000** by default.

---

## 🗂️ Project Structure

```
SalonManagementSystem/
│
├── frontend/                    # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/
│   │   │   ├── admin/           # Admin portal pages
│   │   │   └── customer/        # Customer portal pages
│   │   ├── services/            # API service calls
│   │   └── App.js
│   └── package.json
│
├── backend/                     # C# ASP.NET backend
│   ├── Controllers/             # API route controllers
│   ├── Models/                  # Database models
│   ├── Services/                # Business logic & SMS service
│   ├── Migrations/              # Database migrations
│   └── appsettings.json
│
└── README.md
```

---

## ✨ Key Features Summary

| Feature | Admin | Customer |
|---|:---:|:---:|
| Phone OTP Login | ✅ | ✅ |
| View All Appointments | ✅ | ✅ (Own only) |
| Book Appointments | ❌ | ✅ |
| Update Appointment Status | ✅ | ❌ |
| Send Payment Receipt via SMS | ✅ | ❌ |
| Add New Stylists | ✅ | ❌ |
| View All Stylists | ✅ | ✅ |
| Add Makeup Styles / Services | ✅ | ❌ |
| Browse Makeup Styles | ✅ | ✅ |

---

## 📫 Contact

Built by **Gamith Ranasinghe**

📧 [gamithranasinghe001@gmail.com](mailto:gamithranasinghe001@gmail.com)
🔗 [LinkedIn](https://linkedin.com/in/gamith-ranasinghe)
💻 [GitHub](https://github.com/Gamibro/Salon)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:c44569,100:ff6b9d&height=120&section=footer&animation=fadeIn" width="100%"/>
