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
    "2016-06-13"
]

var Timeutil = {
    getStartTime:function() {
        var st = new Date(DATES[0]);
        return st.setHours(0);
    },

    getTimeInOneDay:function(t) {
        return (t - this.getStartTime()) %(24*3600 *1000);
    }
}
