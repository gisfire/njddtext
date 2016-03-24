
//定义变量
var datajson;
var userphone;
var selecttype;
var colortype;
var items = new Array();
var mapPoint;
var unitname;

var zhi;
var njpointresult;
njpointresult = new Array();
var njpointlayer;
var graphictemp;

(function (window) {
    $(document).ready(function () {

        (function () {
            var screen = $.mobile.getScreenHeight(),
            header = $("#main-header").hasClass("ui-header-fixed") ? $("#main-header").outerHeight() - 1 : $("#main-header").outerHeight(),
            footer = $("#main-footer").hasClass("ui-footer-fixed") ? $("#main-footer").outerHeight() - 1 : $("#main-footer").outerHeight(),
            contentCurrent = $("#main-content").outerHeight() - $("#main-content").height(),
            content = screen - header - footer - contentCurrent;
            $("#main-content").height(content);
            $("#taskDraw-content").height(content);
            $("#essenDraw-content").height(content);
            $("#editTask-content").height(content);
            $("#editEssence-content").height(content);
            $("#convert-content").height(content);
        })();
        var unitname = "寿西湖农场";
        require([
                "esri/map",
                "bdlib/TDTVecLayer",
                "esri/layers/FeatureLayer",
                "esri/graphic",
                "esri/geometry/Point",
                "esri/geometry/Polyline",
                "esri/geometry/Circle",
                "esri/geometry/Polygon",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/SimpleFillSymbol",
                "esri/layers/GraphicsLayer",
                "esri/SpatialReference",
                "esri/symbols/PictureMarkerSymbol",
                "esri/InfoTemplate",
                "esri/graphicsUtils",
                "esri",
                "dojo",
                "dojo/dom",
                "dojo/dom-attr",
                "dojo/domReady!"
        ],
            function (
                Map,
                TDTVecLayer,
                FeatureLayer,
                Graphic,
                Point,
                Polyline,
                Circle,
                Polygon,
                SimpleLineSymbol,
                SimpleMarkerSymbol,
                SimpleFillSymbol,
                GraphicsLayer,
                SpatialReference,
                PictureMarkerSymbol,
                InfoTemplate,
                GraphicsUtils,
                esri,
                dojo,
                dom,
                domAttr
            ) {
                var njpointlayer1;
                var currentX, currentY; //save the latitude and longitude in real-time
                var map;
                var gl; //use it to create graphic.       
                var lastGraphic;
                var circle;
               
                //var njpointresult;
                var getdata; //全局变量

                //initialMap
                (function () {
                    map = new Map("map", {
                        logo: false,
                    });
                    var imgMap = new TDTVecLayer();
                    map.addLayer(imgMap);
                    gl = new GraphicsLayer({ id: "graphicsLayer" });
                    njpointlayer = new GraphicsLayer();
                    //drawData();
                    map.addLayer(gl);
                    map.addLayer(njpointlayer);
                    njpointlayer1 = new GraphicsLayer({ id: "graphicsLayerPoint1" });
                    drawCircle(); //画圆/////
                    map.addLayer(njpointlayer1);

                    
                    //显示所有车队的列表
                    //$.ajax({
                    //    type: "get",
                    //    url: domain + url_getUnit + "?token=1",
                    //    async: true,
                    //    dataType: 'json',
                    //    success: function (data) {
                    //        $.each(data.result.datas, function (i, item) {
                    //            $("#personinfopage_unitName").append("<option value='" + item.id + "'>" + item.name + "</option>");
                    //        });
                    //        unitname = $("#personinfopage_unitName").find("option:selected").text();
                    //    }

                    //});


                })();
                //initialAction
                (function () {

                    setPosition(function () {
                        zoomToPoint();
                    });
                })();

                // 调用定位功能,回调dealFunc进行处理
                function setPosition(dealFunc) {
                    if (navigator.geolocation) {
                        function success(pos) {
                            currentX = pos.coords.longitude;
                            currentY = pos.coords.latitude;
                            dealFunc();
                        }

                        function fail(error) {
                            alert("出错,无法设置坐标");
                        }

                        navigator.geolocation.getCurrentPosition(success, fail, { maximumAge: 100000, enableHighAccuracy: true, timeout: 6000 });
                    }
                }

                function zoomToPoint() {
                    var pt = new Point(currentX, currentY, new SpatialReference({ wkid: 4326 }));
                    map.centerAndZoom(pt, 15);


                }

                //画圆
                function drawCircle(jsondata) {
                    //定义要画的图形的线条颜色  
                    var symbol = new SimpleFillSymbol().setColor(null).outline.setColor("blue");
                    var geodesic = dom.byId("input_area");
                    map.on("click", function (e) {
                        circle = new Circle({
                            center: e.mapPoint,
                            geodesic: domAttr.get(geodesic, "checked"),
                            radius: document.querySelector("#input_area").value //获取范围
                        });
                        gl.clear();
                        var polycircle = new Graphic(circle, symbol);
                        gl.add(polycircle);
                        lastGraphic = polycircle;
                        map.setExtent(circle.getExtent());
                        drawData(); //画圆后请求数据
                        njpointlayer1.clear();
                    });

                }

                //判断点是否在圆内
                function relateGeometries() {
                    njpointlayer.clear();
                    //njpointresult = new Array();
                    var a = 0;
                    for (var i = 0; i < getdata.result.datas.length; i++) {
                        var pt = new Point(getdata.result.datas[i].x, getdata.result.datas[i].y);
                        if (circle.contains(pt)) {
                            items[a] = getdata.result.datas[i];
                            njpointresult[a] = getdata.result.datas[i];
                            a++;

                            var symboltemp = new PictureMarkerSymbol('../../dep/image/png/free.png', 20, 20);
                            var pointtemp = new Point([getdata.result.datas[i].x, getdata.result.datas[i].y], new SpatialReference({ wkid: 4326 }));
                             graphictemp = new Graphic(pointtemp, symboltemp);
                            graphictemp.setAttributes({ "username": getdata.result.datas[i].username, "x": getdata.result.datas[i].x, "y": getdata.result.datas[i].y });
                            var content = "<b>用户姓名</b>: <strong>${username}</strong> <br/><b>经度</b>:<strong>${x}</strong> <br/><b>纬度</b>: <strong>${y}</strong>";
                            var infoTemplate = new InfoTemplate("信息", content);
                            graphictemp.setInfoTemplate(infoTemplate);
                            njpointlayer.add(graphictemp);

                        }
                        // $("#content_panelbody").empty();
                    }
                    // xianshi();
                    // showitems(njpointresult);//在右侧栏显示农机信息
                }

                //$(document).ready(function () {

                //    $("#personinfopage_unitName").change(function () {
                //        //zhi = document.getElementById("personinfopage_unitName").val();                 
                //        unitname = $("#personinfopage_unitName").find("option:selected").text();
                //    });
                //});

                //对机车渲染模版
                //function showitems() {
                //    $.each(njpointresult, function (i, item) {

                //        document.getElementById(item.userid).onclick = function () { dingwei(item.username, item.x, item.y); };
                //    });

                //    function dingwei(username, x, y) {
                //        njpointlayer1.clear();
                //        var symboltemp = new PictureMarkerSymbol('../../image/png/free.png', 35, 35);
                //        mapPoint = new Point(x, y, new SpatialReference({ wkid: 4326 }));
                //        var graphictemp = new Graphic(mapPoint, symboltemp);
                //        graphictemp.setAttributes({ "username": username, "x": x, "y": y });
                //        var content = "<b>用户姓名</b>: <strong>${username}</strong> <br/><b>经度</b>:<strong>${x}</strong> <br/><b>纬度</b>: <strong>${y}</strong>";
                //        var infoTemplate = new InfoTemplate("信息", content);
                //        map.centerAndZoom(mapPoint, 14);
                //        graphictemp.setInfoTemplate(infoTemplate);
                //        njpointlayer1.add(graphictemp);
                //    }

                //}


                //点击后查询至显示的车队
                //$(document).ready(function () {
                //    $("#cargroup").on("click", function () {

                //    });
                //});


                //function xianshi() {
                //    $.each(njpointresult, function(i, item) {
                //        logmanagepagecar(item);
                //    });
                //}

                //function logmanagepagecar(item) {
                //    //模板渲染
                //    var html = tmpl("tmpl_logmanagepage_detailinfo", item);
                //    $(html).appendTo("#logmanagepage_listview").trigger('create');
                //};


                $(document).on("pagebeforecreate", "#njinfopage", function () {
                    $.each(njpointresult, function (i, item) {
                        njinfopageuser(item);

                    });

                });

                function njinfopageuser(item) {
                    if (item.unit_name == null) {
                        item.unit_name = "无";
                    }
                    //模板渲染
                    var html = tmpl("tmpl_logmanagepage_detailinfo", item);
                    $(html).appendTo("#logmanagepage_listview").trigger('create');
                }

               

                //信息与checkbox绑定
                //function chedui() {

                    $(":checkbox").each(function () {
                        $(this).click(function () {
                            if ($(this).attr("checked") == "checked") {

                                $.each(njpointresult, function (i, item) {
                                    if (item.unit_name == unitname) {
                                        var symboltemp = new PictureMarkerSymbol('../../dep/image/png/free.png', 20, 20);
                                        mapPoint = new Point(item.x, item.y, new SpatialReference({ wkid: 4326 }));
                                        var graphictemp = new Graphic(mapPoint, symboltemp);
                                        graphictemp.setAttributes({ "username": item.username, "x": item.x, "y": item.y });
                                        var content = "<b>用户姓名</b>: <strong>${username}</strong> <br/><b>经度</b>:<strong>${x}</strong> <br/><b>纬度</b>: <strong>${y}</strong>";
                                        var infoTemplate = new InfoTemplate("信息", content);
                                       
                                        graphictemp.setInfoTemplate(infoTemplate);
                                        njpointlayer1.add(graphictemp);

                                    }
                                });
                               

                            } else {

                                njpointlayer.clear();

                            }
                        });
                    });
                //}
                
                   

                //请求数据
                function drawData() {
                    var jsondata;

                    $.ajax({
                        type: "get",
                        url: domain + url_userStatus + "?token=1",
                        async: false,
                        success: function (data) {
                            getdata = data;
                            jsondata = data.result.datas;
                        },
                        error: function (errorMsg) {
                            alert("请求数据失败\n" + errorMsg.toString());
                        }
                    });

                    relateGeometries(); //关联圆与点

                }

            });
    });
})(window);



function njinfo_btn_click(carid) {
    userphone = null;
    $.each(njpointresult, function (i, item) {
        if (item.unit_name == null) {
            item.unit_name = "无";
        }
        if (item.userid == carid) {
            userphone = item.phone;
            $(document).on("pageinit", "#detailinfopage", function () {
                $("#detailinfopage_username").html(item.username);
                $("#detailinfopage_carname").html(item.car_brand);
                $("#detailinfopage_power").html(item.car_horsepower);
                $("#detailinfopage_username").html(item.unit_name);
                $("#detailinfopage_carname").html(item.car_brand);
                $("#detailinfopage_power").html(item.car_type);
            });
            return;
        }


    });
}

