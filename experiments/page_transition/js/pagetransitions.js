// On button click, animate to 'next page' and update history state
// On changing history state, dismiss the load event and instead animate to the correct page
var PageTransitions = (function() {

	var $main = $( '#pt-main' ),
		$pages = $main.children( 'div.pt-page' ),
		$btn = $( '#nextPageBtn' ),
		animcursor = 1,
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;
	
	function init() {

		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		$pages.eq( current ).addClass( 'pt-page-current' );

		$btn.on( 'click', function() {
			if( isAnimating ) {
				return false;
			}
            nextPage( 1 );
		} );
        
        window.onpopstate = function(event){
            var pState = event.state;
            console.log(pState);
            if (pState !== null && pState.id !== null) {
                gotoPage(pState.id);
            } else {
                // if pState is null, it means it's back to landing page
                gotoPage(0);
            }
        };

	}

	function nextPage(options ) {
		if( isAnimating ) {
			return false;
		}

		isAnimating = true;
		
		var $currPage = $pages.eq( current );

        if( current < pagesCount - 1 ) {
            ++current;
        }
        else {
            current = 0; // back to main
        }

		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
			outClass = 'pt-page-moveToLeft', inClass = 'pt-page-moveFromRight';
        
        /*
		switch( animation ) {
			case 1:
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 2:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
		}
        */

		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
                pushHistoryState();
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
                pushHistoryState();
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
            pushHistoryState();
		}

	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}
    
    function pushHistoryState() {
        console.log("***pushHistoryState()");
        // pushState takes three parameters
        // - a state object that gets poped out when user uses history navigation to that state via history.state
        //  - Use it to change the content on the page
        // - a title, which doesn't have any functionality atm
        // - additions to the url
        history.pushState({id: current}, "", "?state=" + current);
    }
    
    function gotoPage( targetPg ) {
		if( isAnimating ) {
			return false;
		}
		isAnimating = true;
		var $currPage = $pages.eq( current );
        current = targetPg;
		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
			outClass = 'pt-page-moveToRight', inClass = 'pt-page-moveFromLeft';
		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );
		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );
		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}
        // This landing transition don't need no pushHistoryState()
	}
    
	init();

	return { 
		init : init,
		nextPage : nextPage,
	};

})();