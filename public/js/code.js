// Grab the articles as a json
console.log('helloworld');

$.getJSON("/articles", function(data) {
	console.log('getjson function runs')
  // For each one
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "' data-toggle='modal' data-target='#myModal'>" + 
    		data[i].title + "<br />" + data[i].link + "<br />" + 
    		data[i].author + "<br />"+ data[i].upvotes + "</p>");
  }
});

$(document).on('click', "p", function() {
	console.log();
	var thisId = $(this).data('id');
	$.get('/articles/' + thisId, function(data) {
		console.log(data);
		$('#notes').append('<h2>' + data.title + '</h2>');
    $("#notes").append("<input id='titleinput' name='title' >");
    // A textarea to add a new note body
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    // A button to submit a new note, with the id of the article saved to it
    $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Comment</button>");

    if (data.note) {
    	$('#titleinput').val(data.note.tilte);
    	$('#bodyinput').val(data.note.body);
    }
	})
});

$(document).on('click', '#savenote', function(e) {
	console.log('savenote button clicked');
	e.preventDefault();
	var thisId = $(this).data('id');
	// var data = {
	// 	title: $('#titleinput').val(),
	// 	body: $('#bodyinput').val()
	// }

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");

})