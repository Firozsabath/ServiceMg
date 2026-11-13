export interface InvoiceFilter {
    searchTerm?: string;
    statusId?: number;
    fromDate?: Date;
    toDate?: Date;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }
  
  export interface InvoiceListItem {
    invoiceId: number;
    invoiceNumber: string;
    customerId: number;
    customerName: string;
    invoiceDate: Date;
    dueDate: Date;
    statusId: number;
    statusName: string;
    totalAmount: number;
    amountPaid: number;
    balance: number;
    isOverdue: boolean;
    createdDate: Date;
  }
  
  export interface InvoiceSummary {
    totalInvoiceCount: number;
    totalAmount: number;
    totalVatCollected: number;
    totalPaid: number;
    totalOutstanding: number;
  }
  
  export interface StatusBreakdown {
    statusId: number;
    statusName: string;
    count: number;
    totalAmount: number;
  }
  
  export interface PaginationMeta {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }
  
  export interface InvoiceListResponse {
    invoices: InvoiceListItem[];
    summary: InvoiceSummary;
    statusBreakdown: StatusBreakdown[];
    pagination: PaginationMeta;
  }