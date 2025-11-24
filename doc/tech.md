# HIPAA-Compliant AI Application Architecture - Mermaid Diagrams

## 🎯 COMPLETE SYSTEM ARCHITECTURE - Single Summary Diagram

```mermaid
graph TB
    subgraph USERS["👥 END USERS"]
        U1[Healthcare Providers]
        U2[Patients]
        U3[Administrators]
    end

    subgraph EDGE["🛡️ EDGE & SECURITY LAYER - GCP"]
        LB[Cloud Load Balancer<br/>━━━━━━━━━━━━━<br/>✓ HTTPS/TLS 1.3<br/>✓ SSL Certificates<br/>✓ DDoS Protection]
        ARMOR[Cloud Armor<br/>━━━━━━━━━━━━━<br/>✓ WAF Rules<br/>✓ SQL Injection Block<br/>✓ XSS Prevention<br/>✓ IP Whitelisting]
    end

    subgraph FRONTEND["💻 FRONTEND - Cloud Run"]
        FE[Next.js Application<br/>━━━━━━━━━━━━━<br/>✓ TypeScript<br/>✓ Server-Side Rendering<br/>✓ Auto-scaling 1-100<br/>✓ No PHI in Browser]
    end

    subgraph AUTH["🔐 AUTHENTICATION & API GATEWAY"]
        APIGW[API Gateway/Cloud Endpoints<br/>━━━━━━━━━━━━━<br/>✓ Rate Limiting<br/>✓ Request Validation<br/>✓ API Key Management]
        FIREAUTH[Firebase Identity Platform<br/>━━━━━━━━━━━━━<br/>✓ MFA Required<br/>✓ JWT Tokens 15min<br/>✓ Session Management<br/>✓ Auto-logout]
    end

    subgraph BACKEND["⚙️ BACKEND MICROSERVICES - GKE/Cloud Run"]
        subgraph SERVICES["Java Spring Boot Services"]
            AUTH_SVC[Auth Service<br/>━━━━━━━━━━━━━<br/>✓ Spring Security<br/>✓ JWT Generation<br/>✓ RBAC Authorization<br/>Port: 8081]

            PATIENT_SVC[Patient Service<br/>━━━━━━━━━━━━━<br/>✓ PHI Handler<br/>✓ Field Encryption<br/>✓ Access Control<br/>✓ Data Validation<br/>Port: 8082]

            AI_SVC[AI Service<br/>━━━━━━━━━━━━━<br/>✓ De-identification<br/>✓ Cloud DLP Integration<br/>✓ AI API Calls<br/>✓ Re-identification<br/>Port: 8083]

            AUDIT_SVC[Audit Service<br/>━━━━━━━━━━━━━<br/>✓ PHI Access Logs<br/>✓ Compliance Tracking<br/>✓ 7-Year Retention<br/>Port: 8084]
        end
    end

    subgraph DATA["💾 DATA LAYER - Private VPC"]
        DB[(Cloud SQL PostgreSQL<br/>━━━━━━━━━━━━━<br/>✓ Private IP Only<br/>✓ CMEK Encryption<br/>✓ TLS 1.3 Transit<br/>✓ Auto Backups 35d<br/>✓ HA Configuration<br/>✓ Audit Logging)]

        STORAGE[Cloud Storage<br/>━━━━━━━━━━━━━<br/>✓ PHI Files/Documents<br/>✓ CMEK Encryption<br/>✓ Versioning Enabled<br/>✓ Private Access Only<br/>✓ Lifecycle Policies]

        REDIS[(Memorystore Redis<br/>━━━━━━━━━━━━━<br/>✓ Session Tokens<br/>✓ NO PHI Storage<br/>✓ In-transit Encryption<br/>✓ Private IP Only)]
    end

    subgraph AI["🤖 AI SERVICES with BAA"]
        DLP[Cloud DLP<br/>━━━━━━━━━━━━━<br/>✓ PHI Detection<br/>✓ De-identification<br/>✓ Token Mapping]

        CLAUDE[Anthropic Claude<br/>━━━━━━━━━━━━━<br/>✓ BAA Required<br/>✓ De-identified Data<br/>✓ API Rate Limits]

        VERTEX[Google Vertex AI<br/>━━━━━━━━━━━━━<br/>✓ HIPAA Compliant<br/>✓ Fallback Option<br/>✓ Custom Models]
    end

    subgraph SECURITY["🔒 SECURITY & COMPLIANCE"]
        KMS[Cloud KMS<br/>━━━━━━━━━━━━━<br/>✓ Customer Keys CMEK<br/>✓ Key Rotation<br/>✓ Audit Key Usage]

        SECRET[Secret Manager<br/>━━━━━━━━━━━━━<br/>✓ API Keys<br/>✓ DB Credentials<br/>✓ Auto Rotation]

        VPC_SC[VPC Service Controls<br/>━━━━━━━━━━━━━<br/>✓ Data Perimeter<br/>✓ Prevent Exfiltration<br/>✓ API Access Control]

        SCC[Security Command Center<br/>━━━━━━━━━━━━━<br/>✓ Threat Detection<br/>✓ Vulnerability Scan<br/>✓ Security Monitoring]
    end

    subgraph MONITORING["📊 MONITORING & AUDIT"]
        LOGGING[Cloud Logging<br/>━━━━━━━━━━━━━<br/>✓ All PHI Access<br/>✓ 7-Year Retention<br/>✓ Immutable Logs<br/>✓ Real-time Alerts]

        MONITOR[Cloud Monitoring<br/>━━━━━━━━━━━━━<br/>✓ Performance Metrics<br/>✓ Security Alerts<br/>✓ Dashboards<br/>✓ Incident Response]
    end

    subgraph DR["🔄 DISASTER RECOVERY"]
        DR_DB[(Multi-region Replica<br/>━━━━━━━━━━━━━<br/>✓ us-east1 DR Site<br/>✓ Continuous Replication<br/>✓ Auto Failover<br/>RPO: 1hr, RTO: 4hrs)]

        BACKUP[Automated Backups<br/>━━━━━━━━━━━━━<br/>✓ Daily Backups<br/>✓ 35-Day Retention<br/>✓ Point-in-time Recovery<br/>✓ Multi-region Storage]
    end

    subgraph NETWORK["🌐 NETWORK ARCHITECTURE"]
        VPC[VPC Network<br/>━━━━━━━━━━━━━<br/>Public Subnet: DMZ<br/>App Subnet: Private<br/>Data Subnet: Private<br/>━━━━━━━━━━━━━<br/>✓ Private Google Access<br/>✓ VPC Flow Logs<br/>✓ Cloud NAT Outbound]
    end

    %% User Flow
    U1 & U2 & U3 -->|HTTPS| LB
    LB --> ARMOR
    ARMOR --> FE

    %% Frontend to Backend
    FE --> APIGW
    APIGW --> FIREAUTH
    FIREAUTH --> AUTH_SVC

    %% Microservices Communication
    AUTH_SVC --> PATIENT_SVC
    AUTH_SVC --> AI_SVC
    PATIENT_SVC --> AUDIT_SVC
    AI_SVC --> AUDIT_SVC

    %% Data Access
    AUTH_SVC --> REDIS
    PATIENT_SVC --> DB
    PATIENT_SVC --> STORAGE
    AUDIT_SVC --> DB

    %% AI Integration
    AI_SVC --> DLP
    DLP --> CLAUDE
    DLP --> VERTEX

    %% Security Integration
    DB -.->|Encrypted by| KMS
    STORAGE -.->|Encrypted by| KMS
    AUTH_SVC -.->|Secrets from| SECRET
    PATIENT_SVC -.->|Secrets from| SECRET
    AI_SVC -.->|Secrets from| SECRET

    %% VPC Service Controls
    VPC_SC -.->|Protects| DB
    VPC_SC -.->|Protects| STORAGE
    VPC_SC -.->|Protects| SERVICES

    %% Monitoring & Logging
    AUTH_SVC -.->|Logs| LOGGING
    PATIENT_SVC -.->|Logs| LOGGING
    AI_SVC -.->|Logs| LOGGING
    AUDIT_SVC -.->|Logs| LOGGING
    LOGGING --> MONITOR
    MONITOR --> SCC

    %% Disaster Recovery
    DB -->|Replicate| DR_DB
    DB -->|Backup| BACKUP

    %% Network Layer
    SERVICES -.->|Runs in| VPC
    DB -.->|Runs in| VPC
    STORAGE -.->|Accessible via| VPC

    %% Styling
    style USERS fill:#e1f5ff,stroke:#333,stroke-width:3px
    style LB fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#000
    style ARMOR fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#000
    style FE fill:#4ecdc4,stroke:#333,stroke-width:2px,color:#000
    style APIGW fill:#ffe66d,stroke:#333,stroke-width:2px,color:#000
    style FIREAUTH fill:#ffe66d,stroke:#333,stroke-width:2px,color:#000
    style AUTH_SVC fill:#95e1d3,stroke:#333,stroke-width:2px,color:#000
    style PATIENT_SVC fill:#95e1d3,stroke:#333,stroke-width:2px,color:#000
    style AI_SVC fill:#95e1d3,stroke:#333,stroke-width:2px,color:#000
    style AUDIT_SVC fill:#95e1d3,stroke:#333,stroke-width:2px,color:#000
    style DB fill:#f9ca24,stroke:#333,stroke-width:3px,color:#000
    style STORAGE fill:#f9ca24,stroke:#333,stroke-width:2px,color:#000
    style REDIS fill:#ffa502,stroke:#333,stroke-width:2px,color:#000
    style DLP fill:#a29bfe,stroke:#333,stroke-width:2px,color:#000
    style CLAUDE fill:#a29bfe,stroke:#333,stroke-width:2px,color:#000
    style VERTEX fill:#a29bfe,stroke:#333,stroke-width:2px,color:#000
    style KMS fill:#ff7979,stroke:#333,stroke-width:2px,color:#000
    style SECRET fill:#ff7979,stroke:#333,stroke-width:2px,color:#000
    style VPC_SC fill:#ff7979,stroke:#333,stroke-width:2px,color:#000
    style SCC fill:#ff7979,stroke:#333,stroke-width:2px,color:#000
    style LOGGING fill:#636e72,stroke:#333,stroke-width:2px,color:#fff
    style MONITOR fill:#636e72,stroke:#333,stroke-width:2px,color:#fff
    style DR_DB fill:#fdcb6e,stroke:#333,stroke-width:2px,color:#000
    style BACKUP fill:#fdcb6e,stroke:#333,stroke-width:2px,color:#000
    style VPC fill:#74b9ff,stroke:#333,stroke-width:3px,color:#000
```

### 📋 Architecture Summary Legend

| Color           | Layer          | Components                                   |
| --------------- | -------------- | -------------------------------------------- |
| 🔴 **Red**      | Edge Security  | Load Balancer, Cloud Armor (WAF/DDoS)        |
| 🟡 **Yellow**   | Authentication | API Gateway, Firebase Auth + MFA             |
| 🟢 **Green**    | Application    | Java Spring Boot Microservices               |
| 🟠 **Orange**   | Data Storage   | Cloud SQL, Cloud Storage, Redis              |
| 🟣 **Purple**   | AI Services    | Cloud DLP, Claude API, Vertex AI             |
| 🔴 **Pink/Red** | Security       | Cloud KMS, Secret Manager, VPC Controls, SCC |
| ⚫ **Gray**     | Monitoring     | Cloud Logging, Cloud Monitoring              |
| 🟡 **Gold**     | DR/Backup      | Multi-region Replica, Automated Backups      |
| 🔵 **Blue**     | Network        | VPC with Private Subnets                     |

### 🔒 Key HIPAA Security Features

✅ **Encryption:** All data encrypted at rest (CMEK) and in transit (TLS 1.3)  
✅ **Access Control:** MFA required, JWT tokens (15 min), RBAC, auto-logout  
✅ **PHI Protection:** De-identification before AI, field-level encryption  
✅ **Audit Logging:** All PHI access logged, 7-year retention, immutable  
✅ **Network Security:** Private VPC, no public database access, VPC Service Controls  
✅ **Disaster Recovery:** Multi-region replication, 35-day backups, RPO: 1hr, RTO: 4hrs  
✅ **Monitoring:** Real-time security alerts, threat detection, vulnerability scanning  
✅ **Compliance:** BAA with all GCP services and AI providers

### 🔄 Data Flow

1. **User Request** → Edge Security → Frontend → API Gateway
2. **Authentication** → Firebase Auth (MFA) → JWT Token (15 min)
3. **Authorization** → Spring Security RBAC → Access Control
4. **PHI Access** → Encrypted Database → Audit Log → Cloud Logging
5. **AI Processing** → De-identify (DLP) → Claude/Vertex AI → Re-identify
6. **All Actions** → Logged → 7-Year Retention → Compliance Reports

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Users"
        U[End Users<br/>Patients/Providers]
    end

    subgraph "Edge & Security Layer"
        CLB[Cloud Load Balancer<br/>HTTPS/TLS 1.3]
        CA[Cloud Armor<br/>WAF + DDoS Protection]
        SSL[SSL Certificates<br/>Google-managed]
    end

    subgraph "Frontend Layer - Cloud Run"
        FE[Next.js Frontend<br/>TypeScript<br/>Container: node:20-alpine]
    end

    subgraph "API Gateway & Auth"
        AG[API Gateway<br/>Rate Limiting<br/>Request Validation]
        AUTH[Identity Platform<br/>Firebase Auth + MFA<br/>Session: 15 min timeout]
    end

    subgraph "Backend Layer - GKE/Cloud Run"
        AS[Auth Service<br/>JWT + RBAC]
        PS[Patient Service<br/>PHI Handler]
        AIS[AI Service<br/>Claude/Vertex AI]
        AUDS[Audit Service<br/>Logging]
    end

    subgraph "Data Layer"
        DB[(Cloud SQL PostgreSQL<br/>Private IP<br/>CMEK Encryption)]
        CS[Cloud Storage<br/>PHI Files<br/>CMEK + Versioning]
    end

    subgraph "Cache Layer"
        REDIS[(Memorystore Redis<br/>Session Tokens<br/>No PHI)]
    end

    subgraph "AI Services"
        CLAUDE[Anthropic Claude API<br/>with BAA]
        VERTEX[Google Vertex AI<br/>HIPAA Compliant]
        DLP[Cloud DLP<br/>De-identification]
    end

    subgraph "Security & Monitoring"
        KMS[Cloud KMS<br/>Encryption Keys]
        LOG[Cloud Logging<br/>7-year retention]
        MON[Cloud Monitoring<br/>Security Alerts]
        SCC[Security Command Center<br/>Threat Detection]
        SM[Secret Manager<br/>API Keys]
        VPC[VPC Service Controls<br/>Data Perimeter]
    end

    U -->|HTTPS| CLB
    CLB --> CA
    CA --> SSL
    SSL --> FE
    FE --> AG
    AG --> AUTH
    AUTH --> AS
    AS --> PS
    AS --> AIS
    AS --> AUDS

    PS --> DB
    PS --> CS
    PS --> REDIS

    AIS --> DLP
    DLP --> CLAUDE
    DLP --> VERTEX

    AS -.->|Audit Logs| LOG
    PS -.->|Audit Logs| LOG
    AIS -.->|Audit Logs| LOG

    DB -.->|Encrypted by| KMS
    CS -.->|Encrypted by| KMS

    LOG --> MON
    MON --> SCC

    AS -.->|Get Secrets| SM
    PS -.->|Get Secrets| SM
    AIS -.->|Get Secrets| SM

    VPC -.->|Protects| DB
    VPC -.->|Protects| CS

    style U fill:#e1f5ff
    style CLB fill:#ff9999
    style CA fill:#ff9999
    style FE fill:#99ccff
    style AUTH fill:#ffcc99
    style AS fill:#99ff99
    style PS fill:#99ff99
    style AIS fill:#99ff99
    style DB fill:#ffff99
    style CS fill:#ffff99
    style REDIS fill:#ffcc99
    style KMS fill:#ff99cc
    style LOG fill:#ff99cc
    style SCC fill:#ff99cc
```

## 2. Network Architecture with VPC

```mermaid
graph TB
    subgraph "Internet"
        INT[External Users]
    end

    subgraph "GCP VPC Network - HIPAA Compliant"
        subgraph "Public Subnet - DMZ"
            LB[Cloud Load Balancer<br/>Public IP]
            CA[Cloud Armor<br/>WAF]
            NAT[Cloud NAT<br/>Outbound Only]
        end

        subgraph "Application Subnet - Private"
            GKE[GKE Cluster<br/>Private IPs Only]
            CR[Cloud Run Services<br/>No Public IPs]
            VPCC[VPC Connector]
        end

        subgraph "Data Subnet - Private"
            SQL[(Cloud SQL<br/>Private IP<br/>10.0.3.0/24)]
            MEM[(Memorystore Redis<br/>Private IP<br/>10.0.3.128/26)]
        end

        subgraph "Management Subnet"
            BASTION[Bastion Host<br/>Jump Server<br/>VPN Only]
        end
    end

    subgraph "VPC Service Controls Perimeter"
        VPCS[Perimeter Protection<br/>Prevents Data Exfiltration]
    end

    subgraph "External Services with BAA"
        EXT[Anthropic API<br/>Google APIs]
    end

    INT -->|HTTPS 443| LB
    LB --> CA
    CA --> GKE
    CA --> CR

    GKE --> VPCC
    CR --> VPCC
    VPCC --> SQL
    VPCC --> MEM

    GKE -.->|Outbound via| NAT
    CR -.->|Outbound via| NAT
    NAT -.->|To Internet| EXT

    BASTION -.->|Admin Access| GKE
    BASTION -.->|Admin Access| SQL

    VPCS -.->|Protects| SQL
    VPCS -.->|Protects| MEM
    VPCS -.->|Protects| GKE

    style INT fill:#e1f5ff
    style LB fill:#ff9999
    style CA fill:#ff9999
    style GKE fill:#99ff99
    style CR fill:#99ff99
    style SQL fill:#ffff99
    style MEM fill:#ffcc99
    style VPCS fill:#ff99cc
    style BASTION fill:#ffcc99
```

## 3. Security Layers & Data Flow

```mermaid
graph LR
    subgraph "Layer 1: Edge Security"
        L1A[Cloud Armor<br/>DDoS Protection]
        L1B[WAF Rules<br/>SQL Injection<br/>XSS Prevention]
        L1C[IP Whitelisting<br/>Geo-blocking]
    end

    subgraph "Layer 2: Authentication"
        L2A[Firebase Auth<br/>+ MFA Required]
        L2B[JWT Tokens<br/>15 min expiry]
        L2C[Session Management<br/>Auto-logout]
    end

    subgraph "Layer 3: Authorization"
        L3A[Spring Security<br/>RBAC]
        L3B[Role Validation<br/>Admin/Provider/Patient]
        L3C[Resource-level<br/>Access Control]
    end

    subgraph "Layer 4: Application Security"
        L4A[Input Validation<br/>Bean Validation]
        L4B[SQL Injection<br/>Prevention - JPA]
        L4C[CSRF Protection<br/>Spring Security]
    end

    subgraph "Layer 5: Data Security"
        L5A[Encryption at Rest<br/>CMEK via Cloud KMS]
        L5B[Encryption in Transit<br/>TLS 1.3]
        L5C[Field-level Encryption<br/>Sensitive PHI]
    end

    subgraph "Layer 6: Audit & Monitoring"
        L6A[Cloud Logging<br/>All PHI Access]
        L6B[Audit Triggers<br/>Database Level]
        L6C[Security Alerts<br/>Anomaly Detection]
    end

    L1A --> L1B --> L1C --> L2A
    L2A --> L2B --> L2C --> L3A
    L3A --> L3B --> L3C --> L4A
    L4A --> L4B --> L4C --> L5A
    L5A --> L5B --> L5C --> L6A
    L6A --> L6B --> L6C

    style L1A fill:#ff9999
    style L1B fill:#ff9999
    style L1C fill:#ff9999
    style L2A fill:#ffcc99
    style L2B fill:#ffcc99
    style L2C fill:#ffcc99
    style L3A fill:#99ff99
    style L3B fill:#99ff99
    style L3C fill:#99ff99
    style L4A fill:#99ccff
    style L4B fill:#99ccff
    style L4C fill:#99ccff
    style L5A fill:#ff99cc
    style L5B fill:#ff99cc
    style L5C fill:#ff99cc
    style L6A fill:#cc99ff
    style L6B fill:#cc99ff
    style L6C fill:#cc99ff
```

## 4. Microservices Architecture

```mermaid
graph TB
    subgraph "API Gateway Layer"
        APIGW[Cloud Endpoints<br/>API Gateway<br/>Rate Limiting]
    end

    subgraph "Authentication Microservice"
        AUTH[Auth Service<br/>Port: 8081]
        AUTH_DB[(User DB<br/>Credentials)]
        JWT[JWT Manager<br/>Token Generation]
    end

    subgraph "Patient Management Microservice"
        PATIENT[Patient Service<br/>Port: 8082]
        PHI_DB[(PHI Database<br/>Encrypted)]
        ENCRYPT[Field Encryption<br/>Service]
    end

    subgraph "AI Processing Microservice"
        AI[AI Service<br/>Port: 8083]
        DEID[De-identification<br/>Cloud DLP]
        REID[Re-identification<br/>Token Mapping]
    end

    subgraph "Audit & Logging Microservice"
        AUDIT[Audit Service<br/>Port: 8084]
        AUDIT_DB[(Audit Logs<br/>Immutable)]
    end

    subgraph "External AI Services"
        CLAUDE[Claude API<br/>with BAA]
        VERTEX[Vertex AI<br/>HIPAA]
    end

    subgraph "Shared Services"
        REDIS[(Redis Cache<br/>Sessions)]
        KMS[Cloud KMS<br/>Encryption]
        SM[Secret Manager<br/>API Keys]
    end

    APIGW --> AUTH
    APIGW --> PATIENT
    APIGW --> AI

    AUTH --> AUTH_DB
    AUTH --> JWT
    AUTH --> REDIS

    PATIENT --> PHI_DB
    PATIENT --> ENCRYPT
    PATIENT --> AUDIT

    AI --> DEID
    DEID --> CLAUDE
    DEID --> VERTEX
    AI --> REID
    AI --> AUDIT

    AUDIT --> AUDIT_DB

    ENCRYPT -.->|Get Keys| KMS
    PHI_DB -.->|Encrypted by| KMS

    AUTH -.->|Get Secrets| SM
    PATIENT -.->|Get Secrets| SM
    AI -.->|Get Secrets| SM

    style APIGW fill:#ff9999
    style AUTH fill:#99ff99
    style PATIENT fill:#99ff99
    style AI fill:#99ff99
    style AUDIT fill:#99ff99
    style PHI_DB fill:#ffff99
    style AUDIT_DB fill:#ffff99
    style REDIS fill:#ffcc99
    style KMS fill:#ff99cc
```

## 5. Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant FE as Next.js Frontend
    participant AG as API Gateway
    participant AUTH as Auth Service
    participant PS as Patient Service
    participant DB as Cloud SQL
    participant AUDIT as Audit Service
    participant LOG as Cloud Logging

    U->>FE: Login Request (Email + Password + MFA)
    FE->>AG: POST /auth/login
    AG->>AUTH: Forward Request
    AUTH->>DB: Validate Credentials
    DB-->>AUTH: User Data
    AUTH->>AUTH: Validate MFA Code
    AUTH->>AUTH: Generate JWT (15 min expiry)
    AUTH->>AUDIT: Log Login Event
    AUDIT->>LOG: Write Audit Log
    AUTH-->>AG: JWT Token + Refresh Token
    AG-->>FE: Tokens + User Info
    FE-->>U: Login Success

    Note over U,LOG: User makes authenticated request

    U->>FE: Request PHI Data
    FE->>AG: GET /patients/123 (JWT in header)
    AG->>AG: Validate Rate Limit
    AG->>AUTH: Verify JWT Signature
    AUTH-->>AG: Token Valid + User Roles
    AG->>PS: Forward Request + User Context
    PS->>PS: Check RBAC (Role-Based Access)
    PS->>DB: Query PHI (if authorized)
    DB-->>PS: Patient Data (Encrypted)
    PS->>PS: Decrypt Sensitive Fields
    PS->>AUDIT: Log PHI Access (Who, What, When)
    AUDIT->>LOG: Write Audit Log
    PS-->>AG: Patient Data
    AG-->>FE: Response
    FE-->>U: Display Data

    Note over U,LOG: Session timeout after 15 min inactivity

    FE->>FE: Detect Inactivity (15 min)
    FE->>U: Auto-logout + Clear Session
```

## 6. AI Processing with PHI De-identification

```mermaid
sequenceDiagram
    participant U as Healthcare Provider
    participant FE as Frontend
    participant AI as AI Service
    participant DLP as Cloud DLP
    participant MAP as Token Mapping DB
    participant CLAUDE as Claude API (BAA)
    participant VERTEX as Vertex AI
    participant AUDIT as Audit Service

    U->>FE: Send Patient Note for AI Analysis
    Note over U,FE: Contains PHI: "John Doe, DOB 1/1/1980"

    FE->>AI: POST /ai/analyze (with PHI)

    AI->>AUDIT: Log AI Request Initiated

    AI->>DLP: De-identify PHI
    Note over AI,DLP: Detect: Names, DOB, SSN, MRN

    DLP->>DLP: Replace PHI with Tokens
    Note over DLP: "John Doe" → "[PERSON_1]"<br/>"1/1/1980" → "[DATE_1]"

    DLP->>MAP: Store Token Mappings (Encrypted)
    MAP-->>DLP: Mapping ID

    DLP-->>AI: De-identified Text
    Note over DLP,AI: "[PERSON_1], DOB [DATE_1]"

    alt Use Claude API
        AI->>CLAUDE: Send De-identified Prompt
        CLAUDE-->>AI: AI Response
    else Use Vertex AI (Fallback)
        AI->>VERTEX: Send De-identified Prompt
        VERTEX-->>AI: AI Response
    end

    AI->>AUDIT: Log AI Response Received

    opt Re-identification Needed
        AI->>MAP: Get Token Mappings
        MAP-->>AI: Original PHI (Encrypted)
        AI->>AI: Re-apply PHI to Response
    end

    AI->>AUDIT: Log Complete Transaction
    AI-->>FE: Final Response
    FE-->>U: Display Result

    Note over U,AUDIT: All steps logged for HIPAA compliance
```

## 7. Data Encryption Architecture

```mermaid
graph TB
    subgraph "Encryption at Rest"
        subgraph "Cloud KMS - Customer Managed Keys"
            KEK[Key Encryption Key<br/>Rotated Annually]
            DEK1[Data Encryption Key 1<br/>Cloud SQL]
            DEK2[Data Encryption Key 2<br/>Cloud Storage]
            DEK3[Data Encryption Key 3<br/>Persistent Disks]
        end

        subgraph "Database Encryption"
            TDE[Transparent Data Encryption<br/>PostgreSQL]
            FLE[Field-Level Encryption<br/>PHI Fields]
        end

        subgraph "File Storage Encryption"
            BUCKET[Cloud Storage Buckets<br/>CMEK Enabled]
            OBJ[Object Versioning<br/>Encrypted Versions]
        end
    end

    subgraph "Encryption in Transit"
        TLS[TLS 1.3<br/>All Connections]
        MTLS[mTLS<br/>Service-to-Service]
        VPN[Cloud VPN<br/>Admin Access]
    end

    subgraph "Application-Level Encryption"
        APP_ENC[Spring Crypto<br/>Sensitive Fields]
        JWT_ENC[JWT Signing<br/>RS256 Algorithm]
    end

    KEK --> DEK1
    KEK --> DEK2
    KEK --> DEK3

    DEK1 --> TDE
    TDE --> FLE

    DEK2 --> BUCKET
    BUCKET --> OBJ

    TLS --> MTLS
    TLS --> VPN

    FLE --> APP_ENC
    APP_ENC --> JWT_ENC

    style KEK fill:#ff99cc
    style DEK1 fill:#ff99cc
    style DEK2 fill:#ff99cc
    style DEK3 fill:#ff99cc
    style TDE fill:#ffff99
    style FLE fill:#ffcc99
    style TLS fill:#99ff99
```

## 8. Backup & Disaster Recovery Flow

```mermaid
graph TB
    subgraph "Production Environment - us-central1"
        PROD_DB[(Cloud SQL Primary<br/>us-central1-a)]
        PROD_APP[GKE Cluster Primary<br/>Application Pods]
        PROD_STORAGE[Cloud Storage<br/>Primary Bucket]
    end

    subgraph "Backup Layer"
        AUTO_BACKUP[Automated Daily Backup<br/>2 AM UTC<br/>35-day Retention]
        PITR[Point-in-Time Recovery<br/>Transaction Logs]
        SNAP[Persistent Disk Snapshots<br/>Daily]
    end

    subgraph "Disaster Recovery - us-east1"
        DR_DB[(Cloud SQL Replica<br/>us-east1-a<br/>Read Replica)]
        DR_APP[GKE Cluster Standby<br/>us-east1]
        DR_STORAGE[Cloud Storage<br/>Multi-region Replication]
    end

    subgraph "Recovery Orchestration"
        DNS[Cloud DNS<br/>Failover Policy]
        LB[Load Balancer<br/>Health Checks]
        MONITOR[Cloud Monitoring<br/>Alerting]
    end

    PROD_DB -->|Continuous Replication| DR_DB
    PROD_DB -->|Daily Backup| AUTO_BACKUP
    PROD_DB -->|Transaction Logs| PITR

    PROD_APP -->|Disk Snapshots| SNAP
    PROD_APP -.->|Standby| DR_APP

    PROD_STORAGE -->|Multi-region| DR_STORAGE

    AUTO_BACKUP -.->|Restore to| DR_DB
    PITR -.->|Restore to| DR_DB
    SNAP -.->|Restore to| DR_APP

    DNS -->|Monitors| PROD_APP
    DNS -->|Failover to| DR_APP

    LB -->|Health Check| PROD_APP
    LB -->|Health Check| DR_APP

    MONITOR -->|Alert on Failure| DNS

    style PROD_DB fill:#99ff99
    style PROD_APP fill:#99ff99
    style DR_DB fill:#ffcc99
    style DR_APP fill:#ffcc99
    style AUTO_BACKUP fill:#ff99cc
```

## 9. Monitoring & Audit Logging

```mermaid
graph TB
    subgraph "Application Events"
        AUTH_EV[Authentication Events<br/>Login/Logout/MFA]
        PHI_EV[PHI Access Events<br/>Read/Write/Delete]
        AI_EV[AI API Calls<br/>Prompts/Responses]
        SEC_EV[Security Events<br/>Violations/Attempts]
    end

    subgraph "Cloud Logging"
        LOG_INGEST[Log Ingestion<br/>Structured Logs]
        LOG_FILTER[Log Filtering<br/>PHI Access Logs]
        LOG_EXPORT[Log Export<br/>Long-term Storage]
        LOG_RETENTION[7-Year Retention<br/>Immutable]
    end

    subgraph "Cloud Monitoring"
        METRICS[Metrics Collection<br/>Performance/Usage]
        DASH[Dashboards<br/>Real-time Monitoring]
        ALERT[Alerting Policies<br/>Security + Performance]
    end

    subgraph "Security Monitoring"
        SCC[Security Command Center<br/>Threat Detection]
        SIEM[SIEM Integration<br/>Chronicle or Splunk]
        INCIDENT[Incident Response<br/>Automated Workflows]
    end

    subgraph "Compliance Reporting"
        AUDIT_RPT[Audit Reports<br/>Who/What/When/Where]
        COMP_RPT[Compliance Reports<br/>HIPAA Requirements]
        ACCESS_RPT[Access Reports<br/>User Activity]
    end

    AUTH_EV --> LOG_INGEST
    PHI_EV --> LOG_INGEST
    AI_EV --> LOG_INGEST
    SEC_EV --> LOG_INGEST

    LOG_INGEST --> LOG_FILTER
    LOG_FILTER --> LOG_EXPORT
    LOG_EXPORT --> LOG_RETENTION

    LOG_INGEST --> METRICS
    METRICS --> DASH
    METRICS --> ALERT

    LOG_FILTER --> SCC
    SCC --> SIEM
    SIEM --> INCIDENT

    LOG_RETENTION --> AUDIT_RPT
    LOG_RETENTION --> COMP_RPT
    LOG_RETENTION --> ACCESS_RPT

    style AUTH_EV fill:#99ccff
    style PHI_EV fill:#ff9999
    style AI_EV fill:#99ff99
    style SEC_EV fill:#ff99cc
    style LOG_RETENTION fill:#ffff99
    style SCC fill:#ff99cc
```

## 10. Java Spring Boot Application Structure

```mermaid
graph TB
    subgraph "Controller Layer"
        AC[AuthController<br/>/api/auth/**]
        PC[PatientController<br/>/api/patients/**]
        AIC[AIController<br/>/api/ai/**]
    end

    subgraph "Security Layer"
        SEC_CONF[SecurityConfig<br/>Spring Security]
        JWT_FILT[JwtAuthenticationFilter<br/>Token Validation]
        RBAC[RoleBasedAccessControl<br/>@PreAuthorize]
    end

    subgraph "Service Layer"
        AUTH_SVC[AuthService<br/>Login/JWT Logic]
        PAT_SVC[PatientService<br/>Business Logic]
        AI_SVC[AIService<br/>AI Integration]
        DEID_SVC[DeidentificationService<br/>Cloud DLP]
        ENC_SVC[EncryptionService<br/>Field Encryption]
        AUDIT_SVC[AuditService<br/>Logging]
    end

    subgraph "Repository Layer"
        USER_REPO[(UserRepository<br/>JPA)]
        PAT_REPO[(PatientRepository<br/>JPA)]
        AUDIT_REPO[(AuditLogRepository<br/>JPA)]
    end

    subgraph "External Services"
        DB[(Cloud SQL<br/>PostgreSQL)]
        REDIS[(Memorystore<br/>Redis)]
        KMS[Cloud KMS<br/>Encryption]
        DLP[Cloud DLP<br/>De-identification]
        CLAUDE_API[Claude API]
    end

    AC --> SEC_CONF
    PC --> SEC_CONF
    AIC --> SEC_CONF

    SEC_CONF --> JWT_FILT
    JWT_FILT --> RBAC

    AC --> AUTH_SVC
    PC --> PAT_SVC
    AIC --> AI_SVC

    PAT_SVC --> ENC_SVC
    PAT_SVC --> AUDIT_SVC
    AI_SVC --> DEID_SVC
    AI_SVC --> AUDIT_SVC

    AUTH_SVC --> USER_REPO
    PAT_SVC --> PAT_REPO
    AUDIT_SVC --> AUDIT_REPO

    USER_REPO --> DB
    PAT_REPO --> DB
    AUDIT_REPO --> DB

    AUTH_SVC --> REDIS
    ENC_SVC --> KMS
    DEID_SVC --> DLP
    AI_SVC --> CLAUDE_API

    style AC fill:#99ccff
    style PC fill:#99ccff
    style AIC fill:#99ccff
    style SEC_CONF fill:#ff9999
    style AUTH_SVC fill:#99ff99
    style PAT_SVC fill:#99ff99
    style AI_SVC fill:#99ff99
    style DB fill:#ffff99
```

## 11. Database Schema with Encryption

```mermaid
erDiagram
    USERS ||--o{ AUDIT_LOGS : creates
    USERS ||--o{ PATIENT_RECORDS : owns
    PATIENT_RECORDS ||--o{ MEDICAL_NOTES : contains
    PATIENT_RECORDS ||--o{ CONVERSATIONS : has
    CONVERSATIONS ||--o{ MESSAGES : contains
    MESSAGES ||--o{ AI_REQUESTS : generates

    USERS {
        uuid id PK "Primary Key"
        string email UK "Unique, Indexed"
        string password_hash "Bcrypt"
        string mfa_secret "Encrypted"
        enum role "ADMIN, PROVIDER, PATIENT"
        timestamp created_at
        timestamp last_login
        boolean active
    }

    PATIENT_RECORDS {
        uuid id PK "Primary Key"
        uuid user_id FK "Foreign Key"
        string first_name "Encrypted - Field Level"
        string last_name "Encrypted - Field Level"
        date date_of_birth "Encrypted - Field Level"
        string ssn "Encrypted - Field Level"
        string mrn "Medical Record Number, Indexed"
        json demographics "Encrypted JSON"
        timestamp created_at
        timestamp updated_at
    }

    MEDICAL_NOTES {
        uuid id PK "Primary Key"
        uuid patient_id FK "Foreign Key"
        uuid provider_id FK "Foreign Key"
        text note_content "Encrypted - Large Text"
        enum note_type "SOAP, PROGRESS, DISCHARGE"
        timestamp created_at
        timestamp updated_at
    }

    CONVERSATIONS {
        uuid id PK "Primary Key"
        uuid patient_id FK "Foreign Key"
        string title
        enum status "ACTIVE, ARCHIVED"
        timestamp created_at
        timestamp updated_at
    }

    MESSAGES {
        uuid id PK "Primary Key"
        uuid conversation_id FK "Foreign Key"
        enum role "USER, ASSISTANT"
        text content "Encrypted"
        vector embedding "pgvector(1536)"
        integer tokens_used
        timestamp created_at
    }

    AI_REQUESTS {
        uuid id PK "Primary Key"
        uuid message_id FK "Foreign Key"
        uuid user_id FK "Foreign Key"
        text deidentified_prompt "Stored separately"
        text original_prompt_hash "SHA-256"
        text response "Encrypted"
        string model "claude-3, vertex-ai"
        integer tokens_used
        decimal cost
        boolean phi_detected
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK "Primary Key"
        uuid user_id FK "Foreign Key"
        enum action "READ, CREATE, UPDATE, DELETE"
        enum resource_type "PATIENT, MEDICAL_NOTE, AI_REQUEST"
        uuid resource_id "ID of accessed resource"
        json metadata "IP, User Agent, etc"
        timestamp created_at
    }

    ENCRYPTION_KEYS {
        uuid id PK "Primary Key"
        string key_id "Cloud KMS Key ID"
        enum key_purpose "DATABASE, FIELD, FILE"
        timestamp created_at
        timestamp rotated_at
        boolean active
    }
```

## 12. CI/CD Pipeline with Security Checks

```mermaid
graph LR
    subgraph "Development"
        DEV[Developer<br/>Local Development]
        GIT[Git Commit<br/>Feature Branch]
    end

    subgraph "CI - Cloud Build"
        TRIG[Trigger<br/>on Push/PR]
        LINT[Linting<br/>Checkstyle/ESLint]
        TEST[Unit Tests<br/>JUnit/Jest]
        SEC_SCAN[Security Scanning<br/>OWASP Dependency Check]
        SAST[SAST Analysis<br/>SonarQube]
        BUILD[Build Container<br/>Docker Image]
    end

    subgraph "Security Gates"
        VULN[Vulnerability Scan<br/>Trivy/Snyk]
        SECRETS[Secret Detection<br/>GitGuardian]
        COMP[Compliance Check<br/>HIPAA Requirements]
    end

    subgraph "Artifact Storage"
        GAR[Google Artifact Registry<br/>Signed Images]
    end

    subgraph "CD - Deployment"
        STAGE[Deploy to Staging<br/>Cloud Run/GKE]
        INTEG[Integration Tests<br/>API Testing]
        PEN[Penetration Testing<br/>OWASP ZAP]
        APPROVE[Manual Approval<br/>Security Review]
        PROD[Deploy to Production<br/>Blue-Green]
    end

    subgraph "Post-Deployment"
        MON[Monitoring<br/>Cloud Monitoring]
        ALERT[Security Alerts<br/>Incidents]
    end

    DEV --> GIT
    GIT --> TRIG
    TRIG --> LINT
    LINT --> TEST
    TEST --> SEC_SCAN
    SEC_SCAN --> SAST
    SAST --> BUILD

    BUILD --> VULN
    BUILD --> SECRETS
    BUILD --> COMP

    VULN -->|Pass| GAR
    SECRETS -->|Pass| GAR
    COMP -->|Pass| GAR

    GAR --> STAGE
    STAGE --> INTEG
    INTEG --> PEN
    PEN -->|Pass| APPROVE
    APPROVE -->|Approved| PROD

    PROD --> MON
    MON --> ALERT

    style VULN fill:#ff9999
    style SECRETS fill:#ff9999
    style COMP fill:#ff9999
    style APPROVE fill:#ffcc99
    style PROD fill:#99ff99
```

---

## Notes on Diagrams

**Color Legend:**

- 🔴 Red/Pink: Security & Authentication layers
- 🟢 Green: Application/Service layers
- 🟡 Yellow: Data storage layers
- 🟠 Orange: Caching & temporary storage
- 🔵 Blue: External users/interfaces
- 🟣 Purple: Monitoring & audit

**Key Security Features Highlighted:**

1. All PHI data is encrypted at rest and in transit
2. Private VPC with no public database access
3. De-identification before AI processing
4. Comprehensive audit logging (7-year retention)
5. Multi-layer security (Edge → Auth → Authorization → Encryption)
6. HIPAA-compliant services with BAA
7. Disaster recovery with multi-region replication

These diagrams can be rendered in any Mermaid-compatible viewer or tool!
