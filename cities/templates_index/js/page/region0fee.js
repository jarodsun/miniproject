$(function () {
    $('.sidebar-nav-list').on('click', 'li', function () {
        if ($(this).hasClass("sidebar-nav-active")) {
            return false;
        }
        $(".product-" + $(".sidebar-nav-active").data("for")).removeClass("active");
        $(this).addClass('sidebar-nav-active').siblings().removeClass('sidebar-nav-active');
        var show_ele = $(".product-" + $(this).data("for"));
        setTimeout(function () {
            show_ele.addClass("active");
        }, 50);
    });

    $(document).on("click", ".show-sales", function () {
        $('.customer_service').show();
    });

    $(document).on('click',function(e){
        $(e.target).is('.show-sales') ? e.stopPropagation() : $('.customer_service').hide();
    });

    $(document).on("click", ".certificate-wrap >ul >li", function () {
        $('.honor-bigimg-modal').show().find('img').attr('src',$(this).children('img').attr('src'))
    });

    $('.close-bigimg-modal').on('click',function(){
        $('.honor-bigimg-modal').hide();
    })
})
var mySwiper = new Swiper('#swiper-banner', {
    autoplay: true, //可选选项，自动滑动
    speed: 1000,
    slidesPerView: 1,
    loop: true,
    centeredSlides: true,
    // 分页器
    pagination: {
        el: '.swiper-pagination',
    },
})
//鼠标覆盖停止自动切换
mySwiper.el.onmouseover = function () {
    mySwiper.autoplay.stop();
}

//鼠标离开开始自动切换
mySwiper.el.onmouseout = function () {
    mySwiper.autoplay.start();
}