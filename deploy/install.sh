#!/usr/bin/env bash
set -euo pipefail

REPO_URL_DEFAULT="https://github.com/vexusclaw-sys/vexusclaw-v1.0.01.git"
BRANCH_DEFAULT=""
BUNDLE_URL_DEFAULT="https://vexusclaw.com/install-bundle.tar.gz"
INSTALL_DIR_DEFAULT="/opt/vexusclaw"
PROVISIONING_API_DEFAULT="https://vexusclaw.com/api/v1"
BASE_DOMAIN_DEFAULT="vexusclaw.com"
PNPM_VERSION="10.6.0"
SITE_CONF_NAME="vexusclaw-self-host.conf"

BASE_DOMAIN=""
PUBLIC_DOMAIN=""
EMAIL=""
PASSWORD=""
PROVIDER="mock"
OPENAI_API_KEY=""
WORKSPACE_SLUG=""
WORKSPACE_NAME=""
ADMIN_NAME="Owner"
INSTALL_DIR="$INSTALL_DIR_DEFAULT"
REPO_URL="$REPO_URL_DEFAULT"
BRANCH="$BRANCH_DEFAULT"
BUNDLE_URL="$BUNDLE_URL_DEFAULT"
NON_INTERACTIVE=false
SKIP_SEED=false
SKIP_WHATSAPP=true
UPDATE_MODE=false
DOCTOR_MODE=false
UNINSTALL_MODE=false
INSTALL_TOKEN=""
PROVISIONING_API_URL="$PROVISIONING_API_DEFAULT"
TLS_READY=false
FINAL_URL=""
PUBLIC_IP=""
PHP_FPM_SOCKET=""
REPO_EXPLICIT=false

supports_color() {
  [[ -t 1 ]] && [[ "${TERM:-dumb}" != "dumb" ]] && [[ -z "${NO_COLOR:-}" ]]
}

init_colors() {
  if supports_color; then
    PURPLE='\033[0;35m'
    MAGENTA='\033[1;35m'
    CYAN='\033[0;36m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    BOLD='\033[1m'
    NC='\033[0m'
  else
    PURPLE='' MAGENTA='' CYAN='' GREEN='' YELLOW='' RED='' BOLD='' NC=''
  fi
}

print_banner() {
  echo -e "${MAGENTA}${BOLD}"
  echo "██╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗ ██████╗██╗      █████╗ ██╗    ██╗"
  echo "██║   ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝██╔════╝██║     ██╔══██╗██║    ██║"
  echo "██║   ██║█████╗   ╚███╔╝ ██║   ██║███████╗██║     ██║     ███████║██║ █╗ ██║"
  echo "╚██╗ ██╔╝██╔══╝   ██╔██╗ ██║   ██║╚════██║██║     ██║     ██╔══██║██║███╗██║"
  echo " ╚████╔╝ ███████╗██╔╝ ██╗╚██████╔╝███████║╚██████╗███████╗██║  ██║╚███╔███╔╝"
  echo "  ╚═══╝  ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝"
  echo -e "${PURPLE}                          VEXUSCLAW🧙‍♂️${NC}"
  echo -e "${CYAN}                         BY JOAO LUIZ 🧙‍♂️${NC}"
  echo -e "${MAGENTA}            Premium self-host installer for Apache + PHP + Docker${NC}"
  echo
}

print_step() {
  echo -e "${MAGENTA}[VEXUSCLAW🧙‍♂️]${NC} $*"
}

print_magic() {
  echo -e "${PURPLE}[MAGIA]${NC} $*"
}

print_success() {
  echo -e "${GREEN}[OK]${NC} $*"
}

print_warn() {
  echo -e "${YELLOW}[AVISO]${NC} $*"
}

print_error() {
  echo -e "${RED}[ERRO]${NC} $*" >&2
}

on_error() {
  local line="$1"
  print_error "VEXUSCLAW🧙‍♂️ encontrou uma falha na linha ${line}. Corrija o ponto acima e rode o instalador novamente."
}

trap 'on_error "$LINENO"' ERR

print_help() {
  cat <<'EOF'
Usage:
  curl -fsSL https://vexusclaw.com/install.sh | bash
  curl -fsSL https://vexusclaw.com/install.sh | bash -s -- --install-token vxc_xxx --email owner@example.com

Flags:
  --domain <dominio-base>
  --public-domain <dominio-publico>
  --email <admin_email>
  --password <senha>
  --provider <openai|mock|chatgpt-oauth>
  --openai-api-key <key>
  --workspace <slug>
  --workspace-name <name>
  --admin-name <name>
  --install-token <token>
  --api-base-url <url>
  --non-interactive
  --skip-seed
  --skip-whatsapp
  --with-whatsapp
  --install-dir <path>
  --branch <git_branch>
  --repo <git_url>
  --bundle-url <tarball_url>
  --update
  --doctor
  --uninstall
  --help

Behavior:
  - Sem flags, o instalador entra em modo assistido.
  - Com --install-token, o dominio oficial userxxxxxx.vexusclaw.com e reivindicado automaticamente.
  - Sem --install-token, informe --domain para usar um dominio base proprio do cliente.
  - O codigo e baixado preferencialmente do repositório oficial da VEXUSCLAW no GitHub.
  - Se o repositório ainda estiver vazio ou indisponivel, o instalador tenta o bundle oficial como fallback.
EOF
}

need_root() {
  if [[ "$(id -u)" -eq 0 ]]; then
    SUDO=""
  elif command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  else
    print_error "Execute como root ou instale sudo."
    exit 1
  fi
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --domain) BASE_DOMAIN="${2:-}"; shift 2 ;;
      --public-domain) PUBLIC_DOMAIN="${2:-}"; shift 2 ;;
      --email) EMAIL="${2:-}"; shift 2 ;;
      --password) PASSWORD="${2:-}"; shift 2 ;;
      --provider) PROVIDER="${2:-}"; shift 2 ;;
      --openai-api-key) OPENAI_API_KEY="${2:-}"; shift 2 ;;
      --workspace) WORKSPACE_SLUG="${2:-}"; shift 2 ;;
      --workspace-name) WORKSPACE_NAME="${2:-}"; shift 2 ;;
      --admin-name) ADMIN_NAME="${2:-}"; shift 2 ;;
      --install-dir) INSTALL_DIR="${2:-}"; shift 2 ;;
      --branch) BRANCH="${2:-}"; shift 2 ;;
      --repo) REPO_URL="${2:-}"; REPO_EXPLICIT=true; shift 2 ;;
      --bundle-url) BUNDLE_URL="${2:-}"; shift 2 ;;
      --install-token) INSTALL_TOKEN="${2:-}"; shift 2 ;;
      --api-base-url) PROVISIONING_API_URL="${2:-}"; shift 2 ;;
      --non-interactive) NON_INTERACTIVE=true; shift ;;
      --skip-seed) SKIP_SEED=true; shift ;;
      --skip-whatsapp) SKIP_WHATSAPP=true; shift ;;
      --with-whatsapp) SKIP_WHATSAPP=false; shift ;;
      --update) UPDATE_MODE=true; shift ;;
      --doctor) DOCTOR_MODE=true; shift ;;
      --uninstall) UNINSTALL_MODE=true; shift ;;
      --help|-h) print_help; exit 0 ;;
      *)
        print_error "Flag desconhecida: $1"
        print_help
        exit 1
        ;;
    esac
  done
}

detect_os() {
  if [[ ! -f /etc/os-release ]]; then
    print_error "Nao foi possivel detectar o sistema operacional."
    exit 1
  fi

  . /etc/os-release
  OS_ID="${ID:-}"
  OS_VERSION="${VERSION_ID:-0}"
  OS_CODENAME="${VERSION_CODENAME:-}"

  case "$OS_ID" in
    ubuntu)
      if [[ "${OS_VERSION%%.*}" -lt 22 ]]; then
        print_error "Ubuntu 22.04+ e obrigatorio."
        exit 1
      fi
      ;;
    debian)
      if [[ "${OS_VERSION%%.*}" -lt 12 ]]; then
        print_error "Debian 12+ e obrigatorio."
        exit 1
      fi
      ;;
    *)
      print_error "Sistema suportado apenas em Ubuntu 22.04+ e Debian 12+."
      exit 1
      ;;
  esac

  if [[ -z "$OS_CODENAME" ]] && command -v lsb_release >/dev/null 2>&1; then
    OS_CODENAME="$(lsb_release -sc)"
  fi
}

check_resources() {
  local mem_mb disk_mb
  mem_mb="$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)"
  disk_mb="$(df -Pm / | awk 'NR==2 {print $4}')"

  if [[ "$mem_mb" -lt 3500 ]]; then
    print_warn "A VPS tem ${mem_mb}MB de RAM. O recomendado para VEXUSCLAW🧙‍♂️ e 4GB ou mais."
  fi

  if [[ "$disk_mb" -lt 4096 ]]; then
    print_warn "A VPS tem ${disk_mb}MB livres em /. O recomendado e ao menos 4GB livres."
  fi
}

check_ports() {
  if [[ "$UPDATE_MODE" == true || "$DOCTOR_MODE" == true || "$UNINSTALL_MODE" == true ]]; then
    return
  fi

  local busy=0
  for port in 80 443; do
    if ss -ltn "( sport = :$port )" | tail -n +2 | grep -q .; then
      print_warn "Porta $port ja esta em uso. VEXUSCLAW🧙‍♂️ vai continuar, mas o Apache/certbot podem falhar se isso nao fizer parte da stack atual."
      busy=1
    fi
  done

  if [[ "$busy" -eq 1 && "$NON_INTERACTIVE" == true ]]; then
    print_warn "Modo nao interativo ativo: continuando apesar das portas ocupadas."
  fi
}

apt_install_base() {
  print_step "VEXUSCLAW🧙‍♂️ esta preparando dependencias do host..."
  $SUDO apt-get update -y
  $SUDO apt-get install -y \
    apt-transport-https \
    apache2 \
    ca-certificates \
    certbot \
    curl \
    git \
    gnupg \
    iproute2 \
    jq \
    lsb-release \
    openssl \
    procps \
    python3-certbot-apache \
    rsync \
    software-properties-common
}

install_nodejs() {
  if command -v node >/dev/null 2>&1; then
    local major
    major="$(node -p 'process.versions.node.split(".")[0]')"
    if [[ "$major" -ge 22 ]]; then
      return
    fi
  fi

  print_magic "VEXUSCLAW🧙‍♂️ esta invocando Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | $SUDO bash -
  $SUDO apt-get install -y nodejs
}

install_pnpm() {
  corepack enable
  corepack prepare "pnpm@${PNPM_VERSION}" --activate
}

install_docker() {
  if command -v docker >/dev/null 2>&1 && $SUDO docker compose version >/dev/null 2>&1; then
    $SUDO systemctl enable --now docker >/dev/null 2>&1 || true
    return
  fi

  print_magic "VEXUSCLAW🧙‍♂️ esta invocando Docker..."
  curl -fsSL https://get.docker.com | $SUDO sh
  $SUDO systemctl enable --now docker
}

ensure_php_repository() {
  if apt-cache show php8.3-fpm >/dev/null 2>&1; then
    return
  fi

  if [[ -z "${OS_CODENAME:-}" ]]; then
    print_error "Nao foi possivel detectar o codename do sistema para instalar PHP 8.3."
    exit 1
  fi

  print_magic "VEXUSCLAW🧙‍♂️ esta preparando o repositorio PHP 8.3..."
  if [[ ! -f /usr/share/keyrings/sury-php.gpg ]]; then
    curl -fsSL https://packages.sury.org/php/apt.gpg | $SUDO gpg --dearmor -o /usr/share/keyrings/sury-php.gpg
  fi
  printf 'deb [signed-by=/usr/share/keyrings/sury-php.gpg] https://packages.sury.org/php/ %s main\n' "$OS_CODENAME" \
    | $SUDO tee /etc/apt/sources.list.d/sury-php.list >/dev/null
  $SUDO apt-get update -y
}

install_apache_php() {
  ensure_php_repository

  print_magic "VEXUSCLAW🧙‍♂️ esta despertando Apache e PHP-FPM 8.3..."
  $SUDO apt-get install -y \
    php8.3-cli \
    php8.3-curl \
    php8.3-fpm \
    php8.3-intl \
    php8.3-mbstring \
    php8.3-pgsql \
    php8.3-xml \
    php8.3-zip

  $SUDO a2enmod headers proxy proxy_fcgi proxy_http proxy_wstunnel rewrite setenvif ssl >/dev/null
  $SUDO systemctl enable --now apache2 php8.3-fpm
}

ensure_repo() {
  local source_mode=""

  if [[ -d "$INSTALL_DIR/.git" ]]; then
    source_mode="git-existing"
  elif git_remote_has_refs "$REPO_URL"; then
    source_mode="git-fresh"
  elif [[ "$REPO_EXPLICIT" == false ]] && bundle_is_available; then
    source_mode="bundle"
  fi

  case "$source_mode" in
    git-existing)
      update_existing_git_checkout
      ;;
    bundle)
      install_from_bundle
      ;;
    git-fresh)
      clone_from_git
      ;;
    *)
      if [[ "$REPO_EXPLICIT" == true ]]; then
        print_error "O repositório informado nao possui refs clonaveis: $REPO_URL"
      else
        print_error "Nem o repositório oficial $REPO_URL nem o bundle oficial $BUNDLE_URL estão prontos para instalação."
      fi
      exit 1
      ;;
  esac
}

bundle_is_available() {
  curl -fsSI --retry 2 --connect-timeout 10 "$BUNDLE_URL" >/dev/null 2>&1
}

git_remote_has_refs() {
  local repo_url="$1"
  git ls-remote "$repo_url" HEAD 'refs/heads/*' 2>/dev/null | grep -q .
}

resolve_remote_branch() {
  local repo_url="$1"
  local requested_branch="${2:-}"
  local detected_branch=""

  if [[ -n "$requested_branch" ]]; then
    printf '%s\n' "$requested_branch"
    return
  fi

  detected_branch="$(git ls-remote --symref "$repo_url" HEAD 2>/dev/null | awk '/^ref:/ {sub("refs/heads/","",$2); print $2; exit}')"
  printf '%s\n' "$detected_branch"
}

update_existing_git_checkout() {
  local current_branch local_repo_url resolved_branch
  print_step "Atualizando codigo em $INSTALL_DIR..."
  git -C "$INSTALL_DIR" fetch --all --tags

  current_branch="$(git -C "$INSTALL_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
  local_repo_url="$(git -C "$INSTALL_DIR" remote get-url origin 2>/dev/null || true)"
  resolved_branch="$(resolve_remote_branch "${local_repo_url:-$REPO_URL}" "${BRANCH:-$current_branch}")"

  if [[ -z "$resolved_branch" ]]; then
    print_error "Nao foi possivel detectar a branch para atualizar $INSTALL_DIR."
    exit 1
  fi

  git -C "$INSTALL_DIR" checkout "$resolved_branch"
  git -C "$INSTALL_DIR" pull --ff-only origin "$resolved_branch"
}

clone_from_git() {
  local resolved_branch
  resolved_branch="$(resolve_remote_branch "$REPO_URL" "$BRANCH")"

  if [[ -z "$resolved_branch" ]]; then
    print_error "Nao foi possivel detectar a branch default do repositório $REPO_URL."
    exit 1
  fi

  print_step "Baixando VEXUSCLAW🧙‍♂️ via Git em $INSTALL_DIR..."
  $SUDO mkdir -p "$INSTALL_DIR"
  $SUDO chown -R "$(id -u):$(id -g)" "$INSTALL_DIR"
  git clone --branch "$resolved_branch" "$REPO_URL" "$INSTALL_DIR"
}

install_from_bundle() {
  local tmp_dir bundle_file
  tmp_dir="$(mktemp -d)"
  bundle_file="$tmp_dir/install-bundle.tar.gz"

  print_step "VEXUSCLAW🧙‍♂️ esta invocando o bundle oficial em $BUNDLE_URL..."
  $SUDO mkdir -p "$INSTALL_DIR"
  $SUDO chown -R "$(id -u):$(id -g)" "$INSTALL_DIR"

  curl -fsSL --retry 3 --connect-timeout 15 "$BUNDLE_URL" -o "$bundle_file"
  tar -tzf "$bundle_file" >/dev/null
  tar -xzf "$bundle_file" -C "$INSTALL_DIR"
  rm -rf "$tmp_dir"
  print_success "Bundle oficial aplicado em $INSTALL_DIR"
}

ensure_bundle_published_message() {
  print_warn "Se o GitHub oficial ainda estiver vazio, publique tambem o fallback $BUNDLE_URL com deploy/build-install-bundle.sh."
}

install_dependencies_in_repo() {
  if [[ ! -f "$INSTALL_DIR/package.json" ]]; then
    ensure_bundle_published_message
    print_error "Codigo da VEXUSCLAW nao encontrado em $INSTALL_DIR apos baixar a origem."
    exit 1
  fi
  print_step "VEXUSCLAW🧙‍♂️ esta instalando dependencias do monorepo..."
  cd "$INSTALL_DIR"
  pnpm install --no-frozen-lockfile
  print_magic "VEXUSCLAW🧙‍♂️ esta materializando o Prisma Client..."
  pnpm db:generate
}

run_installer_cli() {
  cd "$INSTALL_DIR"
  pnpm --filter @vexus/installer exec tsx src/index.ts "$@"
}

derive_workspace_name() {
  local slug="$1"
  echo "$slug" | tr '-' ' ' | sed 's/\b\(.\)/\u\1/g'
}

generate_workspace_slug() {
  local seed="$1"
  local hash prefix dec numeric
  hash="$(printf '%s' "${seed}:0" | sha256sum | awk '{print $1}')"
  prefix="${hash:0:8}"
  dec=$((16#$prefix))
  numeric=$(( (dec % 90000) + 10000 ))
  printf 'user%s' "$numeric"
}

validate_provider() {
  case "$PROVIDER" in
    openai|mock|chatgpt-oauth) ;;
    *)
      print_error "Provider invalido: $PROVIDER"
      exit 1
      ;;
  esac
}

prompt_if_needed() {
  if [[ "$NON_INTERACTIVE" == false ]]; then
    if [[ -z "$INSTALL_TOKEN" ]]; then
      read -r -p "Install token oficial [enter para dominio proprio]: " INSTALL_TOKEN
    fi
    if [[ -z "$EMAIL" ]]; then
      read -r -p "Email inicial do admin: " EMAIL
    fi
    if [[ -z "$PASSWORD" ]]; then
      read -r -s -p "Senha inicial do admin [enter para gerar]: " PASSWORD
      echo
    fi
    if [[ -z "$BASE_DOMAIN" && -z "$PUBLIC_DOMAIN" && -z "$INSTALL_TOKEN" ]]; then
      read -r -p "Dominio base do cliente [${BASE_DOMAIN_DEFAULT}]: " BASE_DOMAIN
      BASE_DOMAIN="${BASE_DOMAIN:-$BASE_DOMAIN_DEFAULT}"
    fi
    if [[ -z "$WORKSPACE_SLUG" && -z "$INSTALL_TOKEN" ]]; then
      read -r -p "Workspace slug [auto userxxxxx]: " WORKSPACE_SLUG
    fi
    if [[ -z "$WORKSPACE_NAME" && -n "$WORKSPACE_SLUG" ]]; then
      local suggested
      suggested="$(derive_workspace_name "$WORKSPACE_SLUG")"
      read -r -p "Workspace name [${suggested:-VEXUSCLAW Workspace}]: " WORKSPACE_NAME
      WORKSPACE_NAME="${WORKSPACE_NAME:-${suggested:-VEXUSCLAW Workspace}}"
    fi
    if [[ -z "${PROVIDER:-}" || "$PROVIDER" == "mock" ]]; then
      local provider_input
      read -r -p "Provider inicial [mock/openai/chatgpt-oauth] (mock): " provider_input
      PROVIDER="${provider_input:-$PROVIDER}"
    fi
    if [[ "$PROVIDER" == "openai" && -z "$OPENAI_API_KEY" ]]; then
      read -r -p "OpenAI API key [opcional]: " OPENAI_API_KEY
    fi
    local whatsapp_answer
    read -r -p "Provisionar WhatsApp agora? [y/N]: " whatsapp_answer
    case "${whatsapp_answer,,}" in
      y|yes) SKIP_WHATSAPP=false ;;
      *) SKIP_WHATSAPP=true ;;
    esac
  fi

  if [[ -z "$PASSWORD" ]]; then
    PASSWORD="$(openssl rand -base64 18 | tr -d '\n' | tr '/+' 'AZ')"
  fi

  if [[ -z "$EMAIL" ]]; then
    print_error "O email admin precisa ser informado com --email ou no modo assistido."
    exit 1
  fi

  validate_provider
}

get_public_ip() {
  curl -fsSL https://api.ipify.org 2>/dev/null || true
}

claim_self_host_domain() {
  if [[ -z "$INSTALL_TOKEN" ]]; then
    return
  fi

  print_magic "VEXUSCLAW🧙‍♂️ esta reservando o subdominio self-host..."
  local claim_json
  local args=()
  PUBLIC_IP="${PUBLIC_IP:-$(get_public_ip)}"
  args=(claim --api-base-url "$PROVISIONING_API_URL" --install-token "$INSTALL_TOKEN")
  if [[ -n "$PUBLIC_IP" ]]; then
    args+=(--ip "$PUBLIC_IP")
  fi
  claim_json="$(run_installer_cli "${args[@]}")"

  PUBLIC_DOMAIN="$(printf '%s' "$claim_json" | jq -r '.fqdn // empty')"
  WORKSPACE_SLUG="${WORKSPACE_SLUG:-$(printf '%s' "$claim_json" | jq -r '.slug // empty')}"

  if [[ -z "$PUBLIC_DOMAIN" || -z "$WORKSPACE_SLUG" ]]; then
    print_error "Falha ao reservar subdominio self-host. Resposta: $claim_json"
    exit 1
  fi

  BASE_DOMAIN="${PUBLIC_DOMAIN#${WORKSPACE_SLUG}.}"
  print_success "Subdominio reservado: $PUBLIC_DOMAIN"
}

normalize_domain_inputs() {
  if [[ -n "$PUBLIC_DOMAIN" && -z "$WORKSPACE_SLUG" ]]; then
    WORKSPACE_SLUG="${PUBLIC_DOMAIN%%.*}"
  fi

  if [[ -n "$BASE_DOMAIN" && -n "$WORKSPACE_SLUG" && -z "$PUBLIC_DOMAIN" && "$BASE_DOMAIN" == "${WORKSPACE_SLUG}."* ]]; then
    PUBLIC_DOMAIN="$BASE_DOMAIN"
    BASE_DOMAIN="${BASE_DOMAIN#${WORKSPACE_SLUG}.}"
  fi

  if [[ -z "$BASE_DOMAIN" && -n "$PUBLIC_DOMAIN" && -n "$WORKSPACE_SLUG" && "$PUBLIC_DOMAIN" == "${WORKSPACE_SLUG}."* ]]; then
    BASE_DOMAIN="${PUBLIC_DOMAIN#${WORKSPACE_SLUG}.}"
  fi

  if [[ -z "$BASE_DOMAIN" && -z "$PUBLIC_DOMAIN" ]]; then
    BASE_DOMAIN="$BASE_DOMAIN_DEFAULT"
  fi

  if [[ "$BASE_DOMAIN" == "$BASE_DOMAIN_DEFAULT" && -z "$INSTALL_TOKEN" && -z "$PUBLIC_DOMAIN" ]]; then
    print_error "Para provisionar um subdominio oficial vexusclaw.com, informe --install-token."
    exit 1
  fi

  if [[ -z "$WORKSPACE_SLUG" ]]; then
    WORKSPACE_SLUG="$(generate_workspace_slug "${EMAIL}:${BASE_DOMAIN}")"
  fi

  if [[ -z "$PUBLIC_DOMAIN" ]]; then
    PUBLIC_DOMAIN="${WORKSPACE_SLUG}.${BASE_DOMAIN}"
  fi

  if [[ -z "$WORKSPACE_NAME" ]]; then
    WORKSPACE_NAME="$(derive_workspace_name "$WORKSPACE_SLUG")"
    [[ -n "$WORKSPACE_NAME" ]] || WORKSPACE_NAME="VEXUSCLAW Workspace"
  fi
}

load_env_value() {
  local key="$1"
  if [[ -f "$INSTALL_DIR/.env" ]]; then
    grep -E "^${key}=" "$INSTALL_DIR/.env" | tail -n 1 | cut -d= -f2-
  fi
}

load_existing_context() {
  if [[ ! -f "$INSTALL_DIR/.env" ]]; then
    return
  fi

  BASE_DOMAIN="${BASE_DOMAIN:-$(load_env_value VEXUS_BASE_DOMAIN)}"
  PUBLIC_DOMAIN="${PUBLIC_DOMAIN:-$(load_env_value VEXUS_DOMAIN)}"
  EMAIL="${EMAIL:-$(load_env_value DEFAULT_ADMIN_EMAIL)}"
  PASSWORD="${PASSWORD:-$(load_env_value DEFAULT_ADMIN_PASSWORD)}"
  WORKSPACE_SLUG="${WORKSPACE_SLUG:-$(load_env_value DEFAULT_WORKSPACE_SLUG)}"
  WORKSPACE_NAME="${WORKSPACE_NAME:-$(derive_workspace_name "${WORKSPACE_SLUG:-}")}"
}

is_managed_env_key() {
  case "$1" in
    VEXUS_DOMAIN|VEXUS_BASE_DOMAIN|VEXUS_PUBLIC_URL|VEXUS_DASHBOARD_URL|VEXUS_API_URL|VEXUS_PUBLIC_PROTOCOL|VEXUS_GATEWAY_BIND_ADDRESS|VEXUS_GATEWAY_BIND_PORT|COOKIE_DOMAIN|COOKIE_SECURE|OPENAI_API_KEY|OPENAI_CONNECT_MODE|OPENAI_CHATGPT_OAUTH_ENABLED|CADDY_EMAIL|DEFAULT_WORKSPACE_SLUG|DEFAULT_ADMIN_EMAIL|DEFAULT_ADMIN_PASSWORD)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

ensure_env() {
  local env_file tmp_env
  local args=()
  env_file="$INSTALL_DIR/.env"
  tmp_env="$INSTALL_DIR/.env.install.tmp"

  print_step "VEXUSCLAW🧙‍♂️ esta preparando o ambiente..."
  args=(
    env render
    --non-interactive
    --domain "$BASE_DOMAIN"
    --public-domain "$PUBLIC_DOMAIN"
    --workspace "$WORKSPACE_SLUG"
    --workspace-name "$WORKSPACE_NAME"
    --admin-name "$ADMIN_NAME"
    --email "$EMAIL"
    --password "$PASSWORD"
    --provider "$PROVIDER"
  )
  if [[ -n "$OPENAI_API_KEY" ]]; then
    args+=(--openai-api-key "$OPENAI_API_KEY")
  fi
  run_installer_cli "${args[@]}" > "$tmp_env"

  if [[ ! -f "$env_file" ]]; then
    mv "$tmp_env" "$env_file"
    print_success ".env criado em $env_file"
    return
  fi

  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    [[ "$line" == \#* ]] && continue
    local key
    local escaped_line
    key="${line%%=*}"
    escaped_line="$(printf '%s' "$line" | sed -e 's/[\\/&]/\\&/g')"
    if grep -q "^${key}=" "$env_file"; then
      if is_managed_env_key "$key"; then
        sed -i "s/^${key}=.*/${escaped_line}/" "$env_file"
      fi
    else
      printf '%s\n' "$line" >> "$env_file"
    fi
  done < "$tmp_env"

  rm -f "$tmp_env"
  print_success ".env preservado e completado com chaves ausentes."
}

docker_compose() {
  $SUDO docker compose --env-file "$INSTALL_DIR/.env" -f "$INSTALL_DIR/infra/docker/docker-compose.yml" "$@"
}

prepare_dashboard_php() {
  if [[ ! -d "$INSTALL_DIR/dashboard-php" ]]; then
    print_error "Dashboard PHP nao encontrada em $INSTALL_DIR/dashboard-php."
    exit 1
  fi

  print_step "VEXUSCLAW🧙‍♂️ esta alinhando a dashboard PHP no projeto..."
  $SUDO find "$INSTALL_DIR/dashboard-php" -type d -exec chmod 755 {} +
  $SUDO find "$INSTALL_DIR/dashboard-php" -type f -exec chmod 644 {} +
  $SUDO chgrp -R www-data "$INSTALL_DIR/dashboard-php"
}

resolve_php_socket() {
  if [[ -S /run/php/php8.3-fpm.sock ]]; then
    PHP_FPM_SOCKET="/run/php/php8.3-fpm.sock"
    return
  fi

  PHP_FPM_SOCKET="$(find /run/php -maxdepth 1 -type s -name 'php*-fpm.sock' | sort | head -n 1)"
  if [[ -z "$PHP_FPM_SOCKET" ]]; then
    print_error "Nenhum socket PHP-FPM foi encontrado em /run/php."
    exit 1
  fi
}

render_server_alias_lines() {
  echo ""
}

configure_apache_site() {
  local template site_file site_slug alias_lines
  template="$INSTALL_DIR/infra/apache/vexusclaw.self-host.conf.template"
  site_file="/etc/apache2/sites-available/${SITE_CONF_NAME}"
  site_slug="${PUBLIC_DOMAIN//[^a-zA-Z0-9]/-}"
  alias_lines="$(render_server_alias_lines)"

  resolve_php_socket

  print_step "VEXUSCLAW🧙‍♂️ esta conectando o dashboard PHP no Apache..."
  sed \
    -e "s#__VEXUS_SERVER_NAME__#${PUBLIC_DOMAIN}#g" \
    -e "s#__VEXUS_SERVER_ALIAS_LINES__#${alias_lines}#g" \
    -e "s#__VEXUS_DOCUMENT_ROOT__#${INSTALL_DIR}/dashboard-php#g" \
    -e "s#__VEXUS_PHP_FPM_SOCK__#${PHP_FPM_SOCKET}#g" \
    -e "s#__VEXUS_SITE_SLUG__#${site_slug}#g" \
    "$template" | $SUDO tee "$site_file" >/dev/null

  $SUDO a2dissite 000-default.conf >/dev/null 2>&1 || true
  $SUDO a2ensite "$SITE_CONF_NAME" >/dev/null
  $SUDO apache2ctl configtest >/dev/null
  $SUDO systemctl reload apache2
}

run_database_tasks() {
  print_step "VEXUSCLAW🧙‍♂️ esta preparando o banco..."
  docker_compose build gateway
  docker_compose run --rm gateway pnpm db:deploy
  if [[ "$SKIP_SEED" == false ]]; then
    docker_compose run --rm gateway pnpm db:seed || print_warn "Seed falhou. Continuando para nao bloquear a instalacao."
  fi
}

wait_for_http() {
  local url="$1"
  local label="$2"
  local host_header="${3:-}"
  local attempt

  for attempt in $(seq 1 40); do
    if [[ -n "$host_header" ]]; then
      if curl -fsS -H "Host: $host_header" "$url" >/dev/null 2>&1; then
        print_success "$label respondeu com sucesso."
        return
      fi
    else
      if curl -fsS "$url" >/dev/null 2>&1; then
        print_success "$label respondeu com sucesso."
        return
      fi
    fi
    sleep 3
  done

  print_error "$label nao respondeu em tempo habil."
  exit 1
}

bootstrap_application() {
  local args=()

  print_step "VEXUSCLAW🧙‍♂️ esta despertando o gateway..."
  docker_compose up -d postgres redis
  run_database_tasks
  docker_compose up -d gateway

  wait_for_http "http://127.0.0.1:4000/health" "Gateway"
  wait_for_http "http://127.0.0.1/login" "Dashboard PHP" "$PUBLIC_DOMAIN"

  print_magic "VEXUSCLAW🧙‍♂️ esta finalizando o bootstrap inicial..."
  args=(
    bootstrap run
    --non-interactive
    --base-url "http://127.0.0.1:4000/api/v1"
    --domain "$BASE_DOMAIN"
    --public-domain "$PUBLIC_DOMAIN"
    --workspace "$WORKSPACE_SLUG"
    --workspace-name "$WORKSPACE_NAME"
    --admin-name "$ADMIN_NAME"
    --email "$EMAIL"
    --password "$PASSWORD"
    --provider "$PROVIDER"
    --skip-default-agent
  )
  if [[ -n "$OPENAI_API_KEY" ]]; then
    args+=(--openai-api-key "$OPENAI_API_KEY")
  fi
  if [[ "$SKIP_WHATSAPP" == true ]]; then
    args+=(--skip-whatsapp)
  fi
  run_installer_cli "${args[@]}" >/dev/null
}

wait_for_dns_to_resolve() {
  PUBLIC_IP="${PUBLIC_IP:-$(get_public_ip)}"
  if [[ -z "$PUBLIC_IP" ]]; then
    print_warn "Nao foi possivel detectar o IP publico da VPS. O TLS automatico sera tentado apenas se o dominio ja resolver corretamente."
    return 1
  fi

  local attempt resolved
  for attempt in $(seq 1 20); do
    resolved="$(getent ahostsv4 "$PUBLIC_DOMAIN" 2>/dev/null | awk '{print $1}' | sort -u | tr '\n' ' ')"
    if grep -qw "$PUBLIC_IP" <<<"$resolved"; then
      print_success "DNS confirmado para $PUBLIC_DOMAIN -> $PUBLIC_IP"
      return 0
    fi
    sleep 15
  done

  print_warn "O DNS de $PUBLIC_DOMAIN ainda nao aponta para $PUBLIC_IP. O instalador vai concluir sem forcar TLS agora."
  return 1
}

obtain_tls_certificate() {
  FINAL_URL="http://${PUBLIC_DOMAIN}"

  if ! wait_for_dns_to_resolve; then
    return
  fi

  print_magic "VEXUSCLAW🧙‍♂️ esta invocando TLS com Certbot..."
  if $SUDO certbot --apache --non-interactive --agree-tos --redirect --keep-until-expiring -m "$EMAIL" -d "$PUBLIC_DOMAIN"; then
    TLS_READY=true
    FINAL_URL="https://${PUBLIC_DOMAIN}"
    $SUDO systemctl reload apache2
    print_success "TLS automatico ativado para $PUBLIC_DOMAIN"
    return
  fi

  print_warn "O Certbot nao conseguiu emitir o certificado agora. O sistema continua acessivel por HTTP localmente e pode receber TLS assim que o DNS estabilizar."
}

install_systemd_unit() {
  local unit_path service_file ctl_file
  unit_path="/etc/systemd/system/vexusclaw.service"
  service_file="$INSTALL_DIR/infra/systemd/vexusclaw.service"
  ctl_file="/usr/local/bin/vexusclawctl"

  sed "s#__VEXUS_WORKDIR__#$INSTALL_DIR#g" "$service_file" | $SUDO tee "$unit_path" >/dev/null
  $SUDO systemctl daemon-reload
  $SUDO systemctl enable --now vexusclaw.service

  cat <<EOF | $SUDO tee "$ctl_file" >/dev/null
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$INSTALL_DIR"
case "\${1:-status}" in
  status) docker compose --env-file "\$ROOT_DIR/.env" -f "\$ROOT_DIR/infra/docker/docker-compose.yml" ps ;;
  logs) docker compose --env-file "\$ROOT_DIR/.env" -f "\$ROOT_DIR/infra/docker/docker-compose.yml" logs -f ;;
  doctor) bash "\$ROOT_DIR/deploy/install.sh" --doctor --install-dir "\$ROOT_DIR" ;;
  update) bash "\$ROOT_DIR/deploy/install.sh" --update --install-dir "\$ROOT_DIR" ;;
  restart) docker compose --env-file "\$ROOT_DIR/.env" -f "\$ROOT_DIR/infra/docker/docker-compose.yml" restart ;;
  *) echo "Uso: vexusclawctl {status|logs|doctor|update|restart}" ; exit 1 ;;
esac
EOF
  $SUDO chmod +x "$ctl_file"
}

doctor_mode() {
  print_step "VEXUSCLAW🧙‍♂️ esta validando a saude da stack..."
  check_resources
  load_existing_context

  command -v docker >/dev/null 2>&1 && $SUDO docker compose version || true
  $SUDO systemctl is-active apache2 || true
  $SUDO systemctl is-active php8.3-fpm || true

  if [[ -f "$INSTALL_DIR/.env" ]]; then
    docker_compose ps || true
  fi

  curl -fsS "http://127.0.0.1:4000/health" || true

  if [[ -n "${PUBLIC_DOMAIN:-}" ]]; then
    curl -fsS -H "Host: $PUBLIC_DOMAIN" "http://127.0.0.1/login" >/dev/null && echo "dashboard_php: reachable" || true
  fi

  if [[ -d "$INSTALL_DIR" ]]; then
    run_installer_cli doctor --base-url "http://127.0.0.1:4000/api/v1" || true
  fi
}

update_mode() {
  load_existing_context
  prompt_if_needed
  claim_self_host_domain
  normalize_domain_inputs
  ensure_env
  prepare_dashboard_php
  configure_apache_site
  bootstrap_application
  obtain_tls_certificate
  install_systemd_unit
  print_success "Update da VEXUSCLAW concluido."
  print_footer
}

uninstall_mode() {
  if [[ -d "$INSTALL_DIR" && -f "$INSTALL_DIR/.env" ]]; then
    docker_compose down || true
  fi
  $SUDO systemctl disable --now vexusclaw.service >/dev/null 2>&1 || true
  $SUDO rm -f /etc/systemd/system/vexusclaw.service /usr/local/bin/vexusclawctl
  $SUDO rm -f "/etc/apache2/sites-available/${SITE_CONF_NAME}" "/etc/apache2/sites-enabled/${SITE_CONF_NAME}"
  $SUDO systemctl daemon-reload || true
  $SUDO systemctl reload apache2 >/dev/null 2>&1 || true
  print_warn "VEXUSCLAW removida do systemd e do vhost Apache. Dados Docker e $INSTALL_DIR foram preservados."
}

print_footer() {
  FINAL_URL="${FINAL_URL:-https://${PUBLIC_DOMAIN}}"

  cat <<EOF

${MAGENTA}${BOLD}╔════════════════════════════════════════════════════════════════╗${NC}
${MAGENTA}${BOLD}║                 VEXUSCLAW🧙‍♂️ OPERACIONAL                  ║${NC}
${MAGENTA}${BOLD}╚════════════════════════════════════════════════════════════════╝${NC}
${GREEN}[OK]${NC} URL final: ${CYAN}${FINAL_URL}${NC}
${GREEN}[OK]${NC} Workspace: ${CYAN}${WORKSPACE_SLUG}${NC}
${GREEN}[OK]${NC} Dominio publico: ${CYAN}${PUBLIC_DOMAIN}${NC}
${GREEN}[OK]${NC} Dashboard PHP: ${CYAN}${INSTALL_DIR}/dashboard-php${NC}
${GREEN}[OK]${NC} Admin: ${CYAN}${EMAIL}${NC}
${GREEN}[OK]${NC} Provider inicial: ${CYAN}${PROVIDER}${NC}
${YELLOW}[AVISO]${NC} Senha inicial: ${PASSWORD}
${YELLOW}[AVISO]${NC} Agentes: nenhum agente foi criado automaticamente nesta VPS.
${YELLOW}[AVISO]${NC} WhatsApp: $(if [[ "$SKIP_WHATSAPP" == true ]]; then printf '%s' 'provisionamento inicial pulado para economizar recursos'; else printf '%s' 'canal principal provisionado; conecte o QR depois de criar seus agentes'; fi)
${CYAN}${BOLD}BY JOAO LUIZ 🧙‍♂️${NC}

Próximos passos:
  1. Acesse ${FINAL_URL}
  2. Faça login com ${EMAIL}
  3. Crie seus agentes em /agents
  4. Depois conecte o WhatsApp em /channels
EOF
}

main() {
  init_colors
  print_banner
  parse_args "$@"
  need_root
  detect_os

  if [[ "$DOCTOR_MODE" == true ]]; then
    doctor_mode
    exit 0
  fi

  if [[ "$UNINSTALL_MODE" == true ]]; then
    uninstall_mode
    exit 0
  fi

  check_resources
  check_ports
  apt_install_base
  install_nodejs
  install_pnpm
  install_docker
  install_apache_php
  ensure_repo
  install_dependencies_in_repo

  if [[ "$UPDATE_MODE" == true ]]; then
    update_mode
    exit 0
  fi

  prompt_if_needed
  claim_self_host_domain
  normalize_domain_inputs
  ensure_env
  prepare_dashboard_php
  configure_apache_site
  bootstrap_application
  obtain_tls_certificate
  install_systemd_unit
  print_footer
}

main "$@"
