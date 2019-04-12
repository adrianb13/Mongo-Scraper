$.getJSON("/articles", function(data) {
  console.log(data)
  for (var i = 0; i < data.length; i++) {
    var title = data[i].title
    $("#articles").append("<br><p data-id='" + data[i]._id + "' class='bold'>~~" + title + "~~</p><div class='description'>" + data[i].summary + "</div>" + "<a href='" + data[i].link + "'>" + "Read More..." + "</a>" + "<br><br>");
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
      console.log(data[0].comments);
      $("#comments").append("<h2>" + data[0].title + "</h2>");
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#comments").append("<button data-id='" + data[0]._id + "' id='addComment'>Save</button>");
      $("#comments").append("<button data-id='" + data[0]._id + "' id='deleteComment'>Delete</button>");

      if (data[0].comments) {
        $("#bodyinput").val(data[0].comments.comment);
      }
    });
});

// When you click the addComment button
$(document).on("click", "#addComment", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      comment: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#comments").empty();
    });

  $("#bodyinput").val("");
});

$(document).on("click", "#deleteComment", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
    data: {
      comment
    }
  })
  .then(function(data) {
    console.log(data);
    $("#comments").empty();
  });

});