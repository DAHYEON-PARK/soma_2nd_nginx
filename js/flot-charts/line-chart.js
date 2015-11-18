var options = {};

$(document).ready(function(){
    
    /* Make some random data for Recent Items chart */
    
    var data = [];
    var totalPoints = 100;
    var updateInterval = 30;
    
    function getRandomData() {
        if (data.length > 0)
            data = data.slice(1);

        while (data.length < totalPoints) {
    
            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            } else if (y > 90) {
                y = 90;
            }

            data.push(y);
        }

        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }

        return res;
    }
      
    /* Recent Items Table Chart */
    if ($("#recent-items-chart")[0]) {
        $.plot($("#recent-items-chart"), [
            {data: getRandomData(), lines: { show: true, fill: 0.8 }, label: 'Items', stack: true, color: '#00BCD4' },
        ], options);
    }
    
    
    /* Chart Options */
    options = {
        series: {
            shadowSize: 0,
            lines: {
                show: false,
                lineWidth: 0,
            },
        },
        grid: {
            borderWidth: 0,
            labelMargin:10,
            hoverable: true,
            clickable: true,
            mouseActiveRadius:6,
            
        },
        xaxis: {
            tickDecimals: 0,
            ticks: false
        },
        
        yaxis: {
            tickDecimals: 0,
            ticks: false
        },
        
        legend: {
            show: false
        }
    };
    
    /* Tooltips for Flot Charts */
    if ($(".flot-chart")[0]) {
        $(".flot-chart").bind("plothover", function (event, pos, item) {
            if (item) {
                var x = item.datapoint[0].toFixed(0),
                    y = item.datapoint[1].toFixed(0);
                var day = x.toString().substring(6,8);
                var time = x.toString().substring(8,10);
                $(".flot-tooltip").html(item.series.label + " of " + day + "일"+time+"시 = " + y).css({top: item.pageY+5, left: item.pageX+5}).show();
            }
            else {
                $(".flot-tooltip").hide();
            }
        });
        
        $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
    }
});

function drawLineChart(json)
{
    var d3 = [];
    for (var i = 0; i < json.length; i += 1) {
        d3.push([json[i]['date'], json[i]['count']]);
    }
    
    /* Regular Line Chart */
    if ($("#line-chart")[0]) {
        $.plot($("#line-chart"), [
            {data: d3, lines: { show: true, fill: 0.98 }, label: 'Login', stack: true, color: '#FFC107' }
        ], options);
    }
}
