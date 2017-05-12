function Menu(details) {
  assertDefined(details.getState);
  assertDefined(details.layout);
  assertDefined(details.windowDetails);

  this.updateState = function() {
    this.state = details.getState();
  }
  this.updateState();

  this.window = game.newChoiceWindow(this.state.lines, details.layout,
      details.windowDetails);

  this.update = function() {
    this.updateState();
    this.window.updateLines(this.state.lines);
  }

  this.close = function() {
    this.window.close();
  }

  // onChoice is a callback that takes choice index and should return whether
  // or not to select again.
  this.loopChoice = function(onChoice) {
    while (true) {
      var choiceIdx = this.window.getChoice();

      if (choiceIdx == -1)
        break;

      var shouldContinue = onChoice(choiceIdx);
      if (!shouldContinue)
        break;

      this.update();
    }
  }
}

function SaveAndLoadMenu() {
  var kMaxSlots = 15;
  return new Menu({
    getState : function() {
      var saveInfos = game.getSaveInfos(kMaxSlots);
      var lines = [];

      for (var i = 0; i < saveInfos.length; ++i) {
        lines.push("Espaço" + " " + leftPad(i + 1, 2));
        var saveInfo = saveInfos[i];
        if (saveInfo.isDefined()) {
          lines.push(saveInfo.mapTitle());
        } else {
          lines.push("<" + "Vazio" + ">");
        }
        lines.push("");
      }

      return {
        lines : lines,
        saveInfos : saveInfos
      }
    },
    layout : game.layout(game.CENTERED(), game.FIXED(), 320, 320),
    windowDetails : {
      allowCancel : true,
      linesPerChoice : 3,
      displayedLines : 9
    }
  });
}

function SaveMenu() {

  var saveMenu = new SaveAndLoadMenu();
  saveMenu.loopChoice(function(choiceId) {
    game.saveToSaveSlot(choiceId);
    saveMenu.close();
    return true;
  });
  saveMenu.close();
}

function menu() {
  //game.quit();
  if (!game.getMenuEnabled())
    return;

  //var statusMenu = new StatusMenu();
  var rootMenuWin = new Menu({
    getState : function() {
      return {
        lines : [ "Salvar", "Sair" ],
      };
    },
    layout : game.layout(game.NORTHEAST(), game.SCREEN(), 0.2, 0.8),
    windowDetails : {
      justification : game.CENTER(),
      allowCancel : true
    }
  });

  rootMenuWin.loopChoice(function(choiceId) {
    switch (choiceId) {
    //case 0:
    //  itemsMenu();
    //  break;
    //case 1:
    //  skillsMenu(statusMenu);
    //  break;
    //case 2:
    //  equipMenu(statusMenu);
    //  break;
    case 0:
      SaveMenu();
      break;
    case 1:
      game.quit();
      break;
    }

    //statusMenu.update();
    rootMenuWin.window.takeFocus();
    return true;
  });

  rootMenuWin.close();
  statusMenu.close();
}
