# YouLend Technical Assessment

> **Full-stack loan management platform with RESTful API, Angular SPA, and cloud deployment configurations**

**Candidate:** Peter Sowoolu-Coates  
**Role:** Observability Platform Engineer  
**Submission Date:** January 2026

---

## Project Overview

This repository contains my complete solution for the YouLend Platform Engineer technical assessment, demonstrating:

-  **Backend Development** - Production-ready .NET 8 RESTful API
-  **Frontend Development** - Modern Angular 17 single-page application
-  **DevOps & Deployment** - Docker containerization and Kubernetes orchestration

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Task 1: Web API](#-task-1-web-api)
- [Task 2: Website](#-task-2-website)
- [Task 3: Deployment](#-task-3-deployment)
- [Testing](#-testing)
- [Technologies Used](#-technologies-used)

---

## Quick Start

### **Run Everything with Docker Compose **

```bash
# Clone the repository
git clone https://github.com/petercoates/YouLend-Technical-Assessment.git
cd YouLend-Technical-Assessment

# Start both API and Website
docker compose up --build
```

**Access:**
- 🌐 **Website**: http://localhost:4200
- 🔧 **API**: http://localhost:5103
- 📚 **API Docs**: http://localhost:5103/swagger

**Stop:**
```bash
docker compose down
```

---

## 🏗️ Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   Angular SPA       │         │   .NET 8 API        │
│   (Port 4200)       │ ──HTTP─→│   (Port 5103)       │
│                     │         │                     │
│  - Material Design  │         │  - RESTful          │
│  - Reactive Forms   │         │  - Swagger          │
│  - HTTP Client      │         │  - Health Checks    │
└─────────────────────┘         └─────────────────────┘
                                          │
                                          ↓
                                ┌─────────────────────┐
                                │  In-Memory Store    │
                                │  (Dictionary)       │
                                │  Thread-safe        │
                                └─────────────────────┘
```

---

## 📁 Project Structure

```
YouLend-Technical-Assessment/
│
├── task-1-api/                  # .NET 8 RESTful API
│   ├── Controllers/             # HTTP endpoints
│   ├── Models/                  # Domain entities
│   ├── Services/                # Business logic
│   ├── Dockerfile               # API containerization
│   └── README.md
│
|-- task-2-website/              # Angular 17 SPA
│   ├── src/app/
│   │   ├── components/          # UI components
│   │   ├── services/            # HTTP services
│   │   └── models/              # TypeScript interfaces
│   ├── Dockerfile               # Website containerization
│   ├── nginx.conf               # Production web server
│   └── README.md
│
├── task-3-deployment/           # Deployment configurations
│   ├── kubernetes/              # K8s manifests
│   │   ├── api-deployment.yaml
│   │   └── website-deployment.yaml
│   └── README.md
│
├── docker-compose.yml           # Local development orchestration
└── README.md                    # This file
```

---

## Task 1: Web API

### **Features**

 **RESTful Endpoints:**
- `POST /api/loans` - Create a new loan
- `GET /api/loans/{loanId}` - Get loan by ID
- `GET /api/loans/borrower/{name}` - Get loans by borrower name
- `GET /api/loans` - Get all loans
- `DELETE /api/loans/{loanId}` - Delete a loan

 **Technology:**
- .NET 8 (latest LTS)
- ASP.NET Core with Controllers
- In-memory storage (thread-safe Dictionary)
- Swagger/OpenAPI documentation
- Health check endpoint (`/health`)

 **Data Model:**
```csharp
Loan {
  LoanId: string (GUID)
  BorrowerName: string
  FundingAmount: decimal
  RepaymentAmount: decimal
  CreatedAt: DateTime
}
```

### **Run Locally (Without Docker)**

```bash
cd task-1-api
dotnet run
```

Access at: http://localhost:5103


---

##  Task 2: Website


### **Run Locally (Without Docker)**

```bash
cd task-2-website
npm install
npm start
```

Access at: http://localhost:4200

**Note:** Make sure the API is running on port 5103

---

## Task 3: Deployment

### **Docker**

#### **Build Individual Images:**

```bash
# API
cd task-1-api
docker build -t youlend-loan-api:latest .

# Website
cd task-2-website
docker build -t youlend-loan-website:latest .
```

#### **Run with Docker Compose:**

```bash
docker compose up --build
```

### **Kubernetes**

#### **Deploy to Kubernetes:**

```bash
# Apply all manifests
kubectl apply -f task-3-deployment/kubernetes/

# Check deployment
kubectl get all -n youlend

# Port forward to access
kubectl port-forward -n youlend svc/loan-api-service 5103:80
kubectl port-forward -n youlend svc/loan-website-service 4200:80
```

#### **Features:**
-  Namespace isolation (`youlend`)
-  Horizontal Pod Autoscaling (3-10 pods)
-  Health checks (liveness, readiness, startup)
-  Resource limits and requests
-  Rolling updates (zero-downtime)
-  Security contexts (non-root users)

### **Deployment Documentation**

See [task-3-deployment/README.md](task-3-deployment/README.md) for:
- Local deployment (Minikube/kind)
- AWS EKS deployment
- Pushing to Docker Hub/ECR

---

## 🧪 Testing

### **Manual Testing with Loans.http**

```bash
cd task-1-api
# Open Loans.http in VS Code with REST Client extension
# Click "Send Request" on any endpoint
```

### **Test Workflow:**

1. **Create a loan:**
   - Name: Peter Coates
   - Funding: £50,000
   - Repayment: £55,000 (auto-calculated)

2. **View all loans:**
   - Check the table displays the loan

3. **Search by borrower:**
   - Enter "Peter Coates"
   - Verify it finds the loan

4. **Delete the loan:**
   - Click delete icon
   - Confirm removal

---

## 🛠️ Technologies Used

| Category | Technology | Version |
|----------|------------|---------|
| **Backend** | .NET | 8.0 |
| | C# | 12.0 |
| | ASP.NET Core | 8.0 |
| **Frontend** | Angular | 17 |
| | TypeScript | 5.x |
| | Angular Material | 17 |
| **Containerization** | Docker | Latest |
| | Docker Compose | V2 |
| **Orchestration** | Kubernetes | 1.24+ |
| **Web Server** | Nginx | Alpine |
| **Documentation** | Swagger/OpenAPI | 3.0 |

---

## 🚀 Deployment Options

### **1. Local Development**
```bash
docker compose up
```

### **2. Minikube (Local Kubernetes)**
```bash
minikube start
eval $(minikube docker-env)
docker compose build
kubectl apply -f task-3-deployment/kubernetes/
```

### **3. AWS EKS (Production)**
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag youlend-loan-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/youlend-loan-api:v1.0.0
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/youlend-loan-api:v1.0.0

# Deploy to EKS
kubectl apply -f task-3-deployment/kubernetes/
```

---

**Future Enhancements:**
- Database integration (PostgreSQL/SQL Server)
- Authentication & Authorization (JWT, OAuth)
- API rate limiting
- Distributed caching (Redis)
- Monitoring (Prometheus + Grafana)
- CI/CD pipeline (GitHub Actions)

---

##  Contact

**Peter Sowoolu- Coates**  
Email: petersowoolu@gmail.com  
LinkedIn: [linkedin.com/in/peter-sowoolu-coates](https://www.linkedin.com/in/peter-sowoolu-coates/)  
GitHub: [github.com/petercoates](https://github.com/petercoates)


---

##  Quick Commands Reference

```bash
# Run everything
docker compose up --build

# Stop everything
docker compose down

# View logs
docker compose logs -f

# Rebuild specific service
docker compose up --build api
docker compose up --build website

# Deploy to Kubernetes
kubectl apply -f task-3-deployment/kubernetes/

# Check Kubernetes status
kubectl get all -n youlend

# View pod logs
kubectl logs -n youlend -l app=loan-api
```

---
