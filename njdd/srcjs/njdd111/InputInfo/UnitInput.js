$(document).on("pagecreate", "#unitinputpage", function () {
    //填充所属单位
    $("#unitselect").empty();
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#unitselect").append("<option >"+"请输入"+"</option>");
            $.each(data.result.datas, function (i, item) {
                $("#unitselect").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });

        }
    });
    document.getElementById("unitinput").value = "";
    document.getElementById("textarea").value = "";
    $("#addunit").attr("disabled", "false");
    $("#updateunit").attr("disabled", "true");
    $("#deleteunit").attr("disabled", true);
});

var unitremark;
//内容为“请输入”时添加信息，否则修改信息
function unitChange() {
    var selectstr = $("#unitselect").find("option:selected").text();
    if (selectstr == "请输入") {
        document.getElementById("unitinput").value = "";
        $("#addunit").attr("disabled", false);
        $("#updateunit").attr("disabled", true);
        $("#deleteunit").attr("disabled", true);
    } else {
        document.getElementById("unitinput").value = selectstr;
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
    var unitadd = document.getElementById("unitinput").value;
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
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//修改所属单位
function updateUnit() {
    var unitchange = document.getElementById("unitinput").value;
    var unit = $("#unitselect").find("option:selected").text();
    var unitchangeremark = document.getElementById("textarea").value
    if (unitchange == unit && unitchangeremark == unitremark) {
        //$("#updateunit").show();
    }
    else {
        var unitid = $("#unitselect").val();
        var unitname = document.getElementById("unitinput").value;
        var unitremark = document.getElementById("textarea").value;
        var param = "?token=1&id=" + unitid + "&newName=" + unitname + "&remark=" + unitremark;
        $.ajax({
            type: "get",
            url: domain + url_updateUnit + param,
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
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

    
