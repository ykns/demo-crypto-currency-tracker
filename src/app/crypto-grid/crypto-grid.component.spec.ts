import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CryptoCurrencyApiService } from '../services/crypto-currency-api.service';
import { CryptoGridComponent } from './crypto-grid.component';

describe('CryptoGridComponent', () => {
  let component: CryptoGridComponent;
  let fixture: ComponentFixture<CryptoGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CryptoCurrencyApiService],
      declarations: [ CryptoGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
