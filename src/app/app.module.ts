import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { CryptoGridComponent } from './crypto-grid/crypto-grid.component';
import { CryptoCurrencyApiService } from './services/crypto-currency-api.service';
import { ImageCellComponent } from './image-cell/image-cell.component';
import { SelectHeaderComponent } from './select-header/select-header.component';

@NgModule({
  declarations: [
    AppComponent,
    CryptoGridComponent,
    ImageCellComponent,
    SelectHeaderComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [CryptoCurrencyApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
