$(function() {
    // 1.自定义验证规则
    var form = layui.form
    form.verify({
            pwd: [/^[\S]{6,12}$/,
                '密码必须6到12位，且不能出现空格'
            ],
            // 新旧密码不能重复
            samePwd: function(value) {
                if (value == $('[name=oldPwd]').val()) {
                    return "两次密码不能相同"
                }
            },
            // 判断两次密码要一杨
            rePwd: function(value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次密码不一致'
                }
            }

        })
        // 表单提交
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                    // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})