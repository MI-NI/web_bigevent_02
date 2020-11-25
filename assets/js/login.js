$(function() {
    //1. 点击切换，登录注册
    $('#link_reg').on('click', function() {
        $(".login-box").hide()
        $(".reg-box").show()
    })
    $('#link_login').on('click', function() {
        $(".login-box").show()
        $(".reg-box").hide()
    });
    // 2.表单验证
    // 就和$一样在全局下多了个layui
    var form = layui.form
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        // 自定义了一个叫pass验证规则
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 自定义一个属性，看两次注册两次输入密码是否一致
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return "两次输入密码不一致"
            }
        }
    });
    // 3.发起ajax注册请求
    var layer = layui.layer
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: "/api/reguser",
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                $('#link_login').click()
                $('#form_reg')[0].reset()
            }
        })
    });
    // 4.发起登录的Ajax
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})