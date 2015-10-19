﻿<%@page contentType="text/html;charset=UTF-8" session="false"
	import="com.royalstone.security.*" import="com.royalstone.util.*"
	import="com.royalstone.util.daemon.*"
	import="com.royalstone.myshop.component.*"
	errorPage="../errorpage/errorpage.jsp"%>
<%
	final int moduleid = 3010113;
%>
<%
	request.setCharacterEncoding( "UTF-8" );

	HttpSession session = request.getSession( false );
	if( session == null ) throw new PermissionException( PermissionException.LOGIN_PROMPT );
	Token token = ( Token ) session.getAttribute( "TOKEN" );
	if( token == null ) throw new PermissionException( PermissionException.LOGIN_PROMPT );
	
	//查询用户的权限.
	Permission perm = token.getPermission( moduleid );
	if ( !perm.include( Permission.READ ) ) 
		throw new PermissionException( "您未获得操作此模块的授权,请管理员联系. 模块号:" + moduleid );
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title></title>
<link href="../css/main.css" rel="stylesheet" type="text/css"></link>
<link href="../AW/runtime/styles/xp/aw.css" rel="stylesheet"
	type="text/css"></link>

<script language="javascript" src="../AW/runtime/lib/aw.js"> </script>
<script language="javascript" src="../js/date/WdatePicker.js"></script>
<script language="javascript" src="../js/common.js"></script>
<script language="javascript" src="../js/Sheet.js"></script>
<style type="text/css">
.aw-grid-control {
	width: 100%;
	height: 80%;
	background-color: #F9F8F4;
}

.aw-grid-cell {
	border-right: 1px solid threedshadow;
	hepadding-bottom: 3px;
	padding-top: 3px;
}

.aw-grid-row {
	border-bottom: 1px solid #ccc;
	font-size: 14px;
	height: 22px;
}

.aw-grid-headers {
	font-size: 14px;
}

.aw-column-0 {
	color: blue;
	cursor: pointer;
	width: 120px;
}
</style>
<script language="javascript">
		var s = new Sheet("AMSPurchase");
		window.onload = function(){
			s.init();
			s.allowPrint();
		};
		</script>
</head>
<body>
	<div id="div_tabs" style="width: 100%;"></div>
	<div id="div1"></div>
	<div id="div2" style="display: none;">
		<div id="div_navigator" style="margin: 4px;">
			<input type="button" value="上一单" onclick="s.sheet_navigate(-1)" /> <input
				type="button" value="下一单" onclick="s.sheet_navigate(1)" /> <input
				type="button" value="打印单据" onclick="s.open_win_print()"
				style="display: none" id="btn_print" /> <span id="offset_current"></span>
		</div>
		<div id="div_warning" class="warning"></div>
		<div id="div_sheetshow"></div>
	</div>

	<div id="div0" class="search_main">
		<% if(!token.isVender){ %>
		<div class="search_parms">
			供应商编码: <input type="text" id="txt_venderid" name="txt_parms"
				notnull="notnull" alt="供应商编码" />
		</div>
		<% } %>

		<div class="search_parms">
			单据状态:<select id="txt_status" name="txt_parms">
				<option>全部</option>
				<option value="0" selected="selected">未阅读</option>
				<option value="1">已阅读</option>
			</select>
		</div>
		<div class="search_parms">
			订单日期: <input type="text" id="txt_editdate_min" class="Wdate"
				onFocus="WdatePicker()" name="txt_parms" alt="最小日期" /> - <input
				type="text" id="txt_editdate_max" class="Wdate"
				onFocus="WdatePicker()" name="txt_parms" alt="最大日期" />
		</div>
		<div class="search_parms">
			订单单号: <input type="text" id="txt_sheetid" size="20" name="txt_parms" />
		</div>
		<div class="search_button" id="div_button_search"></div>
	</div>
</body>
</html>