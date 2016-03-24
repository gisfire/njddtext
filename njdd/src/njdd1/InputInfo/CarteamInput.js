$(document).ready(function () {
    //填充车队名称
    $("#carteamname").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#carteamname").append("<option >" + "请输入" + "</option>");
            $.each(data.result.datas, function (i, item) {
                $("#carteamname").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });
        }
    });
    document.getElementById("teamnameinput").value = "";

    //填充所属单位
    $("#unitid").empty();
    $.ajax({
        type: "get",
        url: domain + url_getUnit + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#unitid").append("<option ></option>");
            $.each(data.result.datas, function (i, item) {
                $("#unitid").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });

        }
    });

    //填充车队队长
    $("#teamcaptain").empty();//清空
    $.ajax({
        type: "get",
        url: domain + url_getAlluser + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#teamcaptain").append("<option></option>");
            $.each(data.result.datas, function (i, item) {
                $("#teamcaptain").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });

        }
    });

    document.getElementById("captainphone").value = "";
    document.getElementById("textarea").value = "";
    $("#addteam").attr("disabled", false);
    $("#updateteam").attr("disabled", true);
    $("#deleteteam").attr("disabled", true);
});

//内容为“请输入”时添加信息，否则修改信息
function teamchange() {
    var teamselect = $("#carteamname").find("option:selected").text();
    if (teamselect == "请输入") {
        //内容清空
        document.getElementById("teamnameinput").value = "";
        $("#unitid").find("option[text='']").attr("selected", true);
        $("#teamcaptain").find("option[text='']").attr("selected", true);
        document.getElementById("captainphone").value = "";
        document.getElementById("textarea").value = "";
        $("#addteam").attr("disabled", false);
        $("#updateteam").attr("disabled", true);
        $("#deleteteam").attr("disabled", true);
    }
    else {
        //填充相应信息
        var teamid = $("#carteamname").val();
        $.ajax({
            type: "get",
            url: domain + url_getTeam + "?token=1",
            async: true,
            dataType: 'json',
            success: function (data) {
                teamdata = data.result.datas;
                $.each(data.result.datas, function (i, item) {
                    if (teamid == item.id) {
                        document.getElementById("teamnameinput").value = item.name;
                        var opList = document.getElementById("unitid");
                        for (var i = 0, len = opList.length; i < len; i++) {
                            if (opList.options[i].text == item.unitename) {
                                opList.options[i].selected = true;
                                break;
                            }
                        }
                        
                        document.getElementById("captainphone").value = item.captainphone;
                        document.getElementById("textarea").value = item.remark;
                        
                        var op = document.getElementById("teamcaptain");
                        for (var i = 0, len = op.length; i < len; i++) {
                            if (op.options[i].text == item.captainname) {
                                op.options[i].selected = true;
                                break;
                            }
                        }
                        
                    }
                });
            }
        });
        $("#addteam").attr("disabled", true);
        $("#updateteam").attr("disabled", false);
        $("#deleteteam").attr("disabled", false);
    }
}

//队长名与电话一致化
function captainchange() {
    var selectcaptain = $("#teamcaptain").val();
    $.ajax({
        type: "get",
        url: domain + url_getAlluser + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $.each(data.result.datas, function (i, item) {
                if (selectusername == item.id) {
                    document.getElementById("captainphone").value = item.phone;
                }
            });

        }
    });
}

//删除车队
function deleteteam() {
    var teamid = $("#carteamname").val();
    var param = "?token=1&id=" + teamid;
    $.ajax({
        type: "get",
        url: domain + url_deleteTeam + param,
        async: true,
        dataType: 'json',
        success: function () {
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//修改车队
function updateteam() {
    var name = document.getElementById("teamnameinput").value;
    //获取车队id
    var teamid = $("#carteamname").val();
    var unitid = $("#unitid").val();
    var ownerid = $("#teamcaptain").val();
    var remark;
    if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
        remark = "";
    }
    else {
        remark = document.getElementById("textarea").value;
    }
    var param = "?token=1&id=" + teamid + "&newName=" + name + "&teamUnitid=" + unitid + "&teamCaptainid=" + ownerid + "&remark=" + remark;

    $.ajax({
        type: "get",
        url: domain + url_updateTeam + param,
        async: true,
        dataType: 'json',
        success: function () {
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}

//添加车队
function addteam() {
    var name = document.getElementById("teamnameinput").value;
    var unitid = $("#unitid").val();
    var captainid = $("#teamcaptain").val();
    var remark;
    if (document.getElementById("textarea").value == "" || document.getElementById("textarea").value == null) {
        remark = "";
    }
    else {
        remark = document.getElementById("textarea").value;
    }

    //保存新增车队
    var param = "?token=1&name=" + name + "&remark=" + remark + "&teamCaptainid=" + captainid + "&teamUnitid=" + unitid;
    $.ajax({
        type: "get",
        url: domain + url_addTeam + param,
        async: true,
        dataType: 'json',
        success: function () {
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
}