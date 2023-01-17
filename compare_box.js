/*!   http://zzsvn.pcauto.com.cn/svn/other/pconline/product2011/js/product_compare_toolbar_version2.js */

//cookie
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure': '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

function initCompareHistoryProduct(){
    var ret = "";
    if(typeof(LastView) != "undefined"){
        var str = ""; 
        var cValue = LastView.getData();
        if(cValue != null){
            var cvalues = cValue.split('##');
            var len = cvalues.length;
            for(var i=0;i<len;i++){
                var one = cvalues[i];
                var ones = one.split(',');
                if(ones[0] == "" || ones[1] == ""){
                    continue;
                }
                str += ";"+ones[1]+"|"+ones[0]+"|"+ones[2]+"|"+ones[5]+"|"+ones[3]+"|"+ones[4];
            }
        }
        ret = str.length>0?str.substring(1):str;
    }
    return ret;
}
var historyProduct=initCompareHistoryProduct();     
//var historyProduct = $.cookie("compareProducts");
//if (historyProduct != null && historyProduct != '') historyProduct = historyProduct.substring(0, historyProduct.lastIndexOf(";"));
//对比工具栏.S
var compareBar = function() {
    this.create();
    this.data = {
        barBox: $("#compareBarOut"),
        toolBar: $("#JcompareTab"),
        numbox: $("#Jchoose"),
        tabs: $("#JcompareTab .tab-ctrl a"),
        contents: $("#JcompareTab .panel"),
        closeLi: $("#JcompareTab .icon-item-del"),
        foldBtn: $("#JbtmCompBoxClose"),
        epCompare: $("#Jreset"),
        epView: $("#JepView"),
        compareUl: $("#compareUl"),
        compareFaker: $("#compareFaker"),
        viewUl: $("#viewUl"),
        userState: $("#userState"),
        popMsg: $("#JcompareTab .popMsg"),
        closeTabBtn: $("#JcompareTab .pro_th .cbIcon"),
        closeTab: $("#JcompareTab .panel"),
        smallType: null,

        choosePro: [],

        message: ["" ]
    };
    this.init();
    this.setInitData();
    this.synchroLogin();
};
compareBar.prototype = {
    check : function(id){},
    uncheck : function(id){},
    recheck : function(){
        var d = this.data;
        var len = d.choosePro.length;
        for(var i=0; i<len; i++) {
            this.getElemsByAttr('name','compare_' + d.choosePro[i],'div,a,input').each(function(i,el){
                el.nodeName == "INPUT" ? $(el).attr("checked", true) : $(el).addClass("checked");
            });
            this.check(d.choosePro[i]);
        }
    },
    create: function() {
        var outbox = document.getElementById('compareBarOut');
        var box = '';
        if (!outbox) {
            box += '<div id="compareBarOut">';
        }
        box += '<div class="btm-compare-box" id="JcompareTab">';
        box += '    <div class="tab-ctrl">';
        box += '        <a href="javascript:;" class="current" target="_self"> (<em id="Jchoose">0</em>/5)</a>';
        box += '        <a href="javascript:;" target="_self"></a>';
        box += '        <i class="btm-compare-box-close" id="JbtmCompBoxClose"></i>';
        box += '    </div>';
        box += '    <div class="tab-content">';
        box += '        <div class="panel">';
        box += '            <ul id="compareFirst"><li class="fSelect"><dl class="cpCarSec"><dd><select class="sn" id="_brandList1_" onchange="doSelectedBrandChange(this,1,\'searchBtnAdd\');"><option value=""></option></select></dd><dd><select class="sn" onchange="javascript:doAddCompare_img1Box()" id="_productList1_"><option value=""></option></select></dd></dl></li></ul><ul id="compareUl"></ul><ul id="compareFaker"><li class="fSelect"><dl class="cpCarSec"><dd><select class="sn" id="_brandList2_" onchange="doSelectedBrandChange(this,2,\'searchBtnAdd\');"><option value=""></option></select></dd><dd><select class="sn" onchange="javascript:doAddCompare_img2Box()" id="_productList2_"><option value=""></option></select></dd></dl></li></ul>';
        box += '            <div class="btm-comp-fn">';
        box += '                <a href="javascript:;" class="btm-comp-btn" onclick="compareBar.compare();" target="_self">开始对比</a>';
        box += '                <span class="reset" id="Jreset"><i class="icon-reset"></i></span>';
        box += '            </div>';
        box += '        </div>';
        box += '        <div class="panel" style="display:none;">';
        box += '            <ul id="viewUl"></ul>';
        box += '            <div class="btm-comp-fn btm-comp-fn2">';
        box += '                <span class="reset" id="JepView"><i class="icon-reset"></i></span>';
        box += '            </div>';
        box += '        </div>';
        box += '    </div>';
        box += '</div>';

        if (!outbox) {
            box += '</div>';
            document.write(box);
        } else {
            outbox.innerHTML = box;
        }
    },
    init: function() {
        var self = this,
        d = this.data;
        d.foldBtn.bind("click",
        function() {
            $('#JcompareTab').hide();
        });
        d.epCompare.bind("click",
        function() { ///delete
            self.emptyCont1("compareUl");
        });
        d.epView.bind("click",
        function() {
            self.emptyCont2("viewUl");
        });
        d.closeTabBtn.bind("click",
        function() {
            self.hidTab();
        });

        d.tabs.each(function(index, el) {
            $(el).click(function(event) {
                $('#JcompareTab .panel').eq($(this).index()).show().siblings('.panel').hide();
                $(this).addClass('current').siblings().removeClass('current');
            });
        });

        d.closeLi.live("click",
        function(e) {
            var uId = $(this).parent().parent().attr("id");
            if (uId == "compareUl") {
                var pId = $(this).parent().find("input:hidden").val();
                self.delComparePro(pId);
            } else {
                $(this).parent().remove();
                if (d.viewUl.find(".item").length == 0) {
                    self.setEmpty("viewUl");
                    //this.clearHistory();

                } else {
                    LastView.remove($(this).attr('pid'));
                }
            }
        });
    },
    setInitData: function() {
        var d = this.data;
        // $("#JcompareTab .panel").eq(0).addClass("hide");
        var productSmallType = $.cookie("productSmallType");
        var compareProducts = $.cookie("compareProducts");
        if (productSmallType == "" || productSmallType == null || compareProducts == "" || compareProducts == null) {
            // d.barBox.hide();
            $("#compareFirst").find("li.fSelect").show();
        } else {
            compareProducts = compareProducts.substring(0, compareProducts.lastIndexOf(";"));
            var arrProduct = compareProducts.split(";");

            var len = arrProduct.length > 5 ? 5 : arrProduct.length;
            var item = "";
            for (var i = 0; i < len; i++) {
                var arrParam = arrProduct[i].split("|");
                var pubUrl = arrParam[0];
                var shorName = arrParam[1];
                var picUrl = arrParam[2];
                var price = arrParam[3];
                price = parseInt(price) > -1 ? '￥' + price : price;
                var id = arrParam[4];
                if (shorName == null) shorName = "";
                if (price == null) price = "";
                this.getElemsByAttr('name','compare_' + id,'div,a,input').each(function(i,el){
                    if (el.nodeName == "INPUT") {
                        $(el).attr("checked", true)
                        $(el).parent().parent().addClass("checked");
                    } else {
                        $(el).addClass("checked")
                    }
                });
                d.choosePro.push(parseInt(id, 10));
                item += '<div class="item">';
                item += '    <a href="' + pubUrl + '" target="_blank" class="item-pic"><img width="80" height="60" alt="" src="' + picUrl + '" /></a>';
                item += '    <div class="item-txts">';
                item += '        <a href="' + pubUrl + '" target="_blank" class="item-title">' + shorName + '</a>';
                item += '        <span class="price">' + price + '</span>';
                item += '    </div>';
                item += '    <i class="icon-item-del"></i>';
                item += '<input type="hidden" value="' + id + '" id="compare_' + id + '" />';
                item += '</div>';

            }
            d.compareUl.append(item);
            d.numbox.text(len);
            d.smallType = productSmallType;
        }
        if (parseInt(d.numbox.text(), 10) > 4 && d.choosePro.length > 4) {
            d.compareFaker.find("li.fSelect").hide();
        }
        if (parseInt(d.numbox.text(), 10) > 0 && d.choosePro.length > 0) {
            $("#compareFirst").find("li.fSelect").hide();
        }

        if( typeof historyProduct == "undefined" || historyProduct == "" || historyProduct == null ){
            d.viewUl.html('<li class="msg">'+ d.message[2] +'</li>');
        }else{
            var arrHistory = historyProduct.split(";");
            var len = arrHistory.length > 5 ? 5 : arrHistory.length;
            var str = "", hideClass = "";
            for(var i=len-1; i>=0; i--){
                var arrParam = arrHistory[i].split("|");
                var pubUrl = arrParam[0];
                var shorName = arrParam[1];
                var picUrl = arrParam[2];
                var price = arrParam[3];
                price = parseInt(price) > -1 ? '￥' + price : price;
                var smallTypeId = arrParam[4];
                var id = arrParam[5];
                if(shorName == null) shorName = "";
                if(price == null) price = "";
                (smallTypeId == d.smallType || d.smallType == null) ? hideClass = "" : hideClass = " hide";

                str += '<div class="item">';
                str += '    <a href="' + pubUrl + '" target="_blank" class="item-pic"><img width="80" height="60" alt="" src="' + picUrl + '" /></a>';
                str += '    <div class="item-txts">';
                str += '        <a href="' + pubUrl + '" target="_blank" class="item-title">' + shorName + '</a>';
                str += '        <span class="price">' + price + '</span>';
                str += '    </div>';
                str += '    <i class="icon-item-del" pid="'+id+'"></i>';
                str += '<input type="hidden" value="' + id + '" id="compare_' + id + '" />';
                str += '</div>';
            }
            d.viewUl.append(str);
        }
    },
    comparePro: function(chkbox, pubUrl, shorName, picUrl, price, smallTypeId, id) {
		
        if (chkbox.checked || !$(chkbox).hasClass("checked") && chkbox.tagName != "INPUT") {
            var d = this.data;
            if (d.smallType == "" || d.smallType == null) {
                d.smallType = smallTypeId;
            } else if (d.smallType != smallTypeId) {
                alert(d.message[5]);
                if(chkbox.tagName == "INPUT") chkbox.checked = false;
                return false;
            }
            if (parseInt(d.numbox.text(), 10) >= 5 && d.choosePro.length >= 5) {
                alert(d.message[1]);
                $("#compareBarOut").show();
                $("#JcompareTab").show();
                $(chkbox).removeClass("checked");
                if(chkbox.tagName == "INPUT") chkbox.checked = false;
                return false;
            }
            for(var i=0; i<d.choosePro.length; i++){
                if(id == d.choosePro[i]){
                    alert(d.message[3]);
                    return false;
                }
            }
            // if (d.barBox.hasClass("hide")) d.barBox.show();
            if ($("#compareFirst").find("li.fSelect")) $("#compareFirst").find("li.fSelect").hide();
            if (d.contents.eq(0).hasClass("hide") && chkbox.getAttribute('name').indexOf("compare_") > -1) d.tabs.eq(0).trigger("click");
            this.getElemsByAttr('name','compare_' + id,'div,a,input').each(function(i,el){
                if (el.nodeName == "INPUT") {
                    $(el).attr("checked", true)
                    $(el).parent().parent().addClass("checked");
                } else {
                    $(el).addClass("checked")
                }
                // el.nodeName == "INPUT" ? $(el).attr("checked", true) : $(el).addClass("checked");

                // $(el).parent().parent().addClass("checked");
            });
            this.addComparePro(pubUrl, shorName, picUrl, price, smallTypeId, id);
            if (parseInt(d.numbox.text(), 10) >= 5 && d.choosePro.length >= 5) {
                d.compareFaker.find("li.fSelect").hide();
            }
        } else {
            this.delComparePro(id);
        }
    },
    comparePro2: function(pubUrl, shorName, picUrl, price, smallTypeId, id, numberId) {
        var d = this.data;
        if (d.smallType == "" || d.smallType == null) {
            d.smallType = smallTypeId;
        } else if (d.smallType != smallTypeId) {
            alert(d.message[5]);
            return false;
        }
        for(var i=0; i<d.choosePro.length; i++){
            if(id == d.choosePro[i]){
                alert(d.message[3]);
                return false;
            }
        }
        this.addComparePro(pubUrl, shorName, picUrl, price, smallTypeId, id);

        if($.browser.msie){
            $('#_brandList' + numberId + '_ option').eq(0).attr('selected',"true");
            $('#_productList' + numberId + '_').eq(0).empty().html('<option value=""></option>');
        } else {
            $('#_productList' + numberId + '_ ').attr('onchange', '');
            $('#_productList' + numberId + '_ ').change(function(event) {
                return false;
            });
            $('#_productList' + numberId + '_ ').unbind('change');
            $('#_brandList' + numberId + '_ option').eq(0).attr('selected',"true");
            $('#_productList' + numberId + '_').eq(0).empty().html('<option value=""></option>');
            $('#_productList' + numberId + '_')[0].options[0].selected = true;
            $('#_productList' + numberId + '_ ').change(function(event) {
                eval('doAddCompare_img'+numberId+'Box()');
            });
        }

        this.getElemsByAttr('name','compare_' + id,'div,a,input').each(function(i,el){

            if (el.nodeName == "INPUT") {
                $(el).attr("checked", true)
                $(el).parent().parent().addClass("checked");
            } else {
                $(el).addClass("checked")
            }
        });

        if ($("#compareFirst").find("li.fSelect")) $("#compareFirst").find("li.fSelect").hide();
        if (parseInt(d.numbox.text(), 10) >= 5 && d.choosePro.length >= 5) {
            d.compareFaker.find("li.fSelect").hide();
        }
    },
    compare:function(smallTypeDir){
        var d = this.data;
        var url = null; 
        if(d.choosePro.length <= 0){
            alert("");
            return;
        }
        //http://product.pconline.com.cn/pdlib/compare.do?method=compare&id=436133&id=409514&id=487635
        url = "http://product.pconline.com.cn/pdlib/compare.do?method=compare";
        for(var i = 0;i < d.choosePro.length ;i++){
            var item = d.choosePro[i];
            url += "&id=" + d.choosePro[i];
        }
        window.open(url);
    },
    addComparePro: function(pubUrl, shorName, picUrl, price, smallTypeId, id) {
        $.cookie("barClass", "show", {
            path: '/',
            expires: 1
        });
        var d = this.data;
        if (d.compareUl.find("li").length == 0) {
            d.viewUl.find("input:button").each(function() { //3
                if ($(this).attr("rel") != smallTypeId) $(this).parent().parent().addClass("hide");
            });
        }
        var item = '';
        price = parseInt(price) > -1 ? '￥' + price : price;
        item += '<div class="item">';
        item += '    <a href="' + pubUrl + '" target="_blank" class="item-pic"><img width="80" height="60" alt="" src="' + picUrl + '" /></a>';
        item += '    <div class="item-txts">';
        item += '        <a href="' + pubUrl + '" target="_blank" class="item-title">' + shorName + '</a>';
        item += '        <span class="price">' + price + '</span>';
        item += '    </div>';
        item += '    <i class="icon-item-del" pid="'+id+'"></i>';
        item += '<input type="hidden" value="' + id + '" id="compare_' + id + '" />';
        item += '</div>';

        $(item).hide().appendTo(d.compareUl).fadeIn(300);
        d.numbox.text(parseInt(d.numbox.text(), 10) + 1);
        d.choosePro.push(parseInt(id, 10));
        //  this.popMsg(d.message[3]);
        this.addCookie(pubUrl, shorName, picUrl, price, smallTypeId, id);
        $("#compareBarOut").show();
        $("#JcompareTab").show();

    },
    delComparePro: function(id) {
        var d = this.data;
        //d.compareFaker.sync(); //
        var pos = jQuery.inArray(parseInt(id, 10), d.choosePro);
        if (pos > -1) {
            d.choosePro.splice(pos, 1); //
        } else {
            alert("！");
            return false;
        }
        $("#compare_" + id).parent().remove();
        d.numbox.text(parseInt(d.numbox.text(), 10) - 1);
        this.getElemsByAttr('name','compare_' + id,'div,a,input').each(function(i,el){
            
   //          el.nodeName == "INPUT" ? $(el).attr("checked", false) : $(el).removeClass("checked");
			// $(el).parent().parent().removeClass("checked");
            if (el.nodeName == "INPUT") {
                $(el).attr("checked", false)
                $(el).parent().parent().removeClass("checked");
            } else {
                $(el).removeClass("checked")
            }
        });
        if (parseInt(d.numbox.text(), 10) <= 4 && d.choosePro.length <= 4) {
            d.compareFaker.find("li.fSelect").show();
            //syncWidth();
        }
        if (parseInt(d.numbox.text(), 10) <= 0 && d.choosePro.length <= 0) {
            $('#_brandList1_ option').eq(0).attr('selected',"true");
            $('#_productList1_').eq(0).empty().html('<option value=""></option>');
            // $('#_productList1_ option').eq(0).attr('selected',"true");
            $("#compareFirst").find("li.fSelect").show();
        }
        d.choosePro.length == 0 ? this.setEmpty("compareUl") : this.delCookie(id);
        $("#compareBarOut").show();
        $("#JcompareTab").show();

    },
    addCookie: function(pubUrl, shorName, picUrl, price, smallTypeId, id) {
        var productSmallType = $.cookie("productSmallType");
        if (productSmallType == "" || productSmallType == null) {
            $.cookie("productSmallType", smallTypeId, {
                path: '/',
                expires: 1
            });
        }
        var product = pubUrl + "|" + shorName + "|" + picUrl + "|" + price + "|" + id + ";";
        var compareProducts = $.cookie("compareProducts");
        compareProducts = (compareProducts == "" || compareProducts == null) ? product: compareProducts + product;
        $.cookie("compareProducts", compareProducts, {
            path: '/',
            expires: 1
        });
    },
    delCookie: function(id) {
        var compareProducts = $.cookie("compareProducts");
        var arrProduct = compareProducts.split(";");
        var pos = -1;
        for (var i = 0; i < arrProduct.length; i++) {
            param = arrProduct[i].split("|");
            if (id == param[4]) {
                pos = i;
                break;
            }
        }
        arrProduct.splice(pos, 1);
        compareProducts = arrProduct.join(";");
        $.cookie("compareProducts", compareProducts, {
            path: '/',
            expires: 1
        });
    },
    emptyCont1: function(v) {
        $("#" + v).empty();
        this.setEmpty(v);
        $("#compareFirst").find("li.fSelect").show();
    },
    emptyCont2: function(v) {
        $("#" + v).empty();
        this.setEmpty(v);
    },
    setEmpty: function(v) {
        var d = this.data;
        if (v == "compareUl") {
            var len = d.choosePro.length;
            for (var i = 0; i < len; i++) {
                this.getElemsByAttr('name','compare_' + d.choosePro[i],'div,a,input').each(function(i,el){
                    el.nodeName == "INPUT" ? $(el).attr("checked", false) : $(el).removeClass("checked");
                    $(el).parent().parent().removeClass("checked");
                });
            }
            d.numbox.text(0);

            if (d.compareFaker.find("li.fSelect").hide()) {
                d.compareFaker.find("li.fSelect").show();
            }
            $('#_brandList2_ option').eq(0).attr('selected',"true");
            $('#_productList2_ option').eq(0).attr('selected',"true")
            d.viewUl.find("i.compare").show();
            d.smallType = null;
            d.choosePro = [];
            $.cookie("compareProducts", null, {
                path: '/'
            });
            $.cookie("productSmallType", null, {
                path: '/'
            });
        } else if (v == "viewUl") {
            d.viewUl.html('<li class="msg">' + d.message[2] + '</li>');
            jQuery.cookie('_last_view_product','',{domain: 'product.pconline.com.cn',path: '/',expires: -1})
        }
    },
    clearHistory: function() {
        this.emptyCont2("viweUl");
    },
    userState: function(html) {
        this.data.userState.html(html);
    },
    popMsg: function(msg, width) {
        var d = this.data;
        if (width) d.popMsg.css({
            "width": width + "px",
            "margin-left": -(width / 2 + 1) + "px"
        });
        d.popMsg.text(msg).fadeIn(100);
        setTimeout(function() {
            d.popMsg.fadeOut(500);
            d.popMsg.removeAttr("style");
        },
        1500);
    },
    showToolBar: function() {
        var d = this.data;
        d.toolBar.show();
        $.cookie("barClass", "show", {
            path: '/',
            expires: 1
        });
        this.resetOtherBar();
    },
    // showMini: function() {
    //     var d = this.data;
    //     d.toolBar.addClass("hide");
    //     $.cookie("barClass", "hide", {
    //         path: '/',
    //         expires: 1
    //     });
    // },
    removeBar: function() {
        // d.unfoldBtn.trigger("click");
        // d.barBox.hide();
        //添加cookies
        $.cookie("barClass", "hide", {
            path: '/',
            expires: 1
        });
    },
    hidTab: function() {
        var d = this.data;
        d.closeTab.hide();
        // d.tabs.removeClass("on");
    },
    setOtherBar: function() {
        if ($("#JparamBar")) {
            $("#JparamBar").css("bottom", 323);
            window.paramBarDist = 398 + 80;
        }
        $("#goTopButton").addClass("goTopBtnEx");
        window.goTopDist = 233 + 80;
    },
    resetOtherBar: function() {
        if ($("#JparamBar")) {
            $("#JparamBar").removeAttr("style");
            window.paramBarDist = 398;
        }
        $("#goTopButton").removeClass("goTopBtnEx");
        window.goTopDist = 233;
    },
 
    synchroLogin: function() {
        var self = this;
        if (typeof ajaxLogan == "undefined" || ajaxLogan == "" || ajaxLogan == null) {
            //  setTimeout(arguments.callee, 200);
            setTimeout(function() {
                self.synchroLogin();
            },
            200);
        } else {
            var offLine = '<a target="_self" class="loginTxt" href="http://my.pconline.com.cn/login.jsp?return=' + escape(location.href) + '"></a> <span>|</span> <a target="_blank" href="http://my.pconline.com.cn/passport/register.jsp"></a>',
            online = '欢迎您：<a href="http://my.pconline.com.cn/" target="_blank" id="synchroUser"></a>(<a href="http://my.pconline.com.cn/msg/inbox.jsp" target="_blank"><em class="msg" id="msgNum"></em></a>) [<a target="_self" href="javascript:void(0)" id="synchroExit"></a>]',
            logan = ajaxLogan.checkLogin();
            if (logan.state == true) {
                self.userState(online);
                var logoutBtn = $("#ajaxLogon").find("a:contains('')"),
                userName = $("#name_wrap").text(),
                msgNum = $("#msg_count").text();
                $("#synchroUser").text(userName);
                $("#msgNum").text(msgNum);
                if (msgNum > 0) $("#msgNum").addClass("hasMsg");
                $("#synchroExit").bind("click",
                function() {
                    self.synchroLogout();
                    return false;
                });
                logoutBtn.bind("click", self.synchroLogin);
            } else {
                self.userState(offLine);
            }
        }
    },
    synchroLogout: function() {
        ajaxLogan.exitLogan();
        this.synchroLogin();
    },
    getCompareUrl: function(type){

        var method = type==1?"comparesynthesize":(type==2?"comparepic":"compare");
        var pidStr = "";
        var productCount = 0;
        $("#compareUl input:hidden[id^='compare']").each(function(){
            pidStr += "&id="+this.value;
            productCount ++;
        });
        if(productCount<1){
     
            return false;
        }else if(productCount == 1 && type != 3){
            alert("");
            return false;
        }else{
            var url = "http://product.pconline.com.cn/pdlib/compare.do?method="+method+pidStr;
            window.open(url);
        }
    },

    getElemsByAttr : function(attrName,attrValue,elemType) {
        if ($('div[' + attrName + '="' + attrValue + '"]').length == 0) {
            var elems = $(elemType).filter(function(){
                return $(this).attr(attrName) == attrValue;
            });
            return elems;
        } else {
            var elems = $('[' + attrName + '=' + attrValue + ']');
            return elems;
        }
    }
};

compareBar = new compareBar();

$(function() {
    var isIE6 = ($.browser.msie && $.browser.version < 7);
    if (isIE6) $('#compareBarOut').css({
        "position": "absolute",
        "top": $(window).scrollTop() + $(window).height()
    });
    $(window).bind("scroll load",
    function() {
        $('#compareBarOut').css('top', $(this).scrollTop() + $(this).height());
    });
});
