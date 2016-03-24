$(document).ready(function () {
    //填充农机编号
    $("#carcode").empty();
    $.ajax({
        url: domain + url_getCarInfo + "?token=1",
        type: 'get',
        async: false,
        success: function (json) {
            $("#carcode").append("<option>" + "请输入" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#carcode").append("<option value='" + item.id + "'>" + item.car_code + "</option>");
            });
        }
    });
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
    var toolselect = $("#carcode").find("option:selected").text();
    if (toolselect == "请输入") {
        //内容清空
        document.getElementById("carcodeinput").value = "";
        document.getElementById("carbrand").value = "";
        document.getElementById("carhorsepower").value = "";
        $("#cartype").find("option[text='']").attr("selected", true);
        $("#owner").find("option[text='']").attr("selected", true);
        document.getElementById("tel").value = "";
        $("#unit").find("option[text='']").attr("selected", true);
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
                        document.getElementById("carbrand").value = item.car_brand;
                        document.getElementById("carhorsepower").value = item.car_horsepower;
                        var opLst = document.getElementById("cartype");
                        for (var i = 0, len = opLst.length; i < len; i++) {
                            if (opLst.options[i].text == item.cartype) {
                                opLst.options[i].selected = true;
                                break;
                            }
                        }
                        var opList = document.getElementById("unit");
                        for (var i = 0, len = opList.length; i < len; i++) {
                            if (opList.options[i].text == item.car_userunit) {
                                opList.options[i].selected = true;
                                break;
                            }
                        }
                        var op = document.getElementById("owner");
                        for (var i = 0, len = op.length; i < len; i++) {
                            if (op.options[i].text == item.car_username) {
                                op.options[i].selected = true;
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
                if (selectusername == item.id) {
                    document.getElementById("tel").value = item.phone;
                }
            });

        }
    });
}

//删除农具
function deletetools() {
    var teamid = $("#carcode").val();
    var param = "?token=1&id=" + teamid;
    $.ajax({
        type: "get",
        url: domain + url_deleteCar + param,
        async: true,
        dataType: 'json',
        success: function () {
            vehicleSearch();
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//修改农具
function updatetools() {
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
    var user = $("#tool_reuser").val();
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
        url: domain + addCar + param,
        async: true,
        dataType: 'json',
        success: function () {
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//添加农具
function addtools() {
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
    var user = $("#tool_reuser").val();
    var remark;
    if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
        remark = "";
    }
    else {
        remark = document.getElementById("textarea").value;
    }
    var unit = $("#unit").val();
    var param = "?token=1&carCode=" + carcode + "&remark=" + remark + "&carBrand=" + brand + "&typeid=" + type + "&carHorsepower=" + horsepower + "&carOwnerid=" + user + "&carUnitid=" + unit;
    $.ajax({
        type: "get",
        url: domain + url_addCar + param,
        async: true,
        dataType: 'json',
        success: function () {
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}