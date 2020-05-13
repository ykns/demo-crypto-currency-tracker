import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-select-header',
  templateUrl: './select-header.component.html',
  styleUrls: ['./select-header.component.scss']
})
export class SelectHeaderComponent implements ICellRendererAngularComp {

  constructor() { }

  public name: string;

  public items: any[];

  private onSelectedItemFn: any;

  public onChange(selectedItem: any) {
    this.onSelectedItemFn(selectedItem);
  }

  refresh(params: any): boolean {
    return true;
  }

  agInit(params): void {
    this.name = params.displayName;
    this.items = params.items;
    this.onSelectedItemFn = params.onSelectedItem;
  }
}
