/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 18 22:02
*/
KISSY.add("editor/plugin/color/btn",function(h,d,i,j,k){var l=h.Node;h.DOM.addStyleSheet(window,".ks-editor-color-panel a {display: block;color:black;text-decoration: none;}.ks-editor-color-panel a:hover {color:black;text-decoration: none;}.ks-editor-color-panel a:active {color:black;}.ks-editor-color-palette {    margin: 5px 8px 8px;}.ks-editor-color-palette table {    border: 1px solid #666666;    border-collapse: collapse;}.ks-editor-color-palette td {    border-right: 1px solid #666666;    height: 18px;    width: 18px;}a.ks-editor-color-a {    height: 18px;    width: 18px;}a.ks-editor-color-a:hover {    border: 1px solid #ffffff;    height: 16px;    width: 16px;}a.ks-editor-color-remove {  padding:3px 8px;  margin:2px 0 3px 0;}a.ks-editor-color-remove:hover {    background-color: #D6E9F8;}",
"ks-editor-color-plugin");var m=["000,444,666,999,CCC,EEE,F3F3F3,FFF".split(","),"F00,F90,FF0,0F0,0FF,00F,90F,F0F".split(","),"F4CCCC,FCE5CD,FFF2CC,D9EAD3,D0E0E3,CFE2F3,D9D2E9,EAD1DC,EA9999,F9CB9C,FFE599,B6D7A8,A2C4C9,9FC5E8,B4A7D6,D5A6BD,E06666,F6B26B,FFD966,93C47D,76A5AF,6FA8DC,8E7CC3,C27BAD,CC0000,E69138,F1C232,6AA84F,45818E,3D85C6,674EA7,A64D79,990000,B45F06,BF9000,38761D,134F5C,0B5394,351C75,741B47,660000,783F04,7F6000,274E13,0C343D,073763,20124D,4C1130".split(",")],b;(function(){b="<div class='ks-editor-color-panel'><a class='ks-editor-color-remove' href=\"javascript:void('清除');\">清除</a>";
for(var a=0;3>a;a++){b+="<div class='ks-editor-color-palette'><table>";for(var f=m[a],e=f.length/8,c=0;c<e;c++){b+="<tr>";for(var g=0;8>g;g++){var d="#"+f[8*c+g];b+="<td>";b+="<a href='javascript:void(0);' class='ks-editor-color-a' style='background-color:"+d+"'></a>";b+="</td>"}b+="</tr>"}b+="</table></div>"}b+="<div><a class='ks-editor-button ks-editor-color-others ks-inline-block'>其他颜色</a></div></div>"})();return i.extend({initializer:function(){var a=this;a.on("blur",function(){setTimeout(function(){a.colorWin&&
a.colorWin.hide()},150)});a.on("click",function(){a.get("checked")?a._prepare():a.colorWin&&a.colorWin.hide()})},_prepare:function(){var a=this,f=a.get("editor"),e;a.colorWin=new j({elAttrs:{tabindex:0},elCls:"ks-editor-popup",content:b,autoRender:!0,width:170,zIndex:d.baseZIndex(d.zIndexManager.POPUP_MENU)});var c=a.colorWin;e=c.get("contentEl");e.on("click",a._selectColor,a);c.on("hide",function(){a.set("checked",!1)});e.one(".ks-editor-color-others").on("click",function(b){b.halt();c.hide();k.useDialog(f,
"color/colorPicker",a.get("pluginConfig"),a.get("cmdType"))});a._prepare=a._show;a._show()},_show:function(){var a=this.get("el"),b=this.colorWin;b.align(a,["bl","tl"],[0,2]);b.show()},_selectColor:function(a){a.halt();a=new l(a.target);a.hasClass("ks-editor-color-a")&&this.get("editor").execCommand(this.get("cmdType"),a.style("background-color"))},destructor:function(){this.colorWin&&this.colorWin.destroy()}},{ATTRS:{checkable:{value:!0},mode:{value:d.WYSIWYG_MODE}}})},{requires:["editor","../button/",
"../overlay/","../dialogLoader/"]});