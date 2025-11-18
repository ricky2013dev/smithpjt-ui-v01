import React, { useRef, useState } from "react";
import { Patient } from "../types/patient";
import verificationData from "../data/verificationData.json";
// import availityService from "../services/availityService"; // Not currently used

interface VerificationFormProps {
  patient: Patient;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ patient }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [formData] = useState(verificationData);
  const [showPatientSSN, setShowPatientSSN] = useState(false);
  const [showSubscriberSSN, setShowSubscriberSSN] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    patient: false,
    subscriber: false,
    insurance: false,
    preventative: false,
    basic: false,
    major: false,
    periodontal: false,
    implant: false,
    orthodontic: false,
    miscellaneous: false,
    notes: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Commented out - not currently used in UI
  // const handleStartVerification = async () => {
  //   // Validate coverage ID
  //   if (!coverageId || coverageId.trim() === '') {
  //     setVerificationError('Please enter a Coverage ID');
  //     setIsModalOpen(true);
  //     return;
  //   }

  //   setIsVerifying(true);
  //   setVerificationError(null);
  //   setIsModalOpen(true);

  //   try {
  //     // Get access token first
  //     const accessToken = await availityService.getAccessToken();

  //     // Generate curl command with actual token for testing
  //     const baseUrl = import.meta.env.VITE_AVAILITY_API_BASE_URL;
  //     const curl = `curl --request GET \\
  // --url ${baseUrl}/coverages/${coverageId.trim()} \\
  // --header 'Authorization: Bearer ${accessToken}' \\
  // --header 'accept: application/json'`;
  //     setCurlCommand(curl);

  //     const data = await availityService.startVerification(coverageId.trim());
  //     setCoverageData(data);
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  //     setVerificationError(errorMessage);
  //     console.error('Verification failed:', error);
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };

  // const handleVerifyByPayerId = async () => {
  //   // Validate payer ID
  //   if (!payerId || payerId.trim() === '') {
  //     setVerificationError('Please enter a Payer ID');
  //     setIsModalOpen(true);
  //     return;
  //   }

  //   setIsVerifyingByPayerId(true);
  //   setVerificationError(null);
  //   setIsModalOpen(true);

  //   try {
  //     // Get access token first
  //     const accessToken = await availityService.getAccessToken();

  //     // Generate curl command with actual token for testing
  //     const baseUrl = import.meta.env.VITE_AVAILITY_API_BASE_URL;
  //     const curl = `curl --request POST \\
  // --url ${baseUrl}/coverages \\
  // --header 'Authorization: Bearer ${accessToken}' \\
  // --header 'accept: application/json' \\
  // --header 'content-type: application/x-www-form-urlencoded' \\
  // --data payerId=${payerId.trim()}`;
  //     setCurlCommand(curl);

  //     const data = await availityService.startVerificationByPayerId(payerId.trim());
  //     setCoverageData(data);
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  //     setVerificationError(errorMessage);
  //     console.error('Verification by Payer ID failed:', error);
  //   } finally {
  //     setIsVerifyingByPayerId(false);
  //   }
  // };

  const getFullName = () => {
    const given = patient.name.given.join(" ");
    return `${given} ${patient.name.family}`.trim();
  };

  const maskSSN = (ssn: string) => {
    // Show only last 4 digits, mask the rest
    const digits = ssn.replace(/\D/g, ''); // Remove non-digits
    if (digits.length >= 4) {
      return `***-**-${digits.slice(-4)}`;
    }
    return '***-**-****';
  };

  const handlePrint = () => {
    if (!formRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dental Insurance Verification Form</title>
          <style>
            @page {
              size: letter;
              margin: 0.75in 0.5in 0.5in 0.5in;
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Times New Roman', Times, serif;
              font-size: 11pt;
              line-height: 1.3;
              color: #000;
              background: #fff;
              padding-top: 10px;
              overflow-x: hidden;
            }

            .header {
              text-align: center;
              margin-bottom: 25px;
              border-bottom: 4px double #000;
              padding-bottom: 8px;
            }

            .header h1 {
              font-size: 14pt;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin-bottom: 6px;
            }

            .header p {
              font-size: 9pt;
              margin-top: 6px;
            }

            .section {
              margin-top: 15px;
              margin-bottom: 20px;
              page-break-inside: avoid;
              border: 2px solid #333;
              padding: 15px 20px 20px 20px;
              position: relative;
            }

            .section-header {
              position: absolute;
              top: -12px;
              left: 15px;
              background: #fff;
              padding: 0 8px;
              font-weight: bold;
              font-size: 10pt;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #000;
            }

            .field-group {
              margin-bottom: 8px;
            }

            .field-group-full {
              margin-bottom: 8px;
            }

            .field {
              margin-bottom: 10px;
              display: flex;
              align-items: baseline;
              gap: 8px;
            }

            .field-label {
              font-size: 9pt;
              font-weight: normal;
              white-space: nowrap;
              color: #000;
            }

            .field-value {
              border-bottom: 1px solid #000;
              flex: 1;
              min-height: 16px;
              padding: 0 4px 1px 4px;
              font-size: 9pt;
            }

            .field-inline {
              display: inline-flex;
              align-items: baseline;
              gap: 8px;
              margin-right: 25px;
              margin-bottom: 10px;
            }

            .field-inline .field-value {
              min-width: 150px;
            }

            .field-value.large {
              min-height: 60px;
              border: 1px solid #000;
              padding: 5px;
            }

            .checkbox-group {
              display: inline-flex;
              gap: 15px;
              align-items: center;
            }

            .checkbox-item {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 9pt;
            }

            .checkbox {
              width: 14px;
              height: 14px;
              border: 1.5px solid #000;
              display: inline-block;
              vertical-align: middle;
            }

            .radio {
              width: 14px;
              height: 14px;
              border: 1.5px solid #000;
              border-radius: 50%;
              display: inline-block;
              vertical-align: middle;
            }

            .footer {
              margin-top: 20px;
              page-break-inside: avoid;
            }

            .signature-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-top: 20px;
            }

            .signature-line {
              border-bottom: 2px solid #000;
              margin-top: 30px;
              margin-bottom: 5px;
            }

            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }

              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Dental Insurance Verification Form</h1>
            <p>Form Date: ${new Date().toLocaleDateString()}</p>
          </div>

          ${generatePrintContent()}

          <div class="section">
            <div class="section-header">Additional Notes</div>
            <div class=" large">${formData.additionalNotes}</div>
          </div>

          <div class="footer">
            <div class="signature-section">
              <div>
                <div class="signature-line"></div>
                <div class="field-label">Signature</div>
              </div>
              <div>
                <div class="signature-line"></div>
                <div class="field-label">Date</div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleExportCSV = () => {
    const csvRows: string[] = [];

    // Add CSV header
    csvRows.push('Category,Field Name,Value');

    // Helper function to escape CSV values
    const escapeCSV = (value: string | number | boolean): string => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      // Escape double quotes and wrap in quotes if contains comma, newline, or quote
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Patient Information
    csvRows.push(`Patient Information,Patient Name,${escapeCSV(getFullName())}`);
    csvRows.push(`Patient Information,Patient SSN,${escapeCSV(formData.patientSSN)}`);
    csvRows.push(`Patient Information,Patient Date of Birth,${escapeCSV(patient.birthDate)}`);
    csvRows.push(`Patient Information,Relationship to Subscriber,${escapeCSV(formData.relationshipToSubscriber)}`);

    // Subscriber Information
    csvRows.push(`Subscriber Information,Subscriber Name,${escapeCSV(formData.subscriberName)}`);
    csvRows.push(`Subscriber Information,Subscriber SSN,${escapeCSV(formData.subscriberSSN)}`);
    csvRows.push(`Subscriber Information,Subscriber Date of Birth,${escapeCSV(formData.subscriberDOB)}`);
    csvRows.push(`Subscriber Information,Subscriber ID Number,${escapeCSV(formData.subscriberID)}`);

    // Insurance Information
    csvRows.push(`Insurance Information,Insurance Company,${escapeCSV(formData.insuranceCompany)}`);
    csvRows.push(`Insurance Information,Insurer Type - Primary,${escapeCSV(formData.insurerType.primary ? 'Yes' : 'No')}`);
    csvRows.push(`Insurance Information,Insurer Type - Secondary,${escapeCSV(formData.insurerType.secondary ? 'Yes' : 'No')}`);
    csvRows.push(`Insurance Information,Insurance Address,${escapeCSV(formData.insuranceAddress)}`);
    csvRows.push(`Insurance Information,Insurance Phone,${escapeCSV(formData.insurancePhone)}`);
    csvRows.push(`Insurance Information,Employer,${escapeCSV(formData.employer)}`);
    csvRows.push(`Insurance Information,Group Number,${escapeCSV(formData.groupNumber)}`);
    csvRows.push(`Insurance Information,Effective Date,${escapeCSV(formData.effectiveDate)}`);
    csvRows.push(`Insurance Information,Renewal Month,${escapeCSV(formData.renewalMonth)}`);
    csvRows.push(`Insurance Information,Yearly Maximum,${escapeCSV(formData.yearlyMax)}`);
    csvRows.push(`Insurance Information,Deductible Per Individual,${escapeCSV(formData.deductiblePerIndividual)}`);
    csvRows.push(`Insurance Information,Deductible Per Family,${escapeCSV(formData.deductiblePerFamily)}`);
    csvRows.push(`Insurance Information,Deductible Applies To - Preventative,${escapeCSV(formData.deductibleAppliesTo.preventative ? 'Yes' : 'No')}`);
    csvRows.push(`Insurance Information,Deductible Applies To - Basic,${escapeCSV(formData.deductibleAppliesTo.basic ? 'Yes' : 'No')}`);
    csvRows.push(`Insurance Information,Deductible Applies To - Major,${escapeCSV(formData.deductibleAppliesTo.major ? 'Yes' : 'No')}`);

    // Preventative Coverage
    csvRows.push(`Preventative Coverage,Preventative Covered At (%),${escapeCSV(formData.preventativeCoveredAt)}`);
    csvRows.push(`Preventative Coverage,Preventative Waiting Period,${escapeCSV(formData.preventativeWaitingPeriod ? 'Yes' : 'No')}`);
    csvRows.push(`Preventative Coverage,Preventative Effective Date,${escapeCSV(formData.preventativeEffectiveDate)}`);
    csvRows.push(`Preventative Coverage,Bitewing Frequency,${escapeCSV(formData.bitewingFrequency)}`);
    csvRows.push(`Preventative Coverage,Prophylaxis/Exam Frequency,${escapeCSV(formData.prophylaxisExamFrequency)}`);
    csvRows.push(`Preventative Coverage,Last FMS,${escapeCSV(formData.lastFMS)}`);
    csvRows.push(`Preventative Coverage,Eligible for FMS Now,${escapeCSV(formData.eligibleForFMSNow ? 'Yes' : 'No')}`);
    csvRows.push(`Preventative Coverage,Eligible for FMS Every (Years),${escapeCSV(formData.eligibleForFMSEvery)}`);
    csvRows.push(`Preventative Coverage,Fluoride Varnish Frequency,${escapeCSV(formData.fluorideVarnishFrequency)}`);
    csvRows.push(`Preventative Coverage,Fluoride Age Limit Exists,${escapeCSV(formData.fluorideAgeLimitExists ? 'Yes' : 'No')}`);
    csvRows.push(`Preventative Coverage,Fluoride Age Limit,${escapeCSV(formData.fluorideAgeLimit)}`);
    csvRows.push(`Preventative Coverage,Sealant Coverage,${escapeCSV(formData.sealantCoverage ? 'Yes' : 'No')}`);
    csvRows.push(`Preventative Coverage,Sealant Teeth Covered - Molars,${escapeCSV(formData.sealantTeethCovered.molars ? 'Yes' : 'No')}`);
    csvRows.push(`Preventative Coverage,Sealant Teeth Covered - Premolars,${escapeCSV(formData.sealantTeethCovered.premolars ? 'Yes' : 'No')}`);
    csvRows.push(`Preventative Coverage,Sealant Age Limit Exists,${escapeCSV(formData.sealantAgeLimitExists ? 'Yes' : 'No')}`);
    csvRows.push(`Preventative Coverage,Sealant Age Limit,${escapeCSV(formData.sealantAgeLimit)}`);
    csvRows.push(`Preventative Coverage,Sealant Replacement,${escapeCSV(formData.sealantReplacement)}`);

    // Basic Coverage
    csvRows.push(`Basic Coverage,Basic Covered At (%),${escapeCSV(formData.basicCoveredAt)}`);
    csvRows.push(`Basic Coverage,Basic Waiting Period,${escapeCSV(formData.basicWaitingPeriod ? 'Yes' : 'No')}`);
    csvRows.push(`Basic Coverage,Basic Effective Date,${escapeCSV(formData.basicEffectiveDate)}`);
    csvRows.push(`Basic Coverage,Basic Includes,${escapeCSV(formData.basicIncludes)}`);

    // Major Coverage
    csvRows.push(`Major Coverage,Major Covered At (%),${escapeCSV(formData.majorCoveredAt)}`);
    csvRows.push(`Major Coverage,Major Waiting Period,${escapeCSV(formData.majorWaitingPeriod ? 'Yes' : 'No')}`);
    csvRows.push(`Major Coverage,Major Effective Date,${escapeCSV(formData.majorEffectiveDate)}`);
    csvRows.push(`Major Coverage,Major Includes,${escapeCSV(formData.majorIncludes)}`);

    // Periodontal Coverage
    csvRows.push(`Periodontal Coverage,SRP History,${escapeCSV(formData.srpHistory ? 'Yes' : 'No')}`);
    csvRows.push(`Periodontal Coverage,SRP History Date,${escapeCSV(formData.srpHistoryDate)}`);
    csvRows.push(`Periodontal Coverage,SRP Covered,${escapeCSV(formData.srpCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Periodontal Coverage,SRP Frequency,${escapeCSV(formData.srpFrequency)}`);
    csvRows.push(`Periodontal Coverage,SRP All Quadrants Same Visit,${escapeCSV(formData.srpAllQuadrantsSameVisit ? 'Yes' : 'No')}`);
    csvRows.push(`Periodontal Coverage,SRP Waiting Period,${escapeCSV(formData.srpWaitingPeriod)}`);
    csvRows.push(`Periodontal Coverage,Adult Prophylaxis with SRP,${escapeCSV(formData.adultProphylaxisWithSRP ? 'Yes' : 'No')}`);
    csvRows.push(`Periodontal Coverage,Adult Prophylaxis Waiting Period,${escapeCSV(formData.adultProphylaxisWaitingPeriod)}`);
    csvRows.push(`Periodontal Coverage,Periodontal Maintenance Covered,${escapeCSV(formData.periodontalMaintenanceCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Periodontal Coverage,Periodontal Maintenance Frequency,${escapeCSV(formData.periodontalMaintenanceFrequency)}`);

    // Implant Coverage
    csvRows.push(`Implant Coverage,Endosteal Implants Covered,${escapeCSV(formData.endostealImplantsCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Implant Coverage,Endosteal Implants Covered At (%),${escapeCSV(formData.endostealImplantsCoveredAt)}`);
    csvRows.push(`Implant Coverage,Bone Replacement Grafts Covered,${escapeCSV(formData.boneReplacementGraftsCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Implant Coverage,Bone Replacement Grafts Covered At (%),${escapeCSV(formData.boneReplacementGraftsCoveredAt)}`);
    csvRows.push(`Implant Coverage,Guided Tissue Regeneration Covered,${escapeCSV(formData.guidedTissueRegenerationCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Implant Coverage,Guided Tissue Regeneration Covered At (%),${escapeCSV(formData.guidedTissueRegenerationCoveredAt)}`);
    csvRows.push(`Implant Coverage,Implant Abutments Covered,${escapeCSV(formData.implantAbutmentsCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Implant Coverage,Implant Abutments Covered At (%),${escapeCSV(formData.implantAbutmentsCoveredAt)}`);
    csvRows.push(`Implant Coverage,Implant Crowns Covered,${escapeCSV(formData.implantCrownsCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Implant Coverage,Implant Crowns Covered At (%),${escapeCSV(formData.implantCrownsCoveredAt)}`);
    csvRows.push(`Implant Coverage,Implant Pre-determination Required,${escapeCSV(formData.implantPreDeterminationRequired ? 'Yes' : 'No')}`);

    // Orthodontic Coverage
    csvRows.push(`Orthodontic Coverage,Orthodontics Covered,${escapeCSV(formData.orthodonticsCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Orthodontic Coverage,Orthodontics Covered At (%),${escapeCSV(formData.orthodonticsCoveredAt)}`);
    csvRows.push(`Orthodontic Coverage,Orthodontics Age Limit Exists,${escapeCSV(formData.orthodonticsAgeLimitExists ? 'Yes' : 'No')}`);
    csvRows.push(`Orthodontic Coverage,Orthodontics Age Limit,${escapeCSV(formData.orthodonticsAgeLimit)}`);
    csvRows.push(`Orthodontic Coverage,Orthodontics Lifetime Max Exists,${escapeCSV(formData.orthodonticsLifetimeMaxExists ? 'Yes' : 'No')}`);
    csvRows.push(`Orthodontic Coverage,Orthodontics Lifetime Max,${escapeCSV(formData.orthodonticsLifetimeMax)}`);

    // Miscellaneous
    csvRows.push(`Miscellaneous,Nightguards Covered,${escapeCSV(formData.nightguardsCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Miscellaneous,Nightguards Covered At (%),${escapeCSV(formData.nightguardsCoveredAt)}`);
    csvRows.push(`Miscellaneous,Nitrous Oxide Covered,${escapeCSV(formData.nitrousOxideCovered ? 'Yes' : 'No')}`);
    csvRows.push(`Miscellaneous,Nitrous Oxide Covered At (%),${escapeCSV(formData.nitrousOxideCoveredAt)}`);
    csvRows.push(`Miscellaneous,Crowns and Bridges Replacement (Years),${escapeCSV(formData.crownsAndBridgesReplacement)}`);
    csvRows.push(`Miscellaneous,Dentures Replacement (Years),${escapeCSV(formData.denturesReplacement)}`);
    csvRows.push(`Miscellaneous,Missing Tooth Clause Covered,${escapeCSV(formData.missingToothClauseCovered ? 'Yes' : 'No')}`);

    // Additional Notes
    csvRows.push(`Additional Notes,Additional Notes,${escapeCSV(formData.additionalNotes)}`);

    // Create CSV content
    const csvContent = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `verification-form-${getFullName().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePrintContent = (): string => {
    return `
      <div class="section">
        <div class="section-header">Patient Information</div>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Patient Name:</span>
            <div class="field-value">${getFullName()}</div>
          </div>
          <div class="field">
            <span class="field-label">SSN:</span>
            <div class="field-value">${formData.patientSSN}</div>
          </div>
          <div class="field">
            <span class="field-label">Date of Birth:</span>
            <div class="field-value">${patient.birthDate}</div>
          </div>
          <div class="field">
            <span class="field-label">Relationship to Subscriber:</span>
            <div class="field-value">${formData.relationshipToSubscriber}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Subscriber Information</div>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Subscriber Name:</span>
            <div class="field-value">${formData.subscriberName}</div>
          </div>
          <div class="field">
            <span class="field-label">SSN:</span>
            <div class="field-value">${formData.subscriberSSN}</div>
          </div>
          <div class="field">
            <span class="field-label">Date of Birth:</span>
            <div class="field-value">${formData.subscriberDOB}</div>
          </div>
          <div class="field">
            <span class="field-label">Subscriber ID Number:</span>
            <div class="field-value">${formData.subscriberID}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Insurance Information</div>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Insurance Company:</span>
            <div class="field-value">${formData.insuranceCompany}</div>
          </div>
          <div class="field">
            <span class="field-label">Insurer Type:</span>
            <div class="checkbox-group">
              <span class="checkbox-item"><span class="checkbox">${formData.insurerType.primary ? '✓' : ''}</span> Primary</span>
              <span class="checkbox-item"><span class="checkbox">${formData.insurerType.secondary ? '✓' : ''}</span> Secondary</span>
            </div>
          </div>
          <div class="field">
            <span class="field-label">Address:</span>
            <div class="field-value">${formData.insuranceAddress}</div>
          </div>
          <div class="field">
            <span class="field-label">Phone:</span>
            <div class="field-value">${formData.insurancePhone}</div>
          </div>
          <div class="field">
            <span class="field-label">Employer:</span>
            <div class="field-value">${formData.employer}</div>
          </div>
          <div class="field">
            <span class="field-label">Group Number:</span>
            <div class="field-value">${formData.groupNumber}</div>
          </div>
          <div class="field">
            <span class="field-label">Effective Date:</span>
            <div class="field-value">${formData.effectiveDate}</div>
          </div>
          <div class="field">
            <span class="field-label">Renewal Month:</span>
            <div class="field-value">${formData.renewalMonth}</div>
          </div>
          <div class="field">
            <span class="field-label">Yearly Max:</span>
            <div class="field-value">${formData.yearlyMax}</div>
          </div>
          <div class="field">
            <span class="field-label">Deductible Per Individual:</span>
            <div class="field-value">${formData.deductiblePerIndividual}</div>
          </div>
          <div class="field">
            <span class="field-label">Deductible Per Family:</span>
            <div class="field-value">${formData.deductiblePerFamily}</div>
          </div>
        </div>
        <div class="field-group-full">
          <div class="field">
            <span class="field-label">Deductible Applies To:</span>
            <div class="checkbox-group">
              <span class="checkbox-item"><span class="checkbox">${formData.deductibleAppliesTo.preventative ? '✓' : ''}</span> Preventative</span>
              <span class="checkbox-item"><span class="checkbox">${formData.deductibleAppliesTo.basic ? '✓' : ''}</span> Basic</span>
              <span class="checkbox-item"><span class="checkbox">${formData.deductibleAppliesTo.major ? '✓' : ''}</span> Major</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Preventative Coverage</div>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Covered at:</span>
            <div class="field-value">${formData.preventativeCoveredAt}%</div>
          </div>
          <div class="field">
            <span class="field-label">Waiting Period:</span>
            <div class="checkbox-group">
              <span class="checkbox-item"><span class="radio">${formData.preventativeWaitingPeriod ? '●' : '○'}</span> Yes</span>
              <span class="checkbox-item"><span class="radio">${!formData.preventativeWaitingPeriod ? '●' : '○'}</span> No</span>
            </div>
          </div>
          <div class="field">
            <span class="field-label">Effective Date:</span>
            <div class="field-value">${formData.preventativeEffectiveDate}</div>
          </div>
          <div class="field">
            <span class="field-label">Bitewing Frequency:</span>
            <div class="field-value">${formData.bitewingFrequency}</div>
          </div>
          <div class="field">
            <span class="field-label">Prophylaxis/Exam Frequency:</span>
            <div class="field-value">${formData.prophylaxisExamFrequency}</div>
          </div>
          <div class="field">
            <span class="field-label">Last FMS:</span>
            <div class="field-value">${formData.lastFMS}</div>
          </div>
          <div class="field">
            <span class="field-label">Eligible for FMS Now:</span>
            <div class="checkbox-group">
              <span class="checkbox-item"><span class="radio">${formData.eligibleForFMSNow ? '●' : '○'}</span> Yes</span>
              <span class="checkbox-item"><span class="radio">${!formData.eligibleForFMSNow ? '●' : '○'}</span> No</span>
            </div>
          </div>
          <div class="field">
            <span class="field-label">Eligible for FMS Every:</span>
            <div class="field-value">${formData.eligibleForFMSEvery} Years</div>
          </div>
        </div>
        <div class="field-group-full">
          <div class="field">
            <span class="field-label">Fluoride Varnish Frequency:</span>
            <div class="field-value">${formData.fluorideVarnishFrequency}</div>
          </div>
          <div class="field">
            <span class="field-label">Sealant Coverage:</span>
            <div class="checkbox-group">
              <span class="checkbox-item"><span class="checkbox">${formData.sealantTeethCovered.molars ? '✓' : ''}</span> Molars</span>
              <span class="checkbox-item"><span class="checkbox">${formData.sealantTeethCovered.premolars ? '✓' : ''}</span> Premolars</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Basic Coverage</div>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Covered at:</span>
            <div class="field-value">${formData.basicCoveredAt}%</div>
          </div>
          <div class="field">
            <span class="field-label">Waiting Period:</span>
            <div class="checkbox-group">
              <span class="checkbox-item"><span class="radio">${formData.basicWaitingPeriod ? '●' : '○'}</span> Yes</span>
              <span class="checkbox-item"><span class="radio">${!formData.basicWaitingPeriod ? '●' : '○'}</span> No</span>
            </div>
          </div>
          <div class="field">
            <span class="field-label">Effective Date:</span>
            <div class="field-value">${formData.basicEffectiveDate}</div>
          </div>
        </div>
        <div class="field-group-full">
          <div class="field">
            <span class="field-label">Includes:</span>
            <div class="field-value">${formData.basicIncludes}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Major Coverage</div>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Covered at:</span>
            <div class="field-value">${formData.majorCoveredAt}%</div>
          </div>
          <div class="field">
            <span class="field-label">Waiting Period:</span>
            <div class="checkbox-group">
              <span class="checkbox-item"><span class="radio">${formData.majorWaitingPeriod ? '●' : '○'}</span> Yes</span>
              <span class="checkbox-item"><span class="radio">${!formData.majorWaitingPeriod ? '●' : '○'}</span> No</span>
            </div>
          </div>
          <div class="field">
            <span class="field-label">Effective Date:</span>
            <div class="field-value">${formData.majorEffectiveDate}</div>
          </div>
        </div>
        <div class="field-group-full">
          <div class="field">
            <span class="field-label">Includes:</span>
            <div class="field-value">${formData.majorIncludes}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Periodontal Coverage</div>
        <div class="field-group">
          <div class="field">
            <span class="field-label">SRP History:</span>
            <div class="checkbox-group">
              <span class="checkbox-item"><span class="radio">${formData.srpHistory ? '●' : '○'}</span> Yes</span>
              <span class="checkbox-item"><span class="radio">${!formData.srpHistory ? '●' : '○'}</span> No</span>
            </div>
          </div>
          <div class="field">
            <span class="field-label">SRP History Date:</span>
            <div class="field-value">${formData.srpHistoryDate}</div>
          </div>
          <div class="field">
            <span class="field-label">SRP Frequency:</span>
            <div class="field-value">${formData.srpFrequency}</div>
          </div>
          <div class="field">
            <span class="field-label">Periodontal Maintenance Frequency:</span>
            <div class="field-value">${formData.periodontalMaintenanceFrequency}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Implant & Orthodontic Coverage</div>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Endosteal Implants:</span>
            <div class="field-value">${formData.endostealImplantsCovered ? formData.endostealImplantsCoveredAt + '%' : 'Not Covered'}</div>
          </div>
          <div class="field">
            <span class="field-label">Orthodontics:</span>
            <div class="field-value">${formData.orthodonticsCovered ? formData.orthodonticsCoveredAt + '%' : 'Not Covered'}</div>
          </div>
          <div class="field">
            <span class="field-label">Orthodontics Lifetime Max:</span>
            <div class="field-value">${formData.orthodonticsLifetimeMaxExists ? formData.orthodonticsLifetimeMax : 'N/A'}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">Miscellaneous</div>
        <div class="field-group">
          <div class="field">
            <span class="field-label">Nightguards:</span>
            <div class="field-value">${formData.nightguardsCovered ? formData.nightguardsCoveredAt + '%' : 'Not Covered'}</div>
          </div>
          <div class="field">
            <span class="field-label">Nitrous Oxide:</span>
            <div class="field-value">${formData.nitrousOxideCovered ? formData.nitrousOxideCoveredAt + '%' : 'Not Covered'}</div>
          </div>
          <div class="field">
            <span class="field-label">Replacement on Crowns/Bridges:</span>
            <div class="field-value">${formData.crownsAndBridgesReplacement} Years</div>
          </div>
          <div class="field">
            <span class="field-label">Replacement on Dentures:</span>
            <div class="field-value">${formData.denturesReplacement} Years</div>
          </div>
          <div class="field">
            <span class="field-label">Missing Tooth Clause:</span>
            <div class="checkbox-group">
              <span class="checkbox-item"><span class="radio">${formData.missingToothClauseCovered ? '●' : '○'}</span> Yes</span>
              <span class="checkbox-item"><span class="radio">${!formData.missingToothClauseCovered ? '●' : '○'}</span> No</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div key={patient.id}>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Header with Title and Print Button - Sticky */}
        <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-md rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined">assignment</span>
              Verification Form
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 bg-white dark:bg-slate-900 text-sm"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 bg-white dark:bg-slate-900 text-sm"
              >
                <span className="material-symbols-outlined text-base">print</span>
                Print
              </button>
            </div>
          </div>
        </div>

        <div ref={formRef} className="p-6 space-y-8">
          {/* Patient Information Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('patient')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.patient ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">account_circle</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                PATIENT INFORMATION
              </h4>
            </button>
            {!collapsedSections.patient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={getFullName()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SSN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    value={showPatientSSN ? formData.patientSSN : maskSSN(formData.patientSSN)}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowPatientSSN(!showPatientSSN)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPatientSSN ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={patient.birthDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Relationship to Subscriber
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.relationshipToSubscriber}
                />
              </div>
            </div>
            )}
          </div>

          {/* Subscriber Information Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('subscriber')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.subscriber ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">badge</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                SUBSCRIBER INFORMATION
              </h4>
            </button>
            {!collapsedSections.subscriber && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subscriber Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.subscriberName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SSN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    value={showSubscriberSSN ? formData.subscriberSSN : maskSSN(formData.subscriberSSN)}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowSubscriberSSN(!showSubscriberSSN)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showSubscriberSSN ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.subscriberDOB}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subscriber ID Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.subscriberID}
                />
              </div>
            </div>
            )}
          </div>

          {/* Insurance Information Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('insurance')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.insurance ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">health_and_safety</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                INSURANCE INFORMATION
              </h4>
            </button>
            {!collapsedSections.insurance && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Insurance Company
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.insuranceCompany}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Insurer Type
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked={formData.insurerType.primary} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Primary</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked={formData.insurerType.secondary} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Secondary</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.insuranceAddress}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.insurancePhone}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Employer
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.employer}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Group Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.groupNumber}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Effective Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.effectiveDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Renewal Month
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.renewalMonth}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Yearly Max
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.yearlyMax}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deductible Per Individual
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.deductiblePerIndividual}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deductible Per Family
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.deductiblePerFamily}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Deductible Applies To
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked={formData.deductibleAppliesTo.preventative} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Preventative</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked={formData.deductibleAppliesTo.basic} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Basic</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked={formData.deductibleAppliesTo.major} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Major</span>
                  </label>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Preventative Coverage Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('preventative')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.preventative ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">shield_with_heart</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                PREVENTATIVE COVERAGE
              </h4>
            </button>
            {!collapsedSections.preventative && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.preventativeCoveredAt}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Waiting Period?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preventativeWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preventativeWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Effective Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.lastFMS}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bitewing Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.bitewingFrequency}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Prophylaxis/Exam Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.prophylaxisExamFrequency}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Last FMS
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Eligible for FMS Now?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="fmsNow" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="fmsNow" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Eligible for FMS Every (Years)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.eligibleForFMSEvery}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fluoride Varnish (D1203/D1204/D1206) Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.fluorideVarnishFrequency}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Age Limit on Fluoride?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="fluorideAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="fluorideAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, at what age?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.fluorideAgeLimit}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sealant (D1351) Coverage?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sealant" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sealant" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sealant Teeth Covered
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked={formData.sealantTeethCovered.molars} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Molars</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked={formData.sealantTeethCovered.premolars} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Premolars</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Age Limit on Sealants?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sealantAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="sealantAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, at what age?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.sealantAgeLimit}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Replacement on Sealant
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.sealantReplacement}
                />
              </div>
            </div>
            )}
          </div>

          {/* Basic Coverage Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('basic')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.basic ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">medical_services</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                BASIC COVERAGE
              </h4>
            </button>
            {!collapsedSections.basic && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.basicCoveredAt}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Waiting Period?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="basicWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="basicWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Effective Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Includes
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.basicIncludes}
                />
              </div>
            </div>
            )}
          </div>

          {/* Major Coverage Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('major')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.major ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">verified</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                MAJOR COVERAGE
              </h4>
            </button>
            {!collapsedSections.major && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.majorCoveredAt}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Waiting Period?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="majorWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="majorWaiting" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Effective Date
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Includes
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  defaultValue={formData.majorIncludes}
                />
              </div>
            </div>
            )}
          </div>

          {/* Periodontal Coverage Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('periodontal')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.periodontal ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">dentistry</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                PERIODONTAL COVERAGE
              </h4>
            </button>
            {!collapsedSections.periodontal && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  History of SRP (D4341/D4342)?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpHistory" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpHistory" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, when?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SRP Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpCovered" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpCovered" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SRP Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Frequency"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SRP All Quadrants Same Visit?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpQuadrants" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="srpQuadrants" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If not, waiting period?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Waiting period"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Adult Prophylaxis & Isolated SRP Same Visit?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="prophylaxisSRP" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="prophylaxisSRP" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If not, waiting period?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Waiting period"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Periodontal Maintenance (D4910) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="perioMaintenance" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="perioMaintenance" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Frequency
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Frequency"
                />
              </div>
            </div>
            )}
          </div>

          {/* Implant Coverage Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('implant')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.implant ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">folder_special</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                IMPLANT COVERAGE
              </h4>
            </button>
            {!collapsedSections.implant && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Endosteal Implants (D6012) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="endosteal" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="endosteal" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bone Replacement Grafts (D7953) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="boneGrafts" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="boneGrafts" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Guided-Tissue Regeneration (D4266/D4267) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="guidedTissue" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="guidedTissue" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Implant Abutments (D6056/D6057) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="abutments" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="abutments" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Implant Crowns (D6065/D6066/D6067) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="implantCrowns" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="implantCrowns" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Pre-determination Required Prior to Implant Surgery?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preDetermination" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="preDetermination" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Orthodontic Coverage Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('orthodontic')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.orthodontic ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">sentiment_satisfied</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                ORTHODONTIC COVERAGE
              </h4>
            </button>
            {!collapsedSections.orthodontic && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Orthodontics Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodontics" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodontics" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Age Limit on Orthodontic Coverage?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodonticsAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodonticsAge" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, at what age?
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Lifetime Maximum?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodonticsLifetime" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="orthodonticsLifetime" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, lifetime maximum ($)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="$"
                />
              </div>
            </div>
            )}
          </div>

          {/* Miscellaneous Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('miscellaneous')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.miscellaneous ? 'expand_more' : 'expand_less'}
              </span>
              <span className="material-symbols-outlined text-primary">more_horiz</span>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                MISCELLANEOUS
              </h4>
            </button>
            {!collapsedSections.miscellaneous && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nightguards (D9940) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="nightguards" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="nightguards" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nitrous Oxide (D9230) Covered?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="nitrousOxide" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="nitrousOxide" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  If yes, covered at (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Replacement on Crowns and Bridges (Years)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Replacement on Complete and Partial Dentures (Years)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Years"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Prior Extractions Covered (Missing Tooth Clause)?
                </label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="missingTooth" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="missingTooth" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                  </label>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Additional Notes Section */}
          <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleSection('notes')}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group border-b-2 border-slate-200 dark:border-slate-700"
            >
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">note_add</span>
                ADDITIONAL NOTES
              </h4>
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                {collapsedSections.notes ? 'expand_more' : 'expand_less'}
              </span>
            </button>
            {!collapsedSections.notes && (
            <div className="p-4">
              <textarea
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                defaultValue={formData.additionalNotes}
                placeholder="Add any additional notes or information..."
              />
            </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default VerificationForm;
