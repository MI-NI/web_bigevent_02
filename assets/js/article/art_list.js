$(function () {
    var layer = layui.layer
    var laypage = layui.laypage
    var form = layui.form;


    // 定义过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var n = dt.getFullYear()
        var y = Padzero(dt.getMonth() + 1)
        var r = Padzero(dt.getDate())

        var s = Padzero(dt.getHours())
        var f = Padzero(dt.getMinutes())
        var m = Padzero(dt.getSeconds())

        return n + '-' + y + '-' + r + ' ' + s + ':' + f + ':' + m
    };
    // 数字补零
    function Padzero(n) {
        return n < 10 ? '0' + n : n
    };

    // 1.因为数据比较多，所以定义一个查询的对像。
    // 请求数据的是时侯，需要将青春求参数提交到服务器
    var q = {
        pagenum: 1, //页码值--默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: "", //文章分类得到Id
        state: '' //文章的发布状态
    };

    //2. 渲染表格，请求数据
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用表格模板
                var strHtml = template('tpl-table', res)
                $('tbody').html(strHtml)
                renderPage(res.total)
            }
        })
    }
    initCate();

    // 3.渲染下拉菜单
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var strHTML = template('tpl-cate', res)
                $('[name=cate_id]').html(strHTML);
                // 通过layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    // 4.筛选功能
    $('#form-search').on('click', function (e) {
        // 4.1阻止表单默认提交事件
        e.preventDefault();
        // 4.2获取到标单的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 4.3重新赋值给Q
        q.cate_id = cate_id;
        q.state = state;
        // 4.4.重新渲染表格
        initTable()
    })

    // 5.分页
    function renderPage(total) {
        // console.log(total);

        //执行一个laypage实例
        laypage.render({
            // 前四个是必写参数
            elem: 'pageBox', //指定存放的容器注意，这里的 test1 是 ID，不用加 # 号      
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //设置默认选中页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发jump的方式有两种
            // 1.页面一打开触发
            // 2.点击分页触发
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到用户点击的当前页，以便向服务端请求对应页的数据。
                // 把用户点击的当前页赋值给q
                q.pagenum = obj.curr
                // 实现选择条数页切换功能
                q.pagesize = obj.limit
                // initTable()
                // 可以通过判断 first 的值来判断是那种方式触发
                // 如果值为 true 就是 方式2 触发
                // 否则就是方式一触发
                // !first 就是首次不执行,点击彩执行
                if (!first) {
                    initTable()
                }
            }
        });

    }

    // 6.删除文章功能
    $('tbody').on('click', '#btn-delete', function () {
        var id = $(this).attr('data-id')
        //6.1 询问是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 6.2 发送请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    //6.3 当删除往后应该判断一下本页有没有数据，如果没有
                    // 就页码值 - 1
                    // 在调用initTable()
                    if ($('#btn-delete').length == 1 && q.pagenum > 1) {
                        q.pagenum--
                    }
                    initTable()
                }
            })
            layer.close(index);
        });

    })
})