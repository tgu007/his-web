import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PatientService} from "../../../../service/patient.service";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-temp-record-chart',
  templateUrl: './temp-record-chart.component.html',
  styleUrls: ['./temp-record-chart.component.css']
})
export class TempRecordChartComponent implements OnInit {
  @Input() patientSignIn: any;
  @Output() newTempRecordEvent = new EventEmitter<any>();
  echartsInstance: any;
  colors = ['#FD2446', '#248EFD', '#C916F2', '#6669B1'];
  option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: 0,
      right: 26,
      bottom: 0,
      left: 102
    },
    legend: {
      bottom: 0,
      left: 'center',
      show: false,
      // data: [
      //   {name: '口温', icon: 'circle',},
      //   {name: '耳温', icon: 'rect',},
      //   {name: '腋温', icon: 'roundRect',},
      //   {name: '肛温', icon: 'triangle',},
      //   {name: '脉搏', icon: 'diamond',},
      //   {name: '心率', icon: 'pin',},
      //   //{name: '呼吸', icon: this.iconBreath,},
      // ]
    },
    xAxis: [
      {
        type: 'value',
        position: 'top',
        boundaryGap: false,
        min: 0,
        max: 3600 * 24 * 7,
        maxInterval: 3600 * 4,
        minInterval: 3600 * 4,
        splitNumber: 42,
        axisTick: {
          length: 0
        },
        axisLabel: {
          rotate: 0,//倾斜度 -90 至 90 默认为0
          textStyle: {
            fontWeight: "bold",  //加粗
            color: "#000000"   //黑色
          },
          formatter: function (value, index) {
            return undefined;
            if (value < 604800)
              return ((value / 3600) % 24) + 2
          },
          align: "left",
        },
        data: [],

      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '体温\n(℃)',
        nameLocation: 'end',
        nameGap: -40,
        min: 34,
        max: 42.6,
        maxInterval: 0.2,
        minInterval: 0.2,
        // nameRotate:0,
        nameTextStyle: {
          fontSize: 12,
          align: 'right',
          padding: 10
        },
        axisLine: {
          lineStyle: {
            color: this.colors[0]
          }
        },
        axisTick: {
          length: 0
        },
        axisLabel: {
          formatter: function (value, index) {
            if (value % 1 == 0)
              return value;
            else
              return "";

          },
          verticalAlign: 'bottom'
        },
        splitLine: {
          lineStyle: {
            color: ['black', 'red', 'red', 'red', 'red'],
          }
        }
      },

      {
        type: 'value',
        name: '脉搏',
        nameLocation: 'end',
        nameGap: -29,
        position: "left",
        offset: 50,
        min: 20,
        max: 192,
        maxInterval: 4,
        minInterval: 4,
        // nameRotate:0,
        nameTextStyle: {
          fontSize: 12,
          align: 'right',
          padding: 10
        },
        axisLine: {
          lineStyle: {
            color: this.colors[2]
          }
        },
        axisTick: {
          length: 0
        },
        axisLabel: {
          formatter: function (value, index) {
            if (value % 20 == 0)
              return value;
            else
              return "";

          },
          verticalAlign: 'bottom'
        },

      },

      {
        type: 'value',
        name: '呼\n吸',


        nameLocation: 'end',
        nameGap: -500,
        min: 10,
        max: 96,
        maxInterval: 2,
        minInterval: 2,

        nameTextStyle: {
          fontSize: 12,
          align: 'left',
          padding: 10,
        },
        axisLine: {
          lineStyle: {
            color: this.colors[1]
          }
        },
        axisTick: {
          length: 0
        },
        axisLabel: {
          formatter: function (value, index) {
            if (value % 10 == 0 && value < 41)
              return value;
            else
              return "";

          },
          verticalAlign: 'bottom'
        },
      },
    ],
    series: [
      {
        name: '',
        type: 'line',
        yAxisIndex: 0,
        data: [],
        symbol: 'circle',
        symbolSize: 12,
      },
      {
        name: '口温',
        type: 'line',
        //smooth: true,
        yAxisIndex: 0,

        data: [],
        symbol: this.printService.iconBreath,
        symbolSize: 15,
      },
      {
        name: '耳温',
        type: 'line',
        yAxisIndex: 0,
        data: [],
        symbol: this.printService.iconEarTemp,
        symbolSize: 17,
      },
      {
        name: '腋温',
        type: 'line',
        yAxisIndex: 0,
        data: [],
        symbol: this.printService.iconArmpitTemp,
        symbolSize: 13,
      },
      {
        name: '肛温',
        type: 'line',
        yAxisIndex: 0,
        data: [],
        symbol: this.printService.iconRectalTemp,
        symbolSize: 17,
      },
      {
        name: '脉搏',
        type: 'line',
        yAxisIndex: 1,
        data: [],
        symbol: this.printService.iconPulse,
        symbolSize: 13,
      },
      {
        name: '心率',
        type: 'line',
        yAxisIndex: 1,
        data: [],
        symbol: this.printService.iconHeartBeat,
        symbolSize: 15,
      },
      {
        name: '呼吸',
        type: 'line',
        yAxisIndex: 2,
        data: [],
        symbol: this.printService.iconBreath,
        symbolSize: 10,
      },

      {
        name: '入院时间',
        type: 'line',
        yAxisIndex: 2,
        data: [],
        symbol: 'circle',
        symbolSize: 1,
        label: {
          normal: {
            show: true,//是否显示
            position: 'top',//文字位置
            formatter: '出院时间',//c后面加单位
            fontWeight: 'bold',
            fontSize:17,
          }
        },
      },

      {
        name: '出院时间',
        type: 'line',
        yAxisIndex: 2,
        data: [],
        symbol: 'circle',
        symbolSize: 1,
        label: {
          normal: {
            show: true,//是否显示
            position: 'top',//文字位置
            formatter: '出院时间',//c后面加单位
            fontWeight: 'bold',
            fontSize:17,
          }
        },
      },

      {
        name: '转入时间',
        type: 'line',
        yAxisIndex: 2,
        data: [],
        symbol: 'circle',
        symbolSize: 1,
        label: {
          normal: {
            show: true,//是否显示
            position: 'top',//文字位置
            formatter: '出院时间',//c后面加单位
            fontWeight: 'bold',
            fontSize:17,
          }
        },
      },
    ]
  };
  weekList: any = [];
  selectWeek: any = 0;
  chartResponse;

  constructor(private patientService: PatientService,
              public datePipe: DatePipe,
              public sessionService: SessionService,
              public printService: PrintService,
              private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    if (this.patientSignIn)
      this.loadPatientSignInDays();
  }

  newTempRecordClicked() {
    this.newTempRecordEvent.emit();
  }

  onChartInit(ecInstance: any) {
    this.echartsInstance = ecInstance;
  }

  private updateChartOption() {
    let weekDateList = [];
    if (this.chartResponse) {
      for (let baseWeedDate of this.chartResponse.weekDateList)
        weekDateList.push({value: [baseWeedDate]})
      this.updateChartLineValue(1, this.chartResponse.mouthTempValueList);
      this.updateChartLineValue(2, this.chartResponse.earTempValueList);
      this.updateChartLineValue(3, this.chartResponse.armpitTempValueList);
      this.updateChartLineValue(4, this.chartResponse.rectalTempValueList);
      this.updateChartLineValue(5, this.chartResponse.pulseValueList);
      this.updateChartLineValue(6, this.chartResponse.heartBeatValueList);
      this.updateChartLineValue(7, this.chartResponse.breathValueList);

      let optionValueList = [];
      if (this.chartResponse.signInDate) {
        optionValueList.push({value: [this.chartResponse.signInDate.xAxisIndex, "74"]})
        this.option.series[8].label.normal.formatter = this.chartResponse.signInDate.value;
      }
      this.option.series[8].data = optionValueList;

      optionValueList = [];
      if (this.chartResponse.signOutDate) {
        optionValueList.push({value: [this.chartResponse.signOutDate.xAxisIndex, "74"]})
        this.option.series[9].label.normal.formatter = this.chartResponse.signOutDate.value;
      }
      this.option.series[9].data = optionValueList;

      optionValueList = [];
      if (this.chartResponse.departmentChangedDate) {
        optionValueList.push({value: [this.chartResponse.departmentChangedDate.xAxisIndex, "74"]})
        this.option.series[10].label.normal.formatter = this.chartResponse.departmentChangedDate.value;
      }
      this.option.series[10].data = optionValueList;

    } else {
      let i = 1;
      while (i <= 7) {
        this.updateChartLineValue(i, []);
        i++;
      }
    }
    this.option.series[0].data = weekDateList;

    // if (this.option.series[7].data.length == 2)
    //   this.option.series[8].data = [{recordedDate: "2020-12-21 12:37:49", value: "30"}]
    // console.log(this.option)


    if (this.echartsInstance)
      this.echartsInstance.setOption(this.option);
  }

  private updateChartLineValue(index: number, valueList: any) {
    let optionValueList = [];
    for (let value of valueList)
      optionValueList.push({value: [value.xAxisIndex, value.value]})
    this.option.series[index].data = optionValueList;
  }

  nextWeek() {
    if (this.selectWeek < this.weekList.length - 1) {
      this.selectWeek = this.selectWeek + 1;
      this.loadWeekTempRecord();
    }
  }

  previousWeek() {
    if (this.selectWeek > 0) {
      this.selectWeek = this.selectWeek - 1;
      this.loadWeekTempRecord();
    }
  }

  loadWeekTempRecord() {
    this.chartResponse = undefined;
    if (this.patientSignIn) {
      this.patientService.getTempRecordingListByWeek(this.patientSignIn.uuid, this.selectWeek)
        .subscribe(response => {
          if (response) {
            this.chartResponse = response.content;
            this.updateChartOption();
          }
        });
    }
  }

  loadPatientSignInDays() {
    let patientSignInWeeks = -1;
    let index = 0;
    this.weekList = [];
    this.selectWeek = 0;
    this.chartResponse = undefined;
    if (this.patientSignIn) {
      this.patientService.getPatientSignInWeeks(this.patientSignIn.uuid)
        .subscribe(response => {
          if (response) {
            patientSignInWeeks = response.content;
            for (index; index <= patientSignInWeeks; index++) {
              this.weekList.push({index: index, label: `第${index + 1}周`});
            }
            this.loadWeekTempRecord();
          }
        });
    }
  }

  reloadUi(reloadChartWeek: boolean) {
    if (reloadChartWeek)
      this.loadPatientSignInDays();
    else
      this.loadWeekTempRecord();
  }

  printClicked() {
    this.printService.onPrintClicked.emit({
      name: 'tempRecordChart',
      data: {
        selectedWeek: this.weekList.filter(w => w.index == this.selectWeek),
        patientSignIn: this.patientSignIn,
        chartData: this.chartResponse
      }
    });
  }

  getSafeAllIcon() {
    return this.sanitizer.bypassSecurityTrustUrl(this.printService.allIcon);
  }
}
