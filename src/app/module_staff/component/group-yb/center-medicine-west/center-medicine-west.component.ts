import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-center-medicine-west',
  templateUrl: './center-medicine-west.component.html',
  styleUrls: ['./center-medicine-west.component.css']
})
export class CenterMedicineWestComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
