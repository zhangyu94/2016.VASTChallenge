var DATES = [
    "2016-05-31",
    "2016-06-01",
    "2016-06-02",
    "2016-06-03",
    "2016-06-04",
    "2016-06-05",
    "2016-06-06",
    "2016-06-07",
    "2016-06-08",
    "2016-06-09",
    "2016-06-10",
    "2016-06-11",
    "2016-06-12",
    "2016-06-13",
    "2016-06-14",
    "2016-06-15",
    "2016-06-16"
];

var Timeutil = {
    getStartTime:function() {
        var st = new Date(DATES[0]);
        return st.setHours(0);
    },

    getTimeInOneDay:function(t) {
        return (t - this.getStartTime()) %(24*3600 *1000);
    },

    getDayIndex:function(day) {
        return dayIdx[day];
    }
};

var dayIdx = {
    "2016-5-31":0,
    "2016-6-1":1,
    "2016-6-2":2,
    "2016-6-3":3,
    "2016-6-4":4,
    "2016-6-5":5,
    "2016-6-6":6,
    "2016-6-7":7,
    "2016-6-8":8,
    "2016-6-9":9,
    "2016-6-10":10,
    "2016-6-11":11,
    "2016-6-12":12,
    "2016-6-13":13,
    "2016-6-14":14,
    "2016-6-15":15,
    "2016-6-16":16
};
