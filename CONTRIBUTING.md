# Contributing

SonarWatch Portfolio is made possible by a community that submits issues, creates pull requests, and provides feedback.

A lot of the time, you come across something that can be made better. Maybe you find a bug, or you have an idea for additional functionality. That's great! It's as easy as cloning the Vuetify repository to get started working in a development environment.

## Reporting Issues

TODO

## Local development

In the next section you will learn step-by-step how to set up your local environment and how to configure SonarWatch Portfolio for development.

The SonarWatch Portfolio repository is a [nx](https://nx.dev/) monorepo that connects the portfolio core and plugins. The following guide is designed to get you up and running in no time.

### Setting up your environment

Required software:

- [Git](https://git-scm.com/) >v2.20
- [Node.js](https://nodejs.org/) LTS

Once you have everything installed, clone the repository:

```bash
# Using HTTPS
git clone https://github.com/sonarwatch/portfolio

# Using SSH
git clone git@github.com:sonarwatch/portfolio.git
```

Then install dependencies and perform an initial build to link all the packages together:

```bash
# Navigate to the vuetify folder
cd portfolio

# Install all project dependencies
npm install

# Build the packages
npx nx run core:build
npx nx run plugins:build
```

### Core

TODO

### Plugins

TODO

### Submitting Changes / Pull Requests

First you should create a fork of the repository to push your changes to. Information on forking repositories can be found in the [GitHub documentation](https://help.github.com/en/github/getting-started-with-github/fork-a-repo).

Then add your fork as a remote in git:

```bash
# Using HTTPS
git remote add fork https://github.com/YOUR_USERNAME/portfolio.git

# Using SSH
git remote add fork git@github.com:YOUR_USERNAME/portfolio.git
```

Commit your changes following [our guidelines](#commit-guidelines), then push the branch to your fork with `git push -u fork` and open a pull request on the Vuetify repository following the provided template.

::: error
Pull requests that include unrelated commits or your local merges will be **CLOSED** without notice
:::

### Requesting new features

TODO

### Commit guidelines

All commit messages are required to follow the [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) standard using the _angular_ preset.

#### General Rules

- Commit messages must have a subject line and may have body copy. These must be separated by a blank line.
- The subject line must not exceed 60 characters
- The subject line must be written in imperative mood (fix, not fixed / fixes etc.)
- The body copy must include a reference all issues resolved:
- The body copy must be wrapped at 72 characters
- The body copy must only contain explanations as to what and why, never how. The latter belongs in documentation and implementation.

#### Commit types

The following is a list of **commit types** used in the _angular_ preset:

- **feat:** Commits that result in new features or functionalities. Backwards compatible features will release with the next **MINOR** whereas breaking changes will be in the next **MAJOR**. The body of a commit with breaking changes must begin with `BREAKING CHANGE`, followed by a description of how the API has changed.
- **fix:** Commits that provide fixes for bugs within vuetify's codebase.
- **docs:** Commits that provide updates to the docs.
- **style:** Commits that do not affect how the code runs, these are simply changes to formatting.
- **refactor:** Commits that neither fixes a bug nor adds a feature.
- **perf:** Commits that improve performance.
- **test:** Commits that add missing or correct existing tests.
- **chore:** Other commits that don't modify src or test files.
- **revert:** Commits that revert previous commits.
