$(function () {
  // Header 已经在模板中，不需要动态加载
  // $('#header').load("./public/header.html")
  // $('#footer').load("./public/footer.html")



  setTimeout(() => {
    $('.icon-box').click(function () {
      if (($('.layui-nav-s').attr('class')).indexOf('layui-nav-phone') !== -1) {
        $('.layui-nav-s').removeClass('layui-nav-phone')
      } else {
        $('.layui-nav-s').addClass('layui-nav-phone')
      }
    })
    $('.mask-header').click(function () {
      console.log(11)
      $('.layui-nav-s').addClass('layui-nav-phone')
    })


    $('.search-icon-btn').on('click', function () {
      $(".layui-input-search").toggle()
      $(this).toggle()
      $("#search-s").focus()
    })
    $('#search-s').blur(function () {
      $(".search-icon-btn").toggle()
      $('.layui-input-search').toggle()
    })

    $("#search-s").keydown(function (e) {
      if (e.which == 13) {
        window.location.href = '../help-list.html'
      }
    })


    // 根据链接锁定当前导航
    const curPath = location.pathname
    function chooseActive(url, index) {
      const curItem = $("#top-nav>.layui-nav-item").eq(index)
      curItem.addClass('active')
      // 产品
      if (url === '/business.html') {
        curItem.find('.layui-nav-child a').eq(0).addClass('active')
      }
      if (url === '/cloud.html') {
        curItem.find('.layui-nav-child a').eq(1).addClass('active')
      }
      if (url === '/dcim.html') {
        curItem.find('.layui-nav-child a').eq(2).addClass('active')
      }
      // 服务
      if (url === '/solution.html') {
        curItem.find('.layui-nav-child a').eq(0).addClass('active')
      }
      if (url === '/announce.html') {
        curItem.find('.layui-nav-child a').eq(1).addClass('active')
      }
      if (url === '/verifydomain.html') {
        curItem.find('.layui-nav-child a').eq(2).addClass('active')
      }
      // 关于
      if (url === '/about.html') {
        curItem.find('.layui-nav-child a').eq(0).addClass('active')
      }
      if (url === '/join.html') {
        curItem.find('.layui-nav-child a').eq(1).addClass('active')
      }
      if (url === '/partner.html') {
        curItem.find('.layui-nav-child a').eq(2).addClass('active')
      }
    }

    function getCookie(name) {
      // 构造cookie查找的字符串
      const nameEQ = name + "=";
      // 获取所有cookie并分割成数组
      const cookies = document.cookie.split(';');
      // 遍历所有cookie
      for (let i = 0; i < cookies.length; i++) {
        // 去除多余的空格
        let cookie = cookies[i].trim();
        // 检查这个cookie是否是我们要找的
        if (cookie.indexOf(nameEQ) === 0) {
          // 返回cookie的值
          return cookie.substring(nameEQ.length, cookie.length);
        }
      }
      // 如果没有找到cookie，则返回null
      return null;

    }

    switch (curPath) {
      case '/':
      case '/index.html':
        chooseActive(curPath, 0)
        break;
      case '/business.html':
      case '/cloud.html':
      case '/dcim.html':
        chooseActive(curPath, 1)
        break
      case '/announce.html':
      case '/solution.html':
      case '/verifydomain.html':
        chooseActive(curPath, 4)
        break;
      case '/about.html':
      case '/join.html':
      case '/partner.html':
        chooseActive(curPath, 6)
        break;
    }
    if (curPath.includes('announce-details.html')) {
      $("#top-nav>.layui-nav-item").eq(3).addClass('active').find('.layui-nav-child a').eq(1).addClass('active')
    }

    var token = getCookie('idcsmart_jwt')
    if (token) {
      $('#com-control').show()
      $('#com-login').hide()
      $('#phoen-com-control').show()
      $('#phoen-com-login').hide()

    } else {
      $('#com-control').hide()
      $('#com-login').show()
      $('#phoen-com-login').show()
      $('#phoen-com-control').hide()
    }
  }, 1000)


  $(".search-box-key").keydown(function (e) {
    if (e.which == 13) {
      window.location.href = '../help-list.html'
    }
  })

  //  $(".search-intput-key-announce").keydown(function (e) {
  //  if (e.which == 13) {
  //      window.location.href = '../announce.html'
  //     }
  //  });

  $('.nav-tabs a').hover(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

  let script = document.createElement('script');
  script.src = "https://o.alicdn.com/mecloud/shell/dialog.js";
  $('body').append(script);
  setTimeout(() => {
    window.AlimeDialog({
      from: 'UCMfiTn8ma'
    });
    setTimeout(() => {
      $('#J_xiaomi_dialog').css({ 'bottom': 'auto', 'top': '200px' })
      $('#J_xiaomi_dialog').show()
    }, 100)
  }, 1000)
})

