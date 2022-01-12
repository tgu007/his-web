import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-center-medicine-chinese',
  templateUrl: './center-medicine-chinese.component.html',
  styleUrls: ['./center-medicine-chinese.component.css']
})
export class CenterMedicineChineseComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
