// 每次Ajax请求前都会拿到参数
$.ajaxPrefilter(function(options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || "" }
    }
    //是否成功，都会执行
    options.complete = function(res) {
        console.log(res);
        var obj = res.responseJSON
        if (obj.status == 1 && obj.message === "身份认证失败！") {
            localStorage.removeItem('token')
            location.href = "/login.html"
        }
    }
})