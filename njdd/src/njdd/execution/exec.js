//Task execution

(function (window) {
    require([
        "esri",
        "esri/map",
        "bdlib/TDTVecLayer",
        "esri/layers/FeatureLayer",
        "esri/graphic",
        "esri/graphicsUtils",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/layers/GraphicsLayer",
        "esri/SpatialReference",
        "dojo/domReady!"],
        function (
            esri,
            Map,
            TDTVecLayer,
            FeatureLayer,
            Graphic,
            GraphicsUtils,
            Point,
            Polyline,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            SimpleFillSymbol,
            GraphicsLayer,
            SpatialReference
        ) {
            var currentX, currentY; //save the latitude and longitude in real-time
            var map;
            var gl; //use it to create graphic.
            // flags of the style of buttons
            var startBtnEnable, pauseBtnEnable, comptBtnEnable;
            // flags of the status of users.
            var isResting, isPausing, isExecuting, isCompleting;
            // button element
            var elemBtnStart, elemBtnPause, elemBtnCompt;

            var lastGraphic;

            var taskid, userid, carid;

            var intervalTime;

            // record the start time of pause or work.
            var startPauseTime, startWorkTime;
            // 存放所有任务数据
            var taskData;

            var wkt;


            ///////////////////////////////////////////////////////
            // initialData
            (function () {
                startBtnEnable = true;
                pauseBtnEnable = comptBtnEnable = false;
                isResting = true;
                isPausing = isExecuting = isCompleting = false;
                lastGraphic = null;
                taskid = "";
                userid = sessionStorage.userid;
                carid = sessionStorage.carid;
                intervalTime = 120000;
                elemBtnStart = document.querySelector("#btn_start");
                elemBtnPause = document.querySelector("#btn_pause");
                elemBtnCompt = document.querySelector("#btn_compt");
                wkt = new Wkt.Wkt();
            })();

            //initialMap
            (function() {
                map = new Map("map", {
                    logo: false
                });
                var imgMap = new TDTVecLayer();
                map.addLayer(imgMap);
                gl = new GraphicsLayer({ id: "pointLayer" });
                map.addLayer(gl);;
            })();

            // initialAction
            (function () {
                setPosition(function () {
                    zoomToPoint();
                    drawPoint();
                    saveInfo();
                });
                setSelectTask();
            })();

            // draw a point to reveal the position of user.
            function drawPoint() {
                // remove the point drawn in last time.
                if (lastGraphic != null) {
                    gl.remove(lastGraphic);
                }
                var pt = new Point(currentX, currentY, new SpatialReference({ wkid: 4326 }));
                var symbol = new SimpleMarkerSymbol();
                var graphic = new Graphic(pt, symbol);
                gl.add(graphic);
                // save point
                lastGraphic = graphic;
            }

            // determine the length for the input points using the "meters" unit.
            function calDistance(x1,y1,x2,y2) {
                var polyline = {
                    "paths": [[[x1, y1], [x2, y2]]],
                    "spatialReference": { "wkid": 4326 }
                };

                polyline = new esri.geometry.Polyline(polyline);
                var lengthArray = esri.geometry.geodesicLengths([polyline], esri.Units.METERS);
                return lengthArray[0];
            }

            // insert task options into select dom.
            function setSelectTask() {
                taskData = getUserTask(userid);
                
                var selcDom = $("#sele_task");
                // empty options
                selcDom.empty();
                 
                var initIndex = 0;

                var optionSum = 0;
                selcDom.append("<option value='-1'>请选择任务</option>");
                
                if (taskData != null) {
                    var taskItems = taskData["result"]["datas"];
                    for (var i = 0; i < taskItems.length; i++) {
                        if (taskItems[i].status != "完成任务") {
                            var workData = getUserWork(taskItems[i].workid);
                            if (workData != null) {
                                if (workData.result.datas.length > 0) {
                                    optionSum++;
                                    var opt = "<option value='" + taskItems[i].id + "'>" + workData.result.datas[0].name + "</option>";
                                    selcDom.append(opt);
                                    if (taskItems[i].status == "执行中") {
                                        openExecutingStatus();
                                        initIndex = optionSum;
                                    }
                                    if (taskItems[i].status == "休息") {
                                        openPausingStatus();
                                        initIndex = optionSum;
                                    }
                                }
                            }
                        }
                    }
                }
                var option = $($("option", selcDom).get(initIndex));
                option.attr('selected', 'selected');
                selcDom.selectmenu();
                selcDom.selectmenu('refresh', true);
                // 如果选择项都是"未执行"的任务，则切换为Resting状态
                // 否则让select标签不可选
                if (initIndex == 0) {
                    selcDom.attr("disabled", false);
                    openRestingStatus();
                } else {
                    alert("您有未完成的任务,无法选择其他新任务");
                    selcDom.attr("disabled", true);
                }
            }

            // 得到用户的所有任务.
            function getUserTask(queryUserid) {
                var paramStr = "?token=1&userid=" + queryUserid;
                var data;
                $.ajax({
                    type: "get",
                    async: false, //同步执行
                    url: domain + url_executionGetTask + paramStr,
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
                return data;
            }

            // 通过workid获取作业数据
            function getUserWork(workid) {
                var paramStr = "?token=1&workid=" + workid;
                var data;
                $.ajax({
                    type: "get",
                    async: false, //同步执行
                    url: domain + url_executionGetWork + paramStr,
                    dataType: "json",
                    timeout: 3000,
                    success: function (result) {
                        if (result.message.statusCode == 200)
                            data = result;
                        else {
                            data = null;
                        }
                    },
                    error: function (errorMsg) {
                        data = null;
                        alert("出错,无法查询任务\n" + errorMsg.toString());
                    }
                });
                return data;
            }

            // 定位到用户所在点
            function zoomToPoint() {
                var pt = new Point(currentX, currentY, new SpatialReference({ wkid: 4326 }));
                map.centerAndZoom(pt, 17);
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

            // 绘制工作范围
            function drawWorkRange(value) {
                if (taskData == null)
                    return;
                var workid = null;
                var taskItems = taskData["result"]["datas"];
                // 找到用户选择的任务对应的workid.
                for (var i = 0; i < taskItems.length; i++) {
                    if (taskItems[i]["id"] == value) {
                        workid = taskItems[i]["workid"];
                        break;
                    }
                }
                // 获取到作业数据
                if (workid != null) {
                    var type;
                    var workdata = getUserWork(workid);
                    if (workdata != null) {
                        if (workdata.result.datas.length > 0) {
                            // 根据|符号分隔字符串
                            var wktArray = workdata.result.datas[0]["gml"].split("|");
                            // 清空图层
                            gl.clear();
                            for (i = 0; i < wktArray.length - 1; i++) {
                                if (wktArray[i] != "") {
                                    // 读取wkt
                                    wkt.read(wktArray[i]);
                                    var config = {
                                        spatialReference: {
                                            wkid: 4326 // WGS84 unprojected
                                        }
                                    };
                                    // 根据config将wkt转为esri对象
                                    var obj = wkt.toObject(config);
                                    var symbol = null;
                                    switch (obj.type) {
                                        case "polyline":
                                            symbol = new SimpleLineSymbol();
                                            break;
                                        case "polygon":
                                            symbol = new SimpleFillSymbol();
                                            break;
                                    }
                                    var graphic = new Graphic(obj, symbol);
                                    gl.add(graphic);
                                }
                                map.setExtent(GraphicsUtils.graphicsExtent(gl.graphics));
                            }
                        }
                    }
                }
            }

            // visit the api to save the point and other information
            function saveInfo() {
                // data ready to post
                var data = new Object();
                var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss");
                data["token"] = "1";
                data["data"] = new Object();
                data["data"]["filter"] = new Object();
                data["data"]["items"] = [];
                data["data"]["param"] = new Object();
                data["data"]["param"]["x"] = currentX;
                data["data"]["param"]["y"] = currentY;
                data["data"]["param"]["userid"] = userid;
                data["data"]["param"]["carid"] = carid;
                data["data"]["param"]["recordtime"] = dateStr;
                data["data"]["param"]["taskid"] = taskid;
                $.ajax({
                    type: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    async: true, //异步执行
                    url: domain + url_executionLocation,
                    data: JSON.stringify(data),
                    dataType: "json",
                    timeout: 3000,
                    success: function (result) {
                    },
                    error: function (errorMsg) {
                        alert("出错,轨迹存储失败\n" + errorMsg.toString());
                    }
                });
            }

            // check the problem after timer function executed.
            function checkProblem() {
                // check overspeed
                (function() {
                    var distance;
                    if (lastGraphic != null) {
                        var x1 = lastGraphic.geometry.x;
                        var y1 = lastGraphic.geometry.y;
                        distance = calDistance(x1, y1, currentX, currentY);
                        
                    }
                })();
                // check overrange
                // check overpause
                (function () {
                    if (isPausing) {
                        var currentDate = new Date();
                        console.log(currentDate.getTime() - startPauseTime.getTime());
                    }
                })();
                // check overworking
                (function () {
                    if (isExecuting) {
                        var currentDate = new Date();
                        console.log(currentDate.getTime() - startWorkTime.getTime());
                    }
                })();
            }

            function getStatus() {
                if (isResting) {
                    return  "未执行";
                }
                else if (isExecuting) {
                    return  "执行中";
                }
                else if (isPausing) {
                    return  "休息";
                }
                else{
                    return "完成任务";
                }
            }

            //Set timer to set position and save it.
            window.setInterval(function () {
                setPosition(function() {
                    drawPoint();
                    saveInfo();
                    checkProblem();
                });
            }, intervalTime);

            //Switch the button class
            function switchBtnClass() {
                //Control start buttion
                if (startBtnEnable) {
                    if (classie_css.has(elemBtnStart, "ui-state-disabled")) {
                        classie_css.remove(elemBtnStart, "ui-state-disabled");
                    }
                }
                else {
                    if (!classie_css.has(elemBtnStart, "ui-state-disabled")) {
                        classie_css.add(elemBtnStart, "ui-state-disabled");
                    }
                }
                //Control pause buttion
                if (pauseBtnEnable) {
                    if (classie_css.has(elemBtnPause, "ui-state-disabled")) {
                        classie_css.remove(elemBtnPause, "ui-state-disabled");
                    }
                }
                else {
                    if (!classie_css.has(elemBtnPause, "ui-state-disabled")) {
                        classie_css.add(elemBtnPause, "ui-state-disabled");
                    }
                }
                //Control completion buttion
                if (comptBtnEnable) {
                    if (classie_css.has(elemBtnCompt, "ui-state-disabled")) {
                        classie_css.remove(elemBtnCompt, "ui-state-disabled");
                    }
                }
                else {
                    if (!classie_css.has(elemBtnCompt, "ui-state-disabled")) {
                        classie_css.add(elemBtnCompt, "ui-state-disabled");
                    }
                }
            }

            function openExecutingStatus() {
                // record start time of work
                startWorkTime = new Date();
                startBtnEnable = false;
                pauseBtnEnable = comptBtnEnable = true;
                isExecuting = true;
                isPausing = isCompleting = isResting = false;
            }

            function openPausingStatus() {
                // record start time of pause
                startPauseTime = new Date();
                pauseBtnEnable = false;
                startBtnEnable = comptBtnEnable = true;
                isPausing = true;
                isExecuting = isCompleting = isResting = false;
            }

            function openCompletingStatus() {
                startBtnEnable = pauseBtnEnable = comptBtnEnable = false;
                isCompleting = true;
                isExecuting = isPausing = isResting = false;
            }

            function openRestingStatus() {
                startBtnEnable = true;
                pauseBtnEnable = comptBtnEnable = false;
                isCompleting = true;
                isExecuting = isPausing = isResting = false;
            }



            //Event
            $(document).ready(function () {   
                $("#btn_start").on("click", function () {
                    openExecutingStatus();
                    // current time string
                    var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss");
                    var paramStr = "?token=1&taskid=" + taskid + "&status=" + getStatus() + "&starttime=" + dateStr + "&carid=" + carid;
                    $.ajax({
                        type: "get",
                        async: true, //异步执行
                        url: domain + url_executionTaskstatus + paramStr,
                        dataType: "json",
                        timeout: 3000,
                        success: function (result) {
                            switchBtnClass();
                        },
                        error: function (errorMsg) {
                            alert("出错,无法开始任务\n"+errorMsg.toString());
                        }
                    });
                });

                $("#btn_pause").on("click", function () {
                    openPausingStatus();
                    var paramStr = "?token=1&taskid=" + taskid + "&status=" + getStatus()+"&carid="+carid;
                    $.ajax({
                        type: "get",
                        async: true, //异步执行
                        url: domain + url_executionTaskstatus + paramStr,
                        dataType: "json",
                        timeout: 3000,
                        success: function (result) {
                            switchBtnClass();
                        },
                        error: function (errorMsg) {
                            alert("出错,无法暂停任务\n" + errorMsg.toString());
                        }
                    });
                });

                $("#btn_compt").on("click", function () {
                    openCompletingStatus();
                    var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss");
                    var paramStr = "?token=1&taskid=" + taskid + "&status=" + getStatus() + "&endtime=" + dateStr + "&carid=" + carid;
                    $.ajax({
                        type: "get",
                        async: true, //异步执行
                        url: domain + url_executionTaskstatus + paramStr,
                        dataType: "json",
                        timeout: 3000,
                        success: function (result) {
                            switchBtnClass();
                            // reset task option
                            setSelectTask();
                        },
                        error: function (errorMsg) {
                            alert("出错,无法完成任务\n" + errorMsg.toString());
                        }
                    });
                });

                $("#btn_makeTask").on("click", function () {
                    // 得到所有任务
                    var value = $("#sele_task").val();
                    // 值为-1说明未选择任务
                    if (value != "-1") {
                        taskid = value;
                        switchBtnClass();
                        drawWorkRange(value);
                    } else {
                        alert("您未选择任务");
                    }
                });
            });
        });
})(window);