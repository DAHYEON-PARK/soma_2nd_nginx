
var g_app_menu;
var g_target_table;


String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },


    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

function initMenu(menuKey)
{
	if(g_app_menu)
		return;

	g_target_table = menuKey;
	$.ajax({
		type: 'GET',
		url: 'js/menu.json',
		success: function(data, status) {
			
			g_app_menu = parseJson(data);
			if(g_app_menu.length == 0)
				return;

			for(i=0; i<g_app_menu.length; i++) {
				var cls = '';
				if(menuKey && g_app_menu[i].url.indexOf(menuKey) != -1) 
					cls = 'class="active"';
				else if(!menuKey && g_app_menu[i].title == 'Default') 
					cls = 'class="active"';

				var $menu = '<li><a '+cls+' href="'+g_app_menu[i].url+'"><i class="zmdi zmdi-'+g_app_menu[i].icon+'"></i> '+g_app_menu[i].title+'</a></li>';
				$('#menu-db-table').append($menu);
			}
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

function requestSelect(table, cbComplete)
{
	var query = 'SELECT * FROM ' + table;
	query = query.toLowerCase();
	query = encodeURIComponent(query);

	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				alert("JSON Parsing Error. "+e);
				return;
			}

			//console.log(obj);
			
			if(cbComplete)
			{
				// table은 table 이름 - user, session...
				cbComplete(table, obj.result);
			}
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

// 입력, 추가
function requestInsert(table, cbComplete)
{
	var cols = Object.keys(table);
	
	var attr = '';
	for(var i=1; i<cols.length-1; i++)
	{
		attr = attr.concat(cols[i]);
		if(i!=(cols.length-2))
			attr = attr.concat(',');
	}
	
	var con = '';
	for(var i=1; i<cols.length-1; i++)
	{
		con = con.concat('\''+table[cols[i]]+'\'');
		if(i!=(cols.length-2))
			con = con.concat(',');
	}

	 var query = 'insert into '+table.table_name+' ('+attr+') values('+con+')';
 	 query = query.toLowerCase();
	 query = encodeURIComponent(query);
        
	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				console.log('json error:'+data);
				//alert("JSON Parsing Error. "+e);
				alert(data);
				return;
			}
			
			if(cbComplete)
				cbComplete(table, obj);
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

// 수정
function requestUpdate(table, cbComplete)
{
	var cols = Object.keys(table);
	
	var attr = '';
	for(var i=1; i<cols.length-1; i++)
	{
        attr = attr.concat(cols[i]+'=\''+table[cols[i]]+'\'');                 
		if(i!=(cols.length-2))
			attr = attr.concat(',');
    }
	var query = 'update ' +table['table_name']+ ' set ' +attr+ ' where ' +cols[0]+'=' +table[cols[0]];
    query = query.toLowerCase();
    query = encodeURIComponent(query);
        
	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				console.log('json error:'+data);
				//alert("JSON Parsing Error. "+e);
				alert(data);
				return;
			}
			
			if(cbComplete)
				cbComplete(table, obj);
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

// 삭제
function requestDelete(table, cbComplete)
{
    var cols = Object.keys(table);
    
    var query = 'delete from '+table['table_name']+' where '+cols[0]+'=' +table[cols[0]];
    query = query.toLowerCase();
    query = encodeURIComponent(query);
        
	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				console.log('json error:'+data);
				//alert("JSON Parsing Error. "+e);
				alert(data);
				return;
			}
			
			if(cbComplete)
				cbComplete(table, obj);
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

// app별 user list & channel list
function requestByApp(query)
{
    query = query.toLowerCase();
    query = encodeURIComponent(query);
        
	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				console.log('json error:'+data);
				//alert("JSON Parsing Error. "+e);
				alert(data);
				return;
			}
			
            showMainTable(obj.result);
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

function parseJson(data)
{
	if(typeof(data) == 'object')
		return data;
	return JSON.parse(data);
}

function getJsonFromFormGroup($formGroupRoot) 
{
    var json = {};
    var name = {};
    var value = {};
    
    var i=0
	$formGroupRoot.find('.table').find('th').each(function(index, element){
		name[i++]=$(this).text();
	});
    
    i=0;
    $formGroupRoot.find('.table').find('td').each(function(index, element){
		value[i++]=$(this).find('input').val();
	});

    j=0;    
    for(; j<i; j++)
		json[name[j]] = value[j];
    
	return json;
}

function getLocationParameter( name )
{
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
	var regexS = "[\\?&]"+name+"=([^&#]*)";  
	var regex = new RegExp( regexS );  
	var results = regex.exec( window.location.href ); 
	 if( results == null )    return "";  
	else    return results[1];
}

function showMainTable(json)
{
    
    var $header = $('<div class="card-header"><h2>Custom Table for Admin. <small>위의 간단한 조회 결과입니다.</small></h2></div>');
	var $body = $('<table class="table table-striped"><thead></thead><tbody></tbody></table>');  
    
    var colArr = json.columnNames;
	if(colArr.length > 0) {
        // setting table header columns
		var $thead = $body.find('thead');
		var $tr = $('<tr></tr>');
		for(i=0; i<colArr.length; i++) 
			$tr.append('<th>'+colArr[i].toUpperCase()+'</th>');
		$thead.append($tr);
	}
	
	// 내용 추가
	var rowArr = json.results;
	if(rowArr.length > 0) {
		var $tbody = $body.find('tbody');
		for(i=0; i<rowArr.length; i++) {
			var $tr = $('<tr></tr>');
			var dataArr = rowArr[i];
			for(j=0; j<dataArr.length; j++) 
				$tr.append('<td>'+dataArr[j]+'</td>');
			$tbody.append($tr);
		}
	}
    
    $('#card_table .card-header').eq(0).remove();
    $('#card_table .table').eq(0).remove();
    $('#card_table .table-responsive').before($header);
    $('#card_table .table-responsive').append($body);
}

function onCrud(table, json)
{
    var $header = $('<div class="card-header"><h2>'+table.toUpperCase()+' <small>Show database tables for admin user.</small></h2></div>');
	var $body = $('<table class="table table-striped"><thead></thead><tbody></tbody></table>');  

	var colArr = json.columnNames;
	if(colArr.length > 0) {
        // setting table header columns
		var $thead = $body.find('thead');
		var $tr = $('<tr></tr>');
		for(i=0; i<colArr.length; i++) 
			$tr.append('<th>'+colArr[i].toUpperCase()+'</th>');
		$thead.append($tr);

		// 입력폼에 항목 추가 - 추가/수정/삭제 가능한 칸
        var $input_table = $('<table class="table table-bordered"><thead></thead><tbody></tbody></table>');
        var $input_head = $input_table.find('thead');
        var $input_htr = $('<tr></tr>');
        var $input_body = $input_table.find('tbody');
        var $input_btr = $('<tr></tr>');
        
		for(i=colArr.length-1; i>=0; i--) {
			if(colArr[i] == 'seq' || colArr[i] == 'ipt_date')
				continue;
            
            if(colArr[i].search('date') == -1){
                $input_htr.prepend('<th>'+colArr[i].toUpperCase()+'</th>');
            $input_btr.prepend('<td><input type="text" class="form-control input-sm" id="input_id_'+colArr[i].toLowerCase()+'" name="'+colArr[i].toLowerCase()+'" placeholder="'+colArr[i].toLowerCase()+'"></td>');
            }
		}
        
        $input_head.append($input_htr);
        $input_body.append($input_btr);
        $input_table.append('<br/><br/>');
        $('#card_input .table-responsive').append($input_table);
	}
	
	// 내용 추가
	var rowArr = json.results;
	if(rowArr.length > 0) {
		var $tbody = $body.find('tbody');
		for(i=0; i<rowArr.length; i++) {
			var $tr = $('<tr></tr>');
			var dataArr = rowArr[i];
			for(j=0; j<dataArr.length; j++) 
				$tr.append('<td>'+dataArr[j]+'</td>');
			$tbody.append($tr);
		}
	}
    
    // table click
	var $table = $body.find('table');
	var $tbody = $body.find('tbody');
	$tbody.click(function (e) {
        e = e || window.event;
        var data = [];
        var target = e.srcElement || e.target;
        while (target && target.nodeName !== "TR") {
            target = target.parentNode;
        }
        if (target) {
            var cells = target.getElementsByTagName("td");

            for (i = 0; i < cells.length; i++) {
                    data.push(cells[i].innerHTML);
            }
        }
		var i=0;
		$('#card_input').find('td').each(function(index, element){
			$(this).find('input').val(data[i++]);
		});   
	});

    $('#card_table .table-responsive').before($header);
    $('#card_table .table-responsive').append($body);
    
    $('#emptyBtn').click(function(event){
        var i=0;
		$('#card_input').find('.table').each(function(index, element){
			$(this).find('input').val("");
		});   
	})
    
    $('#insertBtn').click(function(event){
		var json = getJsonFromFormGroup( $('#card_input') );
		json['table_name'] = g_target_table;
		var str = JSON.stringify(json);
		console.log(str);
		str = Base64.encode(str);
		console.log(str);

		requestInsert(json, function(table, recv) {
			console.log(table + ','+recv);
		});
	})
    
    $('#updateBtn').click(function(event){
		var json = getJsonFromFormGroup( $('#card_input') );
		json['table_name'] = g_target_table;
		var str = JSON.stringify(json);
		console.log(str);
		str = Base64.encode(str);
		console.log(str);

		requestUpdate(json, function(table, recv) {
			console.log(table + ','+recv);
		});
	})
    
    $('#deleteBtn').click(function(event){
		var json = getJsonFromFormGroup( $('#card_input') );
		json['table_name'] = g_target_table;
		var str = JSON.stringify(json);
		console.log(str);
		str = Base64.encode(str);
		console.log(str);

		requestDelete(json, function(table, recv) {
			console.log(table + ','+recv);
		});
	})
}

function getAppList(func)
{
    var query = 'select distinct app_id from app_user_list';
    query = query.toLowerCase();
    query = encodeURIComponent(query);
        
	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				console.log('json error:'+data);
				//alert("JSON Parsing Error. "+e);
				alert(data);
				return;
			}
			
			if(func)
				func(obj.result);
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

function getChannelList(app, func)
{
    if(app==null | app=="") return;
    
    var query = 'select channel_name from channel where app_id="'+app+'"';
    query = query.toLowerCase();
    query = encodeURIComponent(query);
        
	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				console.log('json error:'+data);
				//alert("JSON Parsing Error. "+e);
				alert(data);
				return;
			}
			
			if(func)
				func(obj.result);
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

function getUserList(app, func)
{
    if(app==null | app=="") return;
    
    var query = 'select user_id from app_user_list where app_id="'+app+'"';
    query = query.toLowerCase();
    query = encodeURIComponent(query);
        
	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				console.log('json error:'+data);
				//alert("JSON Parsing Error. "+e);
				alert(data);
				return;
			}
			
			if(func)
				func(obj.result);
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

function insertNoti(json, func)
{
    var query = 'insert into notice (subject, content) values ("'+json.subject+'","'+json.content+'")';
    query = query.toLowerCase();
    query = encodeURIComponent(query);
        
	$.ajax({
		type: 'POST',
		url: 'http://133.130.113.101:7010/user/customQuery?query='+query,
		success: function(data, status) {
			
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				console.log('json error:'+data);
				//alert("JSON Parsing Error. "+e);
				alert(data);
				return;
			}
			
			if(func)
				func('success');
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});
}

function logout()
{
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_id');
}

function getTraffic(func)
{
    $.ajax({
		type: 'GET',
		url: 'http://133.130.113.101:7010/user/traffic',
		success: function(data, status) {
			var obj;
			try
			{
				obj = parseJson(data);
			}
			catch (e)
			{
				alert("JSON Parsing Error. "+e);
				return;
			}
            
			drawLineChart(obj[0]['traffic:/user/login']); // login (line-chart.js에 존재)
            
            if(func)
                func(obj);
		},
		error: function(e) {
			console.log('접속이 원활하지 않습니다.');
		}
	});   
}

function divideDate(num, func)
{
    var init = num.toString();
    
//    var time = init % 100;
//    init = init/100;
//    var day = init % 100;
//    init = init/100;
//    var month = init/100;
//    init = init/100;
//    var year = init;
    
    var year = init.substring(0,4);
    var month = init.substring(4,6);
    var day = init.substring(6,8);
    var time = init.substring(8,10);
    
    var json = {};
    json['time'] = time;
    json['day'] = day;
    json['month'] = month;
    json['year'] = year;
    
    if(func)
        func(parseJson(json));
}
