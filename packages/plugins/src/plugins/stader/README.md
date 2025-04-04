# Stader

## Confluence Page

https://octavfi.atlassian.net/wiki/spaces/DATABASE/pages/641040385/Stader

## Testing shortcut

This block uses addresses taken from holders on https://debank.com/protocols?q=stader

```bash
export OCTAV_VERBOSE_LOGGING=true #optional
for address in \
  "0x0ee437c546d49ede6ec561883630cddfda7408fc" \
  "0x3acb9230eee7e82c84e5dfef0b914dba8d4dd7a3" \
  "0x499b628441903598f68ac97f62bb817882938246" \
  "0x94e14f8d7a5e8e90a46ba050f70e57a9d4bbdcff" \
  "0xbe33c3fa6331c964b0fd0460ebb5be85d98f8b64"; do
    npx nx run plugins:run-fetcher stader-ethereum-staking \"$address\"
done
```
