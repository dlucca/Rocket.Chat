#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
if ! command -v meteor >/dev/null 2>&1; then
  export PATH="$HOME/.meteor:$PATH"
fi
if ! command -v meteor >/dev/null 2>&1; then
  echo 'Falta Meteor 3.5.2. Consulta MEXILLUM.md.' >&2
  exit 1
fi
export ROOT_URL="${ROOT_URL:-http://localhost:3000}"
export BIND_IP="${BIND_IP:-127.0.0.1}"
export OVERWRITE_SETTING_Site_Name=Mexillum
export OVERWRITE_SETTING_Language=es
export OVERWRITE_SETTING_Accounts_RegistrationForm=Disabled
exec node .yarn/releases/yarn-4.18.0.cjs workspace @rocket.chat/meteor dev --port "${BIND_IP}:${PORT:-3000}"
