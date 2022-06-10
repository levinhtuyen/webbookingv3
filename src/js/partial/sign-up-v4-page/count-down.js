const CountDown = (() => {
  let _count = "180"; // it's 00:01:02
  let _asyncCounterInterval = null;

  String.prototype.toHHMMSS = function() {
    var sec_num = parseInt(this, 10); // don't forget the second parm
    // var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    // if (hours < 10) {
    //   hours = "0" + hours;
    // }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    // var time = hours + ':' + minutes + ':' + seconds;
    var time = minutes + ":" + seconds;
    return time;
  };

  function __timer() {
    console.log(_count);

    if (parseInt(_count) <= 0) {
      clearInterval(_asyncCounterInterval);
      _asyncCounterInterval = null;
      return;
    }
    var temp = _count.toHHMMSS();
    _count = (parseInt(_count) - 1).toString();

    $("#timer").html(temp);
  }

  return {
    init() {
      _asyncCounterInterval = setInterval(__timer, 1000);
    },

    getCount() {
      return _count;
    },

    destroy() {
      if(_asyncCounterInterval) {
        clearInterval(_asyncCounterInterval);
        _asyncCounterInterval = null;
      }
    }
  };
})();

export default CountDown;
