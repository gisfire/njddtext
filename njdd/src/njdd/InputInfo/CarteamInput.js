/// <reference path="../../../dep/tmpl.js" />

//alluser变量
var person;
//teammember变量
var result;
var datajson = [];
//车队成员管理
var teamteamid;
$(document).on("pagebeforecreate", "#teaminfopage", function () {
    teamteamid = $("#carteamname").val();
    var pramestr = "?token=1&teamID=" + teamteamid;
    $.ajax({
        url: domain + url_getTeammember + pramestr,
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
            result = datajson.result.datas;
            if (datajson.result.datas.length > 0) {
                $.each(datajson.result.datas, function (i, item) {
                    //模板渲染
                    var html = tmpl("tmpl_teaminfopage_detailinfo", item);
                    $(html).appendTo("#teaminfopage_listview").trigger('create');
                });
            }
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
});

function teaminfopageclick(id) {

    $.ajax({
        url: domain + url_getAlluser + "?token=1",
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
            if (datajson.result.datas.length > 0) {
                $.each(datajson.result.datas, function (i, item) {
                    if (id == item.id) {
                        $(document).on("pagebeforecreate", "#teammemberinfo", function () {
                            document.getElementById("teammemberinfo_name").value = item.name;
                            document.getElementById("teammemberinfo_tel").value = item.phone;
                            document.getElementById("teammemberinfo_email").value = item.email;
                            $("#teammemberinfopage_unit").empty();
                            $.ajax({
                                type: "get",
                                url: domain + url_getUnit + "?token=1",
                                async: true,
                                dataType: 'json',
                                success: function (data) {
                                    $.each(data.result.datas, function (i, item) {
                                        $("#teammemberinfopage_unit").append("<option value='" + item.id + "'>" + item.name + "</option>");
                                    });
                                    panduanuserunit(item.unitName, item.teamid, item.teamName);
                                }
                            });
                       });
                    }
                });
            }
        }
    });
}
 
$("#updateteammember").click(function () {
    var username = document.getElementById("teammemberinfo_name").value;
    var userphone = document.getElementById("teammemberinfo_tel").value
    var useremail;
    if (document.getElementById("teammemberinfo_email").value == "" || document.getElementById("teammemberinfo_email").value == null) {
        useremail = "";
    }
    else {
        useremail = document.getElementById("teammemberinfo_email").value;
    }
    var data = new Object();
    data["token"] = "1";
    data["data"] = new Object();
    data["data"]["filter"] = new Object();
    data["data"]["items"] = [];
    data["data"]["param"] = new Object();
    data["data"]["param"]["name"] = username;
    data["data"]["param"]["phone"] = userphone;
    data["data"]["param"]["email"] = useremail;
    data["data"]["param"]["id"] = id;
    $.ajax({
        url: domain + url_addUser,
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        async: false,
        data: JSON.stringify(data),
        dataType: "json",
        timeout: 3000,
        success: function (json) {
            confirm("修改成功！");
        }
    });
});

//删除车队人员wy
$("#deleteteammember").click(function () {
    var teamid = $("#carteamname").val();
    var param = "?token=1&teamid=" + teamid + "&personid=" + id;
    $.ajax({
        type: "get",
        url: domain + url_deleteTeammember + param,
        async: true,
        dataType: 'json',
        success: function () {
            confirm("删除成功！");
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
});

function panduanuserunit(userunit, userteamUnitid, userteam) {
    var opList3 = document.getElementById("#informationpage_unit");
    for (var i = 0, len = opList3.length; i < len; i++) {
        if (opList3.options[i].text == userunit) {
            opList3.options[i].selected = true;
            break;
        }
    }
    //清空
    $("#informationpage_team").empty();
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#informationpage_team").append("<option ></option>");
            $.each(data.result.datas, function (i, item) {
                //根据所属单位填充所属车队的下拉内容
                if (userteamUnitid == item.teamUnitid) {
                    $("#informationpage_team").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }

            });

        }
    });
    panduanuserteam(userteam);
}

function panduanuserteam(userteam) {
    var opList4 = document.getElementById("#informationpage_team");
    for (var i = 4, len = opList4.length; i < len; i++) {
        if (opList4.options[i].text == userteam) {
            opList4.options[i].selected = true;
            break;
        }
    }
}

$(document).on("pagecreate", "#carteaminputpage", function () {
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
    $("#teamadd").hide();
    document.getElementById("captainphone").value = "";
    document.getElementById("textarea").value = "";
    $("#addteam").attr("disabled", false);
    $("#updateteam").attr("disabled", true);
    $("#deleteteam").attr("disabled", true);
});

//内容为“请输入”时添加信息，否则修改信息
function teamchange() {
    $("#teamadd").hide();
    var teamselect = $("#carteamname").find("option:selected").text();
    if (teamselect == "请输入") {
        //内容清空
        document.getElementById("teamnameinput").value = "";
        document.getElementById("unitid").options[0].selected = true;
        document.getElementById("teamcaptain").options[0].selected = true;
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
                        for (var j = 0, len = opList.length; j < len; j++) {
                            if (opList.options[j].text == item.unitename) {
                                opList.options[j].selected = true;
                                break;
                            }
                        }

                        document.getElementById("captainphone").value = item.captainphone;
                        document.getElementById("textarea").value = item.remark;

                        var op = document.getElementById("teamcaptain");
                        for (var j = 0, len = op.length; j < len; j++) {
                            if (op.options[j].text == item.captainname) {
                                op.options[j].selected = true;
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
                if (selectcaptain == item.id) {
                    document.getElementById("captainphone").value = item.phone;
                }
            });

        }
    });
}

//删除车队
function deleteTeam() {
    var teamid = $("#carteamname").val();
    var param = "?token=1&id=" + teamid;
    $.ajax({
        type: "get",
        url: domain + url_deleteTeam + param,
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

//修改车队
function updateTeam() {
    if (document.getElementById("teamnameinput").value == "" || document.getElementById("teamnameinput").value == null) {
        $("#teamadd").show();
    }
    else {
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
                confirm("修改成功！");
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//添加车队
function addTeam() {
    if (document.getElementById("teamnameinput").value == "" || document.getElementById("teamnameinput").value == null) {
        $("#teamadd").show();
    }
    else {
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
                confirm("添加成功！");
            },
            error: function (errorMsg) {
                alert(errorMsg);
            }
        });
    }
}

//车队人员添加显示内容
$(document).on("pagebeforecreate", "#teammemberaddpage", function () {
    $.ajax({
        url: domain + url_getAlluser + "?token=1",
        type: 'get',
        async: false,
        success: function (json) {
            var datajson;
            if (typeof (json) == "object") {
                //为对象
                datajson = json;
            }
            else {
                //将字符串转换为对象
                datajson = JSON.parse(json);
            }
            person = datajson.result.datas;
            var selcTaskDom = $("#teammemberaddpage_listview");
            // empty options
            selcTaskDom.empty();
            selcTaskDom.append();
            // 使用模块加载复选框
            for (var i = 0; i < person.length; i++) {
                selcTaskDom.append(tmpl("user_tmpl", person[i]));
                for (var j = 0; j < result.length; j++) {
                    //判断id，将表中出现的人名勾选上
                    if (result[j]["id"] == person[i]["id"]) {
                        $("#add_" + person[i]["id"]).prop("checked", "true");
                    }
                }
            }
        },
        error: function (errorMsg) {
            data = null;
            alert("出错,无法查询到用户\n" + errorMsg.toString());
        }
    });
});

//车队人员添加
function addperson() {
    for (var i = 0; i < person.length; i++) {
        for (var j = 0; j < result.length; j++) {
            if ($("#add_" + person[i]["id"]).is(":checked") && result[j]["id"] != person[i]["id"]) {
                var personid = person[i]["id"];
                var param = "?token=1&teamid=" + teamteamid + "&personid=" + personid;
                $.ajax({
                    type: "get",
                    url: domain + url_addTeammember + param,
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
    }
    confirm("添加成功！");
}

