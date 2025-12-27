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
    
  

    
})