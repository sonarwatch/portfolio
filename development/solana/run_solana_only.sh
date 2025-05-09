#!/bin/bash

set -e

# === CONFIG ===
SOLANA_ADDRESS="DemoSX9F2zXfQLtBr56Yr5he15P7viZWsYJpSDAX3tKG"
PLUGINS_DIR="${LAMBDA_PORTFOLIO_HOME}/packages/plugins/src/plugins"

# Install dependencies
echo "Installing npm dependencies..."
cd ${LAMBDA_PORTFOLIO_HOME} && npm install

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
