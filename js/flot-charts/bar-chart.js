$(document).ready(function(){
    /* Tooltips for Flot Charts */
    
    if ($(".flot-chart")[0]) {
        $(".flot-chart").bind("plothover", function (event, pos, item) {
            if (item) {
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);
                $(".flot-tooltip").html(item.series.label + " of " + x + " = " + y).css({top: item.pageY+5, left: item.pageX+5}).show();
            }
            else {
                $(".flot-tooltip").hide();
            }
        });
        
        $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
    }
});

function drawBarChart()
{
    var barData = new Array();
    var size = keys.length;
    
    for(i=0; i<size; i++)
    {
        var $content = '<div class="col-md-6"><div class="card"><div class="card-header><h2>'+keys[i]+'</h2><ul class="actions"><li><a href=""><i class="zmdi zmdi-download"></i></a></li><li class="dropdown"><a href="" data-toggle="dropdown"><i class="zmdi zmdi-more-vert"></i></a><ul class="dropdown-menu dropdown-menu-right"><li><a href="">Change Date Range</a></li></ul></li></ul></div><div class="card-body card-padding-sm"><div id="'+i+'" class="flot-chart"></div><div class="flc-bar"></div></div></div</div>';
        
        $table.append($content);   
        
        var data1 = [];
        
        var obj = values[i]; // app 생성, 추가
        for(var i=0; i<obj.length; i++)
        {
            divideDate(obj['date'], function(jsonDate) {
                data1.push([jsonDate['time'], obj['count']]);
            });
        }
        
        var id = '\'#'+keys[i];
        if ($('''+key+''')[0]) {
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
}
   
    

//function channelBarChart(json)
//{
//    var barData = new Array();
//    
//    var data1 = [];
//    var data2 = [];
//    var data3 = [];
//    
//    
//    var obj = json[11]['traffic:/user/makeChannel']; // channel 생성, 추가
//    for(var i=0; i<obj.length; i++)
//    {
//        divideDate(obj[i]['date'], function(jsonDate) {
//            data1.push([jsonDate['time'], obj[i]['count']]);
//        });
//    }
//    obj = json[2]['traffic:/user/joinChannel']; // channel에 가입
//    for(var i=0; i<obj.length; i++)
//    {
//        divideDate(obj[i]['date'], function(jsonDate) {
//            data2.push([jsonDate['time'], obj[i]['count']]);
//        });
//    }
//    obj = json[3]['traffic:/user/withdrawChannel']; // channel에서 탈퇴
//    for(var i=0; i<obj.length; i++)
//    {
//        divideDate(obj[i]['date'], function(jsonDate) {
//            data3.push([jsonDate['time'], obj[i]['count']]);
//        });
//    }
//    
//    
//    barData.push({
//        data : data1,
//        label: 'Channel Create',
//        bars : {
//                show : true,
//                barWidth : 0.08,
//                order : 1,
//                lineWidth: 0,
//                fillColor: '#8BC34A'
//        }
//    });
//    
//    barData.push({
//        data : data2,
//        label: 'Channel Join',
//        bars : {
//                show : true,
//                barWidth : 0.08,
//                order : 2,
//                lineWidth: 0,
//                fillColor: '#00BCD4'
//        }
//    });
//    
//    barData.push({
//        data : data3,
//        label: 'Channel Drop Out',
//        bars : {
//                show : true,
//                barWidth : 0.08,
//                order : 3,
//                lineWidth: 0,
//                fillColor: '#FF9800'
//        }
//    });
//    
//    /* Let's create the chart */
//    if ($('#channel-bar-chart')[0]) {
//        $.plot($("#channel-bar-chart"), barData, {
//            grid : {
//                    borderWidth: 1,
//                    borderColor: '#eee',
//                    show : true,
//                    hoverable : true,
//                    clickable : true
//            },
//            
//            yaxis: {
//                tickColor: '#eee',
//                tickDecimals: 0,
//                font :{
//                    lineHeight: 13,
//                    style: "normal",
//                    color: "#9f9f9f",
//                },
//                shadowSize: 0
//            },
//            
//            xaxis: {
//                tickColor: '#fff',
//                tickDecimals: 0,
//                font :{
//                    lineHeight: 13,
//                    style: "normal",
//                    color: "#9f9f9f"
//                },
//                shadowSize: 0,
//            },
//    
//            legend:{
//                container: '#flc-bar-channel',
//                backgroundOpacity: 0.5,
//                noColumns: 0,
//                backgroundColor: "white",
//                lineWidth: 0
//            }
//        });
//    }
//   
//}