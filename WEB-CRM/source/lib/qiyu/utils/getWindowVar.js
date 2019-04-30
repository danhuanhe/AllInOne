/**
 * 获取window上的变量，获取window.a.b.c的语法糖，getWindowVar('a.b.c')
 * @param {String}
 * @returns {any}
 */
export const getWindowVar = (str) => {
  if (typeof str != 'string') {
    throw new Error('param must be string');
  }
  const arr = str.split('.');
  let returned = window;
  while (arr.length) {
    let key = arr.shift();
    try {
      returned = returned[key];
    } catch (e) {
      // 出错时忽略
    }
  }
  return returned;
};


//所有需要通过window.setting内的值进行简单记算来判断权限是否存在的逻辑放到这里统一处理

/**
 * 是否开启了客户标签
 *
 */
const isOpenCrmTags = () => {
  if (getWindowVar('setting.base.corpPermission.VISITOR_TAGS')) {

    const systemFieldConfig = getWindowVar('setting.base.crmSetting.systemFieldConfig');
    if (systemFieldConfig && systemFieldConfig.length) {
      return !systemFieldConfig.some(item => item.fieldId == -21 && item.status == 0);
    }

    //判断存在值为-21的系统字段，并且status为0时，才返回false,不显示标签，其它都显示。
    return true;
  }
  //如果 VISITOR_TAGS为假，不显示
  return false;
};

/**
 * 是否具备发送短信的权限
 * @param {*} isAdmin
 */
const isCanSendMsg = (isAdmin) => {

  const canSendMsg = !!getWindowVar('setting.base.corpService') &&
    getWindowVar('setting.base.corpService.shortMessageService.state') > 0 &&
    (isAdmin ? getWindowVar('setting.base.authority.ADMIN_SMS_SEND') : getWindowVar('setting.base.authority.SMS_SEND'));

  return !!canSendMsg;
};

/**
 * 判断是否具备外呼能力,用于控制是否显示快速拨号功能
 */
const isCanCall = () => {
  const canCall = !!(getWindowVar('setting.base.corpService.ipccService.state') === 1 ||
    getWindowVar('setting.base.corpService.ipccService.state') === 2)
    && getWindowVar('setting.authority.KEFU_CALL')
    && getWindowVar('setting.authority.KEFU_CALL_OUT');

  return !!canCall;
};

export default {
  get: getWindowVar,
  userId: getWindowVar('setting.base.user.id'),
  isDownloadCallcenter: getWindowVar('setting.base.corpSetting.downloadCenterEnable'),
  isOpenCrmTags: isOpenCrmTags(),
  isAdminCanSendMsg: isCanSendMsg(true),
  isKefuCanSendMsg: isCanSendMsg(),
  isCanCall: isCanCall()
};
