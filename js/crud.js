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

function requestGameList(table, cbComplete)
{
    var query = 'select from app where app_cate=\"game\"';
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

// app별 user list & user별 app list
function requestUserByApp(json, cbComplete)
{
    // json = {"id":"id_value"}
    var key = Object.keys(json);
    var query = 'select * from app_user_list where '+key[0]+'=\"'+json[key[0]]+'\"';
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

// category별 channel & app별 channel & user별 channel
function requestByChannel(json, cbComplete)
{
    // json = { "key":"value" }
    var key = Object.keys(json);
    var query = 'select * from channel_user_list where '+key[0]+'=\"'+json[key[0]]+'\"';
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


function parseJson(data)
{
	if(typeof(data) == 'object')
		return data;
	return JSON.parse(data);
}

function getJsonFromFormGroup($formGroupRoot) 
{
	var json = {};
	$formGroupRoot.find('.form-group').each(function(index, element){
		
		var name = $(this).find('input').attr('name');
		var value = $(this).find('input').val();
		json[name] = value;
	});
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


function onCrud(table, json){
    var $header = $('<div class="card-header"><h2>'+table.toUpperCase()+' <small>Show database tables for admin user.</small></h2></div>');
	var $body = $('<table class="table table-striped"><thead></thead><tbody></tbody></table>');  

    // setting table header columns
	var colArr = json.columnNames;
	if(colArr.length > 0) {
		var $thead = $body.find('thead');
		var $tr = $('<tr></tr>');
		for(i=0; i<colArr.length; i++) 
			$tr.append('<th>'+colArr[i].toUpperCase()+'</th>');
		$thead.append($tr);

		// 입력폼에 항목 추가 - 추가/수정/삭제 가능한 칸
        var $input_table = $('<table class="table table-bordered"><thead></thead><tbody></tbody></table><br/><br/>');
        var $input_head = $input_table.find('thead');
        var $input_htr = $('<tr></tr>');
        var $input_body = $input_table.find('tbody');
        var $input_btr = $('<tr></tr>');
        
//		var input_template = '<div class="form-group"><label class="col-sm-2 control-label" for="input_id_{COLUMN}">{COLUMN}</label><div class="col-sm-10"><div class="fg-line"><input type="text" class="form-control input-sm" id="input_id_{COLUMN}" name="{COLUMN}" placeholder="{COLUMN}"></div></div></div>';
		for(i=colArr.length-1; i>=0; i--) {
			if(colArr[i] == 'seq' || colArr[i] == 'ipt_date')
				continue;
            $input_htr.append('<th>'+colArr[i].toUpperCase()+'</th>');
            $input_btr.append('<td><input type="text" class="form-control input-sm" id="input_id_{COLUMN}" name="{COLUMN}" placeholder="{COLUMN}"><td>');
            $input_btr.replaceAll('{COLUMN}', colArr[i].toLowerCase());
            
//			$('#card_input .card-body').prepend(input_template.replaceAll('{COLUMN}', colArr[i].toUpperCase()));
		}
        
        $input_head.append($input_htr);
        $input_body.append($input_btr);
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
		$('#card_input').find('.form-group').each(function(index, element){
			$(this).find('input').val(data[i++]);
		});   
	});

    $('#card_table .table-responsive').before($header);
    $('#card_table .table-responsive').append($body);
    
    $('#emptyBtn').click(function(event){
        var i=0;
		$('#card_input').find('.form-group').each(function(index, element){
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