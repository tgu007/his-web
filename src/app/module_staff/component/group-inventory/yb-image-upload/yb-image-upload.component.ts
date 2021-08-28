import {Component, Input, OnInit} from '@angular/core';
import {UploadXHRArgs} from "ng-zorro-antd/upload/interface";
import {Observable, Subject, Subscription} from "rxjs";
import {createElementCssSelector} from "@angular/compiler";
import {YbTzService} from "../../../../service/yb-tz.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-yb-image-upload',
  templateUrl: './yb-image-upload.component.html',
  styleUrls: ['./yb-image-upload.component.css']
})
export class YbImageUploadComponent implements OnInit {
  fileList: any = [];
  prevImgSource: string;
  imageUploading: any = false;
  @Input() order: any;
  @Input() isReturn: any = false;
  downloadedImgSource: any;
  downloading: any = false;

  constructor( private ybService: YbTzService,
               private message: NzMessageService,
               ) {
  }

  ngOnInit() {
  }

  uploadImage() {
    let name = '入库照片'
    if(this.isReturn)
      name = '出库照片'
    let uploadReq = {};
    uploadReq["ywdh"] = this.order.yborderId;
    uploadReq["cywdh"] = this.order.uuid;
    uploadReq["yxlx"] = '照片';
    uploadReq["yxmc"] = name;
    uploadReq["yxnr"] = this.prevImgSource;

    this.imageUploading = true;
    this.ybService.uploadMedia(uploadReq).toPromise()
      .then(response => {
        this.imageUploading = false;
        this.message.create("success", "上传成功");
      })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.imageUploading = false;
      });
  }


  handleUpload = (item: UploadXHRArgs): Subscription => {
    const subject = new Subject();
    this.read(item.file).subscribe(res => {
      this.prevImgSource = res;
      subject.next();
      subject.complete();
    });
    return subject.subscribe(res => {
      item.onSuccess({}, item.file, event);
    });
  }

  handleRemove = (file: any) => {
    this.prevImgSource = undefined;
    return true;
  }

  read(file: any): Observable<string> {
    return Observable.create(observer => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // reader.result 为读取成功的base64编码的字符串。
        observer.next(reader.result);
        observer.complete();
      };
    });
  }

  downloadUploadedImage() {
    let downloadReq = {}
    downloadReq["ywdh"] = this.order.yborderId;
    downloadReq["yxbh"] = this.order.ybImageId;

    this.downloading = true
    this.ybService.downloadMedia(downloadReq).toPromise()
      .then(response => {
        this.downloading = false;
        this.downloadedImgSource = response.content.yxnr;
      })
      .catch(error => {
        this.message.create("error", error.error.message);
        this.downloading = false;
      });
  }
}
