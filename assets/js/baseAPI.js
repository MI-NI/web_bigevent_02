// 每次Ajax请求前都会拿到参数
$.ajaxPrefilter(function(options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url
})