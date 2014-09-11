// main

function updateContent(pStateId) {
  $('#content').html(pStateId);
  $('#content').addClass('animated tada');
}


$( document ).ready(function() {
  
  window.onpopstate = function(event){
  var pState = event.state;
  console.log(pState);
  if (pState !== null && pState.id !== null) {
      updateContent(pState.id);
    }
  };
  
  $('a').click(function (event) {
    event.preventDefault();
    var stateId = $(this).attr('href');
    updateContent(stateId);
    history.pushState({id: stateId}, "state" + stateId, "?state=" + stateId);
  });
  
});

// When the user backs to homepage which doesn't have all that stage stuff, the onpopstate will return null