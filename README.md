# 🏫 School Payments & Dashboard Application (Full Stack Assessment)

A full-stack Node.js (Express + TypeScript) & React.js (Vite + Tailwind CSS) application for managing school fees, payment transactions, webhook status updates, and transaction analytics.

---

## 🚀 Live Public Deployment & Repository Links

- **GitHub Repository**: `https://github.com/SureshGopi17/school-payment`
- **Frontend Dashboard App**: Hosted on Vercel / Netlify
- **Backend Service API**: Hosted on Render / Railway

---

## 🛠️ Tech Stack & Frameworks

### **Backend (`server/`)**
- **Core**: Node.js, Express, TypeScript
- **Database**: MongoDB (supports MongoDB Atlas URI + automatic `mongodb-memory-server` fallback)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
- **Integration**: Axios for Edviron ERP Payment Collect API (`create-collect-request`)

### **Frontend (`client/`)**
- **Core**: React.js 18, Vite
- **Styling**: Tailwind CSS (Dark/Light mode theme engine, custom CSS row hover highlights)
- **Navigation & Icons**: React Router v6, Lucide React
- **Data Visualization**: Recharts (Donut chart & Bar chart metrics)

---

## 📋 API Endpoints Documentation

### **1. Fetch All Transactions**
- **Endpoint**: `GET /api/transactions`
- **Query Parameters**:
  - `page` (default: 1): Page number
  - `limit` (default: 10): Items per page
  - `status`: Filter by status (`Success`, `Pending`, `Failed`)
  - `startDate`, `endDate`: Date range filter (`YYYY-MM-DD`)
  - `search`: Search term across `custom_order_id`, `collect_id`, `school_id`, `student_name`
- **Response Format**:
  ```json
  {
    "success": true,
    "page": 1,
    "total": 60,
    "totalPages": 6,
    "data": [
      {
        "collect_id": "675bcc1000114e56eefb0101",
        "school_id": "65b0e6293e9f76a9694d84b4",
        "institute_name": "ST. PATRICKS SENIOR SECONDARY SCHOOL",
        "gateway": "PhonePe",
        "order_amount": 2000,
        "transaction_amount": 2200,
        "status": "Success",
        "custom_order_id": "608A17340625700001",
        "bank_reference": "YESBNK222"
      }
    ]
  }
  ```

### **2. Fetch Transactions by School**
- **Endpoint**: `GET /api/transactions/school/:school_id`
- **Example**: `GET /api/transactions/school/65b0e6293e9f76a9694d84b4`

### **3. Transaction Status Check**
- **Endpoint**: `GET /api/transactions/status/:custom_order_id` or `POST /api/transactions/check-status`
- **Example**: `GET /api/transactions/status/608A17340625700001`

### **4. Webhook for Status Updates**
- **Endpoint**: `POST /api/webhook`
- **Payload Format**:
  ```json
  {
    "status": 200,
    "order_info": {
      "order_id": "608A17340625700001",
      "order_amount": 2000,
      "transaction_amount": 2200,
      "gateway": "PhonePe",
      "bank_reference": "YESBNK222"
    }
  }
  ```

### **5. Manual Status Update**
- **Endpoint**: `POST /api/transactions/manual-update`
- **Payload**:
  ```json
  {
    "custom_order_id": "608A17340625700001",
    "status": "Success",
    "bank_reference": "YESBNK333"
  }
  ```

### **6. JWT Authentication**
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login` (`admin@school.com` / `admin123`)

### **7. Payment Gateway Request (Additional Task)**
- **Endpoint**: `POST /api/payment/create-collect-request`

---

## 💻 Local Setup & Development Instructions

### **1. Server Setup (`server/`)**
```bash
cd server
npm install
npm run dev
```
The backend API server will start at `http://localhost:5000`.

### **2. Client Setup (`client/`)**
```bash
cd client
npm install
npm run dev
```
The React frontend dashboard will start at `http://localhost:3000`.
