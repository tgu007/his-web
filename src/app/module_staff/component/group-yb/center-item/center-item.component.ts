import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-center-item',
  templateUrl: './center-item.component.html',
  styleUrls: ['./center-item.component.css']
})
export class CenterItemComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
