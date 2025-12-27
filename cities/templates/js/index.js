$(function(){
  var x = 0
  var y = 0
  var first = false
  setInterval(function(){
    x=x-0.3
    if((x+y)<=-800){
      x=0
      y=0
      first= true
    }
    $('.logo-river-box').each(function(){
      if(!first){
        y = $(this).data('y')
      }
        var left= $(this).data('x')

      $(this).css("transform",'translate(282.406px, '+(x+y)+'px) ')
    })
  },20)
    
  // Banner 轮播功能
  initBannerCarousel();
})

// Banner 轮播初始化
function initBannerCarousel() {
  var $bannerItems = $('.banner-item');
  var $indicators = $('.banner-indicators .indicator');
  var currentIndex = 0;
  var totalSlides = $bannerItems.length;
  
  if (totalSlides === 0) return;
  
  // 自动轮播
  var autoSlide = setInterval(function() {
    currentIndex = (currentIndex + 1) % totalSlides;
    switchSlide(currentIndex);
  }, 4000); // 每4秒切换一次
  
  // 点击指示器切换
  $indicators.on('click', function() {
    currentIndex = parseInt($(this).data('slide'));
    switchSlide(currentIndex);
    // 重置自动轮播计时器
    clearInterval(autoSlide);
    autoSlide = setInterval(function() {
      currentIndex = (currentIndex + 1) % totalSlides;
      switchSlide(currentIndex);
    }, 4000);
  });
  
  // 鼠标悬停暂停轮播
  $('.banner-carousel').hover(
    function() {
      clearInterval(autoSlide);
    },
    function() {
      autoSlide = setInterval(function() {
        currentIndex = (currentIndex + 1) % totalSlides;
        switchSlide(currentIndex);
      }, 4000);
    }
  );
  
  // 切换幻灯片
  function switchSlide(index) {
    $bannerItems.removeClass('active').eq(index).addClass('active');
    $indicators.removeClass('active').eq(index).addClass('active');
  }
}