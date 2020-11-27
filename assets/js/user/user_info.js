$(function() {
    // 1.自定义验证规则
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称必须在1~6位之间"
            }
        }
    });
    initUserInfo();
    // 2.获取数据
    var layer = layui.layer

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 3.表单重置
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo();
    });
    // 4.监听表单事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                window.parent.getUserInfo();
            }
        })
    })
})