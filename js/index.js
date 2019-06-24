//jshint esversion: 8

(function() {
  let goalElement = document.getElementById('goal');
  let habitElement = document.getElementById('habit');



  //Habit Templates
  let templates = [{
    goal: "Get in Shape",
    habit: "Excercise",
    time: 0,
    difficulty: 2
  },{
    goal: "Get in Shape",
    habit: "Take a Walk",
    time: 1,
    difficulty: 1
  }, {
    goal: "Learn to Program",
    habit: "Update Project",
    time: 2,
    difficulty: 2
  }, {
    goal: "Learn to Program",
    habit: "Study",
    time: 2,
    difficulty: 2
  }, {
    goal: "Get Organized",
    habit: "Make Your Bed",  
    time: 0,
    difficulty: 0
  }, {
    goal: "Mental Maintenance",
    habit: "Meditate",
    time: 1,
    difficulty: 0
  }, {
    goal: "Mental Maintenance",
    habit: "Write 250 Words",
    time: 0,
    difficulty: 0
  }, {
    goal: "Mental Maintenance",
    habit: "Read 10 Pages",
    time: 1,
    difficulty: 1
  }, {
    goal: "Find a Job",
    habit: "Apply for a Job",
    time: 1,
    difficulty: 1
  }];

  let thisGoal;
  let habits = [];
  let i = 0;
  let allHabits = [];
  let upcomingHabits;
  let dispGoal;
  let percentComplete;
  let availableHabits;
  let thisHabit;
  let date;
  let key;
  let note;
  let now;
  let repeat;

  $('.note').hide();
  $('.oneLine').hide();

  try {
    allHabits = JSON.parse(localStorage.getItem('allHabits'));
    if (Array.isArray(allHabits) === false) {
      allHabits = [];
    }
  } catch (e) {
    // might be invalid json in localstorage- because we initted goals on line 5 with [] we should be alright
  }

  // For extension. If in iframe, hide nav.
  if (window.self !== window.top) {
    $('.navbar').hide();
    $('.all').css('padding', 0);
  }

  //Habit constructor
  function Habit(goal, habit, time, difficulty, completed, points, notes, tasksDone, tasksDue, created) {
    this.goal = goal;
    this.habit = habit;
    this.time = time;
    this.difficulty = difficulty;
    this.completed = completed;
    this.points = this.time + this.difficulty;
    this.notes = [];
    this.tasksDone = 0;
    this.tasksDue = 1;
    this.created = Math.floor(now / 8.64e7);
  }

  //Display and make room for text area for notes.
  $('.notes').click(function() {
    $('.note').toggle();
    $('.notes').toggle();
    $('.oneLine').toggle();
    $('.twoLine').toggle();
    $('.saveLog').toggle();
    $('.done').toggle();
    $('.archives').show();
        $('.archive').remove();
    for (i = thisHabit.notes.length-1; i > -1; i--) {
      // Notes
      $('.archives').append(`
  <div class="archive">
  <div class="card-header" id=${i}>
    <div class="mb-0">
      <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
        ${thisHabit.notes[i][0]}
      </button>
    </div>
  </div>

  <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#archives">
    <div class="card-body">
      ${thisHabit.notes[i][1]}
    </div>
  </div>
  </div>`);
    }
    // if (thisHabit.notes.length != 0 && thisHabit.notes[thisHabit.notes.length - 1][0] === date) {
    //   $('.note')[0].value = thisHabit.notes[thisHabit.notes.length - 1][1];
    // }
  });

  $('.saveLog').click(function() {
    $('.note').toggle();
    $('.notes').toggle();
    $('.oneLine').toggle();
    $('.twoLine').toggle();
    $('.saveLog').toggle();
    $('.done').toggle();
    $('.archives').hide();
    console.log(thisHabit);

    // If there is a note stored for this day, update it. Otherwise, add new note.
    if ($('.note')[0].value.length > 0) {

      // if (thisHabit.notes.length != 0) {
      //   console.log(thisHabit.notes);
      //   if (thisHabit.notes[thisHabit.notes.length - 1][0] === date) {
      //     thisHabit.notes[thisHabit.notes.length - 1][1] = $('.note')[0].value;
      //   }
      // } else {
      note = $('.note')[0].value;
      thisHabit.notes.push([date, note]);
      $('.note')[0].value='';
      // }

    }
    localStorage.setItem('allHabits', JSON.stringify(allHabits));
  //   $('.archive').remove();
  //   // if (thisHabit != undefined && thisHabit.notes != undefined) {
  //   for (i = thisHabit.notes.length; i > 0; i--) {
  //     // Notes
  //     $('.archives').append(`
  // <div class="archive">
  // <div class="card-header" id=${i}>
  //   <div class="mb-0">
  //     <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
  //       ${thisHabit.notes[i][0]}
  //     </button>
  //   </div>
  // </div>
  //
  // <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#archives">
  //   <div class="card-body">
  //     ${thisHabit.notes[i][1]}
  //   </div>
  // </div>
  // </div>`);
  //   }
  });

  $('.nav-item').click(function() {

  });

  $('.saveLog').hide();

  const focus = function() {
    if (allHabits.length > 0) {
      $('.newHabit').remove();

      goalElement.value = '';
      habitElement.value = '';
      now = new Date();
      date = `${now.getMonth()}/${now.getDate()}/${now.getYear()+1900}`;
      $('.date').text(date);
      upcomingHabits = allHabits.sort((a, b) => b.points - a.points).filter(e => e.completed !== date);
      if (JSON.parse(localStorage.getItem('i')) != undefined) {
        i = JSON.parse(localStorage.getItem('i'));
      } else {
        i = 0;
      }
      if (i + 1 > upcomingHabits.length) {
        i = 0;
      }
      thisHabit = upcomingHabits[i];
      console.log(upcomingHabits);
      $('.goal').text(`Calculating Optimal Task:`);
      $('.editGoals').hide();
      $('#addGoal').hide();
      $('.habitG').hide();
      $('.progress').hide();
      $('.now').show();
      // $('.lds-roller').show();

      //Show option to skip to habit, but only if there are more than 1 habits remaining.
      if (upcomingHabits.length < 2) {
        $('.switchHabits').hide();
      } else {
        $('.switchHabits').show();
      }

      if (upcomingHabits.length < 1) {
        $('.notes').hide();
      } else {
        // $('.notes').show();
      }


      $('.switchHabits').on('click',
        function() {
          //Removes previously loaded habits from dropdown
          $('.skip').remove();

          //Creates new dropdown
          for (let i = 0; i < upcomingHabits.length; i++)
            if (upcomingHabits[i] != thisHabit) {
              $('.remainingHabits').append(
                `<a class="dropdown-item skip" habit='${i}' href="#">${upcomingHabits[i].habit}</a>`
              );
            }

          //Click on new task to switch focus and add points to new habit
          $('.skip').on('click', function() {
            i = parseInt($(this).attr('habit'), 10);
            upcomingHabits[i].points += 0.5;
            localStorage.setItem('i', JSON.stringify(i));
            localStorage.setItem('allHabits', JSON.stringify(allHabits));
            dispGoal();
          });

        });



      // $('.notes').on('click', function() {
      //   $('.done').on('click', function() {
      //     $('.show').removeClass('show');
      //   });
      // });
      dispGoal();

    } else {
      addGoal();
    }

  };

  //Focus
  dispGoal = function() {
    $('.archives').hide();
    if (upcomingHabits.length > 0) {
      thisHabit = upcomingHabits[i];
      thisHabit.tasksDue = (Math.floor(now / 8.64e7) - thisHabit.created) - thisHabit.count;
      // if (thisHabit.tasksDue < 2) {
      //   repeat='';
      // } else{
      //   console.log(thisHabit);
      //   repeat=` x ${thisHabit.tasksDue}`;
      // }
      $('.goal').text(upcomingHabits[i].goal + ':');
      $('.habitG').text(upcomingHabits[i].habit).show();
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
    let percentComplete = 100 * (allHabits.filter(e => e.completed === date).length / allHabits.length);
    $('.progress-bar').attr('aria-valuenow', `${percentComplete}`);
    $('.progress-bar').attr('style', 'width: ' + `${percentComplete}` + '%');


    // }
  };

  //Mark current habit as completed add note along with completion date
  const done = function() {
    $('.archives').hide();
    i = 0;
    $('.show').removeClass('show');
    $('.oneLine').hide();
    $('.twoLine').show();
    let now = new Date();
    //Add note if note was added
    if (thisHabit) {
      if ($('.note')[0].value.length > 0) {
        let note = $('.note')[0].value;
        $('.note')[0].value = '';
        thisHabit.notes.push([date, note]);
      }
      //Update completion date
      date = `${now.getMonth()}/${now.getDate()}/${now.getYear()+1900}`;
      thisHabit.completed = date;
      thisHabit.count++;
      localStorage.setItem('allHabits', JSON.stringify(allHabits));
      //Hide note field
      // $('.collapse').collapse('hide');
      $('.note').hide();
      focus();
      // setTimeout(dispGoal, 1000);
    }
  };

  //Load Edit Goals menu from local storage
  const editGoals = function() {
    $('.archives').hide();
    $('.newHabit').remove();
    goalElement.value = '';
    habitElement.value = '';
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

        <td id='goal'>${goalDiv.innerHTML}</td>
        <td>${habitDiv.innerHTML}</td>
        <td><button class="removeGoal btn btn-sm btn-secondary" type="button">Remove</button>
        <button class="editGoal btn btn-sm btn-secondary" type="button">Edit</button></td>
      </tr>
      `
        );
      }

      $('.editGoals').show();
      $('#addGoal').hide();
      $('.now').hide();

      //Load existing goal's edit menu
      $('.editGoal').on('click',
        function() {

          $('.editGoals').hide();
          $('#addGoal').show();
          $('.now').hide();
          addGoal();
          $('.suggestions').hide();
          $('label[for="Goal"]').text('Edit Goal');
          $('.newHabit').remove();
          thisGoal = this.closest('tr').getElementsByTagName('td')[0].innerHTML;
          filteredHabits = allHabits.filter(g => g.goal === thisGoal);
          for (let i = 0; i < filteredHabits.length; i++) {
            habitElement.value = filteredHabits[i].habit;
            addHabit();
            $('.radio').eq((i * 6) + 1).removeClass('active');
            $('.radio').eq((i * 6) + 4).removeClass('active');
            $('.radio').eq((i * 6) + parseInt(filteredHabits[i].time, 10)).addClass('active');
            $('.radio').eq((i * 6) + 3 + parseInt(filteredHabits[i].difficulty, 10)).addClass('active');
          }
          goalElement.value = thisGoal;
          return thisGoal;

        });

    }
  };

  //Loads add goal menu
  const addGoal = function() {
    filteredHabits = [];
    $('#addGoal').show();
    $('.editGoals').hide();
    $('.now').hide();
    $('.suggestions').show();
    $('label[for="Goal"]').text('Add Goal');
    // $('.editGoal').on('click',
    //   function() {
    //     $('table').hide();
    //     $('#addGoal').show();
    //     $('.now').hide();
    //     addGoal();
    //
    //     $('.newHabit').remove();
    //
    //     thisGoal = this.closest('tr').getElementsByTagName('td')[0].innerHTML;
    //     filteredHabits = allHabits.filter(g => g.goal === thisGoal);
    //     for (let i = 0; i < filteredHabits.length; i++) {
    //       habitElement.value = filteredHabits[i].habit;
    //       addHabit();
    //       $('.radio').eq((i * 6) + 1).removeClass('active');
    //       $('.radio').eq((i * 6) + 4).removeClass('active');
    //       $('.radio').eq((i * 6) + parseInt(filteredHabits[i].time, 10)).addClass('active');
    //       $('.radio').eq((i * 6) + 3 + parseInt(filteredHabits[i].difficulty, 10)).addClass('active');
    //     }
    //     goalElement.value = thisGoal;
    //
    //     return thisGoal;
    //
    //   });
  };

  //Add new habit
  const addHabit = function() {
    $('.habit').attr("id", `habit${i}`).removeClass('habit');
    $("button").removeClass("temptog");
    console.log(i);
    $('.input-group').eq(i).addClass('newHabit');
    $('.add').addClass('remove').removeClass('add');
    $(`        <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <button type="button" class="btn btn-outline-secondary dropdown-toggle temptog dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <div class="dropdown-menu open">
                    <h6 class="dropdown-header">Time Commitment</h6>
                    <a class="dropdown-item" href="">
                      <div class="btn-group time btn-group-toggle" id='time' data-toggle="buttons">
                        <label class="btn radio btn-secondary" id='0'>
                          <input type="radio" name="options" id="option1" autocomplete="off">Low
                        </label>
                        <label class="btn radio btn-secondary active" id='1'>
                          <input type="radio" name="options" id="option2" autocomplete="off" checked>Medium
                        </label>
                        <label class="btn radio btn-secondary" id='2'>
                          <input type="radio" name="options" id="option3" autocomplete="off">High
                        </label>
                      </div>
                    </a>
                    <div role="separator" class="dropdown-divider"></div>
                    <h6 class="dropdown-header">Challenge</h6>
                    <a class="dropdown-item" href="">
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
    // $(button).on('click', function() {
    //   $('.dropdown-menu').removeClass('show');
    //   console.log('click')
    // });
    addToggle();


  };

  // Closes dropdowns when clicking on body
  $(document).on('click', function(ev) {
    $('.dropdown-menu').removeClass('show');
  });

  // $('.dropdown-toggle').on('click', function(ev) {
  //   $('.dropdown-toggle').dropdown()
  // });
 


  //Adds temporary tag to dropdown button
  const addToggle = function() {
    $('.temptog').on('click', function(event) {
      event.stopPropagation();
      // $('.show').removeClass('show');
      $(this).parent().toggleClass('show');
      $(this).next('div').toggleClass('show');
      $("button").removeClass("temptog");
    });

    $('.radio').on('click', function(event) {
      event.stopPropagation();
      $(this).button('toggle');
    });

    // $('.show').on('click', function(event) {
    //   $('.dropdown-menu').removeClass('show');
    //   console.log('click')
    // });
  };



  addToggle();




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
      localStorage.setItem('allHabits', JSON.stringify(allHabits));
      $(this).parent("td").parent("tr").remove();
      return thisGoal;
    })
  );

  //Submit goal
  $("#submit").on('click', (function() {
    allHabits = allHabits.filter(g => g.goal != thisGoal);
    if (goalElement.value.length > 0) {
      for (let j = 0; j < $('.newHabit').length; j++) {
        if (habitElement != null) {
          // // Update existing habit
          // if (filteredHabits[j]) {
          //   filteredHabits[j].goal = goalElement.value;
          //   filteredHabits[j].habit = $('.newHabit')[j].childNodes[3].value;
          //   filteredHabits[j].time = parseInt($('.active')[j * 2].id, 10);
          //   filteredHabits[j].difficulty = parseInt($('.active')[(j * 2) + 1].id, 10);
          //   filteredHabits[j].notes = [];
          // } else {
          // Create new habit
          now = new Date();
          let habit = new Habit(
            goalElement.value,
            $('.newHabit')[j].childNodes[3].value,
            parseInt($('.active')[j * 2].id, 10),
            parseInt($('.active')[(j * 2) + 1].id, 10)
          );
          // habits.push(document.getElementById(`habit${j}`).value);
          allHabits.push(habit);
          console.log(allHabits);
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
  }));

  $('.editGoalsNav').on('click', editGoals);
  $('.addGoal').on('click', addGoal);
  $('.focus').on('click', focus);
  $('.done').on('click', done);


  if (allHabits.length > 0) {
    focus();
  } else {
    addGoal();
  }


  $('.suggestions').on('click',
    function() {
      $('.template').remove();
      let templateGoals = [...new Set(templates.map(x => x.goal))];
      for (let i = 0; i < templateGoals.length; i++) {
        $('.templates').append(`<a class="dropdown-item template" href="#">${templateGoals[i]}</a>`);
      }
      $('.template').on('click',
        function() {
          i = 0;
          $('.editGoals').hide();
          $('#addGoal').show();
          $('.now').hide();
          addGoal();
          $('.newHabit').remove();

          thisGoal = this.innerHTML;
          thisTemplate = templates.filter(g => g.goal === thisGoal);
          for (let i = 0; i < thisTemplate.length; i++) {
            habitElement.value = thisTemplate[i].habit;
            addHabit();
            $('.radio').eq((i * 6) + 1).removeClass('active');
            $('.radio').eq((i * 6) + 4).removeClass('active');
            $('.radio').eq((i * 6) + parseInt(thisTemplate[i].time, 10)).addClass('active');
            $('.radio').eq((i * 6) + 3 + parseInt(thisTemplate[i].difficulty, 10)).addClass('active');
          }
          goalElement.value = thisGoal;
          return thisGoal;
        });
    }
  );





})();
