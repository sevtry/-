document.body.oncopy=function(){
if(navigator.userAgent.indexOf("MSIE")>0) {
event.returnValue=false;
var t=document.selection.createRange().text;
var s="："+location.href+"";
clipboardData.setData("Text",t+"\r\n"+s+"");
}
}