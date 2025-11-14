# Sample Data Guide

## Overview

The application includes comprehensive sample coverage data based on the official Availity API documentation. This allows you to test and explore the verification functionality without making live API calls.

## Quick Start

1. **Start the application**
   ```bash
   npm run dev:all
   ```

2. **Load Sample Data**
   - Navigate to the verification form
   - Click the **"Load Sample Data"** button (purple button in the header)
   - The coverage modal will open displaying the sample data

## What's Included in Sample Data

### Patient Information
- **Name**: Jane Marie Smith
- **DOB**: March 15, 1985
- **Member ID**: MEM123456789
- **Coverage ID**: 6364793487228928

### Insurance Plan
- **Plan**: Comprehensive Dental Plan
- **Group Number**: GRP-98765
- **Payer**: Sample Insurance Company (ID: 614426698842112)
- **Status**: Active

### Coverage Benefits

#### Deductibles
```
Individual: $50.00 (Remaining: $25.00)
Family:     $150.00 (Remaining: $100.00)
```

#### Annual Maximum
```
Total:      $2,000.00
Remaining:  $1,500.00
```

#### Service Coverage Levels
```
Preventive Care:  100% (cleanings, exams, x-rays)
Basic Services:    80% (fillings, extractions)
Major Services:    50% (crowns, bridges, dentures)
Orthodontics:      50% (lifetime max $1,500, age limit 19)
```

### Service Limitations
```
Cleanings:         2 per calendar year (last: May 15, 2024)
Bitewing X-rays:   2 per calendar year (last: May 15, 2024)
Full Mouth X-rays: 1 per 3 years (last: Jan 10, 2023)
```

### Exclusions
- Cosmetic dentistry
- Teeth whitening
- Dental implants (unless medically necessary)

## Using Sample Data for Development

### Testing Different Scenarios

You can modify `src/data/sampleCoverageData.json` to test different scenarios:

#### Scenario 1: High Usage Patient
```json
{
  "benefits": {
    "deductible": {
      "individual": {
        "amount": 50.00,
        "remaining": 0.00  // Deductible met
      }
    },
    "maximumBenefit": {
      "amount": 2000.00,
      "remaining": 500.00  // High utilization
    }
  }
}
```

#### Scenario 2: New Patient
```json
{
  "benefits": {
    "deductible": {
      "individual": {
        "amount": 50.00,
        "remaining": 50.00  // No usage yet
      }
    },
    "maximumBenefit": {
      "amount": 2000.00,
      "remaining": 2000.00  // Full benefits available
    }
  }
}
```

#### Scenario 3: Validation Errors
```json
{
  "validationMessages": [
    {
      "field": "memberId",
      "message": "Member ID not found in system"
    },
    {
      "field": "eligibility",
      "message": "Coverage terminated as of 2024-10-31"
    }
  ]
}
```

## Comparison with Live API

The sample data structure matches the Availity API response format:

### API Endpoint
```
POST https://api.availity.com/availity/development-partner/v1/coverages
```

### Request Parameters
```
payerId: 614426698842112
memberId: MEM123456789
patientFirstName: Jane
patientLastName: Smith
patientBirthDate: 1985-03-15
providerNpi: 1234567890
```

### Response
The sample data in `sampleCoverageData.json` represents a typical successful response from this endpoint.

## Benefits of Using Sample Data

### 1. **No API Credentials Required**
- Test the UI without setting up API access
- Demo the application to stakeholders
- Develop and iterate quickly

### 2. **Consistent Testing**
- Predictable data for automated testing
- Same data every time for reproducible results
- Easy to modify for edge cases

### 3. **Documentation**
- See exactly what a real API response looks like
- Understand the data structure
- Reference for integration planning

### 4. **Offline Development**
- Work without internet connection
- No dependency on external API availability
- Faster development iterations

## Integration with Real API

When ready to use real data:

1. **Configure credentials** in `.env`:
   ```env
   VITE_AVAILITY_CLIENT_ID=your_real_client_id
   VITE_AVAILITY_CLIENT_SECRET=your_real_client_secret
   ```

2. **Start the backend server**:
   ```bash
   npm run dev:all
   ```

3. **Use verification buttons**:
   - "Verify by ID" - Fetch coverage by coverage ID
   - "Verify by Payer" - Fetch coverage by payer ID
   - "Load Sample Data" - Use local sample data

## Customizing Sample Data

Edit the sample data to match your testing needs:

```bash
# Edit the sample data file
code src/data/sampleCoverageData.json

# Rebuild the application
npm run build

# Restart the dev server
npm run dev:all
```

## API Documentation Reference

Sample data is based on:
- **Availity Developer Portal**: https://developer.availity.com/partner/product/287860/api/223464
- **Endpoint**: POST /coverages
- **Response Type**: CoverageSummary

## Tips

1. **Use sample data first** to understand the UI before testing with live API
2. **Compare sample data** with your actual API responses to spot differences
3. **Modify sample data** to test edge cases and error scenarios
4. **Document your changes** when customizing sample data for your use case
