import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {SessionService} from "../../../service/session.service";
import {UserPasswordResetComponent} from "../group-user/user-password-reset/user-password-reset.component";
import {NotificationService} from "../../../service/notification.service";
import {NzMessageService} from "ng-zorro-antd";
import {BasicService} from "../../../service/basic.service";
import {YbTzService} from "../../../service/yb-tz.service";
import {EmployeeProfileComponent} from "../group-user/employee-profile/employee-profile.component";
import {DataMockService} from "../../../service/data-mock.service";
import {FeeService} from "../../../service/fee.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  isHidden = false;
  activeTabIndex = 0;
  tabs = [];
  resetPasswordModalVisible: any = false;
  resetPasswordModalInitialized: any = false;
  @ViewChild(UserPasswordResetComponent, {static: false}) passwordResetComponent: UserPasswordResetComponent;
  uiPermission;
  timer: any;
  notificationList: any = [];
  hasNewNotification: any = false;
  isLoading: boolean = false;
  personalProfileModalVisible: any = false;
  @ViewChild(EmployeeProfileComponent, {static: false}) employeeProfileComponent: EmployeeProfileComponent;

  constructor(private router: Router,
              private sessionService: SessionService,
              private notificationService: NotificationService,
              private message: NzMessageService,
              private basicService: BasicService,
              private ybService: YbTzService,
              private mockDataService: DataMockService,
              private feeService: FeeService,
  ) {
  }

  ngOnInit() {

    this.uiPermission = this.sessionService.getUserPermission();
    console.log(this.sessionService);
    let defaultTab = this.uiPermission.defaultTab;
    if (defaultTab)
      this.newTab(defaultTab.tabName, defaultTab.componentName);

    if (this.sessionService.getUserPermission().allowNotification) {
      this.notificationService.getMessageList().then(response => {
        this.processNotificationList(response.content);
      });
      this.timer = setInterval(() => {
        this.notificationService.getMessageList().then(response => {
          this.processNotificationList(response.content);
        });
      }, 30000)
    }
  }

  closeTab(tab: any): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    //this.activeTabIndex = 0;
  }

  newTab(tabName, componentName, pram: any = undefined, patientSignInId: any = undefined): void {
    let tab: any = undefined;
    if (patientSignInId)
      tab = this.tabs.find(t => t.patientSignInId === patientSignInId && t.tabName === tabName);
    else
      tab = this.tabs.find(t => t.tabName === tabName);

    if (tab == undefined) {
      tab = {tabName, componentName, pram, patientSignInId};
      this.tabs.push(tab);
      this.activeTabIndex = this.tabs.length - 1;
    } else {
      this.activeTabIndex = this.tabs.indexOf(tab);
    }
    // this.checkShowHidePatientSelect(tab);
    return tab;
  }


  onPrescriptionClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + "：医嘱", 'patientPrescription', patientSignIn, patientSignIn.uuid)
    //this.selectedSignIn = patientSignIn;
  }


  tabClicked(tab: any) {
    this.activeTabIndex = this.tabs.indexOf(tab);
    // this.checkShowHidePatientSelect(tab);
  }

  onPaymentClickedEvent(patientSignIn: any) {
    //console.log(patientSignIn);
    this.newTab(patientSignIn.patientName + ":缴费记录", 'paymentList', patientSignIn, patientSignIn.uuid)
    //tab["patientSignIn"] = patientSignIn;
    //this.selectedSignIn = patientSignIn;
  }

  onFeeListClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":费用清单", 'patientFeeList', patientSignIn, patientSignIn.uuid)
    //this.selectedSignIn = patientSignIn;
  }

  onAutoFeeListClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":自动计费", 'autoPatientFeeList', patientSignIn, patientSignIn.uuid)
  }

  onNursingRecordListClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":护理记录", 'nursingRecordList', patientSignIn, patientSignIn.uuid)
  }

  onTempRecordListClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":体温单", 'tempRecordList', patientSignIn, patientSignIn.uuid)
  }

  onMedicalRecordClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":病历", 'medicalRecord', patientSignIn, patientSignIn.uuid)
  }

  onFeeCheckClickedEvent(patientSignIn: any) {
    //console.log(patientSignIn);
    this.newTab(patientSignIn.patient.name + ":医嘱费用核对", 'feeCheck', patientSignIn, patientSignIn.uuid)
  }

  logOut() {
    this.sessionService.removeLoginUser();
    this.router.navigateByUrl('staff/login');
  }

  getCurrentUser() {
    if (this.sessionService.loginUser)
      return this.sessionService.loginUser.name;
    return "";
  }

  showResetPasswordModal() {
    if (!this.resetPasswordModalInitialized)
      this.resetPasswordModalInitialized = true;
    this.resetPasswordModalVisible = true;
    if (this.passwordResetComponent)
      this.passwordResetComponent.resetPasswordForm.reset();
  }

  updatePersonalProfile() {
    this.personalProfileModalVisible = true;
  }

  handleModalCancel() {
    this.resetPasswordModalVisible = false;
    this.personalProfileModalVisible = false;
  }

  resetPassword() {
    this.passwordResetComponent.resetPassword();
  }

  passwordResetComplete() {
    this.resetPasswordModalVisible = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private processNotificationList(refreshedNotificationList: any) {
    for (let refreshedNotification of refreshedNotificationList) {
      if (this.notificationList.map(n => n.key).indexOf(refreshedNotification.key) < 0) {
        this.hasNewNotification = true;
        break;
      }
    }
    this.notificationList = refreshedNotificationList;
  }

  newMessageRead() {
    this.hasNewNotification = false;
  }

  processMessage(notification: any) {
    if (notification.tabName) {
      this.newTab(notification.tabName, notification.tabComponent, notification.tabPram ? notification.tabPram : undefined);
    }
  }

  rebuildMessageList() {
    this.notificationService.rebuildMessageList().then(response => {
      this.message.create("success", "刷新成功")
    });
  }

  rebuildEntitySearchCode() {
    this.basicService.rebuildAllSearchCode()
      .subscribe(response => {
        this.message.create("success", "执行成功");
      });
  }

  // downloadCenterMedicine() {
  //   this.isLoading = true;
  //   this.ybService.getCenterMedicineList().toPromise()
  //     .then(response => {
  //       let medicineSaveList = {};
  //       medicineSaveList["medicineList"] = response.content;
  //       //medicineSaveList["medicineList"] = [];
  //       this.ybService.saveCenterMedicineList(medicineSaveList).toPromise()
  //         .then(response => {
  //           this.message.create("success", "下载完成");
  //           this.isLoading = false;
  //         })
  //         .catch(error => {
  //           this.processError(error);
  //         });
  //     })
  //     .catch(error => {
  //       this.processError(error);
  //     });
  // }

  downloadCenterMedicine() {
    this.isLoading = true;
    this.ybService.getCenterMedicineList().toPromise()
      .then(response => {
        this.message.create("success", "下载完成");
        this.isLoading = false;
      })
      .catch(error => {
        this.processError(error);
      });
  }

  processError(error: any) {
    this.message.create("error", error.error.message);
    this.isLoading = false;
  }

  // downloadCenterTreatment() {
  //   this.isLoading = true;
  //   this.ybService.getCenterTreatmentList().toPromise()
  //     .then(response => {
  //       let treatmentSaveList = {};
  //       treatmentSaveList["treatmentList"] = response.content;
  //       //medicineSaveList["medicineList"] = [];
  //       this.ybService.saveCenterTreatmentList(treatmentSaveList).toPromise()
  //         .then(response => {
  //           this.message.create("success", "下载完成");
  //           this.isLoading = false;
  //         })
  //         .catch(error => {
  //           this.processError(error);
  //         });
  //     })
  //     .catch(error => {
  //       this.processError(error);
  //     });
  // }

  downloadCenterTreatment() {
    this.isLoading = true;
    this.ybService.getCenterTreatmentList().toPromise()
      .then(response => {
        this.message.create("success", "下载完成");
        this.isLoading = false;
      })
      .catch(error => {
        this.processError(error);
      });
  }

  rebuildUploadedMedicineCache() {
    this.isLoading = true;
    this.ybService.getUploadedMedicineList().toPromise()
      .then(response => {
        this.message.create("success", "更新完成");
        this.isLoading = false;
      })
      .catch(error => {
        this.processError(error);
      });
  }

  rebuildUploadedTreatmentCache() {
    this.isLoading = true;
    this.ybService.getUploadedTreatmentList().toPromise()
      .then(response => {
        this.message.create("success", "更新完成");
        this.isLoading = false;
      })
      .catch(error => {
        this.processError(error);
      });
  }

  uploadAllTreatment() {
    this.isLoading = true;
    this.ybService.uploadALLTreatment().toPromise()
      .then(response => {
        this.message.create("success", "上传完成");
        this.isLoading = false;
      })
      .catch(error => {
        this.processError(error);
      });
  }

  //manufactureList: any = ['湖南千金湘江药业', '山东齐都', '福建省闽东力捷迅', '上海现代制药', '江苏天士力', '山东仁和堂', '东北制药集团沈阳', '匈牙利', 'ABB', '南京新百药业', '东北制药集团沈阳第一', '浙江医药', '宁夏康亚', '台湾泛生', '昆药集团', '北京嘉林', '江苏苏中药业', '瑞典费森尤斯卡比', '无锡济民可信山禾药业', '山东威高药业', '云南雷允上理想', '济川药业', '吉林省博大', '深圳致君', '浙江胡庆余堂草本', '上海新亚药业闵行', '江苏鹏鹞', '浙江万晟药业', '浙江爱诺药业', '扬子江药业集团上海海尼药业', '正大制药（青岛）有限公司', '山西晋新双鹤药业', '杭州中美华东', '浙江新光', '河南羚锐', '山西兰花', '江苏恒瑞', '浙江北生药业汉生制药', '世贸天阶制药', '阿斯利康制药', '江苏远恒药业', '国药集团容生', '新乡市华信药业', '云南生物谷药业', '宁波大红鹰药业', '安徽安科生物工程', '浙江桐君堂', '广东百科制药', '长兴制药', '广东先强药业', '瑞典阿斯利康', '陕西汉王药业', '齐鲁制药', '嵊州瑞元堂', '石药集团恩必普药业', '福元药业', '湖南亚大', '远大医药(中国)', '四川依科制药', '河北天成', '上海和黄药业', '萌帝（中国）', '意大利诺华', '贵州天安', '浙江普洛康裕', 'Salutas Pharma Gmbh', '南昌白云药业', '上海信谊九福药业', '美国礼来公司', '云南云河药业', '安徽宏业', 'VIANEX S.A', '上海海虹', '北京四环生物制药', '湖北午时', '杭州朱养心', '江苏长江', '多多药业', '波兰', '湖南湘中', '德国威玛舒培', '成都倍特药业', '湖南华纳大药厂', '上海新黄河制药', '上海信谊天平', '兴和株式会社真冈工厂', '四川美大康华康', '上海施贵宝', '国药集团广东环球', '贵州健兴', '广州南新', '正大青春宝药业', '礼来苏州制药', '上海运佳黄浦制药', '苏州东瑞制药', '浙江景岳堂药业', '山东鲁抗', '诺和诺德', '康普药业', '浙江诚意药业', '哈尔滨三联', '浙江济民制药', '杭州民泰中药', '法国', '山西津华晖星', '深圳太太', '北京康远制药', '上海新亚药业高邮', '华北制药河北华民药业', '晋城海斯', '浙江国光生物制药', '仲景宛西制药', '上海上药中西制药', '浙江华海药业', '成都奥邦药业', '贵州远程制药', '贵州拜特制药', '北京红林', '卫材（中国）药业', '海正辉瑞', '河南润弘', '浙江省嵊州市医药药材', '武汉人福药业', '杭州民泰（毫州）', '河南辅仁怀庆堂制药', '北京万生药业', '裕松源药业', '河南太龙药业', '福安药业宁波天衡', '杭州华东中药饮片', '宁波立华', '上海朝晖药业', '奥地利', '上海衡山药业', '康臣药业', '石药集团欧意', '天津金耀', '意大利凯西', '澳美制药厂', '日本米雅', '海南赛立克药业', '齐鲁贝特', '贵州威门药业', '四川健能', '芬兰', '法国博福', '河南中杰药业', '纽迪希亚制药（无锡）', '美国 Baxalta US inc.', '中国大冢', '内蒙古蒙药', '常州制药厂', '健民药业', '湖北科伦药业', '丹麦', '正大天晴', '上海信谊', '南京正大', '杭州益品', '浙江莎普爱思药业', '浙江海正', '汕头市美宝', '吉林市鹿王制药', '云南龙海', '马应龙', '拜耳医药', '辅仁药业', '旭华成制药株式会社', '安斯泰来制药（中国）', '深圳中联', '亳州成源中药饮片', '大连美中药厂', '舒泰神生物制药', '常州千红生化', '华润三九（雅安）', '河北神威药业', '佛山双鹤', '浙江尖峰健康科技', '上海上药第一生化', '福建广生堂药业', '上海勃林格', '苏州爱美津', '意大利阿尔法韦土曼制药', '常州兰陵', '杭州胡庆余堂', '南京白敬宇', '西南药业', '云南大唐汉方', '浙江天瑞药业', '金花企业', '杭州九源基因工程', '国药集团', '南京正科医药', '浙江佐力', '上海通用药业', '安徽双鹤药业', '亚宝药业太原', '浙江仙琚', '江西南昌济生', '安徽安科', '江苏平光制药', 'URSAPHARM', '安徽丰原药业', '北京九和药业', '华润双鹤药业', '住友制药', '芜湖康奇制药', '黑龙江福和华星制药', '江西药都', '浙江京新药业', '青岛黄海制药', '上海现代哈森（商丘）药业', '上海旭东海普药业', '四川科伦药业', '江苏豪森药业', '无锡凯夫', '辉瑞制药', '上海现代哈森(商丘)药业', '上海百特医疗用品', '吉林四长制药', '赛诺菲(北京）制药', '中美天津史克制药', '内蒙古兰太药业', '鲁南贝特制药', '桂林三金', '黑龙江葵花药业', '杭州澳医保灵药业', '西安杨森', '通化茂祥制药', '广州白云山天心制药', '浙江奥托康制药', '北京中新药业', '四川辅正药业', '江苏四环', '印度瑞迪', '上海罗氏制药', '浙江国新中药饮片', '德国格兰泰', '山东罗欣', '广州迈特兴华制药', '桂林南药', '浙江亚峰', '江苏黄河', '惠氏制药', '重庆华邦制药', '重庆多普泰制药', '海口奇力制药', '台州仁民中药', '黑龙江济仁药业', '海南林恒', '默克制药', '南京南大', '扬子江药业', 'RF', '海南灵康', '重庆泰平药业', '河南润弘制药', '江苏九旭', '丽珠集团丽珠制药', '天津同仁堂', '安徽恒星', '胡庆余堂', '江苏恩华药业', '马应龙药业', '扬州中宝', '江苏吉贝尔药业', '四川科伦', '广州百特医疗', '亚邦医药', '江苏万邦生化医药', '韩国', '国药集团国瑞药业', '广州白云山', '重庆药友制药', '辰欣药业', '京都念慈菴', '杭州振德中药饮片', '西藏奇正', '湖北科益药业', '安徽沪春堂中药饮片', '湖北康源', '北京益民药业', '广东天普', '深圳信立泰药业', '德国礼达', '杭州桐君堂医药药材', '杭州天目山药业', '广州白云山明兴制药', '瑞阳制药', '葛兰素史克', '无锡正达药业', '浙江得恩德制药', '南京易亨制药', '拜耳广州', '天津华津制药', '勃林格殷格翰', '葛兰素史克(天津)', '北京华素制药', '江苏德源药业', '重庆科瑞制药', '北京泰德', '华润赛科药业', '杭州华东新五丰药业', '珠海联邦中山分公司', '赛诺菲（杭州）制药', '天津生物化学制药', '美国杰特贝林', '山东步长制药', '常州四药制药', '杭州民生', '法国利博福尼制药公司', '广东世信药业有限公司', '深圳万和', '浙江钱王中药', '亚宝药业集团', '浙江德凡中药', '北京北陆', '美国 Kremers Urban', '江苏亚邦', '昆明积大制药', '四川百胜药业', '杭州康恩贝', '锦州奥鸿', '山东华鲁制药', '陕西步长', '常熟星海', '意大利BMS', '阿斯利康', '本溪恒康', '山西国润制药有限公司', '北京赛升药业', '河南福森药业', '浙江三溪堂中药', '昆山龙灯瑞迪', '日本参天制药', '北京同仁堂', '湖北东信', '浙江天冉中药饮片有限公司', '绍兴震元中药饮片', '纽迪希亚制药(无锡)', '湖南科伦制药', '法国施维雅', '台州南峰药业', '宁波药材股份有限公司', '江苏美通制药', '长春天诚', '华瑞制药', '四川绿叶制药', '海南皇隆', '陕西东泰制药', '云南白药集团', '山东达因海洋生物', '陕西郝其军制药', '衢州南孔中药', '石家庄以岭药业', '成都地奥九泓', '吉林省跨海生化药业', '成都迪康', '乐普药业', '苏州中化', '上海上药新亚药业', '天津武田药品', '广东罗浮山', '苏州长征', '华中药业', '华润三九医药', '安徽鸿坤药业有限公司', '亳州市永刚饮片厂', '浙江尖峰药业', '浙江乐普药业', '重庆莱美', '安徽百岁堂', '扬州市三药制药', '通化东宝药业', '沈阳东新', '中美上海施贵宝制药', '湖北远大天天明制药', '天方药业', '江西施美药业', '广东人人康药业', '北京协和药厂', '内蒙古康恩贝药业', '北京诺华', '安徽尚德', '华北制药', '山东方明', '昆山培力', '海口市制药厂', '辉凌国际制药(瑞士)', '蓬莱诺康药业', '北京四环', '杭州默沙东', '中山恒生药业', '华润双鹤利民', '美时化学制药', '桂林华信制药', '贵州百灵正鑫药业', '上海黄海', '天津中新药业', '南京先声东元制药', '浙江一新制药', '昆明贝克诺顿', '哈药集团制药总厂', '上海禾丰制药', '施维雅(天津)制药', '博福-益普生(天津)制药', '天津太平洋制药', '海南斯达', '江苏正大丰海', '赛诺菲(杭州)制药', '天津天大领先制药', '北京北大维信生物科技', '重庆康刻尔', '海南赞邦制药', '青岛双鲸药业', '石家庄四药', '广东雷允上药业', '广东南国', '重庆圣华曦', '优时比制药', '湖南洞庭药业', '沈阳奥吉娜药业', '浙江康恩贝制药', '北京百奥药业', '江中药业', '比利时辉瑞', '湖北天圣药业', 'Takeda', '山东绿叶', '天津华津', '回音必东亚', '国药控股台州中药', '山西云鹏', '浙江亚太药业', '荷兰', '德国拜耳', '北京双鹭药业', '上海信谊金朱药业', '天津力生', '浙江国镜药业', '卫材(中国)药业', '湖南五洲通药业', '悦康药业', '第一三共制药(上海)', '广东恒健', '浙江康吉尔', '第一三共制药（上海）', '亳州蜀中药业有限公司', '乐普恒久远', '广东星昊药业', '浙江英特中药饮片', '内蒙古京新药业', '德国', '贵州益康制药', '遂成药业', '施维雅（天津）制药', '江苏联环', '沈阳红旗', '辽宁丹生', '上海复旦', '施慧达药业', '北京费森尤斯卡比', '宜昌人福药业', '海南海灵', '深圳立健', '安徽贝克', '赛诺菲制药', '国药集团汕头金石', '毫州市永刚饮片厂', '澳大利亚', '瑞士', '上海第一生化药业', '杭州桐阁堂', '上海强生', '安徽华鼎堂中药饮片', '浙江震元绍兴中药饮片', '扬子江药业集团江苏制药', '北京双吉', '哈药集团生物工程', '浙江维康药业', '浙江迪耳药业', '常州康普药业', '浙江瑞新药业', '云南维和药业', '天津金耀集团湖北天药', '上海上药信谊', '西安利君制药', '西安力邦'];

  //manufactureList: any = ['阿斯利康制药','广州白云山明兴制药','杭州澳医保灵药业','青岛黄海制药','陕西郝其军制药','浙江华海药业'];
  //manufactureList: any = ['扬州国康','江苏华东','华芹','山东名德','河北','台州路桥小商品','马来西亚','史密斯','江西华利','好媚','杭州启晨','苏州昌乐','宁波华欣','佛山南海','河南忠厚','扬州鑫康','美国BD','名德','安吉宏德','扬州新星','上医康鸽','扬州洋生','江西丰临','台州康健','江西洪达','扬州美林','扬州亚欧','浙江','台湾','无','京环','3M公司','成武','康利莱','泰州','山东威高','上海科邦','莱斯特','新乡华西','扬州松田','广州维力','浙江苏嘉','河南亚太','景迪','浙江优特格','绍兴福清','江西百医卫仕医疗科技有限公司','杭州艾康','上海联辉','苏州伟康','北京史密斯','北京华联','美国3M','浙江京环','威海洁瑞','广东百合','河南曙光健士','晓康','德州安捷','南昌市恒康医疗器械有限公司','慈溪高旷','扬州宇润','扬州霞光','浙江简成医疗科技有限公司','扬州平安','鱼跃','富利凯','浙江玉升','得尔康','安吉','扬州佳运','杭州萧山奥得舒医疗器械有限公司','华祥','余姚','上海金钟','南昌康华','上海','绍兴东利','河南健琪','华飞','复尔凯','南昌康洁','扬州华泰','亚申','艾科','杭州朗索','桂林优利特','河南中原','瑞科','世纪顺达','环宇','扬州亚申科技有限公司','江苏长城','江苏康捷','艾贝尔','江苏通达','北京灵泽','扬州唐荣','南京宁创','奉化康家乐','山东利尔康','衡水','苏州施莱','如皋贝康','齐康','澳翔','台州金清','江苏泰州','江苏华泰','美林','惠州斯莱达','海门光明','山东海诺','广东事达','金华','飘安','杭州京冷','北京','华威','上海全安','上海曹阳明月','金世康','扬州兴业','余姚登月','台州健乐','扬州源康','海门扬子','潮安','江苏瑞京','扬州龙虎','江苏产','潮安彩塘','事达','扬州华星','佰通','台州恒泰','上虞韩韩','山东威海','广东湛江','江苏康久','扬州亚申','河南华裕','华冠','江苏荣业科技','宝应县亿康卫生用品厂','康裕','常州回春','诺和','华东','山东','扬州华芹','巴德','浙江灵洋','苏州碧迪医疗器械有限公司','鑫乐','3M','振新','广州艾贝尔','曹县华鲁','扬州','泰州精卫','上海钧康','绍兴振德','康力宝','绍兴宏德','杭州山友','驼人'];
  manufactureList: any = ['环宇', '扬州亚申'];

  //初始药品制造商数据添加

  initializeManufacture(manufactureType: any) {
    // for (let manufactureName of this.manufactureList) {
    //   let manufacture = {mc: manufactureName};
    //   //console.log(manufacture);
    //   this.saveNewManufacture(manufacture, manufactureType);
    // }
    this.isLoading = true;
    this.ybService.initializeManufacture(manufactureType).toPromise()
      .then(response => {
        this.isLoading = false;
        this.message.create("success", "上传完成");
      })
      .catch(error => {
        this.processError(error);
      });

  }


  uploadMedicine(inventoryType: any) {
    this.isLoading = true;
    this.ybService.uploadAllInventory(inventoryType).toPromise()
      .then(response => {
        this.message.create("success", "上传完成");
        this.isLoading = false;
      })
      .catch(error => {
        this.processError(error);
      });
  }

  matchEntity(entityType: string) {
    this.isLoading = true;
    this.ybService.matchEntity(entityType).toPromise()
      .then(response => {
        this.message.create("success", "匹配完成，检查匹配错误项目");
        this.isLoading = false;
      })
      .catch(error => {
        this.processError(error);
      });
  }

  uploadAllPendingFee() {
    this.isLoading = true;
    this.ybService.uploadAllPendingFee().toPromise()
      .then(response => {
        this.isLoading = false;

        this.message.create("success", "费用上传完毕");
      })
      .catch(error => {
        this.processError(error);
      })
  }


  mockMedicineOrder() {
    this.mockDataService.mockMedicineOrder().toPromise()
      .then(response => {

      });
  }

  mockItemOrder() {
    this.mockDataService.mockItemOrder().toPromise()
      .then(response => {

      });
  }


  patientChanged(tab: any, patientSignIn: any, componentName: any) {
    tab.tabName = patientSignIn.patient.name + ":" + componentName;
  }

  onInternalChargeAutoFeeListClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":非医疗自动计费设置", 'internalChargeAutoFeeList', patientSignIn, patientSignIn.uuid)
  }

  onInternalChargePaymentListClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":非医疗缴费清单", 'internalChargePaymentList', patientSignIn, patientSignIn.uuid)
  }

  onInternalChargeFeeListClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":非医疗费用清单", 'internalChargeFeeList', patientSignIn, patientSignIn.uuid)
  }

  onCenterFeeValidationClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":医保对账", 'centerFeeValidation', patientSignIn, patientSignIn.uuid)
  }

  initializeWarehouse() {
    this.isLoading = true;
    this.ybService.initializeWarehouse().toPromise()
      .then(response => {
        this.isLoading = false;
        this.message.create("success", "初始化完成");
      })
      .catch(error => {
        this.processError(error);
      })
  }

  uploadPrescriptionOrder() {
    this.isLoading = true;
    this.ybService.uploadPrescriptionOrder().toPromise()
      .then(response => {
        this.isLoading = false;
        this.message.create("success", "上传文成");
      })
      .catch(error => {
        this.processError(error);
      })
  }

  removeMessage(data: any) {
    let messageToDelete = {key: data.key}
    this.basicService.removeMessage(messageToDelete).toPromise()
      .then(response => {
        this.notificationList = this.notificationList.filter(n => n.key !== data.key);

      })
  }

  onSettlementClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":出院结算", 'settlement', patientSignIn, patientSignIn.uuid)
  }

  onDrgRecordClickedEvent(patientSignIn: any) {
    this.newTab(patientSignIn.patient.name + ":DRG信息", 'drgRecord', patientSignIn, patientSignIn.uuid)
  }

  nightlyJobManualRun() {
    this.feeService.nightlyJobManualRun().toPromise()
      .then(response => {
        this.message.create("success", "执行完成");
      })
  }
}
