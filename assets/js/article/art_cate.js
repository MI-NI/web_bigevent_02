$(function() {
    initArtCateList();
    // 1.获取-渲染数据
    var layer = layui.layer

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //调用模板，渲染数据
                var srtHtml = template('tpl-table', res)
                $('tbody').html(srtHtml)
            }
        })
    }
    // 2给添加类别添加绑定事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialogg-add').html()
        })
    });
    // 3.确认添加功能
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('添加成功了')
                layer.close(indexAdd)
            }
        })
    });
    // 4.编辑功能
    var indexEdit = null
    var form = layui.form
    $('tbody').on('click', '#btn-edit', function() {
        //4.1 点击之后弹出一个层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr("data-id");
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
            }
        });
    });
    // 4.2修改渲染
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $('#form-edit').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg(res.message)
                layer.close(indexEdit)
            }
        })
    });
    // 5.删除功能
    $('tbody').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    initArtCateList();
                    layer.close(index);
                }
            })
        });
    })
})