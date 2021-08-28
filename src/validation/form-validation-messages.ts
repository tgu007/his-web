import {Validators} from "@angular/forms";

const passwordMessage = {
  'required': '请输入密码',
  'minlength': '密码太短'
};


export const validationMessages = {
  'formPatientDetail': {
    'txtName': {
      'required': '请输入病人姓名'
    },
    'selectGender': {
      'required': '请选择性别'
    },
    'dateBirthday': {
      'required': '请输入病人出生日期'
    },
    'selectEthnic': {
      'required': '请选择民族'
    },
    'selectMarriageStatus': {
      'required': '请选择婚姻状况'
    },
    'selectOccupation': {
      'required': '请选择职业'
    },
    'txtIdNumber': {
      'required': '请输入证件号码'
    },
    'selectIdType': {
      'required': '请选择证件类型'
    },
    'txtDomicile': {
      'required': '请选择籍贯'
    },
    'txtAddressResidential': {
      'required': '请输入家庭地址'
    },
  },
  'formPatientContacts': {
    'txtContactName': {
      'required': '请输入联系人姓名'
    },
    'txtContactRelationship': {
      'required': '请输入联系人关系'
    },
    'txtContactPhoneNumber': {
      'required': '请输入联系人电话'
    },
  },
  'formMedicinePrescription': {
    'txtMedicine': {
      'required': '药品名称不能为空。',
    },
    'selectFrequency': {
      'required': '频次不能为空。',
    },
    'txtQuantity': {
      'required': '数量不能为空。',
    },
  },
  'formTreatmentPrescription': {
    'txtTreatment': {
      'required': '诊疗名称不能为空。',
    },
    'selectFrequency': {
      'required': '频次不能为空。',
    },
    'txtQuantity': {
      'required': '数量不能为空。',
    },
  },

  'formTextPrescription': {
    'txtText': {
      'required': '描述不能为空。',
    },
    'selectFrequency': {
      'required': '频次不能为空。',
    },
    'txtQuantity': {
      'required': '数量不能为空。',
    },
  }
};
