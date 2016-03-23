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
    document.getElementById("Styleinput").value = "";
    document.getElementById("textarea").value = "";
    $("#addCartype").attr("disabled", false);
    $("#updateCartype").attr("disabled", true);
    $("#deleteCartype").attr("disabled", true);
});

var typeremark;
//内容为“请输入”时添加信息，否则修改信息
function cartypechange() {
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
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//修改农机类型
function updateCartype() {
    var typechange = document.getElementById("Styleinput").value;
    var type = $("#StyleSelect").find("option:selected").text();
    var typechangeremark = document.getElementById("textarea").value;
    if (typechange == type && typechangeremark == typeremark) {
        //$("#tooltypeupdate").show();
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
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}


