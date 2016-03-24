var datajson;
var userphone;
var selecttype;
(function (window) {
    require(["esri/map",
        "bdlib/TDTVecLayer",
        "esri/layers/FeatureLayer",
        "esri/graphic",
        "esri/geometry/Point",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/layers/GraphicsLayer",
        "esri/SpatialReference",
        "esri/symbols/PictureMarkerSymbol",
         "esri/layers/GraphicsLayer",
         "esri/geometry/Point",
         "esri/InfoTemplate",
        "dojo/domReady!"],
        function (
            Map,
            TDTVecLayer,
            FeatureLayer,
            Graphic,
            Point,
            SimpleMarkerSymbol,
            SimpleFillSymbol,
            GraphicsLayer,
            SpatialReference,
            PictureMarkerSymbol,
            GraphicsLayer,
            Point,
            InfoTemplate
        ) {
            document.getElementById("condouctpage_querybtn").onclick = function () { condoctpage_querybtn_click(); };
            var map;
            var gl;
            var point = new Array();
            var symbol = new Array();
            var allusergraphicLayer;
            //加载地图
            (
            function () {
                map = new Map("map", {
                    logo: false,
                    center: [118.312675, 32.276035],
                    zoom: 13
                });
                var imgMap = new TDTVecLayer();
                map.addLayer(imgMap);
                gl = new GraphicsLayer({ id: "pointLayer" });
                map.addLayer(gl);
                allusergraphicLayer = new GraphicsLayer();
                map.addLayer(allusergraphicLayer);
                getAllUsers("0");
            }
            )();

            function condoctpage_querybtn_click() {
                var selectval = $("#condouctpage_select").val();
                getAllUsers(selectval);
            }

            function suregraphic(picname,item) {
                var symboltemp = new PictureMarkerSymbol('../../dep/jquery-mobile/images/icons-png/' + picname + '.png', 20, 20);
                var pointtemp = new Point([item.x, item.y], new SpatialReference({ wkid: 4326 }));
                var graphictemp = new Graphic(pointtemp, symboltemp);
                graphictemp.setAttributes({ "username": item.username });
                var content = "<b>用户姓名</b>: <strong>${username}</strong>";
                var infoTemplate = new InfoTemplate("信息", content);
                graphictemp.setInfoTemplate(infoTemplate);
                allusergraphicLayer.add(graphictemp);
            }

            function getAllUsers(selectval) {
                allusergraphicLayer.clear();
                $.ajax({
                    url: domain+url_userStatus+"?token=1",
                    type: 'get',
                    async: false,
                    success: function (json) {


                        if (typeof (json) == "object") {
                            //为对象
                            datajson = json;
                        }
                        else {
                            //将字符串转换为对象
                            datajson = JSON.parse(json);
                        }

                        $.each(datajson.result.datas, function (i, item) {
                            switch (item.status) {
                                case "空闲":
                                    if (selectval == "0" || selectval == "1") {
                                        suregraphic("free", item);
                                        selecttype = item.status;
                                    }
                                    break;
                                case "停靠超时":

                                    if (selectval == "0" || selectval == "2") {
                                        suregraphic("overrest", item);
                                        selecttype = item.status;
                                    }
                                    break;
                                case "疲劳驾驶":

                                    if (selectval == "0" || selectval == "3") {
                                        suregraphic("tireDriving", item);
                                        selecttype = item.status;
                                    }
                                    break;
                                case "超速":

                                    if (selectval == "0" || selectval == "4") {
                                        suregraphic("Speeding", item);
                                        selecttype = item.status;
                                    }
                                    break;
                                case "超出区域范围":
                                    if (selectval == "0" || selectval == "5") {
                                        suregraphic("overrange", item);
                                        selecttype = item.status;
                                    }
                                    break;
                                case "正常":
                                    if (selectval == "0" || selectval == "6") {
                                        suregraphic("executing", item);
                                        selecttype = item.status;
                                    }
                                    break;
                                default:
                            }
                        });
                        if (selectval == '0') {
                            selecttype = "所有用户";
                        }
                    }
                });
            }
        });
})(window);





$(document).on("pagebeforecreate", "#njinfopage", function () {
    $.each(datajson.result.datas, function (i, item) {
        if (selecttype == "所有用户") {
            njinfopageuser(item);
        } else if (item.status == selecttype) {
            njinfopageuser(item);
        }

    });

});

function njinfopageuser(item) {
    if (item.unit_name == null) {
        item.unit_name = "无";
    }
    //模板渲染
    var html = tmpl("tmpl_conduct_detailinfo", item);
    $(html).appendTo("#njinfopage_listview").trigger('create');
}

function njinfo_btn_click(id) {
    userphone = null;
    $.each(datajson.result.datas, function (i, item) {
        if (item.unit_name == null) {
            item.unit_name = "无";
        }
        if (item.userid == id) {
            userphone = item.phone;
            $(document).on("pageinit", "#detailinfopage", function () {
                $("#detailinfopage_username").html(item.username);
                $("#detailinfopage_carname").html(item.car_brand);
                $("#detailinfopage_power").html(item.car_horsepower);
            });
            return;
        }

        
    });
}

function detailinfopage_smsbtn_click() {
    //alert($("#detailinfopage_smsinfo").val());
    if (userphone!=null) {
        window.location.href = "sms:" + userphone + "?body=" + $("#detailinfopage_smsinfo").val();
    }
}






