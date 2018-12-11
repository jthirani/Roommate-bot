$(document).ready(function () {

  var data = [];
  var activeIdx = -1;

  // kick off getting the questions
  getActivities();
  getChores();
  getBills();

  // now do it  every 2.5 seconds
  setInterval(getActivities, 2500);
  setInterval(getChores, 2500);
  setInterval(getBills, 2500);

  function getActivities() {
    $.ajax({
      url: '/api/getActivities',
      type: 'GET',
      success: function(res) {
        data = res;
        // console.log(data);
        renderPreviews();
        // renderActive();
      }
    })
  }

  function getChores() {
    $.ajax({
      url: '/getChores',
      type: 'GET',
      success: function(res) {
        data1 = res;
        console.log(data1);
        renderPreviews1();
        renderPreviews3();
        // renderActive();
      }
    })
  }

  function getBills() {
    $.ajax({
      url: '/getBills',
      type: 'GET',
      success: function(res) {
        data2 = res;
        console.log(data2);
        renderPreviews2();
        renderPreviews4();
      }
    })
  }


  $(document).on('click', 'button', function () {
    console.log("Wegfwg");
    var id = $(this).data().id;
    var type = $(this).data().type;

    console.log("REHHREHR");
    // TODO: When we submit a new answer, send a POST request to
    //      /api/answerQuestion with  the question answer and the active question's
    //      _id.
    console.log(id);
    console.log(type);

    if (type === "chore") {
      $.ajax({
        url: '/deleteChore',
        data: { id: id },
        type: 'POST',
        success: function(res) {
          console.log(res); 
        }
      })
    } else if (type == "bill") {
      $.ajax({
        url: '/deleteBill',
        data: { id: id },
        type: 'POST',
        success: function(res) {
          console.log(res); 
        }
      })
    }
    
  })

  function renderPreviews() {
    $('#activities').html(
      data.slice(0).reverse().map((i) => '<li data-aid="' + i._id + '">' + i.creator + ' ' + i.activityType + ' for ' + i.activityText + '</li><br>').join('')
    )
  }

  function renderPreviews1() { 
    $('#allchores').html(
      data1.slice(0).reverse().map((i) => '<div class="column is-half"><div class="card"><div class="card-content">' + '<strong>Chore - </strong>'  + i.choreText + '<br><strong>Roomates - </strong>' + i.roommates + '<br><br>' + '<button style="color:red" data-type="chore" data-id="' + i._id + '">Delete</button>' + '</div></div></div>').join('')
    )
  }

  function renderPreviews2() { 
    $('#allbills').html(
      data2.slice(0).reverse().map((i) => '<div class="column is-half"><div class="card"><div class="card-content">' + '<strong>Bill - </strong>'  + i.billText + '<br><strong>Amount - </strong>' + i.amount + '<br><br>' + '<button style="color:red" data-type="bill" data-id="' + i._id + '">Delete</button>' + '</div></div></div>').join('')
    )
  }

  function renderPreviews3() { 
    $('#allchores1').html(
      data1.slice(0).reverse().map((i) => '<div class="column is-half"><div class="card"><div class="card-content">' + '<strong>Chore - </strong>'  + i.choreText + '<br><strong>Roomates - </strong>' + i.roommates + '<br><br>' + '</div></div></div>').join('')
    )
  }

  function renderPreviews4() { 
    $('#allbills1').html(
      data2.slice(0).reverse().map((i) => '<div class="column is-half"><div class="card"><div class="card-content">' + '<strong>Bill - </strong>'  + i.billText + '<br><strong>Amount - </strong>' + i.amount + '<br><br>' + '</div></div></div>').join('')
    )
  }
})
