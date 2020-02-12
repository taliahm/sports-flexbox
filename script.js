const questions = {
    levelOne: {
        rules: "display: flex;",
        numberOfElements: 4
      },
    levelThree: {
      rules: "display: flex; justify-content: center",
      separatedRules: ["display:", "flex;", "justify-content:", "center;"],
      numberOfElements: 4
    },
    levelFour: {
      rules: "display: flex; flex-direction: column; align-items: flex-end",
      numberOfElements: 4
    },
    levelTwo: {
      rules: "display: flex",
      childRules: {
        element: 2,
        style: "align-self: flex-end"
      }
    },
    levelFive: {
      rules: "display: flex, flex-direction: row-reverse;",
    }
  };
  const LS_KEY = "juno-football-flexbox";
  const questionOrder = ["levelOne", "levelTwo", "levelThree", "levelFour", "levelFive"];
  let currentQuestion = 0;
  const inputListener = () => {
      $("#parent-input").on("input", e => {
      reStyleParentContainer(e.target.value);
    });
    $("#child-input").on("input", e => {
      reStyleChildElements(e.target.value);
    });
  };

  const helpListener = () => {
      $('#help-btn').on('click', () => {
        showHelpModal();
      })
  }
  const showHelpModal = () => {
    $('#help').addClass('help-modal-display');
    $('#help-close').on('click', () => {
        closeHelpModal();
    });
    $('#help').on('click', (e) => {
        if(e.target.id === 'inner-help' || $(e.target).parents('#inner-help').length !== 0) {
            return;
        }
        closeHelpModal();
    })
  }

  const closeHelpModal = () => {
    $('#help').removeClass('help-modal-display');
  }

  const reStyleParentContainer = styles => {
    saveToLocalStorage("parent", styles);
    $(".flex-parent").attr("style", styles);
    console.log(styles, 'style>>');
    checkForCompletion(styles);
  };
  const reStyleChildElements = styles => {
    const currentQuestionData = getCurrentQuestionData();
    console.log(currentQuestionData, 'say what?');
    if (!currentQuestionData.childRules) return;
    saveToLocalStorage("child", styles);
    const { element, style } = currentQuestionData.childRules;
    $(".flex-child").each((index, el) => {
      if (index === element) {
        $(el).attr("style", styles);
      }
    });
    checkForCompletion(styles);
  };
  const checkForCompletion = (style) => {
    let matched = 0;
    console.log('style in check for completion', style);
    if(!endsWithSemiColon(style)) {
        console.log('newp');
        return;
    }
    $(".flex-child-guide").each((index, el) => {
      const bounds = el.getBoundingClientRect();
      const { x, y } = bounds;
      $(".flex-child").each((_, child) => {
        const childBounds = child.getBoundingClientRect();
        const { x: childX, y: childY } = childBounds;
        if (childX === x && childY === y) {
          matched = matched + 1;
        }
      });
    });
    if (matched === 4) {
      congratulatePlayer();
    }
  };

  const endsWithSemiColon = (style) => style.charAt(style.length - 1) === ';';

  const congratulatePlayer = () => {
    $(".good-job").fadeIn(1000);
    $("#parent-input").prop('disabled', true);
    $("#child-input").prop('disabled', true);
  };

  const goToNextQuestion = e => {
    console.log("next question");
    e.preventDefault();
    console.log("go to next uestions?");
    currentQuestion = currentQuestion + 1;
    saveToLocalStorage("currentQuestion", currentQuestion);
    const currentQuestionData = getCurrentQuestionData();
    console.log(currentQuestionData, "current question data");
    const { childRules, rules } = currentQuestionData;
    console.log(childRules, 'for guide children?');
    updateGuide(rules);
    updateGuideChildren(childRules);
  };

  const updateGuide = styles => {
    console.log(styles, "styled in update guide");
    $(".flex-parent-guide").attr("style", styles);
    resetStep();
  };

  const updateGuideChildren = rules => {
    if (!rules) return;
    const { element, style } = rules;
    $(".flex-child-guide").each((index, el) => {
      console.log('this be running??');
      console.log(style, 'this be defined?');
      if (index === element) {
        console.log('they ever equal eachother?');
        console.log(el, 'el?');
        $(el).attr("style", style);
      }
    });
  };

  const resetStep = () => {
    $(".good-job").css("display", "none");
    $("#parent-input").prop('disabled', false);
    $("#child-input").prop('disabled', false);
    $("#parent-input").val("");
    $('#child-input').val("");
    $(".flex-parent").attr("style", "");
    $(".flex-child").attr("style", "");
    $(".flex-child-guide").attr("style", "");
  };

  const initiateFirstQuestion = questionNumber => {
    const firstParentStyles = questions[questionNumber].rules;
    const firstChildStyles = questions[questionNumber].childRules;
    updateGuide(firstParentStyles);
    updateGuideChildren(firstChildStyles);
  };

  const getCurrentQuestionData = () => {
    console.log("in get current", currentQuestion);
    const currentLabel = questionOrder[currentQuestion];
    console.log("current label??", currentLabel);
    return questions[currentLabel];
  };

  const saveToLocalStorage = (key, data) => {
    const toSetKey = `${LS_KEY}-${currentQuestion}-${key}`;
    localStorage.setItem(toSetKey, data);
  };
  const getFromLocalStorage = key => {
    const toGetKey = `${LS_KEY}-${currentQuestion}-${key}`;
    return localStorage.getItem(toGetKey);
  };
  // TODO:
  // implement local storage retrieval.
  // implement back functionality
  // use juno brand colours
  // hints
  // completed state
  // SHOULD WE HAVE DONE THIS IN REACT THO?
  $(function() {
    inputListener();
    helpListener();
    initiateFirstQuestion("levelOne");
    $("#next").on("click", goToNextQuestion);
  });