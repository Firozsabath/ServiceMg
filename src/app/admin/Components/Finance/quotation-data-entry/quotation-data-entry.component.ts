import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { DialogQuotationpreviewComponent } from 'src/app/admin/dialogs/dialog-finance/dialog-quotationpreview/dialog-quotationpreview.component';
import { DialogQuotationDataPreviewComponent } from 'src/app/admin/dialogs/dialog-finance/dialog-quotation-data-preview/dialog-quotation-data-preview.component';
import { InventoryDP } from 'src/app/models/Inventory';
import { TicketsReportDropdownDTO } from 'src/app/models/PriorityLevels';
import { InventoryopService } from 'src/app/service/inventory/inventoryop.service';
import { MachinesopService } from 'src/app/service/machines/machinesop.service';
import { QuotationOpService } from 'src/app/service/Quotation/quotation-op.service';
import { ServicerequestopService } from 'src/app/service/serviceRequests/servicerequestop.service';

@Component({
  selector: 'app-quotation-data-entry',
  templateUrl: './quotation-data-entry.component.html',
  styleUrls: ['./quotation-data-entry.component.css']
})
export class QuotationDataEntryComponent implements OnInit {

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
  quotationId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ticketServices: ServicerequestopService, 
    private invService: InventoryopService,
    private quotationService: QuotationOpService, 
    private router: Router,
    private route: ActivatedRoute,
    private machineService: MachinesopService,
    private dialog: MatDialog, 
    private _snackBar: MatSnackBar, 
    private cdRef: ChangeDetectorRef
  ) { }

  quotation = this.fb.group({
    quotationID: [0],
    companyID: [0],
    machineID: [0],  
    branchID: [0],
    companyName: [''],
    companyAddress: [''],
    trn: [''],
    dateCreated: [new Date()],
    totalAmount: [0],
    validUntil: [new Date()],
    quotationNum: [''],
    serviceCharges: [null],
    PaymentTerms: [''],
    disclaimer: [''],
    notes: [''],
    quotationItems: this.fb.array([])    
  });

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.quotationId = params['id'];
        this.isEditMode = true;
        this.loadQuotationForEdit();
      }
    });

    // Initialize the autocomplete for the new part
    this.setupPartAutocomplete();
    
    // Load dropdown data
    this.ticketServices.getReportDropdowns().subscribe(
      (data: any) => {
        this.drps = data;  
        console.log(this.drps);      
        this.filteredCompanies = [...this.drps.requestCompanies];
        this.filteredBranches = [...this.drps.requestBranches];
        this.filteredMachines = [...this.drps.requestMachines];
      }
    );
    
    // Load parts inventory
    this.invService.getItems().subscribe(
      (data: any) => {
        this.partsList = data.map(p => ({
          partsID: p.partsID,
          description: p.description,
          skuID: p.skuID,
          quantityOnHand: p.quantityOnHand,
          rate: p.productCost,  // Include the rate from productCost
          displayText: `${p.description} - ${p.skuID} (${p.quantityOnHand} Pieces Left)`
        }));
      }
    );   
  }

  setupPartAutocomplete() {
    this.filteredPartsOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  get quotationItems(): FormArray {
    return this.quotation.get('quotationItems') as FormArray;
  }

  private _filter(value: string): any[] {
    if (!this.partsList) return [];
    
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.partsList.filter(option => 
      option.skuID.toLowerCase().includes(filterValue) || 
      option.description.toLowerCase().includes(filterValue)
    );
  }

  displayPart(part: any): string {
    return part ? part.displayText || part.description : '';
  }

  onSelectPart(event: any) {
    const selectedPart = event.option.value;
    this.newPart.partsID = selectedPart.partsID;
    this.newPart.description = selectedPart.description;
    this.newPart.skuID = selectedPart.skuID;
    this.newPart.amount = selectedPart.rate || 0;  // Auto-fill the rate
    this.calculateTotal();  // Calculate totals after setting the rate
  }

  calculateTotal() {
    const quantity = this.newPart.quantityUsed || 0;
    const price = this.newPart.amount || 0;
    const subtotal = quantity * price;
    const vatAmount = subtotal * (this.newPart.vatPercent / 100);
    
    this.newPart.vat = vatAmount;
    this.newPart.total = subtotal + vatAmount;
  }

  calculateCustomTotal() {
    const quantity = this.customItem.quantityUsed || 0;
    const price = this.customItem.amount || 0;
    const subtotal = quantity * price;
    const vatAmount = subtotal * (this.customItem.vatPercent / 100);
    
    this.customItem.vat = vatAmount;
    this.customItem.total = subtotal + vatAmount;
  }

  addItemToTable() {
    console.log('Adding item to table:', this.newPart);
    
    if (!this.newPart.partsID || !this.newPart.quantityUsed || !this.newPart.amount) {
      console.log('Validation failed:', { 
        partsID: this.newPart.partsID, 
        quantityUsed: this.newPart.quantityUsed, 
        amount: this.newPart.amount 
      });
      this._snackBar.open("Please fill in all required fields", "OK");
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
    
    console.log('Adding form group to quotationItems:', partGroup.value);
    this.quotationItems.push(partGroup);
    console.log('Current quotationItems length:', this.quotationItems.length);
    
    // Update the data source
    this.dataSource = new MatTableDataSource(this.quotationItems.controls);
    
    // Reset the new part form
    this.resetNewPartForm();
    
    // Update the total amount
    this.updateTotalAmount();
    
    // Force change detection
    this.cdRef.detectChanges();
    
    // Show success message
    this._snackBar.open("Item added successfully", "OK", { duration: 2000 });
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

  addCustomItemToTable() {
    console.log('Adding custom item to table:', this.customItem);
    
    if (!this.customItem.description || !this.customItem.quantityUsed || !this.customItem.amount) {
      console.log('Validation failed:', { 
        description: this.customItem.description, 
        quantityUsed: this.customItem.quantityUsed, 
        amount: this.customItem.amount 
      });
      this._snackBar.open("Please fill in all required fields for the custom item", "OK");
      return;
    }
    
    this.calculateCustomTotal();
    
    const customGroup = this.fb.group({
      partsID: [0], // Use 0 or null for custom items
      description: [this.customItem.description, Validators.required],
      skuId: [this.customItem.skuID],
      quantityUsed: [this.customItem.quantityUsed, [Validators.required, Validators.min(1)]],
      amount: [this.customItem.amount, [Validators.required, Validators.min(0)]],
      vatPercent: [this.customItem.vatPercent],
      vat: [this.customItem.vat],
      total: [this.customItem.total]
    });
    
    console.log('Adding custom form group to quotationItems:', customGroup.value);
    this.quotationItems.push(customGroup);
    console.log('Current quotationItems length:', this.quotationItems.length);
    
    // Update the data source
    this.dataSource = new MatTableDataSource(this.quotationItems.controls);
    
    // Reset the custom item form
    this.resetCustomItemForm();
    
    // Update the total amount
    this.updateTotalAmount();
    
    // Force change detection
    this.cdRef.detectChanges();
    
    // Show success message
    this._snackBar.open("Custom item added successfully", "OK", { duration: 2000 });
  }

  removeItem(index: number) {
    this.quotationItems.removeAt(index);
    // Update the data source
    this.dataSource = new MatTableDataSource(this.quotationItems.controls);
    this.updateTotalAmount();
  }

  updateTotalAmount() {
    let total = 0;
    for (let i = 0; i < this.quotationItems.length; i++) {
      const item = this.quotationItems.at(i).value;
      total += item.total;
    }
    
    // Service charges are now added as custom line items instead
    // const serviceCharges = this.quotation.get('serviceCharges')?.value || 0;
    // total += parseFloat(serviceCharges);
    
    this.quotation.patchValue({
      totalAmount: total
    });
  }

  loadQuotationForEdit() {
    if (this.quotationId) {
      // For now, we'll use the existing method but pass the quotation number
      // The backend should be able to handle both ID and quotation number
      this.quotationService.getQuotInfoByQuotID(this.quotationId).subscribe({
        next: (data) => {
          if (!data) {
            this._snackBar.open("Quotation not found", "OK");
            return;
          }
          console.log(data);
          // Populate the form with existing data
          this.quotation.patchValue({
            quotationID: data.quotID,
            companyID: data.companyID,
            machineID: data.machineID,
            branchID: data.branchID,
            companyName: data.companyName,
            companyAddress: data.companyAddress,
            trn: data.trn,
            dateCreated: new Date(data.dateCreated),
            totalAmount: data.totalAmount,
            validUntil: new Date(data.validUntil),
            quotationNum: data.quotationNum,
            serviceCharges: data.serviceCharges,
            PaymentTerms: data.paymentTerms,
            disclaimer: data.disclaimer,
            notes: data.notes
          });

          // Clear existing items
          while (this.quotationItems.length) {
            this.quotationItems.removeAt(0);
          }

          // Add existing items
          if (data.quotationItems && Array.isArray(data.quotationItems)) {
            data.quotationItems.forEach((item: any) => {
              this.quotationItems.push(this.fb.group({
                partsID: [item.partsId],
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
          this.dataSource = new MatTableDataSource(this.quotationItems.controls);

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
        },
        error: (error) => {
          this._snackBar.open("Error loading quotation", "OK");
          console.error('Error loading quotation:', error);
        }
      });
    }
  }

  saveQuotation() {
    if (this.quotation.valid && this.quotationItems.length > 0) {
      const quotationData = this.quotation.value;
      
      this.quotationService.postQuotation(quotationData).subscribe({
        next: (response) => {
          this._snackBar.open("Quotation saved successfully", "OK");
          if (!this.isEditMode) {
            this.resetForm();
          }
        },
        error: (error) => {
          this._snackBar.open("Error saving quotation", "OK");
          console.error('Error saving quotation:', error);
        }
      });
    } else {
      this._snackBar.open("Please fill in all required fields and add at least one item", "OK");
    }
  }

  viewQuot() {
    if (this.quotation.valid && this.quotationItems.length > 0) {
      // Prepare the quotation data from the form
      const quotationData = this.quotation.value;
      console.log(quotationData);
      // Store the data in the service for backup
      this.quotationService.setQuotation(quotationData);
      
      // Open the preview dialog with the form data
      const dialogRef = this.dialog.open(DialogQuotationDataPreviewComponent, {
        width: '90vw',
        height: '90vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          quotation: quotationData,
          isPreviewOnly: true // Flag to indicate this is just a preview, not saved yet
        }
      });
      
      dialogRef.afterClosed().subscribe({
        next: (result: any) => {
          if (result && result.saved) {
            // If the dialog returns that the data was saved (user clicked download)
            this._snackBar.open("Quotation saved and downloaded successfully", "OK");
            if (!this.isEditMode) {
              this.resetForm();
            }
          }
        }
      });
    } else {
      this._snackBar.open("Please fill in all required fields and add at least one item", "OK");
    }
  }

  resetForm() {
    this.quotation.reset({
      quotationID: 0,
      companyID: 0,
      machineID: 0,
      branchID: 0,
      dateCreated: new Date(),
      totalAmount: 0,
      validUntil: new Date()
    });
    
    while (this.quotationItems.length) {
      this.quotationItems.removeAt(0);
    }
    
    this.resetNewPartForm();
    this.resetCustomItemForm();
  }

  showHideBelowDiv() {
    this.showButtons = true;
    if (this.fontStyle === 'manual') {
      this.showmanualCompany = false;
      this.showAutoCompany = true;   
    }
    else if (this.fontStyle === 'auto') {
      this.showmanualCompany = true; 
      this.showAutoCompany = false;    
    }
  }

  onSelectCompany(companyID: any) {
    if (companyID.value == undefined) {
      this.ticketServices.getReportDropdowns().subscribe(
        (data: any) => {
          this.drps = data;
          this.filteredBranches = this.drps.requestBranches;
        }
      );
    } else {
      this.ticketServices.getReportDropdowns().subscribe(
        (data: any) => {
          this.drps = data;
          this.filteredBranches = this.drps.requestBranches.filter((i) => i.foreignID == companyID.value);
        }
      );
    }
  }

  onSelectBranches(branchID: any) {
    if (branchID.value == undefined) {
      this.machineService.getMachines().subscribe(
        (data: any) => {
          this.filteredMachines = data;
        }
      );
    } else {
      this.machineService.getMachines().subscribe(
        (data: any) => {
          this.filteredMachines = data.filter((p) => p.branchID == branchID.value);
        }
      );
    }
  }

  updateFilteredDrops(drpType: string, searchValue: string) {
    if (!searchValue || typeof searchValue !== 'string') {
      // If no search value, reset to original lists
      if (drpType === 'companies') {
        this.filteredCompanies = [...this.drps.requestCompanies];
      } else if (drpType === 'machines') {
        this.filteredMachines = [...this.drps.requestMachines];
      } else if (drpType === 'branches') {
        this.filteredBranches = [...this.drps.requestBranches];
      }
      return;
    }
    
    const searchTerm = searchValue.toLowerCase();
    
    if (drpType === 'companies') {
      this.filteredCompanies = this.drps.requestCompanies.filter(
        company => company.name.toLowerCase().includes(searchTerm)
      );
    } else if (drpType === 'machines') {
      this.filteredMachines = this.drps.requestMachines.filter(
        machine => machine.name.toLowerCase().includes(searchTerm)
      );
    } else if (drpType === 'branches') {
      this.filteredBranches = this.drps.requestBranches.filter(
        branch => branch.name.toLowerCase().includes(searchTerm)
      );
    }
  }
}
