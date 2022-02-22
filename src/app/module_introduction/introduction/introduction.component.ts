import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  frontPanelActive: any = false;
  backPanelActive: any = false;
  dbPanelActive: any = false;
  mainPanelActive: any = true;

  constructor() {
  }

  ngOnInit() {
  }

  dbPanelClicked() {
    this.mainPanelActive = this.dbPanelActive
    this.dbPanelActive = !this.dbPanelActive
  }

  backPanelClicked() {
    this.mainPanelActive = this.dbPanelActive
    this.backPanelActive = !this.backPanelActive
  }

  frontPanelClicked() {
    this.mainPanelActive = this.dbPanelActive
    this.frontPanelActive = !this.frontPanelActive
  }
}
