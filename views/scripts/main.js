$(document).ready(function () {

  var data = [];
  var activeIdx = -1;

  // kick off getting the questions
  getActivities();
  // now do it  every 2.5 seconds
  setInterval(getActivities, 2500);

  function getActivities() {
    // TODO: make an ajax request to /api/getQuestions. on success
    //       set  the data variable equal to the response and render
    //       out the question previews (by callingrenderPreviews())
    //       Later on in the writeup, also render the active question 
    //       (to update it) with renderactive()
    $.ajax({
      url: '/api/getActivities',
      type: 'GET',
      success: function(res) {
        data = res;
        renderPreviews();
        // renderActive();
      }
    })
  }

  // makes a list  of questions which all have the question text and a data-qid attribute
  // that allows you to access their _id by doing $whateverjQueryObjectYouHave.data('qid')
  function renderPreviews() {
    $('#activities').html(
        data.map((i) => '<li data-qid="' + i._id + '">' + i.ActivityText + '</li>').join('')
    )
  }


  // function renderActive() {
  //   if (activeIdx > -1) {
  //     var active = data[activeIdx];
  //     $('#show-question').css('display', 'block');
  //     $('#question').text(active.questionText ? active.questionText: '');
  //     $('#author').text(active.author ? active.author: '');
  //     $('#answer-text').text(active.answer ? active.answer : '');
  //   } else {
  //     $('#show-question').css('display', 'none');
  //   }
  // }

  // $('#questions').on('click', 'li', function () {
  //   var _id = $(this).data('qid');
  //   // TODO: When a question is clicked, set the `active` variable equal to
  //   //       the data of the question that is active (hint: look through the 
  //   //       data array. If an array entry has the same _id as the _id we just
  //   //       declared here, it is the active question
  //   $.each(data, function (index, value) {
  //     if (value._id === _id) {
  //       activeIdx = index;
  //     }
  //   })
  //   // we now render out the active question
  //   renderActive();
  // })

  // $('#show-question').on('click', '#submitAnswer', function () {
  //   var answer = $('#answer').val();
  //   // TODO: When we submit a new answer, send a POST request to
  //   //      /api/answerQuestion with  the question answer and the active question's
  //   //      _id.
  //   $.ajax({
  //     url: '/api/answerQuestion',
  //     data: { answer: answer, qid: data[activeIdx]._id },
  //     type: 'POST',
  //     success: function(res) {
  //       console.log(res); 
  //     }
  //   })
  // })

  // // when we want to make a new question, show the modal
  // $('#new-question').on('click', function () {
  //   $('.modal').css('display', 'block');
  // })

  // $('#close').on('click', function () {
  //   $('.modal').css('display', 'none');
  // })

  // $('#submit-question').on('click', function () {
  //   // TODO: make a post request to /api/addQuestion with the qText as the 
  //   // questionText attribute. On success, hide the modal
  //   var qText = $('#question-text').val();
  //   $.ajax({
  //     url: '/api/addQuestion',
  //     data: { questionText: qText },
  //     type: 'POST',
  //     success: function(res) {
  //       console.log(res);
  //       // exercise for you: close the modal (hint: see how we do it in other places)
  //       $('.modal').css('display', 'none');
  //     }
  //   })
  // })
})
