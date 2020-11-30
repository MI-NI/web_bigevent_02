$(function () {
    var layer = layui.layer
    var form = layui.form

    //  1.渲染下拉菜单
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板渲染
                var strHtml = template('tpl-cate', res)
                $('[name=cate_id]').html(strHtml)
                // 一定要调用layui.form.render(),不然不会渲染
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击选择封面给文件框，添加点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    });

    // 给文件框添加change事件，获取选则的文件
    $('#coverFile').on('change', function (e) {
        // 获取文件列表数组
        var files = e.target.files
        // 非空校验
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 发布
    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 为表单添加提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单默认提交事件
        e.preventDefault()
        // 2.基于form表单创建formdata对象
        var fd = new FormData($(this)[0])
        // 把发布状态追加到fd中
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })

    })

    // 推送请求
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 发送的是formdata数据一定要写
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('发布成功')
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                }, 1500)
                // location.href = '/article/art_list.html'
            }
        })
    }
})