(function($) {
	
	$.fn.sortify = function(){
    
	function disableSelection(){
		return false;
	}
	
	function insertBefore(drag) {
            drag.insertBefore(drag.prev().css({'top':-drag.height()}).animate({'top':0, 'left':0}, 100));
        }
        
    function insertAfter(drag) {
            drag.insertAfter(drag.next().css({'top':drag.height()}).animate({'top':0, 'left':0}, 100));
        }
        
    $(this).on('mousedown', function(e){
        
		var drag = $(this);
		var posParentTop = drag.parent().offset().top;
		var posParentBottom = posParentTop + drag.parent().height();
		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		var posOld = drag.offset().top;
		var posOldX = drag.offset().left;
		var posOldCorrection = e.clientY - posOld;
		var posOldCorrectionX = e.clientX - posOldX;
        drag.addClass('dragActive');
        
        var mouseMove = function(e){
            
			var posNew = e.clientY - posOldCorrection;
			var posNewX = e.clientX - posOldCorrectionX;
			
			var offset = function (drag) {
                drag.offset({'top': posNew, 'left': posNewX});
            }
            
            var correction = function () {
                drag.css({'top':0});
				posOld = drag.offset().top;
				posOldCorrection = e.clientY - posOld;
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
			$(document).off('mousemove', mouseMove).off('mouseup', mouseUp).off('mousedown', disableSelection);
            drag.animate({'top':0, 'left':0}, 100, function(){
				drag.removeClass('dragActive');
	        });
        };
		
		$(document).on('mousemove', mouseMove).on('mouseup', mouseUp).on('mousedown', disableSelection);
        $(window).on('blur', mouseUp);
    });
    
}

})(jQuery);