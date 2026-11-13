import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDataEntryComponent } from './invoice-data-entry.component';

describe('InvoiceDataEntryComponent', () => {
  let component: InvoiceDataEntryComponent;
  let fixture: ComponentFixture<InvoiceDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
