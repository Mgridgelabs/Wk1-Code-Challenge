const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const taxRates = {
  monthly: {
    '0-24000': 0.10,
    '24001-32333': 0.25,
    '32334-500000': 0.30,
    '500001-800000': 0.325,
    'Above 800000': 0.35
  },
  annual: {
    '0-288000': 0.10,
    '288001-388000': 0.25,
    '388001-6000000': 0.30,
    '6000001-9600000': 0.325,
    'Above 9600000': 0.35
  }
};

const nhifRates = {
  '0-5999': 150,
  '6000-7999': 300,
  '8000-11999': 400,
  '12000-14999': 500,
  '15000-19999': 600,
  '20000-24999': 750,
  '25000-29999': 850,
  '30000-34999': 900,
  '35000-39999': 950,
  '40000-44999': 1000,
  '45000-49999': 1100,
  '50000-59999': 1200,
  '60000-69999': 1300,
  '70000-79999': 1400,
  '80000-89999': 1500,
  '90000-99999': 1600,
  '100000+': 1700
};

const nssfRates = {
  TierI: {
    "Up to 7000": { rate: 0.06 } // 6%
  },
  TierII: {
    "7001-36000": { rate: 0.06 } // 6%
  }
};

const calculateTax = (grossSalary, isAnnual) => {
  const rates = isAnnual ? taxRates.annual : taxRates.monthly;
  let tax = 0;

  for (let [range, rate] of Object.entries(rates)) {
    const [min, max] = range.split('-').map(Number);
    if (grossSalary <= min) break;
    const taxableAmount = max ? Math.min(grossSalary, max) - min : grossSalary - min;
    tax += taxableAmount * rate;
  }

  return tax;
};

const calculateNHIF = (grossSalary) => {
  for (let [range, deduction] of Object.entries(nhifRates)) {
    const [min, max] = range.split('-').map(Number);
    if (!max || grossSalary <= max) return deduction;
  }
  return 0;
};

const calculateNSSF = (grossSalary) => {
  const tierILimit = 7000;
  const tierI = Math.min(grossSalary, tierILimit) * nssfRates.TierI["Up to 7000"].rate;
  const tierII = grossSalary > tierILimit ? (Math.min(grossSalary, 36000) - tierILimit) * nssfRates.TierII["7001-36000"].rate : 0;

  return tierI + tierII;
};

const calculateHousingLevy = (grossSalary) => {
  return grossSalary * 0.015;
};

rl.question('Enter basic salary: ', (basicSalary) => {
  rl.question('Enter benefits: ', (benefits) => {
    const grossSalary = parseFloat(basicSalary) + parseFloat(benefits);
    const isAnnual = false; // Change this to true if you want to calculate annual tax
    const payeeTax = calculateTax(grossSalary, isAnnual);
    const nhifDeductions = calculateNHIF(grossSalary);
    const nssfDeductions = calculateNSSF(grossSalary);
    const housingLevy = calculateHousingLevy(grossSalary);
    const totalDeductions = payeeTax + nhifDeductions + nssfDeductions + housingLevy;
    const netSalary = grossSalary - totalDeductions;

    console.log(`Gross Salary: ${grossSalary}`);
    console.log(`PAYEE (Tax): ${payeeTax}`);
    console.log(`NHIF Deductions: ${nhifDeductions}`);
    console.log(`NSSF Deductions: ${nssfDeductions}`);
    console.log(`Housing Levy: ${housingLevy}`);
    console.log(`Net Salary: ${netSalary}`);

    rl.close();
  });
});