$(function() {
        getUserInfo()
    })
    // 获取·用户信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        // headers: { Authorization: localStorage.getItem('token') || "" },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            renderAvatar(res.data)
        }
    })
}
// 渲染头像
function renderAvatar(user) {
    // 渲染名字
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
        // 渲染头像
    if (user.user_pic !== null) {
        // 渲染头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
// 点击退出
$('#btnLogout').on('click', function() {
    layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function(index) {
        //do something
        // 清除掉本地存的token
        localStorage.removeItem('token');
        // 退回到登录页面
        location.href = "/login.html"
        layer.close(index);
    });
})