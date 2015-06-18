(function($) {
	
	$.fn.sortify = function(){
    
	var disableSelection = function (){
		return false;
	}
	
	var insertBefore = function (drag) {
            drag.insertBefore(drag.prev().css({'top':-drag.height()}).animate({'top':0, 'left':0}, 100));
        }
        
    var insertAfter = function (drag) {
            drag.insertAfter(drag.next().css({'top':drag.height()}).animate({'top':0, 'left':0}, 100));
        }
        
        
    $(this).on('mousedown touchstart', function(e){
        
		var drag = $(this);
		var posParentTop = drag.parent().offset().top;
		var posParentBottom = posParentTop + drag.parent().height();
		var posOld = drag.offset().top;
		var posOldX = drag.offset().left;
		
		if (/touch/.test(e.type)) {
		    
		    var touches = e.originalEvent.targetTouches[0];
		    var posOldCorrection = touches.clientY - posOld;
		    var posOldCorrectionX = touches.clientX - posOldX;
		} else {
		
    		var posOldCorrection = e.clientY - posOld;
    		var posOldCorrectionX = e.clientX - posOldX;
		}
		
        drag.addClass('dragActive');
        
        var mouseMove = function(e){
            
            e.preventDefault();
            e.stopPropagation();
            
			if (/touch/.test(e.type)) {
			    
			    var touches = e.originalEvent.targetTouches[0];
    			var posNew = touches.clientY - posOldCorrection;
    			var posNewX = touches.clientX - posOldCorrectionX;
			    
			} else {    
			
    			var posNew = e.clientY - posOldCorrection;
    			var posNewX = e.clientX - posOldCorrectionX;
			}
			
			var offset = function (drag) {
                drag.offset({'top': posNew, 'left': posNewX});
            }
            
            var correction = function () {
                drag.css({'top':0});
				posOld = drag.offset().top;
				
				if (/touch/.test(e.type)) {
				    posOldCorrection = touches.clientY - posOld;
				} else {
				    posOldCorrection = e.clientY - posOld;
				}
            }
			
			drag.css({'top': posNew - drag.height(), 'left': posNewX - drag.width()});

			if (posNew < posParentTop){
				if (!!drag.prev().length) {
					insertBefore(drag);
				}
				offset(drag);
            } else if (posNew + drag.height() > posParentBottom){
				if (!!drag.next().length) {
					insertAfter(drag);
                }
				offset(drag);
            } else {
				offset(drag);
				if (posOld - posNew > drag.height() - 1){
					insertBefore(drag);
					correction();
				} else if (posNew - posOld > drag.height() - 1){
					insertAfter(drag);
					correction();
				}
			}
			
		};
		
		var mouseUp = function(){
			$(document).off('mousemove touchmove', mouseMove).off('mouseup touchend', mouseUp).off('mousedown touchstart', disableSelection);
            drag.animate({'top':0, 'left':0}, 100, function(){
				drag.removeClass('dragActive');
	        });
        };
		
		$(document).on('mousemove touchmove', mouseMove).on('mouseup touchend', mouseUp).on('mousedown touchstart', disableSelection);
        $(window).on('blur', mouseUp);
    });
    
}

})(jQuery);