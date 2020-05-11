import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-cell',
  templateUrl: './image-cell.component.html',
  styleUrls: ['./image-cell.component.scss']
})
export class ImageCellComponent implements ICellRendererAngularComp {
  public imageUrl: Observable<string>;

  refresh(params: any): boolean {
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.imageUrl = params.value;
  }

  constructor() {
  }

}
