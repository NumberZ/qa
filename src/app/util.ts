const Util = {

  //日期相对时间
  fromNow(idate: Date): string {
    let result;
    const minute  = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const halfMonth = day * 15;
    const month = halfMonth * 2;
    const now = new Date().getTime();
    const diffValue = now - idate.getTime();

    const monthC = diffValue / month;
    const weekC = diffValue / (7*day);
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;
    
    if (monthC >= 1) {
      result = `${parseInt(monthC + '')}月前`
    } else if (weekC >= 1) {
      result = `${parseInt(weekC + '')}周前`
    } else if (dayC >= 1) {
      result = `${parseInt(dayC + '')}天前`
    } else if (hourC >= 1) {
      result = `${parseInt(hourC + '')}小时前`
    } else if (minC >= 1) {
      result = `${parseInt(minC + '')}分钟前`
    } else {
      result = '刚刚';
    }
    return result;
  },

  getQueryObject(url): Object {
    url = url ==  null  ? window.location.href : url;
    if (url.lastIndexOf('?') === -1) return null;
    var  search = url.substring(url.lastIndexOf( "?" ) + 1);
    var  obj = {};
    var  reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg,  function  (rs, $1, $2) {
      var  name = decodeURIComponent($1);
      var  val = decodeURIComponent($2);
      val = String(val);
      obj[name] = val;
      return  rs;
    });
    return  obj;
  }
};

export default Util;