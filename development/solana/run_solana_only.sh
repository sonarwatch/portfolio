#!/bin/bash

set -e

LAMBDA_PORTFOLIO_HOME="/"


# === ENVIRONMENT CHECKS ===
echo "Checking environment..."

command -v node >/dev/null 2>&1 || { echo "node is not installed. Please install Node.js." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is not installed. Please install npm." >&2; exit 1; }
command -v npx >/dev/null 2>&1 || { echo "npx is not available. Please install npm and retry." >&2; exit 1; }

# Check if 'nx' is available through npx
if ! npx nx --version >/dev/null 2>&1; then
  echo "npx nx is not working. Please ensure your project is set up with Nx (monorepo)."
  exit 1
fi

# Check for .env
if [ ! -f "${LAMBDA_PORTFOLIO_HOME}/.env" ]; then
  if [ -f "${LAMBDA_PORTFOLIO_HOME}/.env.example" ]; then
    cp "${LAMBDA_PORTFOLIO_HOME}/.env.example" "${LAMBDA_PORTFOLIO_HOME}.env"
    echo ".env file created from .env.example."
  else
    echo "No .env or .env.example file found. Please create one." >&2
    exit 1
  fi
fi

# Install dependencies
echo "Installing npm dependencies..."
npm install

# === CONFIG ===
SOLANA_ADDRESS="DemoSX9F2zXfQLtBr56Yr5he15P7viZWsYJpSDAX3tKG"
PLUGINS_DIR="${LAMBDA_PORTFOLIO_HOME}/packages/plugins/src/plugins"

# === FIND SOLANA PLUGINS ===
echo "Searching for Solana plugins..."
PLUGINS=()
while IFS= read -r plugin_path; do
  rel_path=${plugin_path#"$PLUGINS_DIR/"}
  plugin_name=${rel_path%%/*}
  PLUGINS+=("$plugin_name")
done < <(grep -rl "NetworkId.solana" "$PLUGINS_DIR" | grep -E "/plugins/[^/]+/")
PLUGINS=($(printf "%s\n" "${PLUGINS[@]}" | sort -u))

echo "Found ${#PLUGINS[@]} Solana plugins:"
printf "   - %s\n" "${PLUGINS[@]}"
echo ""

# === SETUP ===
echo "Installing dependencies..."
npm install

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "🧾 .env file created."
fi

# === START LOCAL CACHE ===
echo "Starting local cache..."
npx nx run plugins:serve-cache &
CACHE_PID=$!
sleep 5  # Wait for cache to start

# === RUN JOBS ===
echo "Running Solana Jobs..."
for plugin in "${PLUGINS[@]}"; do
  PLUGIN_PATH="$PLUGINS_DIR/$plugin"
  JOBS=$(find "$PLUGIN_PATH" -type f -name "*Job.ts" | sed -E 's/.*\/([a-zA-Z0-9_-]+)Job\.ts/\1/' | tr '[:upper:]' '[:lower:]')
  for job in $JOBS; do
    echo "➡️  Job: $job"
    npx nx run plugins:run-job "$job"
  done
done

# === RUN FETCHERS ===
echo "Running Solana Fetchers for $SOLANA_ADDRESS..."
for plugin in "${PLUGINS[@]}"; do
  PLUGIN_PATH="$PLUGINS_DIR/$plugin"
  FETCHERS=$(find "$PLUGIN_PATH" -type f -name "*Fetcher.ts" | sed -E 's/.*\/([a-zA-Z0-9_-]+)Fetcher\.ts/\1/' | tr '[:upper:]' '[:lower:]')
  for fetcher in $FETCHERS; do
    echo "Fetcher: $fetcher"
    npx nx run plugins:run-fetcher "$fetcher" "$SOLANA_ADDRESS"
  done
done

# === CLEANUP ===
echo "Killing local cache (PID $CACHE_PID)..."
kill $CACHE_PID

echo "All Solana jobs and fetchers completed!"
