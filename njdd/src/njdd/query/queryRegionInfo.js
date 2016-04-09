//定义变量
var datajson;
var userphone;
var selecttype;
var colortype;
var items = new Array();
var mapPoint;
var unitname;
//var njpointresult;
//njpointresult = new Array();
var njpointlayer;
var graphictemp;
var pt;
var njpointresult1;
njpointresult1 = new Array();
var dianx;
var diany;
 var unitid = sessionStorage.unitid;
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
        var unitname = sessionStorage.userunit;
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
                var njpointlayer2;
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
                    njpointlayer2 = new GraphicsLayer({ id: "graphicsLayerPoint2" });
                    map.addLayer(njpointlayer2);
                    

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
                    var pt1 = new Point(currentX, currentY, new SpatialReference({ wkid: 4326 }));
                   

                    var symboltemp2 = new PictureMarkerSymbol('../../dep/image/png/tubiao.png', 20, 20);
                    //pt1 = new Point(item.x, item.y, new SpatialReference({ wkid: 4326 }));
                    var graphictemp2 = new Graphic(pt1, symboltemp2);
                    graphictemp2.setAttributes({  "x": currentX, "y": currentY });
                    var content = "<b>经度</b>:<strong>${x}</strong> <br/><b>纬度</b>: <strong>${y}</strong>";
                    var infoTemplate = new InfoTemplate("信息", content);
                    graphictemp2.setInfoTemplate(infoTemplate);
                    njpointlayer2.add(graphictemp2);
                    map.centerAndZoom(pt1, 15);

                }

                ////////
                $("#btn_sumbit").click(function () {
                    
                    if (circle != null) {
                        //zaici();
                    //定义要画的图形的线条颜色  
                    var symbol = new SimpleFillSymbol().setColor(null).outline.setColor("blue");
                    var geodesic = dom.byId("input_area");
                    {
                        var point = new Point([dianx, diany]);
                        circle = new Circle(point, {
                            //center: e.mapPoint,
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
                    }
                    relateGeometries();

                    } else {
                        alert("请点击地图查询范围");

                    }

                });





                /////////////
                //画圆
                function drawCircle(jsondata) {
                    //定义要画的图形的线条颜色  
                    var symbol = new SimpleFillSymbol().setColor(null).outline.setColor("blue");
                    var  geodesic = dom.byId("input_area");
                    map.on("click", function (e) {
                        circle = new Circle({
                            center: e.mapPoint,
                           
                            geodesic: domAttr.get(geodesic, "checked"),
                            radius: document.querySelector("#input_area").value //获取范围
                        });
                       dianx =e.mapPoint.x;
                       diany =e.mapPoint.y;
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
                    
                    var njpointresult;
                    njpointresult = new Array();
                    //njpointresult = new Array();
                    var a = 0;
                    

                    for (var b = 0; b < getdata.result.datas.length; b++) {
                        var pt = new Point(getdata.result.datas[b].x, getdata.result.datas[b].y);
                        if (circle.contains(pt)) {
                            items[a] = getdata.result.datas[b];
                            njpointresult[a] = getdata.result.datas[b];
                             njpointresult1[a] = njpointresult[a];
                            a++;

                          
                        } 
                       
                      
                    }
                   
                 
                        //信息与checkbox绑定
                    $(":checkbox").each(function () {
                       
                            if ($(this).attr("checked") == "checked") {

                                $.each(njpointresult, function (i, item) {
                                    if (item.unit_id == unitid) {
                                        var symboltemp = new PictureMarkerSymbol('../../dep/image/png/free.png', 20, 20);
                                        mapPoint = new Point(item.x, item.y, new SpatialReference({ wkid: 4326 }));
                                        var graphictemp = new Graphic(mapPoint, symboltemp);
                                        graphictemp.setAttributes({ "username": item.username, "x": item.x, "y": item.y });
                                        var content = "<b>用户姓名</b>: <strong>${username}</strong> <br/><b>经度</b>:<strong>${x}</strong> <br/><b>纬度</b>: <strong>${y}</strong>";
                                        var infoTemplate = new InfoTemplate("信息", content);
                                        graphictemp.setInfoTemplate(infoTemplate);
                                        njpointlayer.add(graphictemp);

                                    }

                                  

                                });
                                //alert("只查询本车队");
                               

                            } else {
                                $.each(njpointresult, function (i, item) {                                    
                                        var symboltemp = new PictureMarkerSymbol('../../dep/image/png/free.png', 20, 20);
                                        mapPoint = new Point(item.x, item.y, new SpatialReference({ wkid: 4326 }));
                                        var graphictemp = new Graphic(mapPoint, symboltemp);
                                        graphictemp.setAttributes({ "username": item.username, "x": item.x, "y": item.y });
                                        var content = "<b>用户姓名</b>: <strong>${username}</strong> <br/><b>经度</b>:<strong>${x}</strong> <br/><b>纬度</b>: <strong>${y}</strong>";
                                        var infoTemplate = new InfoTemplate("信息", content);
                                        graphictemp.setInfoTemplate(infoTemplate);
                                        njpointlayer.add(graphictemp);

                                });
                                //alert("查询所有车队");
                            }
                        });
                        //信息与checkbox绑定

                 
                        $(document).on("pagebeforecreate", "#njinfopage", function () {
                            $("#logmanagepage_listview").empty();
                            $(":checkbox").each(function () {

                                if ($(this).attr("checked") == "checked") {

                                    //alert("只查询本车队");
                                    $.each(njpointresult, function (i, item) {
                                        if (item.unit_name == unitname) {
                                              njinfopageuser(item);
                                        }

                                    });

                                } else {

                                    $.each(njpointresult, function (i, item) {
                                        
                                            njinfopageuser(item);
                                        

                                    });

                                    //alert("查询所有车队");
                                }
                            });

                            

                        });

                     

                }

            

                function njinfopageuser(item) {
                    if (item.unit_name == null) {
                        item.unit_name = "无";
                    }
                    //模板渲染                   
                    var html = tmpl("tmpl_logmanagepage_detailinfo", item);
                    $(html).appendTo("#logmanagepage_listview").trigger('create');
                }

               

            

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



function njinfo_btn_click(userid) {
   
    userphone = null;
    $.each(njpointresult1, function (i, item) {
        if (item.unit_name == null) {
            item.unit_name = "无";
        }
        if (item.userid == userid) {
            userphone = item.phone;
            $(document).on("pageinit", "#detailinfopage", function () {
                $("#detailinfopage_username").val(item.username);
              
                $("#detailinfopage_car_type").val(item.car_type);
                $("#detailinfopage_car_horsepower").val(item.car_horsepower);
                $("#detailinfopage_unit_name").val(item.unit_name);
                $("#detailinfopage_car_code").val(item.car_code);
                $("#detailinfopage_phone").val(item.phone);
            
            });
            return;
        }


    });
    
}

