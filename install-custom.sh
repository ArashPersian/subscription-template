#!/usr/bin/env bash
set -euo pipefail

LANG_CODE="fa"
VERSION="latest"
REPOSITORY="ArashPersian/subscription-template"
DEST_DIR="/var/lib/pasarguard/templates/subscription"
DEST_FILE="${DEST_DIR}/index.html"
ENV_FILE="/opt/pasarguard/.env"

usage() {
  cat <<'EOF'
Usage: install-custom.sh [--lang en|fa|zh|ru] [--version latest|<tag>]

Examples:
  install-custom.sh
  install-custom.sh --lang en
  install-custom.sh --lang fa --version v2.2.1-custom.1
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --lang)
      [[ $# -ge 2 ]] || { echo "Error: --lang needs a value." >&2; exit 1; }
      LANG_CODE="$2"
      shift 2
      ;;
    --version)
      [[ $# -ge 2 ]] || { echo "Error: --version needs a value." >&2; exit 1; }
      VERSION="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Error: unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

case "${LANG_CODE}" in
  en|fa|zh|ru) ;;
  *)
    echo "Error: invalid language '${LANG_CODE}'. Use one of: en, fa, zh, ru." >&2
    exit 1
    ;;
esac

[[ -n "${VERSION}" ]] || {
  echo "Error: version cannot be empty." >&2
  exit 1
}

RELEASE_PATH="latest/download"
if [[ "${VERSION}" != "latest" ]]; then
  RELEASE_PATH="download/${VERSION}"
fi

ASSET="${LANG_CODE}.html"
if [[ "${LANG_CODE}" == "fa" ]]; then
  ASSET="index.html"
fi

URL="https://github.com/${REPOSITORY}/releases/${RELEASE_PATH}/${ASSET}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="/root/pg-sub-backup-${TIMESTAMP}"
TEMP_FILE="$(mktemp)"

cleanup() {
  rm -f "${TEMP_FILE}"
}
trap cleanup EXIT

if command -v curl >/dev/null 2>&1; then
  curl -fsSL "${URL}" -o "${TEMP_FILE}"
elif command -v wget >/dev/null 2>&1; then
  wget -q -O "${TEMP_FILE}" "${URL}"
else
  echo "Error: neither curl nor wget is installed." >&2
  exit 1
fi

if ! grep -q '<div id="root">' "${TEMP_FILE}"; then
  echo "Error: downloaded release asset is not a valid template." >&2
  exit 1
fi

install -d -m 700 "${BACKUP_DIR}"
if [[ -f "${DEST_FILE}" ]]; then
  cp -a "${DEST_FILE}" "${BACKUP_DIR}/index.html"
fi
if [[ -f "${ENV_FILE}" ]]; then
  cp -a "${ENV_FILE}" "${BACKUP_DIR}/.env"
fi

install -d "${DEST_DIR}"
install -m 0644 "${TEMP_FILE}" "${DEST_FILE}"

install -d "$(dirname "${ENV_FILE}")"
touch "${ENV_FILE}"

if grep -q '^CUSTOM_TEMPLATES_DIRECTORY=' "${ENV_FILE}"; then
  sed -i 's|^CUSTOM_TEMPLATES_DIRECTORY=.*|CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"|' "${ENV_FILE}"
else
  echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"' >> "${ENV_FILE}"
fi

if grep -q '^SUBSCRIPTION_PAGE_TEMPLATE=' "${ENV_FILE}"; then
  sed -i 's|^SUBSCRIPTION_PAGE_TEMPLATE=.*|SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"|' "${ENV_FILE}"
else
  echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' >> "${ENV_FILE}"
fi

if command -v pasarguard >/dev/null 2>&1; then
  pasarguard restart
  echo "Installed custom template (${LANG_CODE}, ${VERSION})."
else
  echo "Installed custom template at ${DEST_FILE}."
  echo "pasarguard command not found; restart the service manually."
fi

echo "Backup saved in: ${BACKUP_DIR}"
