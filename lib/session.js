'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var eosio = require('@greymass/eosio');
var zlib = require('pako');
var eosioSigningRequest = require('eosio-signing-request');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);

class ABICache {
    constructor(client) {
        this.client = client;
        this.cache = new Map();
        this.pending = new Map();
    }
    getAbi(account) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const key = String(account);
            let record = this.cache.get(key);
            if (!record) {
                let getAbi = this.pending.get(key);
                if (!getAbi) {
                    getAbi = this.client.v1.chain.get_abi(account);
                    this.pending.set(key, getAbi);
                }
                const response = yield getAbi;
                this.pending.delete(key);
                if (response.abi) {
                    record = eosio.ABI.from(response.abi);
                    this.cache.set(key, record);
                }
                else {
                    throw new Error(`ABI for ${key} could not be loaded.`);
                }
            }
            return record;
        });
    }
}

exports.LoginHookTypes = void 0;
(function (LoginHookTypes) {
    LoginHookTypes["beforeLogin"] = "beforeLogin";
    LoginHookTypes["afterLogin"] = "afterLogin";
})(exports.LoginHookTypes || (exports.LoginHookTypes = {}));
class LoginContext {
    constructor(options) {
        var _a;
        this.chains = [];
        this.hooks = {
            afterLogin: [],
            beforeLogin: [],
        };
        this.uiRequirements = {
            requiresChainSelect: true,
            requiresPermissionSelect: true,
            requiresWalletSelect: true,
        };
        this.walletPlugins = [];
        this.appName = options.appName;
        if (options.chains) {
            this.chains = options.chains;
        }
        if (options.chain) {
            this.chain = options.chain;
        }
        this.fetch = options.fetch;
        this.permissionLevel = options.permissionLevel;
        this.walletPlugins = options.walletPlugins || [];
        this.ui = options.ui;
        (_a = options.loginPlugins) === null || _a === void 0 ? void 0 : _a.forEach((plugin) => {
            plugin.register(this);
        });
    }
    addHook(t, hook) {
        this.hooks[t].push(hook);
    }
    getClient(chain) {
        return new eosio.APIClient({ provider: new eosio.FetchProvider(chain.url, { fetch: this.fetch }) });
    }
    get esrOptions() {
        return {
            zlib: zlib__default["default"],
        };
    }
}
class AbstractLoginPlugin {
}
class BaseLoginPlugin extends AbstractLoginPlugin {
    register() {
    }
}

exports.TransactHookTypes = void 0;
(function (TransactHookTypes) {
    TransactHookTypes["beforeSign"] = "beforeSign";
    TransactHookTypes["afterSign"] = "afterSign";
    TransactHookTypes["afterBroadcast"] = "afterBroadcast";
})(exports.TransactHookTypes || (exports.TransactHookTypes = {}));
class TransactContext {
    constructor(options) {
        var _a;
        this.hooks = {
            afterBroadcast: [],
            afterSign: [],
            beforeSign: [],
        };
        this.abiProvider = options.abiProvider;
        this.appName = options.appName;
        this.chain = options.chain;
        this.client = options.client;
        this.createRequest = options.createRequest;
        this.fetch = options.fetch;
        this.permissionLevel = options.permissionLevel;
        if (options.storage) {
            this.storage = options.storage;
        }
        this.transactPluginsOptions = options.transactPluginsOptions || {};
        this.ui = options.ui;
        (_a = options.transactPlugins) === null || _a === void 0 ? void 0 : _a.forEach((plugin) => {
            plugin.register(this);
        });
    }
    get accountName() {
        return this.permissionLevel.actor;
    }
    get permissionName() {
        return this.permissionLevel.permission;
    }
    get esrOptions() {
        return {
            abiProvider: this.abiProvider,
            zlib: zlib__default["default"],
        };
    }
    addHook(t, hook) {
        this.hooks[t].push(hook);
    }
    resolve(request, expireSeconds = 120) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const info = yield this.client.v1.chain.get_info();
            const header = info.getTransactionHeader(expireSeconds);
            const abis = yield request.fetchAbis(this.abiProvider);
            return request.resolve(abis, this.permissionLevel, Object.assign(Object.assign({}, header), { chainId: this.chain.id }));
        });
    }
}
class TransactRevisions {
    constructor(request) {
        this.revisions = [];
        this.addRevision({ request, signatures: [] }, 'original', true);
    }
    addRevision(response, code, allowModify) {
        let modified = false;
        const previous = this.revisions[this.revisions.length - 1];
        if (previous) {
            modified = previous.response.request !== String(response.request);
        }
        this.revisions.push({
            allowModify,
            code: String(code),
            modified,
            response: {
                request: String(response.request),
                signatures: response.signatures ? eosio.Serializer.objectify(response.signatures) : [],
            },
        });
    }
}
class AbstractTransactPlugin {
}
class BaseTransactPlugin extends AbstractTransactPlugin {
    get id() {
        return 'base-transact-plugin';
    }
    register() {
    }
}

const chainNames = new Map([
    ['aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', 'EOS'],
    ['21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c', 'FIO'],
    ['b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e', 'FIO (Testnet)'],
    ['2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840', 'Jungle 3 (Testnet)'],
    ['73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d', 'Jungle 4 (Testnet)'],
    ['5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191', 'Kylin (Testnet)'],
    ['38b1d7815474d0c60683ecbea321d723e83f5da6ae5f1c1f9fecc69d9ba96465', 'Libre'],
    ['b64646740308df2ee06c6b72f34c0f7fa066d940e831f752db2006fcc2b78dee', 'Libre (Testnet)'],
    ['384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0', 'Proton'],
    ['71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd', 'Proton (Testnet)'],
    ['4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11', 'Telos'],
    ['1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f', 'Telos (Testnet)'],
    ['8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02', 'UX'],
    ['1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4', 'WAX'],
    ['f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12', 'WAX (Testnet)'],
]);
exports.ExplorerDefinition = class ExplorerDefinition extends eosio.Struct {
    url(id) {
        return `${this.prefix}${id}${this.suffix}`;
    }
};
tslib.__decorate([
    eosio.Struct.field('string')
], exports.ExplorerDefinition.prototype, "prefix", void 0);
tslib.__decorate([
    eosio.Struct.field('string')
], exports.ExplorerDefinition.prototype, "suffix", void 0);
exports.ExplorerDefinition = tslib.__decorate([
    eosio.Struct.type('explorer_definition')
], exports.ExplorerDefinition);
exports.ChainDefinition = class ChainDefinition extends eosio.Struct {
    get name() {
        const id = String(this.id);
        return chainNames.has(id) ? chainNames.get(id) : 'Unknown blockchain';
    }
};
tslib.__decorate([
    eosio.Struct.field('checksum256')
], exports.ChainDefinition.prototype, "id", void 0);
tslib.__decorate([
    eosio.Struct.field('string')
], exports.ChainDefinition.prototype, "url", void 0);
tslib.__decorate([
    eosio.Struct.field(exports.ExplorerDefinition, { optional: true })
], exports.ChainDefinition.prototype, "explorer", void 0);
exports.ChainDefinition = tslib.__decorate([
    eosio.Struct.type('chain_definition')
], exports.ChainDefinition);
class Canceled extends Error {
    constructor(reason, silent = false) {
        super(reason);
        this.silent = false;
        this.silent = silent;
        Object.setPrototypeOf(this, Canceled.prototype);
    }
}
function cancelable(promise, onCancel) {
    let cancel = null;
    const cancelable = new Promise((resolve, reject) => {
        cancel = (reason = '', silent = false) => {
            try {
                if (onCancel) {
                    onCancel(new Canceled(reason, silent));
                }
            }
            catch (e) {
                reject(e);
            }
            return cancelable;
        };
        promise.then(resolve, reject);
    });
    if (cancel) {
        cancelable.cancel = cancel;
    }
    return cancelable;
}

function getFetch(options) {
    if (options && options.fetch) {
        return options.fetch;
    }
    if (typeof window !== 'undefined' && window.fetch) {
        return window.fetch.bind(window);
    }
    if (typeof global !== 'undefined' && global.fetch) {
        return global.fetch.bind(global);
    }
    throw new Error('Missing fetch');
}

class Session {
    constructor(args, options = {}) {
        this.allowModify = true;
        this.broadcast = true;
        this.expireSeconds = 120;
        this.transactPluginsOptions = {};
        this.serialize = () => eosio.Serializer.objectify({
            chain: this.chain.id,
            actor: this.permissionLevel.actor,
            permission: this.permissionLevel.permission,
            walletPlugin: this.walletPlugin.serialize(),
        });
        this.chain = exports.ChainDefinition.from(args.chain);
        if (args.permissionLevel) {
            this.permissionLevel = eosio.PermissionLevel.from(args.permissionLevel);
        }
        else if (args.actor && args.permission) {
            this.permissionLevel = eosio.PermissionLevel.from(`${args.actor}@${args.permission}`);
        }
        else {
            throw new Error('Either a permissionLevel or actor/permission must be provided when creating a new Session.');
        }
        this.walletPlugin = args.walletPlugin;
        if (options.appName) {
            this.appName = eosio.Name.from(options.appName);
        }
        if (options.allowModify !== undefined) {
            this.allowModify = options.allowModify;
        }
        if (options.broadcast !== undefined) {
            this.broadcast = options.broadcast;
        }
        if (options.expireSeconds) {
            this.expireSeconds = options.expireSeconds;
        }
        if (options.fetch) {
            this.fetch = options.fetch;
        }
        else {
            this.fetch = getFetch(options);
        }
        if (options.storage) {
            this.storage = options.storage;
        }
        if (options.transactPlugins) {
            this.transactPlugins = options.transactPlugins;
        }
        else {
            this.transactPlugins = [new BaseTransactPlugin()];
        }
        if (options.transactPluginsOptions) {
            this.transactPluginsOptions = options.transactPluginsOptions;
        }
        if (options.abiProvider) {
            this.abiProvider = options.abiProvider;
        }
        else {
            this.abiProvider = new ABICache(this.client);
        }
        if (options.ui) {
            this.ui = options.ui;
        }
    }
    get actor() {
        return this.permissionLevel.actor;
    }
    get permission() {
        return this.permissionLevel.permission;
    }
    get client() {
        return new eosio.APIClient({ provider: new eosio.FetchProvider(this.chain.url, { fetch: this.fetch }) });
    }
    upgradeTransaction(args) {
        const anyArgs = args;
        if (args.actions &&
            (anyArgs.expiration ||
                anyArgs.ref_block_num ||
                anyArgs.ref_block_prefix ||
                anyArgs.max_net_usage_words ||
                anyArgs.max_cpu_usage_ms ||
                anyArgs.delay_sec)) {
            return (args = {
                transaction: Object.assign({ expiration: '1970-01-01T00:00:00', ref_block_num: 0, ref_block_prefix: 0, max_net_usage_words: 0, max_cpu_usage_ms: 0, delay_sec: 0 }, anyArgs),
            });
        }
        return args;
    }
    storageType(version) {
        return version === 2 ? eosioSigningRequest.RequestDataV2 : eosioSigningRequest.RequestDataV3;
    }
    cloneRequest(request, abiProvider) {
        let signature;
        if (request.signature) {
            signature = eosioSigningRequest.RequestSignature.from(JSON.parse(JSON.stringify(request.signature)));
        }
        const RequestData = this.storageType(request.version);
        const data = RequestData.from(JSON.parse(JSON.stringify(request.data)));
        return new eosioSigningRequest.SigningRequest(request.version, data, zlib__default["default"], abiProvider, signature);
    }
    createRequest(args, abiProvider) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            let request;
            const options = {
                abiProvider,
                zlib: zlib__default["default"],
            };
            if (args.request && args.request instanceof eosioSigningRequest.SigningRequest) {
                request = this.cloneRequest(args.request, abiProvider);
            }
            else if (args.request) {
                request = eosioSigningRequest.SigningRequest.from(args.request, options);
            }
            else {
                args = this.upgradeTransaction(args);
                request = yield eosioSigningRequest.SigningRequest.create(Object.assign(Object.assign({}, args), { chainId: this.chain.id }), options);
            }
            request.setBroadcast(false);
            return request;
        });
    }
    updateRequest(previous, modified, abiProvider) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const updatedRequest = this.cloneRequest(modified, abiProvider);
            const info = updatedRequest.getRawInfo();
            previous.data.info.forEach((metadata) => {
                if (info[metadata.key]) {
                    console.warn(`During an updateRequest call, the previous request had already set the ` +
                        `metadata key of "${metadata.key}" which will not be overwritten.`);
                }
                updatedRequest.setRawInfoKey(metadata.key, metadata.value);
            });
            return updatedRequest;
        });
    }
    transact(args, options) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            try {
                const expireSeconds = options && options.expireSeconds ? options.expireSeconds : this.expireSeconds;
                const willBroadcast = options && typeof options.broadcast !== 'undefined'
                    ? options.broadcast
                    : this.broadcast;
                const abiProvider = (options === null || options === void 0 ? void 0 : options.abiProvider) || this.abiProvider;
                const transactPlugins = (options === null || options === void 0 ? void 0 : options.transactPlugins) || this.transactPlugins;
                const transactPluginsOptions = (options === null || options === void 0 ? void 0 : options.transactPluginsOptions) || this.transactPluginsOptions;
                let allowModify = options && typeof options.allowModify !== 'undefined'
                    ? options.allowModify
                    : this.allowModify;
                const context = new TransactContext({
                    abiProvider,
                    appName: this.appName,
                    chain: this.chain,
                    client: this.client,
                    createRequest: (args) => this.createRequest(args, abiProvider),
                    fetch: this.fetch,
                    permissionLevel: this.permissionLevel,
                    storage: this.storage,
                    transactPlugins,
                    transactPluginsOptions,
                    ui: this.ui,
                });
                if (context.ui) {
                    yield context.ui.onTransact();
                    for (const translation of transactPlugins.map((transactPlugin) => this.getPluginTranslations(transactPlugin))) {
                        context.ui.addTranslations(translation);
                    }
                }
                let request = yield this.createRequest(args, abiProvider);
                const result = {
                    chain: this.chain,
                    request,
                    resolved: undefined,
                    revisions: new TransactRevisions(request),
                    signatures: [],
                    signer: this.permissionLevel,
                    transaction: undefined,
                };
                for (const hook of context.hooks.beforeSign) {
                    const response = yield hook(request.clone(), context);
                    if (response) {
                        result.revisions.addRevision(response, String(hook), allowModify);
                        if (allowModify) {
                            request = yield this.updateRequest(request, response.request, abiProvider);
                        }
                        if (response.signatures) {
                            result.signatures = [...result.signatures, ...response.signatures];
                            allowModify = false;
                        }
                    }
                }
                result.request = request;
                result.resolved = yield context.resolve(request, expireSeconds);
                result.transaction = result.resolved.resolvedTransaction;
                if (context.ui) {
                    yield context.ui.onSign();
                    context.ui.addTranslations(this.getPluginTranslations(this.walletPlugin));
                }
                const walletResponse = yield this.walletPlugin.sign(result.resolved, context);
                if (context.ui) {
                    yield context.ui.onSignComplete();
                }
                result.signatures.push(...walletResponse.signatures);
                if (walletResponse.request) {
                    const requestWasModified = !request
                        .getRawTransaction()
                        .equals(walletResponse.request.getRawTransaction());
                    if (requestWasModified) {
                        if (allowModify) {
                            result.request = walletResponse.request;
                            result.resolved = yield context.resolve(walletResponse.request, expireSeconds);
                            result.transaction = result.resolved.resolvedTransaction;
                        }
                        else {
                            throw new Error(`The ${this.walletPlugin.metadata.name} plugin modified the transaction when it was not allowed to.`);
                        }
                    }
                }
                for (const hook of context.hooks.afterSign)
                    yield hook(result.request.clone(), context);
                if (willBroadcast) {
                    if (context.ui) {
                        yield context.ui.onBroadcast();
                    }
                    const signed = eosio.SignedTransaction.from(Object.assign(Object.assign({}, result.resolved.transaction), { signatures: result.signatures }));
                    result.response = yield context.client.v1.chain.send_transaction(signed);
                    for (const hook of context.hooks.afterBroadcast)
                        yield hook(result.request.clone(), context, result);
                    if (context.ui) {
                        yield context.ui.onBroadcastComplete();
                    }
                }
                if (context.ui) {
                    yield context.ui.onTransactComplete();
                }
                return result;
            }
            catch (error) {
                if (error.response && error.response.json) {
                    const { json } = error.response;
                    if (json.error && json.error.details) {
                        const e = new Error(json.error.details[0].message);
                        if (this.ui) {
                            yield this.ui.onError(e);
                        }
                        throw e;
                    }
                }
                else {
                    if (this.ui) {
                        yield this.ui.onError(error);
                    }
                }
                throw new Error(error);
            }
        });
    }
    getPluginTranslations(transactPlugin) {
        if (!transactPlugin.translations) {
            return {};
        }
        const prefixed = {};
        const languages = Object.keys(transactPlugin.translations);
        languages.forEach((lang) => {
            if (transactPlugin.translations) {
                prefixed[lang] = { [transactPlugin.id]: transactPlugin.translations[lang] };
            }
        });
        return prefixed;
    }
}

class BrowserLocalStorage {
    constructor(keyPrefix) {
        this.keyPrefix = keyPrefix;
    }
    write(key, data) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            localStorage.setItem(this.storageKey(key), data);
        });
    }
    read(key) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            return localStorage.getItem(this.storageKey(key));
        });
    }
    remove(key) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            localStorage.removeItem(this.storageKey(key));
        });
    }
    storageKey(key) {
        return `wharf-${this.keyPrefix}-${key}`;
    }
}

class SessionKit {
    constructor(options) {
        this.allowModify = true;
        this.expireSeconds = 120;
        this.transactPluginsOptions = {};
        if (typeof options.allowModify !== 'undefined') {
            this.allowModify = options.allowModify;
        }
        this.appName = eosio.Name.from(options.appName);
        this.chains = options.chains.map((chain) => exports.ChainDefinition.from(chain));
        if (options.expireSeconds) {
            this.expireSeconds = options.expireSeconds;
        }
        if (options.fetch) {
            this.fetch = options.fetch;
        }
        else {
            this.fetch = getFetch(options);
        }
        if (options.loginPlugins) {
            this.loginPlugins = options.loginPlugins;
        }
        else {
            this.loginPlugins = [new BaseLoginPlugin()];
        }
        if (options.storage) {
            this.storage = options.storage;
        }
        else {
            this.storage = new BrowserLocalStorage(this.appName.toString());
        }
        if (options.transactPlugins) {
            this.transactPlugins = options.transactPlugins;
        }
        else {
            this.transactPlugins = [new BaseTransactPlugin()];
        }
        if (options.transactPluginsOptions) {
            this.transactPluginsOptions = options.transactPluginsOptions;
        }
        if (options.ui) {
            this.ui = options.ui;
        }
        this.walletPlugins = options.walletPlugins;
    }
    getChainDefinition(id, override) {
        const chains = override ? override : this.chains;
        const chainId = eosio.Checksum256.from(id);
        const chain = chains.find((c) => c.id.equals(chainId));
        if (!chain) {
            throw new Error(`No chain defined with the ID of: ${chainId}`);
        }
        return chain;
    }
    login(options) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!this.ui) {
                throw new Error('An instance of a UserInterface must be provided to utilize the login method.');
            }
            const context = new LoginContext({
                appName: this.appName,
                chain: undefined,
                chains: options && (options === null || options === void 0 ? void 0 : options.chains)
                    ? options.chains.map((c) => this.getChainDefinition(c))
                    : this.chains,
                fetch: this.fetch,
                ui: this.ui,
                walletPlugins: this.walletPlugins.map((plugin) => {
                    return {
                        config: plugin.config,
                        metadata: plugin.metadata,
                    };
                }),
            });
            yield context.ui.onLogin();
            if (options && options.chain) {
                context.chain = this.getChainDefinition(options.chain, context.chains);
                context.uiRequirements.requiresChainSelect = false;
            }
            else if (context.chains.length === 1) {
                context.chain = context.chains[0];
                context.uiRequirements.requiresChainSelect = false;
            }
            if (options === null || options === void 0 ? void 0 : options.permissionLevel) {
                context.permissionLevel = eosio.PermissionLevel.from(options.permissionLevel);
                context.uiRequirements.requiresPermissionSelect = false;
            }
            let walletPlugin = undefined;
            if (this.walletPlugins.length === 1) {
                walletPlugin = this.walletPlugins[0];
                context.uiRequirements.requiresWalletSelect = false;
            }
            else if (options === null || options === void 0 ? void 0 : options.walletPlugin) {
                walletPlugin = this.walletPlugins.find((p) => p.id === options.walletPlugin);
                if (walletPlugin) {
                    context.uiRequirements.requiresWalletSelect = false;
                }
            }
            if (context.uiRequirements.requiresChainSelect ||
                context.uiRequirements.requiresPermissionSelect ||
                context.uiRequirements.requiresWalletSelect) {
                const uiLoginResponse = yield context.ui.login(context);
                if (uiLoginResponse.walletPluginIndex !== undefined) {
                    walletPlugin = this.walletPlugins[uiLoginResponse.walletPluginIndex];
                }
                if (!walletPlugin) {
                    throw new Error('UserInterface did not return a valid WalletPlugin index.');
                }
                if (uiLoginResponse.chainId) {
                    if (!context.chains.some((c) => c.id.equals(uiLoginResponse.chainId))) {
                        throw new Error('UserInterface did not return a chain ID matching the subset of chains.');
                    }
                    context.chain = this.getChainDefinition(uiLoginResponse.chainId, context.chains);
                }
                if (uiLoginResponse.permissionLevel) {
                    context.permissionLevel = eosio.PermissionLevel.from(uiLoginResponse.permissionLevel);
                }
            }
            if (!walletPlugin) {
                throw new Error('No WalletPlugin available to perform the login.');
            }
            const { supportedChains } = walletPlugin.config;
            if (context.chain &&
                supportedChains &&
                supportedChains.length &&
                !supportedChains.includes(String(context.chain.id))) {
                throw new Error(`The wallet plugin '${walletPlugin.metadata.name}' does not support the chain '${context.chain.id}'`);
            }
            const response = yield walletPlugin.login(context);
            const session = new Session({
                chain: this.getChainDefinition(response.chain),
                permissionLevel: response.permissionLevel,
                walletPlugin,
            }, this.getSessionOptions(options));
            yield context.ui.onLoginComplete();
            this.persistSession(session);
            return {
                context,
                response,
                session,
            };
        });
    }
    logout(session) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!this.storage) {
                throw new Error('An instance of Storage must be provided to utilize the logout method.');
            }
            yield this.storage.remove('session');
            if (session) {
                const sessions = yield this.getSessions();
                if (sessions) {
                    const serialized = session.serialize();
                    const other = sessions.filter((s) => {
                        return (!eosio.Checksum256.from(s.chain).equals(eosio.Checksum256.from(serialized.chain)) ||
                            !eosio.Name.from(s.actor).equals(eosio.Name.from(serialized.actor)) ||
                            !eosio.Name.from(s.permission).equals(eosio.Name.from(serialized.permission)));
                    });
                    yield this.storage.write('sessions', JSON.stringify(other));
                }
            }
            else {
                yield this.storage.remove('sessions');
            }
        });
    }
    restore(args, options) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!args && this.storage) {
                const data = yield this.storage.read('session');
                if (data) {
                    args = JSON.parse(data);
                }
            }
            if (!args) {
                throw new Error('Either a RestoreArgs object or a Storage instance must be provided.');
            }
            const walletPlugin = this.walletPlugins.find((p) => {
                if (!args) {
                    return false;
                }
                return p.id === args.walletPlugin.id;
            });
            if (!walletPlugin) {
                throw new Error(`No WalletPlugin found with the ID of: '${args.walletPlugin.id}'`);
            }
            if (args.walletPlugin.data) {
                walletPlugin.data = args.walletPlugin.data;
            }
            const session = new Session({
                chain: this.getChainDefinition(args.chain),
                permissionLevel: eosio.PermissionLevel.from({
                    actor: args.actor,
                    permission: args.permission,
                }),
                walletPlugin,
            }, this.getSessionOptions(options));
            this.persistSession(session);
            return session;
        });
    }
    persistSession(session) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!this.storage) {
                return;
            }
            const serialized = session.serialize();
            this.storage.write('session', JSON.stringify(serialized));
            const existing = yield this.storage.read('sessions');
            if (existing) {
                const sessions = JSON.parse(existing);
                const other = sessions.filter((s) => {
                    return (!eosio.Checksum256.from(s.chain).equals(eosio.Checksum256.from(serialized.chain)) ||
                        !eosio.Name.from(s.actor).equals(eosio.Name.from(serialized.actor)) ||
                        !eosio.Name.from(s.permission).equals(eosio.Name.from(serialized.permission)));
                });
                const orderedSessions = [...other, serialized];
                this.storage.write('sessions', JSON.stringify(orderedSessions));
            }
            else {
                this.storage.write('sessions', JSON.stringify([serialized]));
            }
        });
    }
    getSessions() {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!this.storage) {
                throw new Error('No storage instance is available to retrieve sessions from.');
            }
            const data = yield this.storage.read('sessions');
            if (!data)
                return [];
            try {
                const parsed = JSON.parse(data);
                const filtered = parsed.filter((s) => this.walletPlugins.some((p) => {
                    return p.id === s.walletPlugin.id;
                }));
                return filtered;
            }
            catch (e) {
                throw new Error(`Failed to parse sessions from storage (${e})`);
            }
        });
    }
    getSessionOptions(options) {
        return {
            allowModify: this.allowModify,
            appName: this.appName,
            expireSeconds: this.expireSeconds,
            fetch: this.fetch,
            storage: this.storage,
            transactPlugins: (options === null || options === void 0 ? void 0 : options.transactPlugins) || this.transactPlugins,
            transactPluginsOptions: (options === null || options === void 0 ? void 0 : options.transactPluginsOptions) || this.transactPluginsOptions,
            ui: this.ui,
        };
    }
}

class AbstractUserInterface {
    translate(key, options, namespace) {
        throw new Error('The `translate` method must be implemented in this UserInterface. Called with: ' +
            JSON.stringify({
                key,
                options,
                namespace,
            }));
    }
    getTranslate(namespace) {
        return (key, options) => this.translate(key, options, namespace);
    }
    addTranslations(translations) {
        throw new Error('The `addTranslations` method must be implemented in this UserInterface. Called with: ' +
            JSON.stringify(translations));
    }
}

class AbstractWalletPlugin {
    constructor() {
        this._data = {};
        this.config = {
            requiresChainSelect: true,
            requiresPermissionSelect: false,
        };
        this.metadata = {};
    }
    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
    }
    serialize() {
        return {
            id: this.id,
            data: this.data,
        };
    }
}

exports.ABICache = ABICache;
exports.AbstractLoginPlugin = AbstractLoginPlugin;
exports.AbstractTransactPlugin = AbstractTransactPlugin;
exports.AbstractUserInterface = AbstractUserInterface;
exports.AbstractWalletPlugin = AbstractWalletPlugin;
exports.BaseLoginPlugin = BaseLoginPlugin;
exports.BaseTransactPlugin = BaseTransactPlugin;
exports.BrowserLocalStorage = BrowserLocalStorage;
exports.Canceled = Canceled;
exports.LoginContext = LoginContext;
exports.Session = Session;
exports.SessionKit = SessionKit;
exports.TransactContext = TransactContext;
exports.TransactRevisions = TransactRevisions;
exports.cancelable = cancelable;
exports.chainNames = chainNames;
exports["default"] = SessionKit;
Object.keys(eosio).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: function () { return eosio[k]; }
    });
});
Object.keys(eosioSigningRequest).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: function () { return eosioSigningRequest[k]; }
    });
});
//# sourceMappingURL=session.js.map
