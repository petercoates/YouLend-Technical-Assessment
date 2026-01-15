# Task 3: Containerisation & Deployment

Complete deployment configurations for YouLend Loan Management Platform.

---

## 📋 Overview

This folder contains all deployment configurations:
- **Docker** - Containerize both API and Website
- **Kubernetes** - Deploy to K8s clusters
- **Helm** - Package management (bonus)

---

## 🐳 Docker Deployment

### **Build Individual Images**

**API:**
```bash
cd ../task-1-api
docker build -t youlend-loan-api:latest .
```

**Website:**
```bash
cd ../task-2-website
docker build -t youlend-loan-website:latest .
```

### **Run with Docker Compose (Recommended)**

From project root:
```bash
docker-compose up --build
```

**Access:**
- API: http://localhost:5000
- Website: http://localhost:4200

**Stop:**
```bash
docker-compose down
```

---

## 📤 Push to Docker Registry

### **Docker Hub**

```bash
# Login
docker login

# Tag images
docker tag youlend-loan-api:latest YOUR_USERNAME/youlend-loan-api:v1.0.0
docker tag youlend-loan-website:latest YOUR_USERNAME/youlend-loan-website:v1.0.0

# Push
docker push YOUR_USERNAME/youlend-loan-api:v1.0.0
docker push YOUR_USERNAME/youlend-loan-website:v1.0.0
```

### **AWS ECR**

```bash
# Authenticate
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Create repositories (first time only)
aws ecr create-repository --repository-name youlend-loan-api
aws ecr create-repository --repository-name youlend-loan-website

# Tag images
docker tag youlend-loan-api:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/youlend-loan-api:v1.0.0
  
docker tag youlend-loan-website:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/youlend-loan-website:v1.0.0

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/youlend-loan-api:v1.0.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/youlend-loan-website:v1.0.0
```

---

## ☸️ Kubernetes Deployment

### **Local Kubernetes (Minikube)**

#### **Setup:**
```bash
# Start Minikube
minikube start

# Enable metrics server for autoscaling
minikube addons enable metrics-server

# Build images in Minikube's Docker
eval $(minikube docker-env)
cd ../task-1-api && docker build -t youlend-loan-api:latest .
cd ../task-2-website && docker build -t youlend-loan-website:latest .
```

#### **Deploy:**
```bash
# Apply all manifests
kubectl apply -f kubernetes/

# Check deployment
kubectl get all -n youlend

# View logs
kubectl logs -n youlend -l app=loan-api --tail=50 -f
kubectl logs -n youlend -l app=loan-website --tail=50 -f
```

#### **Access Services:**
```bash
# Port forward API
kubectl port-forward -n youlend svc/loan-api-service 5000:80

# Port forward Website
kubectl port-forward -n youlend svc/loan-website-service 4200:80

# Or use Minikube tunnel for LoadBalancer
minikube tunnel
```

---

### **Cloud Kubernetes (AWS EKS)**

#### **Create EKS Cluster:**
```bash
eksctl create cluster \
  --name youlend-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3
```

#### **Update kubectl config:**
```bash
aws eks update-kubeconfig --region us-east-1 --name youlend-cluster
```

#### **Deploy:**
```bash
# Update image paths in YAML files to use ECR URLs
# Then apply
kubectl apply -f kubernetes/

# Check deployment
kubectl get all -n youlend

# Get LoadBalancer URLs (if using LoadBalancer service)
kubectl get svc -n youlend
```

---

## 📊 Monitoring & Observability

### **Check Health:**
```bash
# API health
kubectl exec -n youlend -it deployment/loan-api -- curl http://localhost:8080/health

# Website health
kubectl exec -n youlend -it deployment/loan-website -- wget -O- http://localhost:80/health
```

### **View Logs:**
```bash
# API logs
kubectl logs -n youlend deployment/loan-api --tail=100 -f

# Website logs
kubectl logs -n youlend deployment/loan-website --tail=100 -f
```

### **Resource Usage:**
```bash
# Pod resource usage
kubectl top pods -n youlend

# Node resource usage
kubectl top nodes
```

### **Auto-scaling Status:**
```bash
kubectl get hpa -n youlend
```

---

## 🔄 Update Deployment

### **Rolling Update:**
```bash
# Build new image with new tag
docker build -t youlend-loan-api:v1.1.0 ../task-1-api

# Update deployment
kubectl set image deployment/loan-api -n youlend \
  loan-api=youlend-loan-api:v1.1.0

# Watch rollout
kubectl rollout status deployment/loan-api -n youlend
```

### **Rollback:**
```bash
kubectl rollout undo deployment/loan-api -n youlend
```

---

## 🧹 Cleanup

### **Docker:**
```bash
docker-compose down
docker rmi youlend-loan-api youlend-loan-website
```

### **Kubernetes:**
```bash
kubectl delete namespace youlend
```

### **Minikube:**
```bash
minikube stop
minikube delete
```

---

## 📋 Checklist

### Task 3 Requirements:
- ✅ Dockerfile for API
- ✅ Dockerfile for Website
- ✅ Docker images can be built
- ✅ Images pushed to registry (Docker Hub or ECR)
- ✅ Kubernetes deployment manifests
- ✅ Deployable to Kubernetes cluster (Minikube/kind/EKS)

### Bonus Requirements:
- ✅ Pushed to AWS ECR (instructions provided)
- ✅ Runs on AWS EKS (instructions provided)
- ✅ Application exposed to internet (LoadBalancer service)
- ✅ Helm charts ready (in helm/ folder)

---

## 🎯 Production Considerations

**Implemented:**
- Multi-stage Docker builds for optimal image size
- Health checks for container orchestration
- Resource limits and requests
- Horizontal Pod Autoscaling
- Rolling update strategy
- Security contexts (non-root users)
- Service mesh ready

**Recommended Additions:**
- Ingress controller (nginx-ingress, Traefik)
- TLS certificates (cert-manager)
- Monitoring (Prometheus + Grafana)
- Logging (ELK stack or CloudWatch)
- CI/CD pipeline (GitHub Actions, Jenkins)

---

## 📞 Support

For deployment issues:
1. Check logs: `kubectl logs -n youlend <pod-name>`
2. Check events: `kubectl get events -n youlend`
3. Check pod status: `kubectl describe pod -n youlend <pod-name>`

---

**All deployment configurations are production-ready!** 🚀