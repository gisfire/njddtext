(function (window) {
    require([
            "esri/map",
            "bdlib/TDTVecLayer",
            "esri/layers/FeatureLayer",
            "esri/graphic",
            "esri/graphicsUtils",
            "esri/geometry/Point",
            "esri/geometry/Polyline",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/PictureMarkerSymbol",
            "esri/symbols/SimpleFillSymbol",
            "esri/layers/GraphicsLayer",
             "esri/InfoTemplate",
            "esri/SpatialReference",
            "dojo/domReady!",
            "esri",
             "dojo/dom",
            "dojo/dom-attr",
            "dojo"
    ],
        function (
            Map,
            TDTVecLayer,
            FeatureLayer,
            Graphic,
            GraphicsUtils,
            Point,
            Polyline,
            SimpleLineSymbol,
            SimpleMarkerSymbol,
            PictureMarkerSymbol,
            SimpleFillSymbol,
            GraphicsLayer,
             InfoTemplate,
            SpatialReference,        
            esri,
            dojo
        ) {
            var njpointresult;
            var njpointlayer;
            var map;
            var gl; //use it to create graphic.
            // flags of the style of buttons

            var lastGraphic;
            var userid, carid;

            var currentX, currentY;

            ///////////////////////////////////////
            // initialData
            (function () {
                lastGraphic = null;
                userid = sessionStorage.userid;
                carid = sessionStorage.carid;
            })();

            //initialMap
            (function () {
                map = new Map("map", {
                    logo: false
                });
                var imgMap = new TDTVecLayer();
                map.addLayer(imgMap);
                gl = new GraphicsLayer({ id: "graphicsLayer" });
                map.addLayer(gl);
                njpointlayer = new GraphicsLayer({ id: "graphicsLayerPoint" });

                map.addLayer(njpointlayer);
            })();

            //initialAction
            (function() {
                setCarSelection();
                setPosition(function () {
                    zoomToPoint();
                });
            })();


            // 设置农机编号选项
            function setCarSelection() {
                var carData = getAllCar();
                // 检查是否有数据
                if (carData == null) return;

                var selcDom = $("#sele_car");
                // empty options
                selcDom.empty();

                selcDom.append("<option value='-1'>请选择农机</option>");

                var taskItems = carData["result"]["datas"];
                for (var i = 0; i < taskItems.length; i++) {
                    var opt = "<option value='" + taskItems[i].id + "'>" + taskItems[i].car_code + "</option>";
                    selcDom.append(opt);
                }

                var option = $($("option", selcDom).get(0));
                option.attr('selected', 'selected');
                selcDom.selectmenu();
                selcDom.selectmenu('refresh', true);
            }
            // 获得所有农机数据
            function getAllCar() {
                var paramStr = "?token=1";
                var data;
                $.ajax({
                    type: "get",
                    async: false, //同步执行
                    url: domain + url_getCarInfo + paramStr,
                    dataType: "json",
                    timeout: 3000,
                    success: function (result) {
                        if (result.message.statusCode == 200) {
                            data = result;
                        }
                        else {
                            data = null;
                        }
                    },
                    error: function (errorMsg) {
                        data = null;
                        alert("出错,无法查询任务\n" + errorMsg.toString());
                    }
                });


                Date.prototype.format = function (format) {
                    var date = {
                        "M+": this.getMonth() + 1,
                        "d+": this.getDate(),
                        "h+": this.getHours(),
                        "m+": this.getMinutes(),
                        "s+": this.getSeconds(),
                        "q+": Math.floor((this.getMonth() + 3) / 3),
                        "S+": this.getMilliseconds()
                    };
                    if (/(y+)/i.test(format)) {
                        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                    }
                    for (var k in date) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                                   ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                        }
                    }
                    return format;
                }

                return data;
            }

            // 调用手机的定位功能,回调dealFunc进行处理
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

            // 定位到用户所在点
            function zoomToPoint() {
                var pt = new Point(currentX, currentY, new SpatialReference({ wkid: 4326 }));
                map.centerAndZoom(pt, 17);
            }

            //画点
            function drawPoint(jsondata) {
                
                var a = 0;
                njpointresult = new Array();
                for (var i = 0; i < jsondata.length; i++) {
                    //items[a] = jsondata[i];
                    njpointresult[a] = jsondata[i];
                    a++;
                    var newDate = new Date();
                    newDate.setTime(jsondata[i].recordtime);
                    jsondata[i].recordtime = newDate.format('yyyy-MM-dd h:m:s');
                    var symboltemp = new PictureMarkerSymbol('../../dep/image/png/free.png', 20, 20);
                    var pointtemp = new Point([jsondata[i].x, jsondata[i].y], new SpatialReference({ wkid: 4326 }));
                    var graphictemp = new Graphic(pointtemp, symboltemp);
                    graphictemp.setAttributes({ "username": jsondata[i].username, "x": jsondata[i].x, "y": jsondata[i].y, "recordtime": jsondata[i].recordtime });
                    var content = "<b>用户姓名</b>: <strong>${username}</strong> <br/><b>经度</b>:<strong>${x}</strong> <br/><b>纬度</b>: <strong>${y}</strong> <br/> <b>时间</b>:<strong>${recordtime}</strong>";
                    var infoTemplate = new InfoTemplate("信息", content);
                    graphictemp.setInfoTemplate(infoTemplate);
                    njpointlayer.add(graphictemp);

                }

            }
            

            //画线s
            function drawLined(jsondata) {
                var arraysecond = new Array();
                for (var i = 0; i < jsondata.length; i++) {
                    var arrayfirst = new Array();
                    arrayfirst.push(jsondata[i].x);
                    arrayfirst.push(jsondata[i].y);
                    arraysecond.push(arrayfirst);
                }
                console.log(JSON.stringify(arraysecond));
                var arraythird = new Array();
                //arraythird.push(arraysecond);
                var line = new Polyline(arraysecond);
                var symbol = new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 0]), 2);

                var polyline = new Graphic(line, symbol);
                gl.add(polyline);
                lastGraphic = polyline;
                map.setExtent(GraphicsUtils.graphicsExtent([polyline]));
            }

            $(document).ready(function () {
                $("#btn_start").on("click", function () {
                    var value = $("#sele_car").val();
                    if (value != "-1") {
                        drawData(value);
                    } else {
                        alert("您未选择农机");
                    }
                });
            });

            // 绘制历史轨迹,value为农机id
            function drawData(value) {
                var paramStr = "?token=1&carid="+value+"&starttime=" + document.querySelector("#input_startime").value + "%2011:49:45&endtime=" + document.querySelector("#input_endtime").value + "%2011:49:45";
                var jsondata;
                console.log(domain + url_queryHistory + paramStr);
                $.ajax({
                    type: "get",
                    url: domain + url_queryHistory + paramStr,
                    async: false,
                    success: function (data) {
                        jsondata = data.result.datas;
                        
                    },
                    error: function (errorMsg) {
                        alert("请求数据失败\n" + errorMsg.toString());
                    }
                });
                gl.clear();
                drawPoint(jsondata);
                drawLined(jsondata);
            }
        });
})(window);
