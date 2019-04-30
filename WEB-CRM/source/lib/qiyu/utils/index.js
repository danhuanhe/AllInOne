
export * from './ajax';
export * from './number';
export * from './date';
export * from './type2type';
export * from './pySegSort';
export * from './ppfish';
export * from './edition';
export * from './iframeWrapper';
export { default as windowVar, getWindowVar } from './getWindowVar';
export * from './log';
export * from './richEditorText';
export * from './userAgent';
export * from './format';
export * from './element';
export * from './apiCrmRequest';
export * from './text.js';
export * from './session';
export {default as Polling} from './polling';

/**
 * iframe方式下载文件
 * @param {string} url   - 文件地址
 * @param {string} name  - 文件名
 */
export const downloadFile = (url, name) => {
    let nIframe = document.createElement('iframe');
    nIframe.style = 'display:none';
    document.body.appendChild(nIframe);
    setTimeout(() => {
        nIframe.src = url + '?download=' + encodeURIComponent(name);
    }, 0);
};

/**
 * 文本中的url补全为超链接
 * @param {string} str
 * @return {string}
 */
export const fillUrlOfText = (str) => {
    let regExp = new RegExp("((?:(http|https|rtsp):\\/\\/(?:(?:[a-zA-Z0-9\\$\\-\\_\\.\\+\\!\\*\\'\\(\\)\\,\\;\\?\\&\\=]|(?:\\%[a-fA-F0-9]{2})){1,64}(?:\\:(?:[a-zA-Z0-9\\$\\-\\_\\.\\+\\!\\*\\'\\(\\)\\,\\;\\?\\&\\=]|(?:\\%[a-fA-F0-9]{2})){1,25})?\\@)?)?(?:(([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9]){0,1}\\.)+[a-zA-Z]{2,63}|((25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9]))))(?:\\:\\d{1,5})?)(\\/(?:(?:[a-zA-Z0-9\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\\;\\/\\?\\:\\@\\&\\=\\#\\~\\-\\.\\+\\!\\*\\'\\(\\)\\,\\_])|(?:\\%[a-fA-F0-9]{2}))*)?(?:\\b|$)", "gi");
    return str.replace(regExp, ($1) => {
        let url = $1;
        if (url.indexOf('://')<0){
            url = 'http://'+url;
        }
        return '<a target="_blank" href="' + url + '">' + $1 + '</a>';
    });
};
