﻿﻿<%@page contentType="text/html;charset=UTF-8" session="false"
	import="java.lang.*" import="com.royalstone.util.*"
	import="com.royalstone.security.*"
	import="com.royalstone.util.daemon.*"
	import="com.royalstone.util.component.*"
	import="com.royalstone.myshop.component.*"
	errorPage="../errorpage/errorpage.jsp"%>
<%
final int moduleid = 9010201;
request.setCharacterEncoding( "UTF-8" );
HttpSession session = request.getSession( false );
if( session == null ) throw new TokenException( "您尚未登录,或已超时." );
Token token = ( Token ) session.getAttribute( "TOKEN" );
if( token == null ) throw new TokenException( "您尚未登录,或已超时." );

//查询用户的权限.
Permission perm = token.getPermission( moduleid );
if ( !perm.include( Permission.READ ) ) 
	throw new PermissionException( "您未获得操作此模块的授权,请管理员联系. 模块号:" + moduleid );


Input input_user = new Input();
input_user.setAttribute( "name", "ctrl_userid" );

String userid = request.getParameter( "userid" );
if( userid != null && userid.length() > 0 ) {
	int i = Integer.parseInt( userid );
	userid = "" + i;
	input_user.setAttribute( "type", "hidden" );
	input_user.setAttribute( "value", userid );
} else {
	throw new InvalidDataException( "userid not set! " );
}

%>

﻿
<?xml version="1.0" encoding="UTF-8"?>
<html lang=en xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" href="../css/style.css" type="text/css" />
<xml id="island4request" />
<xml id="island4result" />
<xml id="format4list" src="user_list.xsl"></xml>
<xml id="format4menu" src="radio_menuroot.xsl"></xml>

<script language="javascript" src="../js/ajax.js"> </script>
<script language="javascript" src="../js/XErr.js"> </script>
<script language="javascript" src="User.js"> </script>


<script language="javascript">

function init()
{
	load_info();
	load_menuroot();

}

/**
 * 此函数访问后台, 查询指定编号的用户信息并显示.
 *
 */

function load_info()
{
	if( ctrl_userid.value == "" ) return;
	
	var url = "../DaemonUserAdm?action=get_user&userid=" + ctrl_userid.value ;

	island4result.async = false;
	island4result.load( url );
	var elm_err 	= island4result.XMLDocument.selectSingleNode( "/xdoc/xerr" );
	
	var xerr = parseXErr( elm_err );
	if ( xerr.code == "0" ){
		var elm_user 	= island4result.XMLDocument.selectSingleNode( "/xdoc/xout/user" );
		var user = parseUser( elm_user );
		display_user( user );
		return true;
	} else {
		alert( xerr.note );
		return false;
	}
}


function load_menuroot()
{	
	divMenu.innerHTML = "请稍候 ..." ;
	
	var url = "../DaemonMenuAdm?action=get_user_root&userid=<%=userid%>";
	island4result.async = false;
	island4result.load( url );
	var elm_err 	= island4result.XMLDocument.selectSingleNode( "/xdoc/xerr" );

	divMenu.innerHTML = island4result.transformNode( format4menu.documentElement );
	
}



function save_info()
{
	if( !check_input() ) return;
	
	var user = new User();
	user.userid 	= ctrl_userid.value ;
	user.username 	= ctrl_username.value; 
	user.loginid	= ctrl_loginid.value; 
	user.password	= ctrl_password1.value; 
	user.menuroot	= ctrl_menuroot.value;
	
	island4request.loadXML( "" );
	var doc      	= island4request.XMLDocument;
	var elm_root 	= doc.selectSingleNode("/");
	var elm_user  	= user.toElement( doc );
	
	elm_root.appendChild( user.toElement(doc) );

	send_user_info();
}



function display_user ( user )
{
	ctrl_loginid.value 	= user.loginid;
	ctrl_username.value 	= user.username;
	ctrl_menuroot.value	= user.menuroot;
}

function check_input()
{
	if( ctrl_userid.value == "" ) {
		alert( "userid is invalid ! " ) ;
		return false;
	}
	
	if( ctrl_loginid.value 	== "" ) {
		alert( "登录名无效 ! " ) ;
		return false;
	}

	if( ctrl_username.value == "" ) {
		alert( "用户名无效 ! " ) ;
		return false;
	}

	if( ctrl_password1.value != ctrl_password2.value ){
		alert( "两次输入的密码不一致! " );
		return false;
	}
	
	return true;
}


function send_user_info()
{
	var url = "../DaemonUserAdm?action=update_user";
	var courier 		= new AjaxCourier( url );
	courier.island4req  	= island4request;
	courier.reader.read 	= analyse_reply;
	courier.call();
}

function analyse_reply( text )
{
	island4result.loadXML( text );
	var elm_err 	= island4result.XMLDocument.selectSingleNode( "/xdoc/xerr" );
	var xerr 	= parseXErr( elm_err );

	if( xerr.code == "0" ) alert ( " 修改成功! " );
	else {
		alert( " 修改失败! " );
		alert( xerr.toString() );
	}

}

function set_menuroot( ctrl )
{
	ctrl_menuroot.value = "" + ctrl.menuid;
}

</script>

</head>

<body onload="init()">

	<table class="noborder">
		<caption>修改用户信息</caption>

		<tr>
			<td><label>登录名</label></td>
			<td><input type="text" name="ctrl_loginid" value="" size="10"
				maxlength="10" /></td>
		</tr>

		<tr>
			<td><label>用户名</label></td>
			<td><input type="text" name="ctrl_username" value="" size="10"
				maxlength="10" /></td>
		</tr>

		<tr>
			<td><label>密码</label></td>
			<td><input type="password" name="ctrl_password1" value=""
				size="12" maxlength="12" /></td>
		</tr>



		<tr>
			<td><label>密码确认</label></td>
			<td><input type="password" name="ctrl_password2" value=""
				size="12" maxlength="12" /></td>
		</tr>


		<tr>
			<td><label>根菜单</label></td>
			<td><input type="text" name="ctrl_menuroot" value="" readonly /></td>
		</tr>

	</table>


	<input type="button" value=" 保存 " onclick="save_info()" />
	<input type="button" value=" 返回 " onclick="window.history.back()" />
	<%=input_user.toString()%>

	<div id="divMenu"></div>

</body>
</html>
