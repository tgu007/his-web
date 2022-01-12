import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-center-disease',
  templateUrl: './center-disease.component.html',
  styleUrls: ['./center-disease.component.css']
})
export class CenterDiseaseComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
