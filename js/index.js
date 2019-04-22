//jshint esversion: 8
let goalIndex;
let goals = [];
let habits = [];
let i = 0;
goals = JSON.parse(localStorage.getItem('goals'));

const nextGoal = function() {
  goalIndex = null;
  let randomGoal = goals[Math.floor(Math.random() * goals.length)];
  let randomHabit = randomGoal.habits[Math.floor(Math.random() * randomGoal.habits.length)];
  $('.goal').text(randomGoal.goal);
  $('.habitG').text(randomHabit);
  $('.now').show();
  $('table').hide();
  $('.card').hide();
};
nextGoal();

//Load table from local storage
function loadTable() {
  $('tr').remove();
  for (let i = 0; i < goals.length; i++) {
    $('.table').append(
      `
    <tr>
      <th scope="row">${i+1}</th>
      <td>${goals[i].goal}</td>
      <td>${goals[i].habits.length}</td>
      <td><button class="remove btn btn-outline-secondary" type="button">Remove</button>
      <button class="editGoal btn btn-outline-secondary" type="button">Edit</button></td>
    </tr>
    `
    );
  }
  $('table').show();
  $('.card').hide();
  $('.now').hide();
  //Edit table
  $('.editGoal').on('click', function() {
    goalIndex = this.closest('tr').getElementsByTagName('th')[0].innerHTML - 1;
    for (let i = 0; i < goals[goalIndex].habits.length; i++) {
      document.getElementById("habit").value = goals[goalIndex].habits[i];
      addHabit();
    }
    document.getElementById("goal").value = goals[goalIndex].goal;
    $('table').hide();
    $('.card').show();
    $('.now').hide();

  });
}

//Goal constructor
function Goal(goal, habit) {
  this.goal = goal;
  this.habits = habits;
}



//Add new habit
const addHabit = function() {
  $('.habit').attr("id", `habit${i}`).removeClass('habit');
  $('.add').addClass('remove').removeClass('add');
  $(`<div class="input-group mb-3">
  <input type="text" autocomplete="off" id='habit' class="habit form-control" placeholder="Habit">
  <div class="input-group-append">
    <button class="add btn btn-outline-secondary" type="button">Add</button>
  </div>
</div>`).insertBefore('#submit');
  $('.remove').text('Remove');
  i++;
};

$(document).on('click', '.add', addHabit);

//Remove habit
$(document).on('click', '.remove',
  (function() {
    $(this).parent("div").parent("div").remove();
  })
);

//Remove goal
$(document).on('click', '.remove',
  (function() {
    goals.splice(this.closest('tr').getElementsByTagName('th')[0].innerHTML - 1, 1);
    console.log(this.closest('tr').getElementsByTagName('th')[0].innerHTML - 1);
    console.log(goals);
    localStorage.setItem('goals', JSON.stringify(goals));
    $(this).parent("td").parent("tr").remove();
  })
);

//Submit goal
$("#submit").on('click',
  (function() {
    if (document.getElementById("goal").value.length > 0) {
      for (j = 0; j < i; j++) {
        if (document.getElementById(`habit${j}`) != null) {
          habits.push(document.getElementById(`habit${j}`).value);
        }
      }
      if (goalIndex != null) {
        goals.splice(goalIndex, 1);
      }
      var goal = new Goal(document.getElementById("goal").value, habits);

      $('.table').append(`<tr>
            <th scope="row">${goals.length+1}</th>
            <td>${document.getElementById("goal").value}</td>
            <td>${habits.length}</td>
            <td><button class="remove btn btn-outline-secondary" type="button">Remove</button></td>
            <td><button class="editGoal btn btn-outline-secondary" type="button">Edit</button></td>
          </tr>`);

      document.getElementById("goal").value = '';
      document.getElementById("habit").value = '';

      $('.remove').parent("div").parent("div").remove();
      goals.push(goal);
      localStorage.setItem('goals', JSON.stringify(goals));
      loadTable();
      console.log(goals);
      goal = '';
      habits = [];
      goalIndex = null;
      i = 0;
    } else {
      alert("Please name your goal.");
    }
  })

);

//Edit a goal
$('.editGoal').on('click', function() {

  goalIndex = this.closest('tr').getElementsByTagName('th')[0].innerHTML - 1;
  for (let i = 0; i < goals[goalIndex].habits.length; i++) {
    document.getElementById("habit").value = goals[goalIndex].habits[i];
    addHabit();
  }
  document.getElementById("goal").value = goals[goalIndex].goal;
  $('table').hide();
  $('.card').show();
  $('.now').hide();

});

$('.editGoals').on('click', function() {

  loadTable();
  goalIndex = null;
  $('table').show();
  $('.card').hide();
  $('.now').hide();
  $();
  document.getElementById("goal").value = '';
  document.getElementById("habit").value = '';
  $('.remove').parent("div").parent("div").remove();
});

$('.addGoal').on('click', function() {
  goalIndex = null;
  $('table').hide();
  $('.card').show();
  $('.now').hide();
  document.getElementById("goal").value = '';
  document.getElementById("habit").value = '';
  $('.remove').parent("div").parent("div").remove();
});

$('.focus').on('click', nextGoal);
$('.done').on('click', nextGoal);
