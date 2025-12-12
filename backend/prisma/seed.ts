import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Users
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'alice@construct.ai' },
    update: {},
    create: {
      email: 'alice@construct.ai',
      name: 'Alice Admin',
      password,
      role: 'ADMIN',
      status: 'Active'
    },
  });

  await prisma.user.upsert({
    where: { email: 'bob@construct.ai' },
    update: {},
    create: {
      email: 'bob@construct.ai',
      name: 'Bob Finance',
      password,
      role: 'FINANCE_MANAGER',
      status: 'Active'
    },
  });

  // Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Downtown Skyscraper',
      budget: 5000000,
      actualCost: 2100000,
      startDate: new Date('2023-01-15'),
      endDate: new Date('2024-12-01'),
      progress: 45,
      status: 'On Track'
    }
  });

  // Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      name: 'Steel Suppliers Inc.',
      email: 'sales@steelsuppliers.com',
      phone: '555-0123'
    }
  });

  // Exchange Rates
  await prisma.exchangeRate.create({
    data: {
      currency: 'EUR',
      rateToUSD: 1.08
    }
  });

  // Invoices with Vendor
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-SEED-001',
      vendorName: 'Steel Suppliers Inc.',
      vendorId: vendor1.id,
      amount: 15000,
      currency: 'USD',
      issueDate: new Date('2023-06-01'),
      dueDate: new Date('2023-07-01'),
      status: 'Pending',
      projectId: project1.id
    }
  });

  // Chart of Accounts
  const cashAcc = await prisma.account.create({ data: { code: '1000', name: 'Cash', type: 'Asset', balance: 150000 } });
  const arAcc = await prisma.account.create({ data: { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 50000 } });
  const apAcc = await prisma.account.create({ data: { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 30000 } });
  const equityAcc = await prisma.account.create({ data: { code: '3000', name: 'Owner Equity', type: 'Equity', balance: 100000 } });
  const salesAcc = await prisma.account.create({ data: { code: '4000', name: 'Construction Sales', type: 'Revenue', balance: 200000 } });
  const expenseAcc = await prisma.account.create({ data: { code: '5000', name: 'Materials Expense', type: 'Expense', balance: 80000 } });

  // Risk Analysis
  await prisma.riskAnalysis.create({
    data: {
      projectId: project1.id,
      riskScore: 65,
      riskLevel: 'Medium',
      factors: 'Delay in steel delivery, Material cost inflation'
    }
  });

  // Journal Entries
  // Entry 1: Revenue recognition
  const je1 = await prisma.journalEntry.create({
    data: {
      date: new Date('2023-01-20'),
      description: 'Invoice #101 Payment',
      status: 'Approved'
    }
  });
  await prisma.journalEntryLine.createMany({
    data: [
      { journalEntryId: je1.id, accountId: cashAcc.id, debit: 50000, credit: 0 },
      { journalEntryId: je1.id, accountId: arAcc.id, debit: 0, credit: 50000 }
    ]
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
