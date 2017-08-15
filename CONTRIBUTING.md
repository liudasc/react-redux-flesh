# Adding new feature to the project

- create feature branch from `master` with `feature-` prefix (eg: `feature-hyperlocal`)
- create task branch from `feature` with unique name
- submit MR of task implementation with description: `task` -> `feature` (task branch will be merged to feature branch after code-review)
- submit MR feature implementation with description: `feature` -> `master` (feature branch will be merged to master branch after code-review and testing)
- CI: `master` -> `DEV1` (automaticaly will be deployed after merge to master)
