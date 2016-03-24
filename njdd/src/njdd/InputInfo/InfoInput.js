

$(document).on("pagecreate", "#carinfoinputpage", function () {
    //填充农机编号
    $("#carcode").empty();
    $.ajax({
        url: domain + url_getCarInfo + "?token=1",
        type: 'get',
        async: false,
        dataType: 'json',
        success: function (data) {
            $("#carcode").append("<option>" + "请输入" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#carcode").append("<option value='" + item.id + "'>" + item.car_code + "</option>");
            });
        }
    });
    $("#caradd").hide();
    document.getElementById("carcodeinput").value = "";
    document.getElementById("carbrand").value = "";
    document.getElementById("carhorsepower").value = "";
    //加载农机类型select的内容
    $("#cartype").empty();
    $.ajax({
        type: "get",
        url: domain + url_getCartype + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#cartype").append("<option>" + "" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#cartype").append("<option value='" + item.id + "'>" + item.type + "</option>");
            });
        }
    });
    //填充农机车主
    $("#owner").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getAlluser + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#owner").append("<option></option>");
            $.each(data.result.datas, function (i, item) {
                $("#owner").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });

        }
    });
    document.getElementById("tel").value = "";
    //填充所属单位
    $("#unit").empty();
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#unit").append("<option ></option>");
            $.each(data.result.datas, function (i, item) {
                $("#unit").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });

        }
    });


    document.getElementById("textarea").value = "";
    $("#addtools").attr("disabled", false);
    $("#updatetools").attr("disabled", true);
    $("#deletetools").attr("disabled", true);
});

//内容为“请输入”时添加信息，否则修改信息
function toolschange() {
    $("#caradd").hide();
    var toolselect = $("#carcode").find("option:selected").text();
    if (toolselect == "请输入") {
        //内容清空
        document.getElementById("carcodeinput").value = "";
        document.getElementById("carbrand").value = "";
        document.getElementById("carcodeinput").disabled = false;
        document.getElementById("carhorsepower").value = "";
        document.getElementById("cartype").options[0].selected = true;
        document.getElementById("owner").options[0].selected = true;
        document.getElementById("tel").value = "";
        document.getElementById("unit").options[0].selected = true;
        document.getElementById("textarea").value = "";
        $("#addtools").attr("disabled", false);
        $("#updatetools").attr("disabled", true);
        $("#deletetools").attr("disabled", true);
    }
    else {

        //填充相应信息
        var carid = $("#carcode").val();
        $.ajax({
            type: "get",
            url: domain + url_getCarInfo + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                teamdata = data.result.datas;
                $.each(data.result.datas, function (i, item) {
                    if (carid == item.id) {
                        document.getElementById("carcodeinput").value = item.car_code;
                        document.getElementById("carcodeinput").disabled = true;
                        document.getElementById("carbrand").value = item.car_brand;
                        document.getElementById("carhorsepower").value = item.car_horsepower;
                        var opLst = document.getElementById("cartype");
                        for (var j = 0, len = opLst.length; j < len; j++) {
                            var cartype = item.cartype;
                            if (opLst.options[j].text == cartype) {
                                opLst.options[j].selected = true;
                                break;
                            }
                        }
                        var opList = document.getElementById("unit");
                        for (var j = 0, len = opList.length; j < len; j++) {
                            if (opList.options[j].text == item.car_userunit) {
                                opList.options[j].selected = true;
                                break;
                            }
                        }
                        var op = document.getElementById("owner");
                        for (var j = 0, len = op.length; j < len; j++) {
                            if (op.options[j].text == item.car_username) {
                                op.options[j].selected = true;
                                break;
                            }
                        }
                        document.getElementById("tel").value = item.car_userphone;
                        document.getElementById("textarea").value = item.remark;
                    }
                });
            }
        });
        $("#addtools").attr("disabled", true);
        $("#updatetools").attr("disabled", false);
        $("#deletetools").attr("disabled", false);
    }
}

//车主名与电话一致化
function ownerchange() {
    var selectcaptain = $("#owner").val();
    $.ajax({
        type: "get",
        url: domain + url_getAlluser + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $.each(data.result.datas, function (i, item) {
                if (selectcaptain == item.id) {
                    document.getElementById("tel").value = item.phone;
                }
            });

        }
    });
}

//删除农具
function deleteTools() {
    var teamid = $("#carcode").val();
    var param = "?token=1&id=" + teamid;
    $.ajax({
        type: "get",
        url: domain + url_deleteCar + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("删除成功！");
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//修改农具
function updateTools() {
    var carcodeid = $("#carcode").val();
    var carcode = document.getElementById("carcodeinput").value;
    var brand;
    if (document.getElementById("carbrand").value == "" || document.getElementById("carbrand").value == null) {
        brand = "";
    }
    else {
        brand = document.getElementById("carbrand").value;
    }

    var type = $("#cartype").val();
    var horsepower;
    if (document.getElementById("carhorsepower").value == "" || document.getElementById("carhorsepower").value == null) {
        horsepower = "";
    }
    else {
        horsepower = document.getElementById("carhorsepower").value;
    }
    var user = $("#owner").val();
    var remark;
    if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
        remark = "";
    }
    else {
        remark = document.getElementById("textarea").value;
    }
    var unit = $("#unit").val();
    var param = "?token=1&carCode=" + carcode + "&remark=" + remark + "&carBrand=" + brand + "&typeid=" + type + "&carHorsepower=" + horsepower + "&carOwnerid=" + user + "&carUnitid=" + unit + "&id=" + carcodeid;
    $.ajax({
        type: "get",
        url: domain + url_addCar + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("修改成功！");
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//添加农具
function addTools() {
    if (document.getElementById("carcodeinput").value == "" || document.getElementById("carcodeinput").value == null) {
        $("#caradd").hide();
    }
    else {
        var carcode = document.getElementById("carcodeinput").value;
        var brand;
        if (document.getElementById("carbrand").value == "" || document.getElementById("carbrand").value == null) {
            brand = "";
        }
        else {
            brand = document.getElementById("carbrand").value;
        }

        var tooltype = $("#cartype").val();
        var horsepower;
        if (document.getElementById("carhorsepower").value == "" || document.getElementById("carhorsepower").value == null) {
            horsepower = "";
        }
        else {
            horsepower = document.getElementById("carhorsepower").value;
        }
        var user = $("#owner").val();
        var remark;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            remark = "";
        }
        else {
            remark = document.getElementById("textarea").value;
        }
        var unit = $("#unit").val();
        var param = "?token=1&carCode=" + carcode + "&remark=" + remark + "&carBrand=" + brand + "&typeid=" + tooltype + "&carHorsepower=" + horsepower + "&carOwnerid=" + user + "&carUnitid=" + unit;
        $.ajax({
            type: "get",
            url: domain + url_addCar + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("添加成功！");
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

$(document).on("pagecreate", "#stypeinputpage", function () {
    //加载农机类型select的内容
    $("#StyleSelect").empty();
    $.ajax({
        type: "get",
        url: domain + url_getCartype + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#StyleSelect").append("<option>" + "请输入" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#StyleSelect").append("<option value='" + item.id + "'>" + item.type + "</option>");
            });
        }
    });
    $("#typeadd").hide();
    $("#typeupdate").hide();
    document.getElementById("Styleinput").value = "";
    document.getElementById("textarea").value = "";
    $("#addCartype").attr("disabled", false);
    $("#updateCartype").attr("disabled", true);
    $("#deleteCartype").attr("disabled", true);
});

var typeremark;
//内容为“请输入”时添加信息，否则修改信息
function cartypechange() {
    $("#typeadd").hide();
    $("#typeupdate").hide();
    var selectstr = $("#StyleSelect").find("option:selected").text();
    if (selectstr == "请输入") {
        document.getElementById("Styleinput").value = "";
        $("#addCartype").attr("disabled", false);
        $("#updateCartype").attr("disabled", true);
        $("#deleteCartype").attr("disabled", true);
    } else {
        document.getElementById("Styleinput").value = selectstr;
        var typevalue = $("#StyleSelect").val();
        $.ajax({
            type: "get",
            url: domain + url_getCartype + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                $.each(data.result.datas, function (i, item) {
                    if (typevalue == item.id) {
                        document.getElementById("textarea").value = item.remark;
                        typeremark = item.remark;
                    }
                });
            }
        });
        $("#addCartype").attr("disabled", true);
        $("#updateCartype").attr("disabled", false);
        $("#deleteCartype").attr("disabled", false);
    }
}

//添加农机类型
function addCartype() {
    if (document.getElementById("Styleinput").value == "" || document.getElementById("Styleinput").value == null) {
        $("#typeadd").show();
    }
    else {
        var typeadd = document.getElementById("Styleinput").value;
        var remarkadd;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            remarkadd = "";
        }
        else {
            remarkadd = document.getElementById("textarea").value;
        }
        var param = "?token=1&type=" + typeadd + "&remark=" + remarkadd;
        $.ajax({
            type: "get",
            url: domain + url_addCartype + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("添加成功！");
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//修改农机类型
function updateCartype() {
    var typechange = document.getElementById("Styleinput").value;
    var type = $("#StyleSelect").find("option:selected").text();
    var typechangeremark = document.getElementById("textarea").value;
    if (typechange == type && typechangeremark == typeremark) {
        $("#typeupdate").show();
    }
    else {
        var cartypeid = $("#StyleSelect").val();
        var cartypename = document.getElementById("Styleinput").value;
        var cartyperemark;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            cartyperemark = "";
        }
        else {
            cartyperemark = document.getElementById("textarea").value;
        }
        var param = "?token=1&type= " + cartypename + "&remark=" + cartyperemark + "&typeid=" + cartypeid;
        $.ajax({
            type: "get",
            url: domain + url_addCartype + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("修改成功！");
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//删除农机类型
function deleteCartype() {
    var typeid = $("#StyleSelect").val();
    var param = "?token=1&id=" + typeid;
    $.ajax({
        type: "get",
        url: domain + url_deleteCartype + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("删除成功！");
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}


$(document).on("pagecreate", "#unitinputpage", function () {
    //填充所属单位
    $("#unitselect").empty();
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#unitselect").append("<option >" + "请输入" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#unitselect").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });

        }
    });
    $("#unitadd").hide();
    $("#unitupdate").hide();
    document.getElementById("unitinput").value = "";
    document.getElementById("textarea").value = "";
    $("#addunit").attr("disabled", false);
    $("#updateunit").attr("disabled", true);
    $("#deleteunit").attr("disabled", true);
});

var unitremark;
//内容为“请输入”时添加信息，否则修改信息
function unitChange() {
    var selectstr = $("#unitselect").find("option:selected").text();
    if (selectstr == "请输入") {
        document.getElementById("unitinput").value = "";
        $("#unitadd").hide();
        $("#unitupdate").hide();
        $("#addunit").attr("disabled", false);
        $("#updateunit").attr("disabled", true);
        $("#deleteunit").attr("disabled", true);
    } else {
        $("#unitadd").hide();
        $("#unitupdate").hide();
        document.getElementById("unitInput").value = selectstr;
        var unitvalue = $("#unitselect").val();
        $.ajax({
            type: "get",
            url: domain + url_getUnit + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                $.each(data.result.datas, function (i, item) {
                    if (unitvalue == item.id) {
                        document.getElementById("textarea").value = item.remark;
                        unitremark = item.remark;
                    }
                });
            }
        });
        $("#addunit").attr("disabled", true);
        $("#updateunit").attr("disabled", false);
        $("#deleteunit").attr("disabled", false);
    }
}

//添加所属单位
function addUnit() {
    if (document.getElementById("unitInput").value == "" || document.getElementById("unitInput").value == null) {
        $("#unitadd").show();
    }
    else {
        var unitadd = document.getElementById("unitInput").value;
        var remarkadd;
        if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
            remarkadd = "";
        }
        else {
            remarkadd = document.getElementById("textarea").value;
        }
        var param = "?token=1&name=" + unitadd + "&remark=" + remarkadd;
        $.ajax({
            type: "get",
            url: domain + url_addUnit + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("添加成功！");
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//修改所属单位
function updateUnit() {
    var unitname = document.getElementById("unitInput").value;
    var unit = $("#unitselect").find("option:selected").text();
    var unitchangeremark = document.getElementById("textarea").value
    if (unitname == unit && unitchangeremark == unitremark) {
        $("#unitupdate").show();
    }
    else {
        var unitid = $("#unitselect").val();
        var unitremark = document.getElementById("textarea").value;
        var param = "?token=1&id=" + unitid + "&newName=" + unitname + "&remark=" + unitremark;
        $.ajax({
            type: "get",
            url: domain + url_updateUnit + param,
            async: true,
            dataType: 'json',
            success: function () {
                confirm("修改成功！");
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//删除所属单位
function deleteUnit() {
    var unitid = $("#unitselect").val();
    var param = "?token=1&id=" + unitid;
    $.ajax({
        type: "get",
        url: domain + url_updateUnit + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("删除成功！");
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}


