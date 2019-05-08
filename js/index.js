//jshint esversion: 8

(function() {
  //   'use strict'; // this will throw more errors instead of hiding them

  // unless you overwrite elements with .innerHTML = 'whatever' your id lookups should just work if run once
  const goalElement = document.getElementById('goal');
  let habitElement = document.getElementById('habit');

  let goalIndex;
  let habits = [];
  let i = 0;
  let goals = [];

  try {
    goals = JSON.parse(localStorage.getItem('goals'));
    if (Array.isArray(goals) === false) {
      goals = []; // we always want an array- if goals fails to be restored properly this gives us a slight safety net
    }
  } catch (e) {
    // might be invalid json in localstorage- because we initted goals on line 5 with [] we should be alright
  }

  //Goal constructor
  function Goal(goal, habit) {
    this.goal = goal;
    this.habits = habits;
  }

  //Habit constructor
  function Habit(importance, difficulty, duration) {
    this.priority = priority;
    this.difficulty = difficulty;
    this.duration = duration;
  }

  const focus = function() {
    if (goals.length > 0) {
      goalIndex = null;

      let randomGoal = goals[Math.floor(Math.random() * goals.length)];
      let randomHabit = randomGoal.habits[Math.floor(Math.random() * randomGoal.habits.length)];

      $('.now').show();
      $('table').hide();
      $('#addGoal').hide();
      $('.goal').text(`Calculating Optimal Task:`);
      $('.habitG').hide();
      $('.lds-roller').show();

      dispGoal = function() {
        $('.goal').text(randomGoal.goal + ':');
        $('.habitG').text(randomHabit).show();
        $('.lds-roller').hide();
        $('.goal').show();
      };

      setTimeout(dispGoal, 3000);
    } else {
      addGoal();
    }
  };



  //Load table from local storage
  const editGoals = function() {
    if (goals.length < 1) {
      addGoal();
    } else {
      i = 0;
      $('.goals').remove();
      for (let i = 0; i < goals.length; i++) {

        const temporaryDiv = document.createElement('div'); // this will create a div but only in memory and not attached to the page. we can use it to escape html so the user cant inject code- we can make this a helper function later. in jquery you can also do $('<div>').text('<b>value here</b>').html() - try the output in the console
        temporaryDiv.textContent = goals[i].goal;

        $('.table').append(
          `
      <tr class='goals'>
        <th scope="row">${i+1}</th>
        <td>${temporaryDiv.innerHTML}</td>
        <td>${goals[i].habits.length}</td>
        <td><button class="remove btn btn-sm btn-secondary" type="button">Remove</button>
        <button class="editGoal btn btn-sm btn-secondary" type="button">Edit</button></td>
      </tr>
      `
        );
      }
      $('table').show();
      $('#addGoal').hide();
      $('.now').hide();
      // goalIndex = null;
      // $('table').show();
      // $('#addGoal').hide();
      // $('.now').hide();
      // $();
      // goalElement.value = '';
      // habitElement.value = '';
      // $('.remove').parent("div").parent("div").remove();
      //Edit table
      $('.editGoal').on('click', function() {
        goalIndex = this.closest('tr').getElementsByTagName('th')[0].innerHTML - 1;
        for (let i = 0; i < goals[goalIndex].habits.length; i++) {
          habitElement.value = goals[goalIndex].habits[i];
          addHabit();
        }
        goalElement.value = goals[goalIndex].goal;
        $('table').hide();
        $('#addGoal').show();
        $('.now').hide();

      });

    }
  };

  const addGoal = function() {
    goalIndex = null;
    $('#addGoal').show();
    $('table').hide();
    $('.now').hide();
    goalElement.value = '';
    habitElement.value = '';
    $('.remove').parent("div").parent("div").remove();
  };

  const addToggle = function(e) {
    $('.temptog').on('click', function() {
      event.stopPropagation();
      $(this).parent().toggleClass('show');
      $(this).next('div').toggleClass('show');

      console.log('Toggle');
      console.log(i);
    });


  };

  //Add new habit
  const addHabit = function() {
    $('.habit').attr("id", `habit${i}`).removeClass('habit');
          $("button").removeClass("temptog");
    $('.add').addClass('remove').removeClass('add');
    $(`<div class="input-group mb-3">
      <div class="input-group-prepend">
        <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split temptog" aria-haspopup="true" aria-expanded="true">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <div class="dropdown-menu open">
          <h6 class="dropdown-header">Priority</h6>
          <a class="dropdown-item" href="#">
            <div class="btn-group" data-toggle="buttons-radio">
              <button type="button" class="btn low-priority btn-primary">Low</button>
              <button type="button" class="btn btn-primary">Medium</button>
              <button type="button" class="btn btn-primary">High</button>
            </div>
          </a>
                          <div role="separator" class="dropdown-divider"></div>
          <h6 class="dropdown-header">Challenge</h6>
          <a class="dropdown-item" href="#">
            <div class="btn-group" data-toggle="buttons-radio">
              <button type="button" class="btn btn-primary">Low</button>
              <button type="button" class="btn btn-primary">Medium</button>
              <button type="button" class="btn btn-primary">High</button>
            </div>
          </a>
        </div>
      </div>
      <input type="text" autocomplete="off" id='habit' class="habit form-control" placeholder="Habit">
      <div class"input-group-append">
        <button class="add btn btn-primary" type="button">Add</button>
      </div>
    </div>`).insertBefore('#submit');

    habitElement = document.getElementById('habit');
    $('.remove').text('Remove');
    i++;

    addToggle();
      $("button").removeClass("temptog");
  };

  addToggle();

//   $('body').on('click', function(ev) {
//     console.log('body');
//     $('.show').removeClass('show');
//
//   });
//
// $('.dropdown-toggle').on('click', function(ev) {
//   ev.stopPropagation();
// });






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
      localStorage.setItem('goals', JSON.stringify(goals));
      $(this).parent("td").parent("tr").remove();
    })
  );

  //Submit goal
  $("#submit").on('click',
    (function() {
      if (goalElement.value.length > 0) {
        for (let j = 0; j < i; j++) {
          if (document.getElementById(`habit${j}`) != null) {
            habits.push(document.getElementById(`habit${j}`).value);
          }
        }
        if (goalIndex != null) {
          goals.splice(goalIndex, 1);
        }
        let goal = new Goal(goalElement.value, habits);
        const goalValue = goalElement.value;
        const temporaryDiv = document.createElement('div'); // this will create a div but only in memory and not attached to the page. we can use it to escape html so the user cant inject code- we can make this a helper function later. in jquery you can also do $('<div>').text('<b>value here</b>').html() - try the output in the console
        temporaryDiv.textContent = goalValue;
        goalElement.value = '';
        habitElement.value = '';

        $('.remove').parent("div").parent("div").remove(); // anytime you need to fish around for parent x y z it's an indicator we can restructure the output of the row and its event handler, we'll make changes in another commit to try to tighten it up
        goals.push(goal);
        localStorage.setItem('goals', JSON.stringify(goals));
        editGoals();
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
  $('.editGoal').on('click',
    (function() {
      goalIndex = this.closest('tr').getElementsByTagName('th')[0].innerHTML - 1;
      for (let i = 0; i < goals[goalIndex].habits.length; i++) {
        habitElement.value = goals[goalIndex].habits[i];
        addHabit();
      }
      goalElement.value = goals[goalIndex].goal;
      $('table').hide();
      $('#addGoal').show();
      $('.now').hide();

    })
  );


  $('.editGoals').on('click', editGoals);
  $('.addGoal').on('click', addGoal);
  $('.focus').on('click', focus);
  $('.done').on('click', focus);

  if (goals.length > 0) {
    focus();
  } else {
    addGoal();
  }





})();
