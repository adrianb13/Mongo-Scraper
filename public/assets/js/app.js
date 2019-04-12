$.getJSON("/articles", function(data) {
  console.log(data)
  for (var i = 0; i < data.length; i++) {
    var title = data[i].title
    $("#articles").append("<br><p data-id='" + data[i]._id + "' class='bold'>~~" + title + "~~</p><div class='description'>" + data[i].summary + "</div>" + "<a href='" + data[i].link + "'>" + data[i].link + "</a>" + "<br>");
  }
});


// Whenever someone clicks an article title
$(document).on("click", "p", function() {
  $("#comments").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      $("#comments").append("<h2>" + data[0].title + "</h2>");
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#comments").append("<button data-id='" + data._id + "' id='addComment'>Save</button>");
      $("#comments").append("<button data-id='" + data._id + "' id='deleteComment'>Delete</button>");

      if (data.comments) {
        $("#bodyinput").val(data.comments.body);
      }
    });
});

// When you click the addComment button
$(document).on("click", "#addComment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
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
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
