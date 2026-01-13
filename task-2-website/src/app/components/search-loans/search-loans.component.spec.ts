import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLoansComponent } from './search-loans.component';

describe('SearchLoansComponent', () => {
  let component: SearchLoansComponent;
  let fixture: ComponentFixture<SearchLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchLoansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
