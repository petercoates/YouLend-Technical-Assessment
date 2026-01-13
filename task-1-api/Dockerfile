# ============================================================================
# YouLend Loan Management API - Dockerfile
# ============================================================================
# Multi-stage build for optimal image size and security

# ============================================================================
# Stage 1: Build the application
# ============================================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["YouLend.LoanManagement.Api.csproj", "./"]
RUN dotnet restore "YouLend.LoanManagement.Api.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "YouLend.LoanManagement.Api.csproj" -c Release -o /app/build

# ============================================================================
# Stage 2: Publish the application
# ============================================================================
FROM build AS publish
RUN dotnet publish "YouLend.LoanManagement.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ============================================================================
# Stage 3: Create final runtime image
# ============================================================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Expose port 8080
EXPOSE 8080

# Copy published app
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Switch to non-root user
USER appuser

# Run the application
ENTRYPOINT ["dotnet", "YouLend.LoanManagement.Api.dll"]