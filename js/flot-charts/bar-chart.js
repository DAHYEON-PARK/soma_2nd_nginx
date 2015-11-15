$(document).ready(function(){
    /* Tooltips for Flot Charts */
    
//    if ($(".flot-chart")[0]) {
//        $(".flot-chart").bind("plothover", function (event, pos, item) {
//            if (item) {
//                var x = item.datapoint[0].toFixed(2),
//                    y = item.datapoint[1].toFixed(2);
//                $(".flot-tooltip").html(item.series.label + " of " + x + " = " + y).css({top: item.pageY+5, left: item.pageX+5}).show();
//            }
//            else {
//                $(".flot-tooltip").hide();
//            }
//        });
//        
//        $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
//    }
});

function appBarChart(json)
{
    var barData = new Array();
    
    var data1 = [];
    var data2 = [];
    var data3 = [];
    
    
    var obj = json[7]['traffic:/user/registApp']; // app 생성, 추가
    for(var i=0; i<obj.length; i++)
    {
        data1.push([obj[i]['date'], obj[i]['count']]);
    }
    obj = json[3]['traffic:/user/registNick']; // app에 가입
    for(var i=0; i<obj.length; i++)
    {
        data2.push([obj[i]['date'], obj[i]['count']]);
    }
    obj = json[1]['traffic:/user/removeApp']; // app에서 탈퇴
    for(var i=0; i<obj.length; i++)
    {
        data3.push([obj[i]['date'], obj[i]['count']]);
    }
    
    
    barData.push({
        data : data1,
        label: 'App Create',
        bars : {
                show : true,
                barWidth : 0.08,
                order : 1,
                lineWidth: 0,
                fillColor: '#8BC34A'
        }
    });
    
    barData.push({
        data : data2,
        label: 'App Join',
        bars : {
                show : true,
                barWidth : 0.08,
                order : 2,
                lineWidth: 0,
                fillColor: '#00BCD4'
        }
    });
    
    barData.push({
        data : data3,
        label: 'App Drop Out',
        bars : {
                show : true,
                barWidth : 0.08,
                order : 3,
                lineWidth: 0,
                fillColor: '#FF9800'
        }
    });
    
    /* Let's create the chart */
    if ($('#app-bar-chart')[0]) {
        $.plot($("#app-bar-chart"), barData, {
            grid : {
                    borderWidth: 1,
                    borderColor: '#eee',
                    show : true,
                    hoverable : true,
                    clickable : true
            },
            
            yaxis: {
                tickColor: '#eee',
                tickDecimals: 0,
                font :{
                    lineHeight: 13,
                    style: "normal",
                    color: "#9f9f9f",
                },
                shadowSize: 0
            },
            
            xaxis: {
                tickColor: '#fff',
                tickDecimals: 0,
                font :{
                    lineHeight: 13,
                    style: "normal",
                    color: "#9f9f9f"
                },
                shadowSize: 0,
            },
    
            legend:{
                container: '.flc-bar',
                backgroundOpacity: 0.5,
                noColumns: 0,
                backgroundColor: "white",
                lineWidth: 0
            }
        });
    }
}

function channelBarChart(json)
{
    var barData = new Array();
    
    var data1 = [];
    var data2 = [];
    var data3 = [];
    
    
    var obj = json[11]['traffic:/user/makeChannel']; // channel 생성, 추가
    for(var i=0; i<obj.length; i++)
    {
        var date = obj[i]['date'];
        
        data1.push([obj[i]['date'], obj[i]['count']]);
    }
    obj = json[2]['traffic:/user/joinChannel']; // channel에 가입
    for(var i=0; i<obj.length; i++)
    {
        data2.push([obj[i]['date'], obj[i]['count']]);
    }
    obj = json[5]['traffic:/user/withdrawChannel']; // channel에서 탈퇴
    for(var i=0; i<obj.length; i++)
    {
        data3.push([obj[i]['date'], obj[i]['count']]);
    }
    
    
    barData.push({
        data : data1,
        label: 'Channel Create',
        bars : {
                show : true,
                barWidth : 0.08,
                order : 1,
                lineWidth: 0,
                fillColor: '#8BC34A'
        }
    });
    
    barData.push({
        data : data2,
        label: 'Channel Join',
        bars : {
                show : true,
                barWidth : 0.08,
                order : 2,
                lineWidth: 0,
                fillColor: '#00BCD4'
        }
    });
    
    barData.push({
        data : data3,
        label: 'Channel Drop Out',
        bars : {
                show : true,
                barWidth : 0.08,
                order : 3,
                lineWidth: 0,
                fillColor: '#FF9800'
        }
    });
    
    /* Let's create the chart */
    if ($('#channel-bar-chart')[0]) {
        $.plot($("#channel-bar-chart"), barData, {
            grid : {
                    borderWidth: 1,
                    borderColor: '#eee',
                    show : true,
                    hoverable : true,
                    clickable : true
            },
            
            yaxis: {
                tickColor: '#eee',
                tickDecimals: 0,
                font :{
                    lineHeight: 13,
                    style: "normal",
                    color: "#9f9f9f",
                },
                shadowSize: 0
            },
            
            xaxis: {
                tickColor: '#fff',
                tickDecimals: 0,
                font :{
                    lineHeight: 13,
                    style: "normal",
                    color: "#9f9f9f"
                },
                shadowSize: 0,
            },
    
            legend:{
                container: '.flc-bar',
                backgroundOpacity: 0.5,
                noColumns: 0,
                backgroundColor: "white",
                lineWidth: 0
            }
        });
    }
   
}