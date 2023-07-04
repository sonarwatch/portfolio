# SonarWatch Portfolio

## Useful commands

```bash
# Getting started
npm install
cp .env.example .env
# Set your RPCs

# Generate a plugin
npx nx generate @sonarwatch/portfolio-plugins:plugin my-super-protocol

# Serve jobs
npx nx run plugins:serve-jobs

# Run a job
npx nx run plugins:run-job marinade

# Run a fetcher
npx nx run plugins:run-fetcher marinade DemoSX9F2zXfQLtBr56Yr5he15P7viZWsYJpSDAX3tKG
```

## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.
