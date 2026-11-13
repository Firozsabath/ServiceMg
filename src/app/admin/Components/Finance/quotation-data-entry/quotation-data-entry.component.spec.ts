import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationDataEntryComponent } from './quotation-data-entry.component';

describe('QuotationDataEntryComponent', () => {
  let component: QuotationDataEntryComponent;
  let fixture: ComponentFixture<QuotationDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
