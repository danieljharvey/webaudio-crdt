let makeTitle = \(title: Text) -> { paneCommand = "watch figlet ${title}" }

in { sessionTitle = "collabsynth"
, sessionWindows =
  [ { windowTitle = "server"
    , windowPanes =
      [ { paneCommand = "cd packages/server; yarn ts-node src/index.ts" }
      , { paneCommand = "cd packages/server; yarn tsc --noEmit --watch" }
      , makeTitle "server"
      ]
    , windowArrangement = "main-vertical"
    }
  , { windowTitle = "frontend"
    , windowPanes =
      [ { paneCommand = "cd packages/frontend; yarn start" }
      , { paneCommand = "cd packages/frontend; yarn test" }
      , { paneCommand = "cd packages/frontend; yarn typescript:watch" }
      , makeTitle "frontend"
      ]
    , windowArrangement = "main-vertical"
    }
  , { windowTitle = "webaudio-diff"
    , windowPanes = 
      [ { paneCommand = "cd packages/webaudio-diff; yarn typescript:build" }
      , makeTitle "webaudio-diff"
      ]
    , windowArrangement = "tiled"
    }
  , { windowTitle = "fold-cache"
    , windowPanes = 
      [ { paneCommand = "cd packages/fold-cache; yarn typescript:build" }
        , makeTitle "fold-cache"
      ]
    , windowArrangement = "tiled"
    }

  ]
}
