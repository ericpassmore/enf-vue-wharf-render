import { APIClient, ABI, API, Name, Checksum256Type, Struct, Checksum256, PermissionLevelType, Signature, PermissionLevel, AnyTransaction, AnyAction, PublicKey, NameType } from '@greymass/eosio';
export * from '@greymass/eosio';
import { AbiProvider, SigningRequest, SigningRequestEncodingOptions, ResolvedSigningRequest, ResolvedTransaction } from 'eosio-signing-request';
export * from 'eosio-signing-request';

/**
 * Given an APIClient instance, this class provides an AbiProvider interface for retrieving and caching ABIs.
 */
declare class ABICache implements AbiProvider {
    readonly client: APIClient;
    readonly cache: Map<string, ABI>;
    readonly pending: Map<string, Promise<API.v1.GetAbiResponse>>;
    constructor(client: APIClient);
    getAbi(account: Name): Promise<ABI>;
}

type Fetch = (input: any, init?: any) => Promise<any>;
/**
 * A list of chain IDs and their names for display purposes.
 */
declare const chainNames: Map<Checksum256Type, string>;
declare class ExplorerDefinition extends Struct {
    prefix: string;
    suffix: string;
    url(id: string): string;
}
/**
 * The information required to interact with a given chain.
 */
declare class ChainDefinition extends Struct {
    id: Checksum256;
    url: string;
    explorer?: ExplorerDefinition;
    get name(): string | undefined;
}
type ChainDefinitionType = ChainDefinition | {
    id: Checksum256Type;
    url: string;
};
type LocaleDefinitions = Record<string, any>;
/**
 * Cancelable promises
 *
 * https://stackoverflow.com/questions/46461801/possible-to-add-a-cancel-method-to-promise-in-typescript/46464377#46464377
 */
declare class Canceled extends Error {
    silent: boolean;
    constructor(reason: any, silent?: boolean);
}
interface Cancelable<T> extends Promise<T> {
    cancel(reason?: string, silent?: boolean): Cancelable<T>;
}
declare function cancelable<T>(promise: Promise<T>, onCancel?: (canceled: Canceled) => void): Cancelable<T>;

/**
 * The arguments for a [[UserInterface.prompt]] call.
 */
interface PromptArgs {
    title: string;
    body?: string;
    elements: PromptElement[];
}
/**
 * The different types of elements that can be used in a [[PromptArgs]].
 */
interface PromptElement {
    type: 'accept' | 'asset' | 'close' | 'countdown' | 'link' | 'qr';
    label?: string;
    data?: unknown;
}
/**
 * The response for a [[UserInterface.prompt]] call.
 */
interface PromptResponse {
}
/**
 * The response for a login call of a [[UserInterface]].
 */
interface UserInterfaceLoginResponse {
    chainId?: Checksum256Type;
    permissionLevel?: PermissionLevelType;
    walletPluginIndex: number;
}
/**
 * The options to pass to [[UserInterface.translate]].
 */
interface UserInterfaceTranslateOptions {
    default: string;
    [key: string]: unknown;
}
/**
 * The translate function the UserInterface expects and uses.
 */
type UserInterfaceTranslateFunction = (key: string, options?: UserInterfaceTranslateOptions, namespace?: string) => string;
/**
 * Interface which all 3rd party user interface plugins must implement.
 */
interface UserInterface {
    /** Interact with the user to collect the data needed for a [[UserInterfaceLoginResponse]]. */
    login(context: LoginContext): Promise<UserInterfaceLoginResponse>;
    /** Inform the UI that an error has occurred */
    onError: (error: Error) => Promise<void>;
    /** Inform the UI that a login call has started **/
    onLogin: () => Promise<void>;
    /** Inform the UI that a login call has completed **/
    onLoginComplete: () => Promise<void>;
    /** Inform the UI that a transact call has started **/
    onTransact: () => Promise<void>;
    /** Inform the UI that a transact call has completed **/
    onTransactComplete: () => Promise<void>;
    /** Inform the UI that a transact call has started signing the transaction **/
    onSign: () => Promise<void>;
    /** Inform the UI that a transact call has completed signing the transaction **/
    onSignComplete: () => Promise<void>;
    /** Inform the UI that a transact call has started broadcasting the transaction **/
    onBroadcast: () => Promise<void>;
    /** Inform the UI that a transact call has completed broadcasting the transaction **/
    onBroadcastComplete: () => Promise<void>;
    /** Prompt the user with a custom UI element **/
    prompt: (args: PromptArgs) => Cancelable<PromptResponse>;
    /** Update the displayed modal status from a TransactPlugin **/
    status: (message: string) => void;
    /** Translate a string using the UI's language **/
    translate: UserInterfaceTranslateFunction;
    /** Returns a translator for a specific namespace */
    getTranslate: (namespace?: string) => UserInterfaceTranslateFunction;
    /** Programmatically add new localization strings to the  user interface */
    addTranslations: (translations: LocaleDefinitions) => void;
}
/**
 * Abstract class which all 3rd party [[UserInterface]] implementations may extend.
 */
declare abstract class AbstractUserInterface implements UserInterface {
    abstract login(context: LoginContext): Promise<UserInterfaceLoginResponse>;
    abstract onError(error: Error): Promise<void>;
    abstract onLogin(options?: LoginOptions): Promise<void>;
    abstract onLoginComplete(): Promise<void>;
    abstract onTransact(): Promise<void>;
    abstract onTransactComplete(): Promise<void>;
    abstract onSign(): Promise<void>;
    abstract onSignComplete(): Promise<void>;
    abstract onBroadcast(): Promise<void>;
    abstract onBroadcastComplete(): Promise<void>;
    abstract prompt(args: PromptArgs): Cancelable<PromptResponse>;
    abstract status(message: string): void;
    translate(key: string, options?: UserInterfaceTranslateOptions, namespace?: string): string;
    getTranslate(namespace?: string | undefined): UserInterfaceTranslateFunction;
    addTranslations(translations: LocaleDefinitions): void;
}

/**
 * Interface storage adapters should implement.
 *
 * Storage adapters are responsible for persisting [[Session]]s and can optionally be
 * passed to the [[SessionKit]] constructor to auto-persist sessions.
 */
interface SessionStorage {
    /** Write string to storage at key. Should overwrite existing values without error. */
    write(key: string, data: string): Promise<void>;
    /** Read key from storage. Should return `null` if key can not be found. */
    read(key: string): Promise<string | null>;
    /** Delete key from storage. Should not error if deleting non-existing key. */
    remove(key: string): Promise<void>;
}
declare class BrowserLocalStorage implements SessionStorage {
    readonly keyPrefix: string;
    constructor(keyPrefix: string);
    write(key: string, data: string): Promise<void>;
    read(key: string): Promise<string | null>;
    remove(key: string): Promise<void>;
    storageKey(key: string): string;
}

type TransactPluginsOptions = Record<string, unknown>;
declare enum TransactHookTypes {
    beforeSign = "beforeSign",
    afterSign = "afterSign",
    afterBroadcast = "afterBroadcast"
}
type TransactHook = (request: SigningRequest, context: TransactContext, result?: TransactResult) => Promise<TransactHookResponse | void>;
interface TransactHooks {
    afterSign: TransactHook[];
    beforeSign: TransactHook[];
    afterBroadcast: TransactHook[];
}
interface TransactHookResponse {
    request: SigningRequest;
    signatures?: Signature[];
}
type TransactHookResponseType = TransactHookResponse | void;
/**
 * Options for creating a new context for a [[Session.transact]] call.
 */
interface TransactContextOptions {
    abiProvider: AbiProvider;
    appName?: Name;
    chain: ChainDefinition;
    client: APIClient;
    createRequest: (args: TransactArgs) => Promise<SigningRequest>;
    fetch: Fetch;
    permissionLevel: PermissionLevel;
    storage?: SessionStorage;
    transactPlugins?: AbstractTransactPlugin[];
    transactPluginsOptions?: TransactPluginsOptions;
    ui?: UserInterface;
}
/**
 * Temporary context created for the duration of a [[Session.transact]] call.
 *
 * This context is used to store the state of the transact request and
 * provide a way for plugins to add hooks into the process.
 */
declare class TransactContext {
    readonly abiProvider: AbiProvider;
    readonly appName: Name | undefined;
    readonly chain: ChainDefinition;
    readonly client: APIClient;
    readonly createRequest: (args: TransactArgs) => Promise<SigningRequest>;
    readonly fetch: Fetch;
    readonly hooks: TransactHooks;
    readonly permissionLevel: PermissionLevel;
    readonly storage?: SessionStorage;
    readonly transactPluginsOptions: TransactPluginsOptions;
    readonly ui?: UserInterface;
    constructor(options: TransactContextOptions);
    get accountName(): Name;
    get permissionName(): Name;
    get esrOptions(): SigningRequestEncodingOptions;
    addHook(t: TransactHookTypes, hook: TransactHook): void;
    resolve(request: SigningRequest, expireSeconds?: number): Promise<ResolvedSigningRequest>;
}
/**
 * Payload accepted by the [[Session.transact]] method.
 * Note that one of `action`, `actions` or `transaction` must be set.
 */
interface TransactArgs {
    /** Full transaction to sign. */
    transaction?: AnyTransaction;
    /** Action to sign. */
    action?: AnyAction;
    /** Actions to sign. */
    actions?: AnyAction[];
    /** An ESR payload */
    request?: SigningRequest | string;
}
/**
 * Options for the [[Session.transact]] method.
 */
interface TransactOptions {
    /**
     * An optional AbiProvider to control how ABIs are loaded.
     */
    abiProvider?: AbiProvider;
    /**
     * Whether to allow the signer to make modifications to the request
     * (e.g. applying a cosigner action to pay for resources).
     *
     * Defaults to true if [[broadcast]] is true or unspecified; otherwise false.
     */
    allowModify?: boolean;
    /**
     * Whether to broadcast the transaction or just return the signature.
     * Defaults to true.
     */
    broadcast?: boolean;
    /**
     * Chain to use when configured with multiple chains.
     */
    chain?: Checksum256Type;
    /**
     * The number of seconds in the future this transaction will expire.
     */
    expireSeconds?: number;
    /**
     * Specific transact plugins to use for this transaction.
     */
    transactPlugins?: AbstractTransactPlugin[];
    /**
     * Optional parameters passed in to the various transact plugins.
     */
    transactPluginsOptions?: TransactPluginsOptions;
    /**
     * Optional parameter to control whether signatures returned from plugins are validated.
     */
    validatePluginSignatures?: boolean;
}
interface TransactRevision {
    /**
     * Whether or not the context allowed any modification to take effect.
     */
    allowModify: boolean;
    /**
     * The string representation of the code executed.
     */
    code: string;
    /**
     * If the request was modified by this code.
     */
    modified: boolean;
    /**
     * The response from the code that was executed.
     */
    response: {
        request: string;
        signatures: string[];
    };
}
declare class TransactRevisions {
    readonly revisions: TransactRevision[];
    constructor(request: SigningRequest);
    addRevision(response: TransactHookResponse, code: string, allowModify: boolean): void;
}
/**
 * The response from a [[Session.transact]] call.
 */
interface TransactResult {
    /** The chain that was used. */
    chain: ChainDefinition;
    /** The SigningRequest representation of the transaction. */
    request: SigningRequest;
    /** The ResolvedSigningRequest of the transaction */
    resolved: ResolvedSigningRequest | undefined;
    /** The response from the API after sending the transaction, only present if transaction was broadcast. */
    response?: {
        [key: string]: any;
    };
    /** An array containing revisions of the transaction as modified by plugins as ESR payloads */
    revisions: TransactRevisions;
    /** The transaction signatures. */
    signatures: Signature[];
    /** The signer authority. */
    signer: PermissionLevel;
    /** The resulting transaction. */
    transaction: ResolvedTransaction | undefined;
}
/**
 * Interface which a [[Session.transact]] plugin must implement.
 */
interface TransactPlugin {
    /** A URL friendly (lower case, no spaces, etc) ID for this plugin - Used in serialization */
    get id(): string;
    /** Any translations this plugin requires */
    translations?: LocaleDefinitions;
    /** A function that registers hooks into the transaction flow */
    register: (context: TransactContext) => void;
}
/**
 * Abstract class for [[Session.transact]] plugins to extend.
 */
declare abstract class AbstractTransactPlugin implements TransactPlugin {
    translations?: LocaleDefinitions;
    abstract register(context: TransactContext): void;
    abstract get id(): string;
}
declare class BaseTransactPlugin extends AbstractTransactPlugin {
    get id(): string;
    register(): void;
}

/**
 * The static configuration of a [[WalletPlugin]].
 */
interface WalletPluginConfig {
    /**
     * Indicates if the pp requires the user to manually select the blockchain to authorize against.
     */
    requiresChainSelect: boolean;
    /**
     * Indicates if the [[WalletPlugin]] requires the user to manually select a permission to use.
     */
    requiresPermissionSelect: boolean;
    /**
     * If set, indicates which blockchains are compatible with this [[WalletPlugin]].
     */
    supportedChains?: Checksum256Type[];
}
/**
 * The metadata of a [[WalletPlugin]] for display purposes.
 */
interface WalletPluginMetadata {
    /**
     * A display name for the wallet that is presented to users.
     */
    name?: string;
    /**
     * A wallet description to further identify the wallet for users.
     */
    description?: string;
    /**
     * Wallet branding
     */
    logo?: string;
    /**
     * Link to the homepage for the wallet
     */
    homepage?: string;
    /**
     * Link to the download page for the wallet
     */
    download?: string;
    /**
     * The public key being used by the wallet plugin
     */
    publicKey?: PublicKey;
}
/**
 * The response for a login call of a [[WalletPlugin]].
 */
interface WalletPluginLoginResponse {
    chain: Checksum256;
    permissionLevel: PermissionLevel;
}
/**
 * The response for a sign call of a [[WalletPlugin]].
 */
interface WalletPluginSignResponse {
    request?: SigningRequest;
    signatures: Signature[];
}
/**
 * Persistent storage format for wallet specified data.
 */
type WalletPluginData = Record<string, any>;
/**
 * The serialized form of a [[WalletPlugin]] instance.
 */
interface SerializedWalletPlugin {
    id: string;
    data: WalletPluginData;
}
/**
 * Interface which all 3rd party wallet plugins must implement.
 */
interface WalletPlugin {
    /** A URL friendly (lower case, no spaces, etc) ID for this plugin - Used in serialization */
    get id(): string;
    /** A method to return the data that needs to persist for the plguin - Used in serialization */
    get data(): WalletPluginData;
    set data(data: WalletPluginData);
    /** The [[SessionKit]] configuration parameters for this [[WalletPlugin]]. */
    config: WalletPluginConfig;
    /** The metadata for the [[WalletPlugin]] itself. */
    metadata: WalletPluginMetadata;
    /** Any translations this plugin requires */
    translations?: LocaleDefinitions;
    /**
     * Request the [[WalletPlugin]] to log in a user and return a [[WalletPluginLoginResponse]].
     *
     * @param context The [[LoginContext]] for the [[WalletPlugin]] to use.
     */
    login(context: LoginContext): Promise<WalletPluginLoginResponse>;
    /**
     * Requests the [[WalletPlugin]] to sign a transaction and return a [[WalletPluginSignResponse]]]
     *
     * @param transaction The transaction to sign.
     * @param context The [[TransactContext]] for the [[WalletPlugin]] to use.
     */
    sign(transaction: ResolvedSigningRequest, context: TransactContext): Promise<WalletPluginSignResponse>;
    /**
     * Serialize the [[WalletPlugin]] ID and data into a plain object.
     */
    serialize(): WalletPluginData;
}
/**
 * Abstract class which all 3rd party [[WalletPlugin]] implementations may extend.
 */
declare abstract class AbstractWalletPlugin implements WalletPlugin {
    _data: WalletPluginData;
    config: WalletPluginConfig;
    metadata: WalletPluginMetadata;
    translations?: LocaleDefinitions;
    abstract get id(): string;
    abstract login(context: LoginContext): Promise<WalletPluginLoginResponse>;
    abstract sign(transaction: ResolvedSigningRequest, context: TransactContext): Promise<WalletPluginSignResponse>;
    get data(): WalletPluginData;
    set data(data: WalletPluginData);
    serialize(): SerializedWalletPlugin;
}

declare enum LoginHookTypes {
    beforeLogin = "beforeLogin",
    afterLogin = "afterLogin"
}
type LoginHook = (context: LoginContext) => Promise<void>;
interface LoginHooks {
    afterLogin: LoginHook[];
    beforeLogin: LoginHook[];
}
/**
 * Options for creating a new context for a [[Kit.login]] call.
 */
interface LoginContextOptions {
    appName?: Name;
    chain?: ChainDefinition;
    chains?: ChainDefinition[];
    fetch: Fetch;
    loginPlugins?: AbstractLoginPlugin[];
    permissionLevel?: PermissionLevel;
    walletPlugins?: UserInterfaceWalletPlugin[];
    ui: UserInterface;
}
interface UserInterfaceRequirements {
    requiresChainSelect: boolean;
    requiresPermissionSelect: boolean;
    requiresWalletSelect: boolean;
}
interface UserInterfaceWalletPlugin {
    config: WalletPluginConfig;
    metadata: WalletPluginMetadata;
}
/**
 * Temporary context created for the duration of a [[Kit.login]] call.
 *
 * This context is used to store the state of the login request and
 * provide a way for plugins to add hooks into the process.
 */
declare class LoginContext {
    appName: Name | undefined;
    chain?: ChainDefinition;
    chains: ChainDefinition[];
    fetch: Fetch;
    hooks: LoginHooks;
    permissionLevel?: PermissionLevel;
    ui: UserInterface;
    uiRequirements: UserInterfaceRequirements;
    walletPlugins: UserInterfaceWalletPlugin[];
    constructor(options: LoginContextOptions);
    addHook(t: LoginHookTypes, hook: LoginHook): void;
    getClient(chain: ChainDefinition): APIClient;
    get esrOptions(): SigningRequestEncodingOptions;
}
/**
 * Payload accepted by the [[Kit.login]] method.
 */
interface LoginPlugin {
    register: (context: LoginContext) => void;
}
/**
 * Abstract class for [[Kit.login]] plugins to extend.
 */
declare abstract class AbstractLoginPlugin implements LoginPlugin {
    abstract register(context: LoginContext): void;
}
declare class BaseLoginPlugin extends AbstractLoginPlugin {
    register(): void;
}

/**
 * Arguments required to create a new [[Session]].
 */
interface SessionArgs {
    actor?: NameType;
    chain: ChainDefinitionType;
    permission?: NameType;
    permissionLevel?: PermissionLevelType | string;
    walletPlugin: WalletPlugin;
}
/**
 * Options for creating a new [[Session]].
 */
interface SessionOptions {
    abiProvider?: AbiProvider;
    allowModify?: boolean;
    appName?: NameType;
    broadcast?: boolean;
    expireSeconds?: number;
    fetch?: Fetch;
    storage?: SessionStorage;
    transactPlugins?: AbstractTransactPlugin[];
    transactPluginsOptions?: TransactPluginsOptions;
    ui?: UserInterface;
}
interface SerializedSession {
    actor: string;
    chain: string;
    permission: string;
    walletPlugin: SerializedWalletPlugin;
}
/**
 * A representation of a session to interact with a specific blockchain account.
 */
declare class Session {
    readonly appName: Name | undefined;
    readonly abiProvider: AbiProvider;
    readonly allowModify: boolean;
    readonly broadcast: boolean;
    readonly chain: ChainDefinition;
    readonly expireSeconds: number;
    readonly fetch: Fetch;
    readonly permissionLevel: PermissionLevel;
    readonly storage?: SessionStorage;
    readonly transactPlugins: TransactPlugin[];
    readonly transactPluginsOptions: TransactPluginsOptions;
    readonly ui?: UserInterface;
    readonly walletPlugin: WalletPlugin;
    /**
     * The constructor of the `Session` class.
     *
     * @param options SessionOptions
     */
    constructor(args: SessionArgs, options?: SessionOptions);
    /**
     * Returns the name of the actor that is being used for this session.
     */
    get actor(): Name;
    /**
     * Returns the name of the permission that is being used for this session.
     */
    get permission(): Name;
    /**
     * Returns an APIClient configured for this session.
     */
    get client(): APIClient;
    /**
     * Templates in any missing fields from partial transactions.
     *
     * @param args TransactArgs
     * @returns TransactArgs
     */
    upgradeTransaction(args: TransactArgs): TransactArgs;
    /**
     * Lifted from @greymass/eosio-signing-request.
     *
     * Copy of: https://github.com/greymass/eosio-signing-request/blob/6fc84b2355577d6461676bff417c76e4f6f2f5c3/src/signing-request.ts#L305
     *
     * TODO: Remove. This will no longer be needed once the `clone` functionality in ESR is updated
     */
    private storageType;
    /**
     * Create a clone of the given SigningRequest
     *
     * Overrides: https://github.com/greymass/eosio-signing-request/blob/6fc84b2355577d6461676bff417c76e4f6f2f5c3/src/signing-request.ts#L1112
     *
     * @param {SigningRequest} request The SigningRequest to clone
     * @param {AbiProvider} abiProvider The AbiProvider to use for the clone
     * @returns Returns a cloned SigningRequest with updated abiProvider and zlib
     */
    cloneRequest(request: SigningRequest, abiProvider: AbiProvider): SigningRequest;
    /**
     * Convert any provided form of TransactArgs to a SigningRequest
     *
     * @param {TransactArgs} args
     * @param {AbiProvider} abiProvider
     * @returns Returns a SigningRequest
     */
    createRequest(args: TransactArgs, abiProvider: AbiProvider): Promise<SigningRequest>;
    /**
     * Update a SigningRequest, ensuring its old metadata is retained.
     *
     * @param {SigningRequest} previous
     * @param {SigningRequest} modified
     * @param abiProvider
     * @returns
     */
    updateRequest(previous: SigningRequest, modified: SigningRequest, abiProvider: AbiProvider): Promise<SigningRequest>;
    /**
     * Perform a transaction using this session.
     *
     * @param {TransactArgs} args
     * @param {TransactOptions} options
     * @returns {TransactResult} The status and data gathered during the operation.
     * @mermaid - Transaction sequence diagram
     * flowchart LR
     *   A((Transact)) --> B{{"Hook(s): beforeSign"}}
     *   B --> C[Wallet Plugin]
     *   C --> D{{"Hook(s): afterSign"}}
     *   D --> E[Broadcast Plugin]
     *   E --> F{{"Hook(s): afterBroadcast"}}
     *   F --> G[TransactResult]
     */
    transact(args: TransactArgs, options?: TransactOptions): Promise<TransactResult>;
    serialize: () => SerializedSession;
    getPluginTranslations(transactPlugin: TransactPlugin | WalletPlugin): LocaleDefinitions;
}

interface LoginOptions {
    chain?: Checksum256Type;
    chains?: Checksum256Type[];
    loginPlugins?: LoginPlugin[];
    transactPlugins?: TransactPlugin[];
    transactPluginsOptions?: TransactPluginsOptions;
    permissionLevel?: PermissionLevelType | string;
    walletPlugin?: string;
}
interface LoginResult {
    context: LoginContext;
    response: WalletPluginLoginResponse;
    session: Session;
}
interface RestoreArgs {
    chain: Checksum256Type;
    actor: NameType;
    permission: NameType;
    walletPlugin: Record<string, any>;
}
interface SessionKitOptions {
    allowModify?: boolean;
    appName: NameType;
    chains: ChainDefinitionType[];
    expireSeconds?: number;
    fetch?: Fetch;
    loginPlugins?: LoginPlugin[];
    storage: SessionStorage;
    transactPlugins?: TransactPlugin[];
    transactPluginsOptions?: TransactPluginsOptions;
    ui?: UserInterface;
    walletPlugins: WalletPlugin[];
}
/**
 * Request a session from an account.
 */
declare class SessionKit {
    readonly allowModify: boolean;
    readonly appName: Name;
    readonly chains: ChainDefinition[];
    readonly expireSeconds: number;
    readonly fetch: Fetch;
    readonly loginPlugins: AbstractLoginPlugin[];
    readonly storage: SessionStorage;
    readonly transactPlugins: AbstractTransactPlugin[];
    readonly transactPluginsOptions: TransactPluginsOptions;
    readonly ui?: UserInterface;
    readonly walletPlugins: WalletPlugin[];
    constructor(options: SessionKitOptions);
    getChainDefinition(id: Checksum256Type, override?: ChainDefinition[]): ChainDefinition;
    /**
     * Request a session from an account.
     *
     * @mermaid - Login sequence diagram
     * flowchart LR
     *   A((Login)) --> B{{"Hook(s): beforeLogin"}}
     *   B --> C[Wallet Plugin]
     *   C --> D{{"Hook(s): afterLogin"}}
     *   D --> E[Session]
     */
    login(options?: LoginOptions): Promise<LoginResult>;
    logout(session?: Session): Promise<void>;
    restore(args?: RestoreArgs, options?: LoginOptions): Promise<Session>;
    persistSession(session: Session): Promise<void>;
    getSessions(): Promise<SerializedSession[]>;
    getSessionOptions(options?: LoginOptions): {
        allowModify: boolean;
        appName: Name;
        expireSeconds: number;
        fetch: Fetch;
        storage: SessionStorage;
        transactPlugins: AbstractTransactPlugin[];
        transactPluginsOptions: TransactPluginsOptions;
        ui: UserInterface | undefined;
    };
}

export { ABICache, AbstractLoginPlugin, AbstractTransactPlugin, AbstractUserInterface, AbstractWalletPlugin, BaseLoginPlugin, BaseTransactPlugin, BrowserLocalStorage, Cancelable, Canceled, ChainDefinition, ChainDefinitionType, ExplorerDefinition, Fetch, LocaleDefinitions, LoginContext, LoginContextOptions, LoginHook, LoginHookTypes, LoginHooks, LoginOptions, LoginPlugin, LoginResult, PromptArgs, PromptElement, PromptResponse, RestoreArgs, SerializedSession, SerializedWalletPlugin, Session, SessionArgs, SessionKit, SessionKitOptions, SessionOptions, SessionStorage, TransactArgs, TransactContext, TransactContextOptions, TransactHook, TransactHookResponse, TransactHookResponseType, TransactHookTypes, TransactHooks, TransactOptions, TransactPlugin, TransactPluginsOptions, TransactResult, TransactRevision, TransactRevisions, UserInterface, UserInterfaceLoginResponse, UserInterfaceRequirements, UserInterfaceTranslateFunction, UserInterfaceTranslateOptions, UserInterfaceWalletPlugin, WalletPlugin, WalletPluginConfig, WalletPluginData, WalletPluginLoginResponse, WalletPluginMetadata, WalletPluginSignResponse, cancelable, chainNames, SessionKit as default };
