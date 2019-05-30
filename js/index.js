//jshint esversion: 8

(function() {

  const goalElement = document.getElementById('goal');
  let habitElement = document.getElementById('habit');

  let thisGoal;
  let habits = [];
  let i = 0;
  let allHabits = [];
  let nextHabit;
  let dispGoal;
  let percentComplete;
  let availableHabits;
  let thisHabit;
  let date;
  try {
    allHabits = JSON.parse(localStorage.getItem('allHabits'));
    if (Array.isArray(allHabits) === false) {
      allHabits = [];
    }
  } catch (e) {
    // might be invalid json in localstorage- because we initted goals on line 5 with [] we should be alright
  }

  //Habit constructor
  function Habit(goal, habit, priority, difficulty, completed, points, notes) {
    this.goal = goal;
    this.habit = habit;
    this.priority = priority;
    this.difficulty = difficulty;
    this.completed = completed;
    this.points = priority + (2 - difficulty);
    this.notes = [];
  }

  const focus = function() {

    if (allHabits.length > 0) {
      i = 0;
      let now = new Date();
      date = `${now.getMonth()}:${now.getDate()}:${now.getYear()}`;
      nextHabit = allHabits.sort((a, b) => b.points - a.points).filter(e => e.completed != date);
      $('.now').show();
      $('table').hide();
      $('#addGoal').hide();
      $('.goal').text(`Calculating Optimal Task:`);
      $('.habitG').hide();
      $('.progress').hide();
      $('.lds-roller').show();
      if (nextHabit.length < 2) {
        $('.switchHabits').hide();
      } else {
        $('.switchHabits').show();
      }
      $('.switchHabits').on('click',
        function() {
          $('.skip').remove();

          // availableHabits = nextHabit.filter(h => h.habit !== nextHabit[i].habit);
          for (let i = 0; i < nextHabit.length; i++)
            if (nextHabit[i] != thisHabit) {
              $('.remainingHabits').append(
                `<a class="dropdown-item skip" habit='${i}' href="#">${nextHabit[i].habit}</a>`
              );
            }


          $('.skip').on('click', function() {



            thisHabit = $(this).attr('habit');
            i = parseInt(thisHabit, 10);
            nextHabit[i].points += 0.01;
            localStorage.setItem('allHabits', JSON.stringify(allHabits));
            dispGoal();
          });

        });

      dispGoal = function() {
        thisHabit = nextHabit[i];
        if (nextHabit.length > 0) {
          $('.goal').text(nextHabit[i].goal + ':');
          $('.habitG').text(nextHabit[i].habit).show();
          $('.lds-roller').hide();
          $('.progress').show();
          $('.goal').show();
        } else {
          $('.goal').text('You did it!');
          $('.habitG').show();
          $('.habitG').text('Relax!');
          $('.lds-roller').hide();
          $('.progress').show();
          $('.goal').show();
        }
        let percentComplete = 100 * (allHabits.filter(e => e.completed === date).length) / allHabits.length;
        $('.progress-bar').attr('aria-valuenow', `${percentComplete}`);
        $('.progress-bar').attr('style', 'width: ' + `${percentComplete}` + '%');

      };

      $('.notes').on('click', function() {
        $('.done').on('click', function() {
          $('.show').removeClass('show');
        });
      });
      setTimeout(dispGoal, 1000);

    } else {
      addGoal();
    }
  };

  const done = function() {
    if (nextHabit[i]) {
      if ($('.note')[0].value.length > 0) {
        let note = $('.note')[0].value;
        $('.note')[0].value = '';
        // nextHabit[i].notes.push()
        let now = new Date();
        thisHabit.notes.push([now, note]);
        console.log(thisHabit);
      }
      // $('.show').removeClass('show');
      let now = new Date();
      date = `${now.getMonth()}:${now.getDate()}:${now.getYear()}`;
      nextHabit[i].completed = date;
      $('.collapse').collapse('hide');
      localStorage.setItem('allHabits', JSON.stringify(allHabits));
      focus();
    }
  };

  // $('.notes').on('click', function() {
  //   $('form-control').toggleClass('.show');
  // });

  $('textarea').on('click', function() {
    event.stopPropagation();
  });
  $('.done').on('click', done);



  //Load table from local storage
  const editGoals = function() {
    let goalsX = allHabits.map(a => a.goal);
    let uniqueGoals = goalsX.filter((e, i) => goalsX.indexOf(e) === i);
    let counts = uniqueGoals.map(a => allHabits.filter(g => a === g.goal).length);
    if (uniqueGoals.length < 1) {
      addGoal();
    } else {
      i = 0;
      $('.goals').remove();
      for (let i = 0; i < uniqueGoals.length; i++) {

        const goalDiv = document.createElement('div');
        goalDiv.textContent = uniqueGoals[i];
        const habitDiv = document.createElement('div');
        habitDiv.textContent = counts[i];

        $('.table').append(
          `
      <tr class='goals'>
        <th scope="row">${i+1}</th>
        <td id='goal'>${goalDiv.innerHTML}</td>
        <td>${habitDiv.innerHTML}</td>
        <td><button class="removeGoal btn btn-sm btn-secondary" type="button">Remove</button>
        <button class="editGoal btn btn-sm btn-secondary" type="button">Edit</button></td>
      </tr>
      `
        );
      }
      $('table').show();
      $('#addGoal').hide();
      $('.now').hide();

      //Edit a goal
      $('.editGoal').on('click',
        function() {
          $('table').hide();
          $('#addGoal').show();
          $('.now').hide();
          addGoal();
          $('.newHabit').remove();

          thisGoal = this.closest('tr').getElementsByTagName('td')[0].innerHTML;
          filteredHabits = allHabits.filter(g => g.goal === thisGoal);
          for (let i = 0; i < filteredHabits.length; i++) {
            habitElement.value = filteredHabits[i].habit;
            addHabit();
            $('.radio').eq((i * 6) + 1).removeClass('active');
            $('.radio').eq((i * 6) + 4).removeClass('active');
            $('.radio').eq((i * 6) + parseInt(filteredHabits[i].priority, 10)).addClass('active');
            $('.radio').eq((i * 6) + 3 + parseInt(filteredHabits[i].difficulty, 10)).addClass('active');
          }
          goalElement.value = thisGoal;
          return thisGoal;

        });

    }
  };

  const addGoal = function() {
    filteredHabits=null;
    $('.newHabit').remove();
    $('#addGoal').show();
    $('table').hide();
    $('.now').hide();
    goalElement.value = '';
    habitElement.value = '';

    $('.editGoal').on('click',
      function() {
        $('table').hide();
        $('#addGoal').show();
        $('.now').hide();

        addGoal();
        $('.newHabit').remove();

        thisGoal = this.closest('tr').getElementsByTagName('td')[0].innerHTML;
        filteredHabits = allHabits.filter(g => g.goal === thisGoal);
        for (let i = 0; i < filteredHabits.length; i++) {
          habitElement.value = filteredHabits[i].habit;
          addHabit();
          $('.radio').eq((i * 6) + 1).removeClass('active');
          $('.radio').eq((i * 6) + 4).removeClass('active');
          $('.radio').eq((i * 6) + parseInt(filteredHabits[i].priority, 10)).addClass('active');
          $('.radio').eq((i * 6) + 3 + parseInt(filteredHabits[i].difficulty, 10)).addClass('active');
        }
        goalElement.value = thisGoal;
        return thisGoal;

      });
  };

  const addToggle = function() {
    $('.temptog').on('click', function(event) {
      event.stopPropagation();
      $('.show').removeClass('show');
      $(this).parent().toggleClass('show');
      $(this).next('div').toggleClass('show');
      $("button").removeClass("temptog");
    });

    $('.radio').on('click', function(event) {
      event.stopPropagation();
      $(this).button('toggle');
    });

  };

  //Add new habit
  const addHabit = function() {
    $('.habit').attr("id", `habit${i}`).removeClass('habit');
    $("button").removeClass("temptog");
    $('.input-group').eq(i).addClass('newHabit');
    $('.add').addClass('remove').removeClass('add');
    $(`        <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <button type="button" class="btn btn-outline-secondary dropdown-toggle temptog dropdown-toggle-split" aria-haspopup="true" aria-expanded="true">
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <div class="dropdown-menu open">
                    <h6 class="dropdown-header">Priority</h6>
                    <a class="dropdown-item" href="#">
                      <div class="btn-group priority btn-group-toggle" id='priority' data-toggle="buttons">
                        <label class="btn radio btn-secondary" id='0'>
                          <input type="radio" name="options" id="option1" autocomplete="off"> Low
                        </label>
                        <label class="btn radio btn-secondary active" id='1'>
                          <input type="radio" name="options" id="option2" autocomplete="off" checked> Medium
                        </label>
                        <label class="btn radio btn-secondary" id='2'>
                          <input type="radio" name="options" id="option3" autocomplete="off"> High
                        </label>
                      </div>
                    </a>
                    <div role="separator" class="dropdown-divider"></div>
                    <h6 class="dropdown-header">Challenge</h6>
                    <a class="dropdown-item" href="#">
                      <div class="btn-group challenge btn-group-toggle" data-toggle="buttons">
                        <label class="btn radio btn-secondary" id='0'>
                          <input type="radio" name="options" id="option1" autocomplete="off" checked> Low
                        </label>
                        <label class="btn radio btn-secondary active" id='1'>
                          <input type="radio" name="options" id="option2" autocomplete="off"> Medium
                        </label>
                        <label class="btn radio btn-secondary" id='2'>
                          <input type="radio" name="options" id="option3" autocomplete="off"> High
                        </label>
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


  };

  addToggle();

  $('body').on('click', function(ev) {
    $('.dropdown-menu').removeClass('show');

  });

  $(document).on('click', '.add', addHabit);

  //Remove habit
  $(document).on('click', '.remove',
    (function() {
      $(this).parent("div").parent("div").remove();
    })
  );

  //Remove goal
  $(document).on('click', '.removeGoal',
    (function() {
      thisGoal = this.closest('tr').getElementsByTagName('td')[0].innerHTML;
      allHabits = allHabits.filter(g => g.goal != thisGoal);
      // localStorage.setItem('goals', JSON.stringify(goals));
      localStorage.setItem('allHabits', JSON.stringify(allHabits));
      $(this).parent("td").parent("tr").remove();
      return thisGoal;
    })
  );

  //Submit goal
  $("#submit").on('click',
    (function() {
      // allHabits = allHabits.filter(g => g.goal != thisGoal);
      if (goalElement.value.length > 0) {
        for (let j = 0; j < $('.newHabit').length; j++) {
          if (document.getElementById(`habit`) != null) {
            if (filteredHabits) {
              filteredHabits[j].goal = goalElement.value;
              filteredHabits[j].habit = $('.newHabit')[j].childNodes[3].value;
              filteredHabits[j].priority = parseInt($('.active')[j * 2].id, 10);
              filteredHabits[j].difficulty = parseInt($('.active')[(j * 2) + 1].id, 10);
            } else {
              let habit = new Habit(
                goalElement.value,
                $('.newHabit')[j].childNodes[3].value,
                parseInt($('.active')[j * 2].id, 10),
                parseInt($('.active')[(j * 2) + 1].id, 10),
                []

              );
              // habits.push(document.getElementById(`habit${j}`).value);
              allHabits.push(habit);
            }
          }
        }


        // let goal = new Goal(goalElement.value, habits);
        const goalValue = goalElement.value;
        const temporaryDiv = document.createElement('div'); // this will create a div but only in memory and not attached to the page. we can use it to escape html so the user cant inject code- we can make this a helper function later. in jquery you can also do $('<div>').text('<b>value here</b>').html() - try the output in the console
        temporaryDiv.textContent = goalValue;
        goalElement.value = '';
        habitElement.value = '';
        $('.removeGoal').parent("div").parent("div").remove(); // anytime you need to fish around for parent x y z it's an indicator we can restructure the output of the row and its event handler, we'll make changes in another commit to try to tighten it up
        // goals.push(goal);
        // localStorage.setItem('goals', JSON.stringify(goals));
        localStorage.setItem('allHabits', JSON.stringify(allHabits));
        editGoals();
        goal = '';
        habits = [];
        thisGoal = null;
        i = 0;
      } else {
        alert("Please name your goal.");
      }
    })

  );

  $('.editGoals').on('click', editGoals);
  $('.addGoal').on('click', addGoal);
  $('.focus').on('click', focus);

  if (allHabits.length > 0) {
    focus();
  } else {
    addGoal();
  }


  //Habit Templates
  const templates = [{
      goal: "Get in Shape",
      habit: "Excercise",
      difficulty: 2,
      priority: 2
    }, {
      goal: "Learn a New Skill",
      habit: "Practice",
      difficulty: 2,
      priority: 2
    }, {
      goal: "Learn a New Skill",
      habit: "Create",
      difficulty: 2,
      priority: 2
    }, {
      goal: "Accomplish a Goal",
      habit: "Do this thing",
      difficulty: 2,
      priority: 2
    },
    {
      goal: "Accomplish a Goal",
      habit: "Don't do this thing",
      difficulty: 2,
      priority: 2
    },
    {
      goal: "Accomplish a Goal",
      habit: "Do do this thing",
      difficulty: 2,
      priority: 2
    }

  ];

  $('.templates').on('click',
    function() {
      i = 0;
      $('table').hide();
      $('#addGoal').show();
      $('.now').hide();

      addGoal();
      $('.newHabit').remove();

      thisGoal = this.innerHTML;
      filteredHabits = templates.filter(g => g.goal === thisGoal);
      for (let i = 0; i < filteredHabits.length; i++) {
        habitElement.value = filteredHabits[i].habit;
        addHabit();
        $('.radio').eq((i * 6) + 1).removeClass('active');
        $('.radio').eq((i * 6) + 4).removeClass('active');
        $('.radio').eq((i * 6) + parseInt(filteredHabits[i].priority, 10)).addClass('active');
        $('.radio').eq((i * 6) + 3 + parseInt(filteredHabits[i].difficulty, 10)).addClass('active');
      }
      goalElement.value = thisGoal;
      return thisGoal;
    });



})();
