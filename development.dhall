{ sessionTitle = "collabsynth"
, sessionWindows =
  [ { windowTitle = "server"
    , windowPanes =
      [ { paneCommand = "cd packages/server; yarn ts-node src/index.ts" }
      , { paneCommand = "cd packages/server; yarn tsc --noEmit --watch" }
      ]
    , windowArrangement = "main-vertical"
    }
  , { windowTitle = "frontend"
    , windowPanes =
      [ { paneCommand = "cd packages/frontend; yarn start" }
      , { paneCommand = "cd packages/frontend; yarn test" }
      , { paneCommand = "cd packages/frontend; yarn typescript:watch" }
      ]
    , windowArrangement = "main-vertical"
    }
  , { windowTitle = "webaudio-diff"
    , windowPanes = 
      [ { paneCommand = "cd packages/webaudio-diff; yarn typescript:build" } ]
    , windowArrangement = "tiled"
    }
  ]
}
