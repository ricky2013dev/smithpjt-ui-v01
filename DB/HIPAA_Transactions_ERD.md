# HIPAA Transactions API - Entity Relationship Diagram

## Overview
This document provides the Entity Relationship Diagrams (ERD) for the HIPAA Transactions API database structure based on Availity's developer documentation.

---

## 1. Coverage Management System

### Main Coverage ERD

```mermaid
erDiagram
    COVERAGE ||--|| PAYER : "has"
    COVERAGE ||--|| REQUESTING_PROVIDER : "requested_by"
    COVERAGE ||--|| PATIENT : "for"
    COVERAGE ||--|| SUBSCRIBER : "under"
    COVERAGE ||--o{ PLANS : "includes"
    COVERAGE ||--o{ VALIDATION_MESSAGES : "may_have"
    COVERAGE ||--o| SUPPLEMENTAL_INFORMATION : "has"
    COVERAGE ||--o| REMINDERS : "may_have"

    COVERAGE {
        string id PK "Unique response ID"
        string customerId "Organization identifier"
        datetime createdDate "Creation timestamp"
        datetime updatedDate "Last update timestamp"
        datetime expirationDate "Expiration timestamp"
        string controlNumber "Availity tracking number"
        string submitterStateCode "Submitter state code"
        string status "Current status"
        string statusCode "Status code"
        datetime asOfDate "Coverage information date"
        datetime toDate "End date for coverage search"
        datetime cardIssueDate "Member card issue date"
    }

    PAYER {
        string payerId PK "Availity-specific identifier"
        string name "Payer name"
        string responsePayerId "Payer response ID"
        string responseName "Payer response name"
    }

    REQUESTING_PROVIDER {
        string npi PK "National Provider Identifier"
        string lastName "Last or business name"
        string firstName "First name"
        string type "Provider type"
        string typeCode "Provider type code"
        string specialtyCode "Specialty code"
        string taxId "Tax ID number"
        string payerAssignedProviderId "Payer-assigned ID"
        string ssn "Social Security Number"
        string submitterId "Submitter ID"
        string placeOfService "Place of service description"
        string placeOfServiceCode "Place of service code"
        string pin "Personal identification number"
    }

    PATIENT {
        string memberId PK "Health plan member ID"
        string lastName "Last name"
        string firstName "First name"
        string middleName "Middle name"
        string suffix "Suffix"
        datetime birthDate "Date of birth"
        string ssn "Social Security Number"
        string gender "Gender"
        string genderCode "Gender code (F, M, U)"
        string subscriberRelationship "Relationship to subscriber"
        string subscriberRelationshipCode "Relationship code"
        string patientAccountNumber "Account number"
        string familyUnitNumber "NCPDP suffix number"
        datetime deathDate "Date of death"
        boolean updateYourRecords "Update records flag"
    }

    SUBSCRIBER {
        string memberId PK "Member ID number"
        string medicaidId "Medicaid member ID"
        string lastName "Last name"
        string firstName "First name"
        string middleName "Middle name"
        string suffix "Suffix"
        datetime birthDate "Date of birth"
        string gender "Gender"
        string genderCode "Gender code"
        string ssn "Social Security Number"
        string caseNumber "Case number"
    }

    VALIDATION_MESSAGES {
        int id PK "Message ID"
        string coverageId FK "Coverage reference"
        string field "Associated field"
        string code "Error code"
        string errorMessage "Error message"
        int index "Array index"
    }

    SUPPLEMENTAL_INFORMATION {
        string coverageId FK "Coverage reference"
        boolean professionalPatientCostEstimator "PCE available flag"
        boolean institutionalPatientCostEstimator "Institutional PCE flag"
        boolean patientCareSummary "Care summary available"
        string patientCareSummaryReason "Reason for availability"
        string patientCareSummaryReasonCode "Reason code"
        boolean assessmentCarePlan "Assessment available"
        string thirdPartySystemId "Third party system ID"
        string routingCode "Routing code"
        boolean outOfArea "Out of area flag"
        string clickToTalkPhoneNumber "Click-to-talk number"
        string clickToTalkKey "Click-to-talk key"
        string localMemberId "Local member ID"
        string pceMemberLocatorKey "PCE member key"
        boolean pceHostIndicator "PCE host indicator"
        boolean referralShortFormIndicator "Short form indicator"
        boolean viewReferralAuthIndicator "View auth indicator"
        boolean csnpIndicator "C-SNP form available"
        boolean requestLtssccAmount "LTSSCC request flag"
        boolean pregnant "Maternity form exists"
        boolean erReferralCompleted "ER referral completed"
    }

    REMINDERS {
        string coverageId FK "Coverage reference"
        string inference "Clinical inference"
    }
```

---

## 2. Plans and Benefits Structure

```mermaid
erDiagram
    COVERAGE ||--o{ PLANS : "includes"
    PLANS ||--o{ BENEFITS : "offers"
    PLANS ||--o{ ADDITIONAL_PAYERS : "coordinates_with"
    PLANS ||--o{ PRIMARY_CARE_PROVIDER : "assigned_to"

    BENEFITS ||--|| BENEFIT_DETAIL : "has"
    BENEFITS ||--|| AMOUNTS : "includes"
    BENEFIT_DETAIL ||--o{ NETWORK_BENEFIT : "in_network"
    BENEFIT_DETAIL ||--o{ NETWORK_BENEFIT : "out_of_network"
    BENEFIT_DETAIL ||--o{ NETWORK_BENEFIT : "not_applicable_network"
    BENEFIT_DETAIL ||--o{ NETWORK_BENEFIT : "no_network"

    AMOUNTS ||--o| CO_PAYMENT : "has"
    AMOUNTS ||--o| OUT_OF_POCKET : "has"
    AMOUNTS ||--o| DEDUCTIBLES : "has"
    AMOUNTS ||--o| CO_INSURANCE : "has"

    PLANS {
        string planId PK "Plan identifier"
        string coverageId FK "Coverage reference"
        string status "Coverage status"
        string statusCode "Status code"
        string identityCardNumber "ID card number"
        string groupNumber "Group number"
        string groupName "Group name"
        string policyNumber "Policy number"
        string planNumber "Plan number"
        string planName "Plan name"
        string planNetworkId "Plan network ID"
        string planNetworkName "Plan network name"
        string description "Plan description"
        datetime eligibilityStartDate "Eligibility start"
        datetime eligibilityEndDate "Eligibility end"
        datetime coverageStartDate "Coverage start"
        datetime coverageEndDate "Coverage end"
        string insuranceType "Insurance type"
        string insuranceTypeCode "Insurance type code"
        string contractClassCode "Contract class code"
        string contractNumber "Contract number"
        string medicalRecordNumber "Medical record number"
        string healthInsuranceClaimNumber "Medicare beneficiary ID"
        datetime admissionDate "Admission date"
        datetime dischargeDate "Discharge date"
        datetime planStartDate "Plan start date"
        datetime planEndDate "Plan end date"
        datetime planEnrollmentDate "Enrollment date"
        datetime certificationDate "Certification date"
        datetime lastUpdateDate "Last update"
        datetime statusDate "Status date"
    }

    BENEFITS {
        string benefitId PK "Benefit identifier"
        string planId FK "Plan reference"
        string name "Benefit name"
        string type "Benefit type"
        string source "Procedure benefit source"
        string status "Coverage status"
        string statusCode "Status code"
    }

    BENEFIT_DETAIL {
        string benefitId FK "Benefit reference"
        string detailType "Detail type (in/out/not_applicable/no network)"
    }

    NETWORK_BENEFIT {
        string networkBenefitId PK "Network benefit ID"
        string benefitDetailId FK "Benefit detail reference"
        string status "Benefit status"
        string statusCode "Status code"
        string insuranceType "Insurance type"
        string insuranceTypeCode "Insurance type code"
        string amount "Benefit amount"
        string units "Benefit units"
        string amountTimePeriod "Time period"
        string amountTimePeriodCode "Time period code"
        string remaining "Remaining amount"
        string remainingTimePeriod "Remaining period"
        string total "Total amount"
        string totalTimePeriod "Total period"
        string level "Benefit level"
        string levelCode "Level code"
        string quantity "Quantity"
        string quantityQualifier "Quantity qualifier"
        string quantityQualifierCode "Qualifier code"
        boolean authorizationRequired "Authorization required flag"
        boolean authorizationRequiredUnknown "Unknown authorization flag"
        string placeOfService "Place of service"
        string placeOfServiceCode "Place of service code"
        string description "Benefit description"
        datetime eligibilityStartDate "Eligibility start"
        datetime eligibilityEndDate "Eligibility end"
        datetime serviceDate "Service date"
    }

    AMOUNTS {
        string benefitId FK "Benefit reference"
    }

    CO_PAYMENT {
        string amountId FK "Amount reference"
        string amount "Copayment amount"
    }

    OUT_OF_POCKET {
        string amountId FK "Amount reference"
        string amount "Out-of-pocket amount"
    }

    DEDUCTIBLES {
        string amountId FK "Amount reference"
        string amount "Deductible amount"
    }

    CO_INSURANCE {
        string amountId FK "Amount reference"
        string percentage "Coinsurance percentage"
    }

    ADDITIONAL_PAYERS {
        string additionalPayerId PK "Additional payer ID"
        string planId FK "Plan reference"
        string name "Payer name"
        string serviceTypeCode "Service type code"
        string insuredMemberId "Insured member ID"
        boolean primary "Primary payer flag"
        boolean secondary "Secondary payer flag"
        boolean tertiary "Tertiary payer flag"
        date coordinationOfBenefitsBeginDate "COB begin date"
        date coordinationOfBenefitsEndDate "COB end date"
        date coordinationOfBenefitsDate "COB date"
    }

    PRIMARY_CARE_PROVIDER {
        string pcpId PK "PCP identifier"
        string planId FK "Plan reference"
        string npi "Provider NPI"
        string name "Provider name"
        datetime primaryCareProviderDate "PCP date"
    }
```

---

## 3. Payer List and Processing Routes

```mermaid
erDiagram
    PAYER_LIST ||--o{ PROCESSING_ROUTES : "supports"

    PAYER_LIST {
        string payerId PK "Availity-specific identifier"
        string name "Common name for health plan"
        string displayName "Display name on Availity Essentials"
        string shortName "Shortened name for file naming"
    }

    PROCESSING_ROUTES {
        string routeId PK "Route identifier"
        string payerId FK "Payer reference"
        string transactionDescription "HIPAA transaction type description"
        string submissionMode "Submission method (Portal, Batch, RealTime, API)"
        string effectiveDate "Transaction availability date"
        boolean availability "Transaction available flag"
        boolean enrollmentRequired "Enrollment required flag"
        string enrollmentMode "Enrollment type"
        string additionalInfo "Additional information"
        string rebateTier "Cost tier"
        string passThroughRate "Pass-through rate"
        string newTierNotice "Upcoming tier change notice"
        string gateway "Availity gateway designation"
        string recentlyAdded "Route addition date"
    }
```

---

## 4. Configuration and Elements

```mermaid
erDiagram
    CONFIGURATIONS ||--|| ELEMENTS : "defines"
    ELEMENTS ||--o{ ELEMENTS : "contains_child"
    ELEMENTS ||--o| OBJECT_TYPES : "has"
    ELEMENTS ||--o{ CONDITIONAL_FIELDS : "may_have"

    CONFIGURATIONS {
        string configId PK "Configuration ID"
        string type "HIPAA transaction type"
        string categoryId "Category identifier"
        string categoryValue "Category value"
        string subtypeId "Subtype identifier"
        string subtypeValue "Subtype value"
        string payerId "Availity payer identifier"
        string payerName "Health plan name"
        string version "Configuration version"
        string sourceId "Configuration source"
        int totalCount "Total assets count"
        int count "Result set count"
        int offset "Paging offset"
        int limit "Paging limit"
    }

    ELEMENTS {
        string elementId PK "Element identifier"
        string configId FK "Configuration reference"
        string parentElementId FK "Parent element reference"
        string type "Data type (Boolean, Collection, Date, etc.)"
        string label "Display label for UI"
        int order "UI ordering index"
        string helpTopicId "Help topic reference"
        string errorMessage "UI error message"
        int maxRepeats "Maximum repetitions"
        boolean allowed "Valid to use flag"
        boolean required "Required flag"
        boolean repeats "Repeats flag"
        boolean hidden "Hidden flag"
        int minRepeats "Minimum repetitions"
        string defaultValue "Default value"
        string values "Acceptable values"
        string min "Minimum date"
        string max "Maximum date"
        string pattern "Validation regex"
        int maxLength "Maximum character length"
        int minLength "Minimum character length"
        string mode "UI mode (dropdown, radio)"
    }

    OBJECT_TYPES {
        string objectTypeId PK "Object type ID"
        string elementId FK "Element reference"
        string label "Object type label"
        int minInstances "Minimum instances"
        int maxInstances "Maximum instances"
        boolean required "Required flag"
    }

    CONDITIONAL_FIELDS {
        string conditionalId PK "Conditional ID"
        string elementId FK "Element reference"
        string equalTo "Equal to condition"
        string greaterThan "Greater than condition"
        string lessThan "Less than condition"
        string greaterEqual "Greater or equal condition"
        string lessEqual "Less or equal condition"
        int maxLength "Conditional max length"
        int pattern "Conditional pattern"
    }
```

---

## 5. Service Reviews

```mermaid
erDiagram
    SERVICE_REVIEW ||--|| PAYER : "for"
    SERVICE_REVIEW ||--|| REQUESTING_PROVIDER : "requested_by"
    SERVICE_REVIEW ||--|| SUBSCRIBER : "for"
    SERVICE_REVIEW ||--|| PATIENT : "for"
    SERVICE_REVIEW ||--o{ DIAGNOSES : "includes"
    SERVICE_REVIEW ||--o{ PROCEDURES : "includes"
    SERVICE_REVIEW ||--o{ RENDERING_PROVIDERS : "rendered_by"
    SERVICE_REVIEW ||--o{ TRANSPORT_LOCATIONS : "transported_to"
    SERVICE_REVIEW ||--o{ VALIDATION_MESSAGES : "may_have"
    SERVICE_REVIEW ||--o{ PROVIDER_NOTES : "has"
    SERVICE_REVIEW ||--o{ PAYER_NOTES : "receives"
    SERVICE_REVIEW ||--o| SUPPLEMENTAL_INFORMATION : "includes"

    SERVICE_REVIEW {
        string id PK "Service review identifier"
        string customerId "Customer identifier"
        string controlNumber "Availity tracking number"
        string userId "User identifier"
        boolean shortFormIndicator "Short form flag"
        boolean updatable "Updatable flag"
        boolean deletable "Deletable flag"
        string status "Current status"
        string statusCode "Status code"
        datetime createdDate "Creation timestamp"
        datetime updatedDate "Last update timestamp"
        datetime expirationDate "Expiration timestamp"
        datetime certificationIssueDate "Certification issue date"
        datetime certificationEffectiveDate "Certification effective date"
        datetime certificationExpirationDate "Certification expiration date"
        string certificationNumber "Certification identifier"
        string referenceNumber "Reference identifier"
        string requestType "Request type"
        string requestTypeCode "Request type code"
        string serviceType "Service type"
        string serviceTypeCode "Service type code"
        string placeOfService "Service location"
        string placeOfServiceCode "Service location code"
        string serviceLevel "Service level"
        string serviceLevelCode "Service level code"
        date fromDate "Service start date"
        date toDate "Service end date"
        string quantity "Quantity of services"
        string quantityType "Quantity measure type"
        string quantityTypeCode "Quantity type code"
        string admissionType "Admission type (inpatient)"
        string admissionTypeCode "Admission type code"
        string admissionSource "Admission source"
        string admissionSourceCode "Admission source code"
        string nursingHomeResidentialStatus "Nursing home status"
        string nursingHomeResidentialStatusCode "Residency status code"
        string homeHealthStartDate "Home health start"
        string transportType "Transport service type"
        string transportTypeCode "Transport type code"
        string transportDistance "Transport distance"
        string transportPurpose "Transport purpose"
        string chiropracticTreatmentCount "Chiropractic treatment count"
        string oxygenEquipmentType "Oxygen equipment type"
        string oxygenEquipmentTypeCode "Equipment type code"
        string oxygenFlowRate "Oxygen flow rate"
        string oxygenDailyUseCount "Daily oxygen use"
    }

    DIAGNOSES {
        string diagnosisId PK "Diagnosis ID"
        string serviceReviewId FK "Service review reference"
        string code "Diagnosis code"
        string description "Diagnosis description"
        int sequenceNumber "Sequence number"
    }

    PROCEDURES {
        string procedureId PK "Procedure ID"
        string serviceReviewId FK "Service review reference"
        string code "Procedure code"
        string description "Procedure description"
        int sequenceNumber "Sequence number"
    }

    RENDERING_PROVIDERS {
        string renderingProviderId PK "Rendering provider ID"
        string serviceReviewId FK "Service review reference"
        string npi "Provider NPI"
        string name "Provider name"
        string specialtyCode "Specialty code"
    }

    TRANSPORT_LOCATIONS {
        string locationId PK "Location ID"
        string serviceReviewId FK "Service review reference"
        string addressLine1 "Address line 1"
        string addressLine2 "Address line 2"
        string city "City"
        string stateCode "State code"
        string zipCode "ZIP code"
        string locationType "Location type"
    }

    PROVIDER_NOTES {
        string noteId PK "Note ID"
        string serviceReviewId FK "Service review reference"
        string type "Note type"
        string typeCode "Type code"
        string message "Note content"
    }

    PAYER_NOTES {
        string noteId PK "Note ID"
        string serviceReviewId FK "Service review reference"
        string type "Note type"
        string typeCode "Type code"
        string message "Note content"
    }
```

---

## 6. Provider Delivery Information

```mermaid
erDiagram
    REQUESTING_PROVIDER ||--o{ DELIVERY_INFORMATION : "provides"

    DELIVERY_INFORMATION {
        string deliveryId PK "Delivery info ID"
        string providerId FK "Provider reference"
        string quantityQualifier "Quantity unit type description"
        string quantityQualifierCode "Quantity unit type code"
        string quantity "Benefit quantity"
        string amount "Benefit amount"
        string per "Frequency period"
        string perCode "Frequency period code"
        string timePeriod "Time period measurement"
        string timePeriodCode "Time period code"
        string timePeriods "Number of periods"
        string pattern "Calendar pattern"
        string patternCode "Calendar pattern code"
        string time "Time of day"
        string timeCode "Time of day code"
    }
```

---

## Relationship Summary

### One-to-One Relationships
- `COVERAGE` ↔ `PAYER`
- `COVERAGE` ↔ `REQUESTING_PROVIDER`
- `COVERAGE` ↔ `PATIENT`
- `COVERAGE` ↔ `SUBSCRIBER`
- `COVERAGE` ↔ `SUPPLEMENTAL_INFORMATION` (optional)
- `COVERAGE` ↔ `REMINDERS` (optional)
- `BENEFITS` ↔ `BENEFIT_DETAIL`
- `BENEFITS` ↔ `AMOUNTS`
- `CONFIGURATIONS` ↔ `ELEMENTS` (root)

### One-to-Many Relationships
- `COVERAGE` → `PLANS` (one coverage can have multiple plans)
- `COVERAGE` → `VALIDATION_MESSAGES` (one coverage can have multiple validation messages)
- `PLANS` → `BENEFITS` (one plan can offer multiple benefits)
- `PLANS` → `ADDITIONAL_PAYERS` (one plan can coordinate with multiple payers)
- `PLANS` → `PRIMARY_CARE_PROVIDER` (one plan can have multiple PCPs)
- `BENEFIT_DETAIL` → `NETWORK_BENEFIT` (detail has in-network, out-of-network variants)
- `PAYER_LIST` → `PROCESSING_ROUTES` (one payer supports multiple routes)
- `ELEMENTS` → `ELEMENTS` (parent-child hierarchy)
- `ELEMENTS` → `CONDITIONAL_FIELDS` (one element can have multiple conditions)
- `SERVICE_REVIEW` → `DIAGNOSES` (one review can include multiple diagnoses)
- `SERVICE_REVIEW` → `PROCEDURES` (one review can include multiple procedures)
- `SERVICE_REVIEW` → `RENDERING_PROVIDERS` (one review can have multiple rendering providers)
- `SERVICE_REVIEW` → `TRANSPORT_LOCATIONS` (one review can have multiple locations)
- `REQUESTING_PROVIDER` → `DELIVERY_INFORMATION` (one provider can have multiple delivery schedules)

---

## Key Entities Description

### Primary Entities

1. **COVERAGE**: Central entity representing eligibility/benefits verification requests
2. **SERVICE_REVIEW**: Represents authorization/referral requests
3. **PAYER_LIST**: Master list of health insurance payers
4. **CONFIGURATIONS**: Dynamic form configurations per payer/transaction type

### Supporting Entities

- **PAYER**: Health insurance plan information
- **PATIENT**: Patient demographic information
- **SUBSCRIBER**: Primary insurance subscriber information
- **REQUESTING_PROVIDER**: Healthcare provider requesting services/verification
- **PLANS**: Insurance plan details and coverage information
- **BENEFITS**: Specific benefit types and coverage details

### Transactional Entities

- **VALIDATION_MESSAGES**: Error/warning messages from payer responses
- **PAYER_NOTES**: General disclaimers and messages from health plans
- **PROVIDER_NOTES**: Notes from requesting providers
- **DIAGNOSES**: Diagnosis codes for service reviews
- **PROCEDURES**: Procedure codes for service reviews

---

## Database Normalization Notes

The database structure follows normalization principles:

- **1NF (First Normal Form)**: All tables have atomic values
- **2NF (Second Normal Form)**: Non-key attributes depend on primary keys
- **3NF (Third Normal Form)**: No transitive dependencies

### Denormalization Considerations

Some fields are intentionally denormalized for API performance:
- Status codes stored alongside status descriptions
- Type codes stored alongside type descriptions
- Date ranges stored in multiple formats for different query patterns

---

## Indexes Recommendations

### Primary Indexes
- All `id` fields (Primary Keys)
- All foreign key fields

### Secondary Indexes
- `COVERAGE.customerId`, `COVERAGE.controlNumber`, `COVERAGE.status`
- `PATIENT.memberId`, `PATIENT.lastName`, `PATIENT.birthDate`
- `SUBSCRIBER.memberId`
- `PAYER.payerId`
- `REQUESTING_PROVIDER.npi`, `REQUESTING_PROVIDER.taxId`
- `SERVICE_REVIEW.controlNumber`, `SERVICE_REVIEW.status`
- `PLANS.groupNumber`, `PLANS.planNumber`

### Composite Indexes
- `COVERAGE(customerId, status, createdDate)` - For coverage searches
- `PATIENT(lastName, firstName, birthDate)` - For patient lookups
- `SERVICE_REVIEW(customerId, status, createdDate)` - For review searches

---

## API Endpoint to Entity Mapping

### Coverage APIs
- `POST /v1/coverages` → Creates `COVERAGE` + related entities
- `GET /v1/coverages` → Searches `COVERAGE` table
- `GET /v1/coverages/{id}` → Retrieves `COVERAGE` with all relationships
- `POST /v1/coverages/search` → Advanced `COVERAGE` search

### Service Review APIs
- `POST /v2/service-reviews` → Creates `SERVICE_REVIEW` + related entities
- `GET /v2/service-reviews` → Searches `SERVICE_REVIEW` table
- `GET /v2/service-reviews/{id}` → Retrieves `SERVICE_REVIEW` with relationships
- `PUT /v2/service-reviews` → Updates `SERVICE_REVIEW`
- `DELETE /v2/service-reviews/{id}` → Voids `SERVICE_REVIEW`

### Payer List APIs
- `GET /v1/payers` → Queries `PAYER_LIST` and `PROCESSING_ROUTES`

### Configuration APIs
- `GET /v1/configurations` → Queries `CONFIGURATIONS` and `ELEMENTS`

---

## Data Flow

```mermaid
graph LR
    A[Client Application] -->|POST Coverage Request| B[Coverage API]
    B -->|Create| C[COVERAGE]
    C -->|Links to| D[PAYER]
    C -->|Links to| E[PATIENT]
    C -->|Links to| F[SUBSCRIBER]
    C -->|Creates| G[PLANS]
    G -->|Defines| H[BENEFITS]

    I[Client Application] -->|POST Service Review| J[Service Review API]
    J -->|Create| K[SERVICE_REVIEW]
    K -->|Links to| D
    K -->|Links to| L[REQUESTING_PROVIDER]
    K -->|Includes| M[DIAGNOSES]
    K -->|Includes| N[PROCEDURES]
```

---

## Document Version
- **Version**: 1.0
- **Last Updated**: 2025-01-18
- **Source**: Availity HIPAA Transactions API Documentation
- **Based on**: 37 Database Tables
