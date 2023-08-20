export default function getQueryBalanceByOwner(owner: string): JSON {
  return JSON.parse(`{
    "balance": {
      "address": "${owner}"
    }
  }`);
}
