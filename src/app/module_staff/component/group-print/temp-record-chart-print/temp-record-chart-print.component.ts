import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {BasePrint} from "../BasePrint";
import {PrintService} from "../../../../service/print.service";
import {DatePipe} from "@angular/common";
import {SessionService} from "../../../../service/session.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-temp-record-chart-print',
  templateUrl: './temp-record-chart-print.component.html',
  styleUrls: ['./temp-record-chart-print.component.css']
})
export class TempRecordChartPrintComponent extends BasePrint implements OnInit, AfterViewChecked {

  colors = ['#FD2446', '#248EFD', '#C916F2', '#6669B1'];
  option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: 0,
      right: 26,
      bottom: 0,
      left: 93
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
        symbol: this._printService.iconBreath,
        symbolSize: 15,
      },
      {
        name: '耳温',
        type: 'line',
        yAxisIndex: 0,
        data: [],
        symbol: this._printService.iconEarTemp,
        symbolSize: 17,
      },
      {
        name: '腋温',
        type: 'line',
        yAxisIndex: 0,
        data: [],
        symbol: this._printService.iconArmpitTemp,
        symbolSize: 13,
      },
      {
        name: '肛温',
        type: 'line',
        yAxisIndex: 0,
        data: [],
        symbol: this._printService.iconRectalTemp,
        symbolSize: 17,
      },
      {
        name: '脉搏',
        type: 'line',
        yAxisIndex: 1,
        data: [],
        symbol: this._printService.iconPulse,
        symbolSize: 13,
      },
      {
        name: '心率',
        type: 'line',
        yAxisIndex: 1,
        data: [],
        symbol: this._printService.iconHeartBeat,
        symbolSize: 15,
      },
      {
        name: '呼吸',
        type: 'line',
        yAxisIndex: 2,
        data: [],
        symbol: this._printService.iconBreath,
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
            fontSize:17
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
            fontSize:17
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
  echartsInstance: any;

  constructor(printService: PrintService,
              public datePipe: DatePipe,
              public sessionService: SessionService,
              private sanitizer: DomSanitizer,
  ) {
    super(printService, sessionService);
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.canClose)
      this._printService.onTempRecordChartClose.emit();
  }

  onChartInit(ecInstance: any) {
    this.echartsInstance = ecInstance;
    this.updateChartOption();
  }

  private updateChartOption() {
    let weekDateList = [];
    if (this.printData.chartData) {
      for (let baseWeedDate of this.printData.chartData.weekDateList)
        weekDateList.push({value: [baseWeedDate]})

      this.updateChartLineValue(1, this.printData.chartData.mouthTempValueList);
      this.updateChartLineValue(2, this.printData.chartData.earTempValueList);
      this.updateChartLineValue(3, this.printData.chartData.armpitTempValueList);
      this.updateChartLineValue(4, this.printData.chartData.rectalTempValueList);
      this.updateChartLineValue(5, this.printData.chartData.pulseValueList);
      this.updateChartLineValue(6, this.printData.chartData.heartBeatValueList);
      this.updateChartLineValue(7, this.printData.chartData.breathValueList);

      let optionValueList = [];
      if (this.printData.chartData.signInDate) {
        optionValueList.push({value: [this.printData.chartData.signInDate.xAxisIndex, "74"]})
        this.option.series[8].label.normal.formatter = this.printData.chartData.signInDate.value;
      }
      this.option.series[8].data = optionValueList;

      optionValueList = [];
      if (this.printData.chartData.signOutDate) {
        optionValueList.push({value: [this.printData.chartData.signOutDate.xAxisIndex, "74"]})
        this.option.series[9].label.normal.formatter = this.printData.chartData.signOutDate.value;
      }
      this.option.series[9].data = optionValueList;

      optionValueList = [];
      if (this.printData.chartData.departmentChangedDate) {
        optionValueList.push({value: [this.printData.chartData.departmentChangedDate.xAxisIndex, "74"]})
        this.option.series[10].label.normal.formatter = this.printData.chartData.departmentChangedDate.value;
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


    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.option);
    }
  }

  onChartFinished() {
    if (this.echartsInstance) {
      window.print();
      this.canClose = true;
    }
  }

  private updateChartLineValue(index: number, valueList: any) {
    let optionValueList = [];
    for (let value of valueList)
      optionValueList.push({value: [value.xAxisIndex, value.value]})
    this.option.series[index].data = optionValueList;
  }


  getSafeAllIcon() {
    return this.sanitizer.bypassSecurityTrustUrl(this._printService.allIcon);
  }
}
