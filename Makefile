_APP_PATH=app
_SERVER_PATH=app/server
_FRONTEND_PATH=app/frontend

_SERVER_NODE=server
_FRONTEND_NODE=frontend

_NODE_CTR=node
_SSL_PATH=./docker/app/ssl
_LETCENCRYPT_PATH=/etc/letsencrypt
_PERM_USER_WWW_DATA=www-data
_PERM_USER=$$USER
#_PERM_USER=www-data
#_PERM_MEDIUM=755
#_PERM_OPEN=777

#ifeq ($(ENV), 'dev')
#	_SUDO=sudo
#else
#	_SUDO=
#endif

_SUDO=
#ifeq ($(shell lsb_release -si), Ubuntu)
#	_SUDO=sudo
#else
#	_SUDO=
#endif

_SSL_RENEW=
ifeq ($(ENV), 'prod')
	_SSL_RENEW=ssl-renew
endif

_EXEC=$(_SUDO) docker-compose exec

server-start-dev:
	$(_EXEC) $(_SERVER_NODE) npm run server-dev;
server-start-prod:
	$(_EXEC) $(_SERVER_NODE) npm run server-prod

init: frontend-init server-init

server-init:
	$(_SUDO) npm i $(_SERVER_PATH) --package-lock --prefix $(_SERVER_PATH);
frontend-init:
	$(_SUDO) npm i $(_FRONTEND_PATH) --package-lock --prefix $(_FRONTEND_PATH);

server-install:
	$(_EXEC) $(_SERVER_NODE) npm i --package-lock;
frontend-install:
	$(_EXEC) $(_FRONTEND_NODE) npm i --package-lock;

server-reinstall: clear_node_modules server-install
frontend-reinstall: clear_node_modules frontend-install

server-install-cmd:
	$(_EXEC) $(_SERVER_NODE) npm i $(cmd);
frontend-install-cmd:
	$(_EXEC) $(_FRONTEND_NODE) npm i $(cmd);
frontend-cmd:
	$(_EXEC) $(_FRONTEND_NODE) $(cmd);

clear_node_modules:
	$(_SUDO) rm -rf ./$(_FRONTEND_NODE)/node_modules;
	$(_SUDO) rm -rf ./$(_SERVER_NODE)/node_modules;

down: docker-down

up: docker-up

restart: down up

docker-restart-force: volumes-remove rebuild

rebuild: init docker-rebuild

docker-rebuild: docker-down docker-build

docker-restart-safe: docker-down docker-up

volumes-remove:
	$(_SUDO) rm -rf volumes/*;
	$(_SUDO) rm -rf storage/*;

docker-up: memory
	$(_SUDO) docker-compose up -d;

docker-build: memory
	$(_SUDO) docker-compose up --build -d;

docker-down: docker-prune
	$(_SUDO) docker-compose down;

docker-prune:
	$(_SUDO) docker system prune -f;

memory:
	$(_SUDO) sysctl -w vm.max_map_count=262144;

perm: perm-user-display perm-developer

perm-developer:
	$(_SUDO) chown -f -R $(_PERM_USER):$(_PERM_USER) $(_APP_PATH);
	$(_SUDO) find $(_APP_PATH) -type f -exec chmod 644 {} \;
	$(_SUDO) find $(_APP_PATH) -type d -exec chmod 755 {} \;
	$(_SUDO) chmod -f -R 777 $(_SERVER_PATH)/node_modules;
	$(_SUDO) chmod -f -R 777 $(_FRONTEND_PATH)/node_modules;

perm-user-display:
	echo $(_PERM_USER);

################### deprecated

#server-start:
#	$(_EXEC) $(_NODE_CTR) node server.js;
#
#server-start-loop:
#	$(_EXEC) $(_NODE_CTR) nodemon server.js;
#
#npm-start:
#	$(_EXEC) $(_NODE_CTR) npm run start;


