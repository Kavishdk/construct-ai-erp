import { Router } from 'express';
import {
    getAccounts, getJournalEntries, getInvoices, createInvoice, getFinancialDashboard,
    getCashFlowForecast, getBalanceSheet, getProfitLoss, getVendors, createVendor,
    getCustomers, createCustomer,
    createJournalEntry, createPayment, getExchangeRates
} from '../controllers/finance.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // Protect all finance routes

router.get('/accounts', getAccounts);
router.get('/journal-entries', getJournalEntries);
router.post('/journal-entries', createJournalEntry);
router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);
router.post('/payments', createPayment);
router.get('/dashboard', getFinancialDashboard);

// New Feature Routes
router.get('/forecast', getCashFlowForecast);
router.get('/exchange-rates', getExchangeRates);
router.get('/balance-sheet', getBalanceSheet);
router.get('/profit-loss', getProfitLoss);
router.get('/vendors', getVendors);
router.post('/vendors', createVendor);
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);

export default router;
