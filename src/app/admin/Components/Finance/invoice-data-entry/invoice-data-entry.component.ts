import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { DialogInvoiceDataPreviewComponent } from 'src/app/admin/dialogs/dialog-finance/dialog-invoice-data-preview/dialog-invoice-data-preview.component';
import { DialogInvoicepreviewComponent } from 'src/app/admin/dialogs/dialog-finance/dialog-invoicepreview/dialog-invoicepreview.component';
import { InventoryDP } from 'src/app/models/Inventory';
import { TicketsReportDropdownDTO } from 'src/app/models/PriorityLevels';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
import { InvoiceOpService } from 'src/app/service/invoice/invoice-op.service';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-invoice-data-entry',
  templateUrl: './invoice-data-entry.component.html',
  styleUrls: ['./invoice-data-entry.component.css']
})
export class InvoiceDataEntryComponent implements OnInit {
  drps: TicketsReportDropdownDTO;
  selectedMachine: any;  
  selectedBranch: any;
  selectedCompany: any;
  selectedparts: any;
  myControl = new FormControl('', Validators.required);
  fontStyle?: string;
  options: InventoryDP[];
  filteredOptions: Observable<any[]>[] = [];
  showmanualCompany: boolean = false;
  showAutoCompany: boolean = false;
  showButtons: boolean = false;
  filteredCompanies: any[];
  filteredBranches: any[];
  filteredMachines: any[];
  partsList: any[];
  
  // Table display properties
  displayedColumns: string[] = ['description', 'skuId', 'quantity', 'unitPrice', 'vatPercent', 'vatAmount', 'total', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  
  // New part being added
  newPart = {
    searchInput: '',
    partsID: null,
    description: '',
    skuID: '',
    quantityUsed: 1,
    amount: 0,
    vatPercent: 5,
    vat: 0,
    total: 0
  };
  
  // Custom item for non-inventory items
  customItem = {
    description: '',
    skuID: 'CUSTOM',
    quantityUsed: 1,
    amount: 0,
    vatPercent: 5,
    vat: 0,
    total: 0
  };
  
  // Filtered options for the autocomplete
  filteredPartsOptions: Observable<any[]>;

  isEditMode: boolean = false;
  invoiceId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceOpService,
    private inventoryService: InventoryopService,
    private ticketService: ServicerequestopService,
    private machineService: MachinesopService,
    private cdRef: ChangeDetectorRef
  ) {
    this.initForm();
  }

  invoiceForm = this.fb.group({
    invoiceID: [0],
    companyID: [0],
    machineID: [0],
    branchID: [0],
    companyName: [''],
    companyAddress: [''],
    trn: [''],
    dateCreated: [new Date()],
    totalAmount: [0],
    validUntil:[new Date()],
    quotationNum:[''],
    invoiceNum:[''],
    serviceCharges: [0],
    PaymentTerms: [''],
    disclaimer: [''],
    notes: [''],
    invoiceItems: this.fb.array([])
  });

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.invoiceId = params['id'];
        this.isEditMode = true;
        this.loadInvoiceForEdit();
      }
    });

    // Initialize the autocomplete for the new part
    this.setupPartAutocomplete();
    
    // Load dropdown data
    this.ticketService.getReportDropdowns().subscribe({
      next: (data: any) => {
        this.drps = data;
        this.filteredCompanies = [...this.drps.requestCompanies];
        this.filteredBranches = [...this.drps.requestBranches];
        this.filteredMachines = [...this.drps.requestMachines];
      },
      error: (error) => {
        console.error('Error loading dropdown data:', error);
        this.snackBar.open('Error loading form data', 'Close', { duration: 3000 });
      }
    });
    
    // Load parts inventory
    this.inventoryService.getItems().subscribe({
      next: (data: any) => {
        this.partsList = data.map(p => ({
          partsID: p.partsID,
          description: p.description,
          skuID: p.skuID,
          quantityOnHand: p.quantityOnHand,
          rate: p.productCost,
          displayText: `${p.description} - ${p.skuID} (${p.quantityOnHand} Pieces Left)`
        }));
      },
      error: (error) => {
        console.error('Error loading inventory items:', error);
        this.snackBar.open('Error loading inventory items', 'Close', { duration: 3000 });
      }
    });
  }

  private initForm(): void {
    // Form is already initialized in the class property
  }

  private setupPartAutocomplete(): void {
    this.filteredPartsOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: string | InventoryDP) => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filter(name) : this.partsList?.slice() || [];
      })
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.partsList?.filter(part => 
      part.description.toLowerCase().includes(filterValue) ||
      part.skuID.toLowerCase().includes(filterValue)
    ) || [];
  }

  showHideBelowDiv() {
    if (this.fontStyle === 'auto') {
      this.showmanualCompany = true;
      this.showAutoCompany = false;
      this.showButtons = true;
    } else if (this.fontStyle === 'manual') {
      this.showmanualCompany = false;
      this.showAutoCompany = true;
      this.showButtons = true;
    }
  }

  updateFilteredDrops(type: string, searchText: string) {
    searchText = searchText.toLowerCase();
    switch (type) {
      case 'companies':
        this.filteredCompanies = this.drps.requestCompanies.filter(company =>
          company.name.toLowerCase().includes(searchText)
        );
        break;
      case 'branches':
        this.filteredBranches = this.drps.requestBranches.filter(branch =>
          branch.name.toLowerCase().includes(searchText)
        );
        break;
      case 'machines':
        this.filteredMachines = this.drps.requestMachines.filter(machine =>
          machine.name.toLowerCase().includes(searchText)
        );
        break;
    }
  }

  onSelectCompany(event: any) {
    const selectedCompany = this.drps.requestCompanies.find(c => c.id === event.value);
    if (selectedCompany) {
      this.selectedCompany = selectedCompany.id;
      this.invoiceForm.patchValue({
        companyName: selectedCompany.name,
        companyAddress: selectedCompany.address,
        trn: selectedCompany.trn
      });

      // Filter branches for selected company
      this.filteredBranches = this.drps.requestBranches.filter(b => b.foreignID === selectedCompany.id);
    }
  }

  onSelectBranches(event: any) {
    const selectedBranch = this.drps.requestBranches.find(b => b.id === event.value);
    if (selectedBranch) {
      this.selectedBranch = selectedBranch.id;
      // Filter machines for selected branch
      this.filteredMachines = this.drps.requestMachines.filter(m => m.foreignID === selectedBranch.id);
    }
  }

  get invoiceItems(): FormArray {
    return this.invoiceForm.get('invoiceItems') as FormArray;
  }

  displayPart(part: any): string {
    return part ? part.displayText || part.description : '';
  }

  onSelectPart(event: any) {
    const selectedPart = event.option.value;
    this.newPart.partsID = selectedPart.partsID;
    this.newPart.description = selectedPart.description;
    this.newPart.skuID = selectedPart.skuID;
    this.newPart.amount = selectedPart.rate || 0;
    this.calculateTotal();
  }

  calculateTotal() {
    const quantity = Number(this.newPart.quantityUsed) || 0;
    const price = Number(this.newPart.amount) || 0;
    const subtotal = Number((quantity * price).toFixed(2));
    const vatAmount = Number((subtotal * (this.newPart.vatPercent / 100)).toFixed(2));
    
    this.newPart.vat = vatAmount;
    this.newPart.total = Number((subtotal + vatAmount).toFixed(2));
  }

  calculateCustomTotal() {
    const quantity = Number(this.customItem.quantityUsed) || 0;
    const price = Number(this.customItem.amount) || 0;
    const subtotal = Number((quantity * price).toFixed(2));
    const vatAmount = Number((subtotal * (this.customItem.vatPercent / 100)).toFixed(2));
    
    this.customItem.vat = vatAmount;
    this.customItem.total = Number((subtotal + vatAmount).toFixed(2));
  }

  addItemToTable() {
    if (!this.newPart.partsID || !this.newPart.quantityUsed || !this.newPart.amount) {
      this.snackBar.open("Please fill in all required fields", "OK");
      return;
    }
    
    this.calculateTotal();
    
    const partGroup = this.fb.group({
      partsID: [this.newPart.partsID, Validators.required],
      description: [this.newPart.description, Validators.required],
      skuId: [this.newPart.skuID],
      quantityUsed: [this.newPart.quantityUsed, [Validators.required, Validators.min(1)]],
      amount: [this.newPart.amount, [Validators.required, Validators.min(0)]],
      vatPercent: [this.newPart.vatPercent],
      vat: [this.newPart.vat],
      total: [this.newPart.total]
    });
    
    this.invoiceItems.push(partGroup);
    
    // Update the data source
    this.dataSource = new MatTableDataSource(this.invoiceItems.controls);
    
    // Reset the new part form
    this.resetNewPartForm();
    
    // Update the total amount
    this.updateTotalAmount();
    
    // Force change detection
    this.cdRef.detectChanges();
    
    // Show success message
    this.snackBar.open("Item added successfully", "OK", { duration: 2000 });
  }

  addCustomItemToTable() {
    if (!this.customItem.description || !this.customItem.quantityUsed || !this.customItem.amount) {
      this.snackBar.open("Please fill in all required fields for the custom item", "OK");
      return;
    }
    
    this.calculateCustomTotal();
    
    const customGroup = this.fb.group({
      partsID: [0], // Use 0 for custom items
      description: [this.customItem.description, Validators.required],
      skuId: [this.customItem.skuID],
      quantityUsed: [this.customItem.quantityUsed, [Validators.required, Validators.min(1)]],
      amount: [this.customItem.amount, [Validators.required, Validators.min(0)]],
      vatPercent: [this.customItem.vatPercent],
      vat: [this.customItem.vat],
      total: [this.customItem.total]
    });
    
    this.invoiceItems.push(customGroup);
    
    // Update the data source
    this.dataSource = new MatTableDataSource(this.invoiceItems.controls);
    
    // Reset the custom item form
    this.resetCustomItemForm();
    
    // Update the total amount
    this.updateTotalAmount();
    
    // Force change detection
    this.cdRef.detectChanges();
    
    // Show success message
    this.snackBar.open("Custom item added successfully", "OK", { duration: 2000 });
  }

  resetNewPartForm() {
    this.newPart = {
      searchInput: '',
      partsID: null,
      description: '',
      skuID: '',
      quantityUsed: 1,
      amount: 0,
      vatPercent: 5,
      vat: 0,
      total: 0
    };
    
    this.myControl.reset();
  }

  resetCustomItemForm() {
    this.customItem = {
      description: '',
      skuID: 'CUSTOM',
      quantityUsed: 1,
      amount: 0,
      vatPercent: 5,
      vat: 0,
      total: 0
    };
  }

  removeItem(index: number) {
    this.invoiceItems.removeAt(index);
    // Update the data source
    this.dataSource = new MatTableDataSource(this.invoiceItems.controls);
    this.updateTotalAmount();
  }

  updateTotalAmount() {
    let total = 0;
    this.invoiceItems.controls.forEach(control => {
      total += control.get('total').value || 0;
    });
    
    this.invoiceForm.patchValue({
      totalAmount: total
    });
  }

  refreshPage() {
    // Reset form and data
    this.resetForm();
    
    // Reset company selection mode
    this.fontStyle = undefined;
    this.showmanualCompany = false;
    this.showAutoCompany = false;
    this.showButtons = false;
    
    // Reset dropdowns
    if (this.drps) {
      this.filteredCompanies = [...this.drps.requestCompanies];
      this.filteredBranches = [...this.drps.requestBranches];
      this.filteredMachines = [...this.drps.requestMachines];
    }
    
    // Show success message
    this.snackBar.open('Page refreshed successfully', 'Close', { duration: 2000 });
  }

  private loadInvoiceForEdit() {
    if (this.invoiceId) {
      this.isLoading = true;
      this.invoiceService.getInvoiceById(this.invoiceId).subscribe({
        next: (data) => {
          if (!data) {
            this.snackBar.open("Invoice not found", "OK");
            return;
          }
          console.log(data);
          // Populate the form with existing data
          this.invoiceForm.patchValue({
            invoiceID: data.invoiceID,
            companyID: data.companyID,
            machineID: data.machineID,
            branchID: data.branchID,
            companyName: data.companyName,
            companyAddress: data.companyAddress,
            trn: data.trn,
            invoiceNum: data.invoiceNum,
            quotationNum: data.quotationNum,
            dateCreated: new Date(data.dateCreated),
            totalAmount: data.totalAmount,
            serviceCharges: data.serviceCharges,
            PaymentTerms: data.paymentTerms,
            disclaimer: data.disclaimer,
            notes: data.notes
          });

          // Clear existing items
          while (this.invoiceItems.length) {
            this.invoiceItems.removeAt(0);
          }

          // Add existing items
          if (data.invoiceItems && Array.isArray(data.invoiceItems)) {
            data.invoiceItems.forEach((item: any) => {
              this.invoiceItems.push(this.fb.group({
                partsID: [item.partsID],
                description: [item.description],
                skuId: [item.skuId == null ? "CUSTOM" : item.skuId],
                quantityUsed: [item.quantityUsed],
                amount: [item.amount],
                vatPercent: [item.vatPercent],
                vat: [item.vat],
                total: [item.total]
              }));
            });
          }
          
          // Update the data source
          this.dataSource = new MatTableDataSource(this.invoiceItems.controls);

          // Set selected values
          this.selectedCompany = data.companyID;
          this.selectedBranch = data.branchID;
          this.selectedMachine = data.machineID;

          // Show the form
          this.showButtons = true;
          if (!this.fontStyle) {
            this.fontStyle = 'auto'; // Default to auto if not set
          }
          this.showHideBelowDiv();
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading invoice:', error);
          this.snackBar.open('Error loading invoice data', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  viewInvoice(): void {
    if (this.invoiceForm.valid && this.invoiceItems.length > 0) {
      const dialogRef = this.dialog.open(DialogInvoiceDataPreviewComponent, {
        width: '90vw',
        height: '90vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          isPreviewOnly: true,
          invoiceData: this.invoiceForm.value
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.saved) {
          this.snackBar.open('Invoice saved and downloaded successfully', 'Close', { duration: 3000 });
          if (!this.isEditMode) {
            this.resetForm();
          }
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields and add at least one item', 'Close', { duration: 3000 });
    }
  }

  resetForm() {
    this.invoiceForm.reset({
      invoiceID: 0,
      companyID: 0,
      machineID: 0,
      branchID: 0,
      dateCreated: new Date(),
      totalAmount: 0,
      serviceCharges: 0
    });
    
    while (this.invoiceItems.length) {
      this.invoiceItems.removeAt(0);
    }
    
    this.resetNewPartForm();
    this.resetCustomItemForm();
    
    this.dataSource = new MatTableDataSource(this.invoiceItems.controls);
  }

  onCancel(): void {
    this.router.navigate(['/admin/fin/allinvoices']);
  }
}
