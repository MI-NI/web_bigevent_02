// 每次Ajax请求前都会拿到参数
$.ajaxPrefilter(function(options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    // //是否成功，都会执行
    options.complete = function(res) {
            // console.log(res.responseJSON);
            var obj = res.responseJSON
                // console.log(obj);
            if (obj.status == 1 && obj.message === '身份认证失败！') {
                localStorage.removeItem('token')
                location.href = "/login.html"
            }
        }
        // options.complete = function(res) {
        //     // 请求失败，而且是是否认证失败，就进行强制跳转和销毁token

    //     if (res.responseJSON.status !== 0 && res.responseJSON.message == "身份认证失败！") {
    //         localStorage.removeItem('token')
    //         location.href = '/login.html'
    //     }
    // }
})