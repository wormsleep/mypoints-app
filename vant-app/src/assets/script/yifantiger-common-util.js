import axios from "axios";
import qs from 'qs'
import moment from "moment";
import JSEncrypt from "jsencrypt";


/**
 *
 * @param v any
 * @param options
 * {
 *   allowEmptyString: false, // 允许空字符串（默认值：false）
 *   allowEmptyArray: false, // 允许空数组（默认值：false）
 *   allowEmptyObject: false // 允许无可枚举值的对象（默认值：false）
 * }
 * @returns {boolean}
 */
const isEmpty = (v, options) => {
  if (v == null) return true
  if (typeof v === 'undefined') return true
  if (typeof v === 'boolean') return false
  if (typeof v === 'number') return false
  if (typeof v === 'function') return false

  options = Object.assign({}, {
    allowEmptyString: false,
    allowEmptyArray: false,
    allowEmptyObject: false
  }, options || {})

  if (typeof v === 'string') {
    if (v.trim().length < 1) {
      return options.allowEmptyString ? false : true
    } else {
      return false
    }
  } else if (Array.isArray(v)) {
    if (v.length < 1) {
      return options.allowEmptyArray ? false : true
    } else {
      return false
    }
  } else if (typeof v === 'object' && v.constructor.name === 'Object') {
    let enumableKeysLength = Object.keys(v).length
    if (enumableKeysLength < 1 || JSON.stringify(v) === '{}') {
      return options.allowEmptyObject ? false : true
    } else {
      return false
    }
  } else {
    return (v) ? false : true
  }
}

const isNotEmpty = (v, options) => !isEmpty(v, options)

/**
 * 获取带参数的URL
 * @param url
 * @param params
 * @returns {*}
 */
const getUrlWithParams = (url, params) => {
  if (isEmpty(url)) return undefined

  params = params || {}

  if (params) {
    for (var p in params) {
      if (url.indexOf("?") > 0) {
        url += "&" + p + "=" + (typeof params[p] == 'object' ? JSON.stringify(params[p]) : params[p])
      } else {
        url += "?" + p + "=" + (typeof params[p] == 'object' ? JSON.stringify(params[p]) : params[p])
      }
    }
  }

  return encodeURI(url)
}

/* 本地数据存储 */
const LocalStorageUtil = {};

/**
 * 本地数据存储。不支持 Function 存储
 * @param key
 * @param data
 */
LocalStorageUtil.setItem = function (key, data) {
  if (isNotEmpty(data) && typeof data !== 'function') {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
    }
  }
}

/**
 * 本地数据获取。支持默认数值
 * @param key
 * @param defaultData
 * @returns {undefined}
 */
LocalStorageUtil.getItem = function (key, defaultData) {
  var data;

  try {
    data = JSON.parse(window.localStorage.getItem(key));
  } catch (e) {
  }

  return isEmpty(data)
    ? isEmpty(defaultData) ? undefined : defaultData
    : data;
}

/* 本地数据存储 - SessionStorage */
const SessionStorageUtil = {};

/**
 * 本地数据存储。不支持 Function 存储
 * @param key
 * @param data
 */
SessionStorageUtil.setItem = function (key, data) {
  if (isNotEmpty(data) && typeof data !== 'function') {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
    }
  }
}

/**
 * 本地数据获取。支持默认数值
 * @param key
 * @param defaultData
 * @returns {undefined}
 */
SessionStorageUtil.getItem = function (key, defaultData) {
  var data;

  try {
    data = JSON.parse(window.sessionStorage.getItem(key));
  } catch (e) {
  }

  return isEmpty(data)
    ? isEmpty(defaultData) ? undefined : defaultData
    : data;
};

//*** token 对象 ***
const setToken = (token) => {
  // SessionStorage 正式环境使用
  SessionStorageUtil.setItem("_token", token);
  // 压力测试需要临时改为 LocalStorage
  // LocalStorageUtil.setItem("_token", token);
};

const getToken = () => {
  // SessionStorage 正式环境使用
  return SessionStorageUtil.getItem("_token");
  // 压力测试需要临时改为 LocalStorage
  // return LocalStorageUtil.getItem("_token");
};

//*** Context 对象 ***
const setContext = (context) => {
  // SessionStorage 正式环境使用
  SessionStorageUtil.setItem("_cntx", context);
  // 压力测试需要临时改为 LocalStorage
  // LocalStorageUtil.setItem("_cntx", context);
};

const getContext = () => {
  // SessionStorage 正式环境使用
  return SessionStorageUtil.getItem("_cntx");
  // 压力测试需要临时改为 LocalStorage
  // return LocalStorageUtil.getItem("_cntx");
};

//*** Version 对象 ***
const setVersion = (version) => {
  LocalStorageUtil.setItem("_ver", version);
};

const getVersion = () => {
  return LocalStorageUtil.getItem("_ver");
};

/* ajax service */
const service = axios.create({
  baseURL: process.env.VUE_APP_URL + (process.env.NODE_ENV === 'development' ? '/api' : ''),
  timeout: 10 * 1000
})

const AXIOS_DEFAULT_CONFIGURATION = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
  }
}

const AXIOS_TOKEN_NAME = 'ItbysToken'

service.interceptors.request.use(config => {
  config = config || {}

  if (isEmpty(config.headers)) {
    config.headers = AXIOS_DEFAULT_CONFIGURATION.headers
  } else {
    config.headers = Object.assign({}, AXIOS_DEFAULT_CONFIGURATION.headers, config.headers)
  }

  // 针对 POST 中的 'Content-Type': 'application/x-www-form-urlencoded;charset=utf8' 对应处理
  if (/post/i.test(config.method) &&
    /^application\/x-www-form-urlencoded/i.test(config.headers['Content-Type'])) {
    config.data = qs.stringify(config.data)
  }

  let m = 'service.interceptors.request' + JSON.stringify(config)
  console.log(m)

  return config;
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(response => {
  try {
    if (response['config']
      && response.config['responseParser']
      && typeof response.config['responseParser'] === 'function') {
      return response.config.responseParser(response)
    } else {
      return response
    }
  } catch (e) {
    return Promise.reject(e)
  }
}, error => {
  return Promise.reject(error)
})

const $post = (url, data, config) => {
  config = config || {}

  config.headers = Object.assign({}, config.headers)
  config.headers[AXIOS_TOKEN_NAME] = getToken()

  return new Promise((resolve, reject) => {

    service(Object.assign({}, {
      url: url,
      method: 'POST',
      data: data
    }, config))
      .then((resp) => {
        resolve(resp.data)
      })
      .catch((error) => {
        let erd = error.response.data

        let errorMessage = erd.message || '服务器处理异常'
        let errorCode = erd.code || '9999'

        reject({
          em: errorMessage,
          ec: errorCode
        })
      })

  })
}

/* crypto 工具集 */
const CryptoUtil = {}

CryptoUtil.rsa = {}
CryptoUtil.rsa.encrypt = (publicKey, plaintext) => {
  var jsEncrypt = new JSEncrypt();

  jsEncrypt.setPublicKey(publicKey);

  return jsEncrypt.encrypt(plaintext);
}

CryptoUtil.rsa.decrypt = (privateKey, cliphertext) => {
  var jsEncrypt = new JSEncrypt();

  jsEncrypt.setPrivateKey(privateKey);

  return jsEncrypt.decrypt(cliphertext);
}


/* number 工具集 */
const NumberUtil = {}

/**
 * @description 格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认0位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号 默认为,
 */
NumberUtil.formatMoney = (number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  let n = !isFinite(+number) ? 0 : +number
  let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
  let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
  let s = ''
  let toFixedFix = function (n, prec) {
    let k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  let re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}

/* date 工具集 */
const DateUtil = {}

/**
 * 是否为有效日期
 * @param date 待检验的日期
 * @return Boolean
 */
DateUtil.isValid = (date) => {

  try {
    return moment(date).isValid()
  } catch (e) {
    return false
  }

}

/**
 * 日期格式化
 * @param date
 * @param format
 * @returns {*}
 */
DateUtil.format = (date, format) => {
  format = isEmpty(format) ? 'YYYY-MM-DD' : format

  if (DateUtil.isValid(date)) {
    return moment(date).format(format)
  } else {
    return date
  }
}

DateUtil.getTimestamp = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

// *** 版本升级 ***
/**
 * 是否需要升级
 * @param nativeVersion
 * @param remoteVersion
 * @returns {boolean}
 */
const appNeedForUpdate = (nativeVersion, remoteVersion) => {
  // let m = '版本比较 - 内部版本号：' + nativeVersion + ' - 更新版本号：' + remoteVersion
  // console.log(m)

  if (isEmpty(nativeVersion) || isEmpty(remoteVersion)) return false

  let nvs = nativeVersion.split(".")
  let rvs = remoteVersion.split(".")

  // 强校验版本格式一致性
  if (nvs.length !== rvs.length) return false

  try {
    let srv, snv
    for (var i = 0; i < Math.min(nvs.length, rvs.length); i++) {

      srv = parseInt(rvs[i])
      snv = parseInt(nvs[i])

      // console.log('版本比较顺序位：',i,'更新版本位：',parseInt(rvs[i]),'内部版本位：',parseInt(nvs[i]),'比较结果：',srv > snv)

      if (srv > snv) {
        return true
      } else if (srv < snv) {
        return false
      }
    }
  } catch (e) {
    return false
  }

  return false
}

const getAppNativeVersion = () => {
  return new Promise((resolve, reject) => {
    cordova.getAppVersion
      .getVersionNumber()
      .then((version) => {
        // let m = 'APP 内部版本号：' + version
        // console.log(m)
        resolve(version)
      })
      .catch((error) => {
        // console.log('获取 APP 内部版本号失败！')
        reject()
      })
  })
}

// *** device information need plugin ***
const mydevice = {}

mydevice.model = () => {
  try {
    return JSON.stringify(device.model)
  } catch (e) {
    return JSON.stringify("")
  }
}

mydevice.platform = () => {
  try {
    return JSON.stringify(device.platform)
  } catch (e) {
    return JSON.stringify("")
  }
}

mydevice.uuid = () => {
  try {
    return JSON.stringify(device.uuid)
  } catch (e) {
    return JSON.stringify("")
  }
}

mydevice.version = () => {
  try {
    return JSON.stringify(device.version)
  } catch (e) {
    return JSON.stringify("")
  }
}

mydevice.manufacturer = () => {
  try {
    return JSON.stringify(device.manufacturer)
  } catch (e) {
    return JSON.stringify("")
  }
}

mydevice.isVirtual = () => {
  try {
    return JSON.stringify(device.isVirtual)
  } catch (e) {
    return JSON.stringify("")
  }
}

mydevice.serial = () => {
  try {
    return JSON.stringify(device.serial)
  } catch (e) {
    return JSON.stringify("")
  }
}

mydevice.info = () => {
  return {
    model: mydevice.model(),
    platform: mydevice.platform(),
    uuid: mydevice.uuid(),
    version: mydevice.version(),
    manufacturer: mydevice.manufacturer(),
    isVirtual: mydevice.isVirtual(),
    serial: mydevice.serial()
  }
}

// *** 不启用 ***
const mymedia = {}

mymedia.getInstance = (fname) => {
  if (isEmpty(fname)) return

  let my_media

  try {
    let fileURL = cordova.file.applicationDirectory + "www/media/" + fname

    my_media = new Media(fileURL,
      function () {
        // console.log("playAudio():Audio Success");
      },
      function (err) {
        // console.log("playAudio():Audio Error: " + err);
      },
      function (status) {
        // let sms = "media status: " + JSON.stringify(status)
        // console.log(sms)
      }
    )

  } catch (e) {
    // let ems = "播放声音失败 - 错误：" + JSON.stringify(e)
    // console.log(ems)
  }

  return my_media
}

mymedia.release = (handler) => {
  try {
    if (handler) {
      handler.release()
    }
  } catch (e) {
  }
}

const myscreen = {}

myscreen.ORIENTATION_PORTRAIT = 'portrait'
myscreen.ORIENTATION_LANDSCAPE = 'landscape'

myscreen.getOrientation = () => {

  try {
    return screen.orientation.type
  } catch (e) {
    return ''
  }

}

myscreen.lock = (orientation) => {
  try {
    screen.orientation.lock(orientation)
  } catch (e) {
  }
}

myscreen.unlock = () => {
  try {
    screen.orientation.unlock()
  } catch (e) {
  }
}

export {
  isEmpty,
  isNotEmpty,
  getToken,
  setToken,
  setContext,
  getContext,
  getVersion,
  setVersion,
  getUrlWithParams,
  service as $http,
  $post,
  CryptoUtil as crypto,
  DateUtil as date,
  NumberUtil as number,
  appNeedForUpdate,
  getAppNativeVersion,
  mydevice,
  mymedia,
  myscreen
}
