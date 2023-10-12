/// <reference types="node" />

import EventEmitter from 'events';
import { FSWatcher } from 'chokidar';
import type { Logger } from 'vite';
import { Plugin as Plugin_2 } from 'vite';
import { RawData } from 'ws';
import type { ResolvedConfig as ResolvedConfig_2 } from 'vite';
import { SourceMap } from 'rollup';
import { TransformResult } from 'vite';
import { UserConfig } from 'vite';
import { ViteDevServer } from 'vite';
import { WatchOptions } from 'chokidar';
import { WebSocket as WebSocket_2 } from 'ws';
import { WebSocketServer } from 'ws';
import { z } from 'zod';

export declare interface CalculateRamParams {
    filename: string;
    server: string;
}

export declare const calculateRamResponseSchema: z.ZodNumber;

export declare function createLogger(): {
    base: Logger;
    info: (...msg: string[]) => void;
    warn: (...msg: string[]) => void;
    error: (...msg: string[]) => void;
};

export declare const defaultDownloadLocation: (file: string) => string;

export declare const defaultDts = "NetscriptDefinitions.d.ts";

export declare const defaultUploadLocation: (file: string) => string;

/** TypeScript helper to define your config */
export declare function defineConfig(config: ViteBurnerUserConfig): UserConfig;

export declare interface DeleteFileParams {
    filename: string;
    server: string;
}

export declare const deleteFileResponseSchema: z.ZodLiteral<"OK">;

export declare function displayKeyHelpHint(): void;

export declare function displayWatchAndHelp(): void;

export declare const externalRE: RegExp;

export declare interface FileContent {
    filename: string;
    content: string;
}

/**
 * Converts absolute path to relative path by the watch options.
 * Vite resolves import path to absolute path to source file.
 * We need to convert it back to relative so the bitburner will like it.
 *
 * Vite add a trailing slash to the path, we need to remove it before converting.
 * We also need to returns a sourcemap.
 */
export declare function fixImportPath(options: FixImportPathOptions): string;

export declare interface FixImportPathOptions {
    filename: string;
    content: string;
    server: string;
    manager: WatchManager;
}

/** Enforce starting slash if file is not in root dir */
export declare const fixStartingSlash: (s: string) => string;

declare type Fn = (...args: any[]) => any;

/** Enforce starting slash */
export declare const forceStartingSlash: (s: string) => string;

export declare const formatDownload: (from: string, to: string, serverName: string) => {
    styled: string;
    raw: string;
};

export declare function formatError(msg: string): string;

export declare function formatNormal(first?: string, second?: string, third?: string): string;

export declare const formatUpload: (from: string, to: string, serverName: string) => {
    styled: string;
    raw: string;
};

export declare function formatWarn(msg: string): string;

export declare type Functionable<T> = T | (() => T);

export declare interface GetAllFilesParams {
    server: string;
}

export declare const getAllFilesResponseSchema: z.ZodArray<z.ZodObject<{
    filename: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    filename: string;
    content: string;
}, {
    filename: string;
    content: string;
}>, "many">;

export declare function getDefaultConfig(): UserConfig;

export declare const getDefinitionFileResponseSchema: z.ZodString;

export declare interface GetFileNamesParams {
    server: string;
}

export declare const getFileNamesResponseSchema: z.ZodArray<z.ZodString, "many">;

export declare interface GetFileParams {
    filename: string;
    server: string;
}

export declare const getFileResponseSchema: z.ZodString;

export declare function getSourceMapString(map?: SourceMap | null): string;

export declare function getWss(port: number): WebSocketServer;

export declare function handleKeyInput(wsAdapter: WsAdapter): KeypressHandler;

export declare interface HmrData extends WatchItem {
    file: string;
    event: string;
    initial: boolean;
    timestamp: number;
}

export declare const hmrPluginName = "viteburner:hmr";

export declare const isExternalUrl: (url: string) => boolean;

export declare function isScriptFile(filename: string): boolean;

export declare function isWssReused(): boolean;

export declare interface KeyHandlerContext {
    str: string;
    key: KeyInfo;
    on(): void;
    off(): void;
}

export declare interface KeyInfo {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}

export declare type KeypressHandler = (ctx: KeyHandlerContext) => void | Promise<void>;

export declare interface KeypressHandlerControl {
    on(): void;
    off(): void;
    running: () => boolean;
}

export declare function loadConfig(inlineConfig: ViteBurnerInlineConfig): Promise<ResolvedViteBurnerConfig>;

export declare const logger: {
    base: Logger;
    info: (...msg: string[]) => void;
    warn: (...msg: string[]) => void;
    error: (...msg: string[]) => void;
};

export declare function main(): Promise<void>;

export declare interface MessageSchema<P = undefined, R extends z.ZodTypeAny = z.ZodTypeAny> {
    method: string;
    params?: P;
    validator?: R;
}

export declare function onKeypress(handler: KeypressHandler): KeypressHandlerControl;

/**
 * polling options, see chokidar
 */
export declare interface PollingOptions {
    /**
     * Interval of file system polling in milliseconds.
     * @default 100
     */
    interval?: number;
    /**
     * Interval of file system polling for binary files.
     * @default 300
     */
    binaryInterval?: number;
}

export declare const prefix = "[viteburner]";

export declare type Promisable<T> = T | Promise<T>;

declare type Promisable_2<T> = T | Promise<T>;

export declare interface PromiseHolder<T = any> {
    resolve: (value?: T) => void;
    reject: (reason?: unknown) => void;
}

export declare interface PushFileParams {
    filename: string;
    content: string;
    server: string;
}

export declare const pushFileResponseSchema: z.ZodLiteral<"OK">;

/** Remove starting slash on download */
export declare const removeStartingSlash: (s: string) => string;

export declare type RenameOutput = string | RenameOutputObject | Array<string | RenameOutputObject> | null | undefined;

/**
 * Destinations for the transformed files.
 */
export declare type RenameOutputObject = {
    /**
     * The destination path with no starting slash.
     * If not provided, the starting `src/` will be removed and `.ts` will be replaced with `.js`.
     */
    filename?: string;
    /**
     * The destination server.
     * @default 'home'
     */
    server?: string;
};

export declare function resolveConfig(config: ViteBurnerConfig): ResolvedViteBurnerConfig;

export declare type ResolvedConfig = Readonly<Omit<ResolvedConfig_2, 'viteburner'> & {
    viteburner: ResolvedViteBurnerConfig;
}>;

export declare type ResolvedData = ResolvedDataItem[];

export declare interface ResolvedDataItem {
    filename: string;
    server: string;
}

export declare function resolveDts(dts: ViteBurnerConfig['dts']): string | undefined;

export declare function resolveDumpFile(dumpFiles: ViteBurnerConfig['dumpFiles']): ((file: string, server: string) => string | null | undefined) | undefined;

export declare interface ResolvedViteBurnerConfig {
    watch: ResolvedWatchItem[];
    usePolling: boolean;
    pollingOptions: PollingOptions;
    sourcemap: boolean | 'inline' | 'hidden';
    port: number;
    timeout: number;
    dts?: string;
    ignoreInitial: boolean;
    download: {
        server: string[];
        location: (file: string, server: string) => string | null | undefined;
        ignoreTs: boolean;
        ignoreSourcemap: boolean;
    };
    dumpFiles?: (file: string, server: string) => string | null | undefined;
    cwd: string;
}

export declare interface ResolvedWatchItem {
    pattern: string;
    transform: boolean;
    location: (file: string) => {
        filename: string;
        server: string;
    }[];
}

export declare function resolvePolling(usePolling: ViteBurnerConfig['usePolling']): {
    usePolling: boolean;
    pollingOptions: PollingOptions;
};

export declare function resolveWatchLocation(location: WatchItem['location']): (filename: string) => {
    filename: string;
    server: string;
}[];

export declare function setHandler(value?: KeypressHandler): void;

export declare function startDev(options: any): Promise<void>;

export declare const virtualModuleId = "virtual:viteburner-entry";

/**
 * User config defined in `viteburner.config`.
 */
export declare interface ViteBurnerConfig {
    /**
     * watch options
     */
    watch?: WatchItem[];
    /**
     * polling options, see chokidar
     */
    usePolling?: boolean | PollingOptions;
    /**
     * If set to `inline`, sourcemap will be embedded into transformed js files.
     * If not set, use `build.sourcemap` from `vite` config.
     */
    sourcemap?: boolean | 'inline' | 'hidden';
    /**
     * The port that WebSocket server listens to.
     * @default 12525
     */
    port?: number;
    /**
     * The timeout for WebSocket server in ms.
     * @default 10000
     */
    timeout?: number;
    /**
     * The path to the file that contains bitburner type definitions.
     * Set to `true` to use the default filename.
     * Set to `false` to disable syncing type definitions from bitburner server.
     * @default 'NetscriptDefinitions.d.ts'
     */
    dts?: string | boolean;
    /**
     * Set to `true` to disable initial sync action on startup.
     * @default false
     */
    ignoreInitial?: boolean;
    /**
     * Manual download configs.
     */
    download?: {
        /**
         * servers to download from.
         * @default "home"
         */
        server?: string | string[];
        /**
         * Rewrite the path of the downloaded file.
         * The `file` param contains no starting slash.
         * Return `null` or `undefined` to skip downloading the file.
         * @default (file) => 'src/' + file;
         */
        location?: (file: string, server: string) => string | null | undefined;
        /**
         * If set to `true`, check if the destination contains a `.ts` file with the same basename.
         * If so, skip downloading the file.
         *
         * For example. If the destination contains a file named `template.ts`,
         * the file `template.js` will not be downloaded.
         *
         * @default true
         */
        ignoreTs?: boolean;
        /**
         * If set to `true`, skip downloading files that have a tailing inline sourcemap.
         * @default true
         */
        ignoreSourcemap?: boolean;
    };
    /**
     * Dump destination of `*.js` files transformed by `vite`.
     * Set to `null` or `undefined` to disable dumping.
     * Set to a string to dump to a specific directory.
     * Set to a function that dynamically decides the destination filepath.
     * If the function returns `null` or `undefined`, the file will not be dumped.
     * @default undefined
     */
    dumpFiles?: string | null | undefined | ((file: string, server: string) => string | null | undefined);
    /** current working dir */
    cwd?: string;
}

export declare type ViteBurnerInlineConfig = Pick<ViteBurnerConfig, 'port' | 'cwd'>;

export declare function viteburnerPlugin(inlineConfig: ViteBurnerInlineConfig): Plugin_2;

export declare interface ViteBurnerServer extends Omit<ViteDevServer, 'config'> {
    config: ResolvedConfig;
    pathToId(file: string): string;
    invalidateFile(file: string): Promise<void>;
    fetchModule(file: string): Promise<TransformResult | null>;
    onHmrMessage(handler: (data: HmrData, server: ViteBurnerServer) => void): void;
    buildStart(): Promise<void>;
}

export declare interface ViteBurnerUserConfig extends UserConfig {
    /** viteburner related configs */
    viteburner?: ViteBurnerConfig;
}

export declare type ViteBurnerUserConfigInput = Functionable<Promisable<UserConfig>>;

export declare interface WatchItem {
    /**
     * Glob pattern to match.
     * See {@link https://github.com/micromatch/micromatch micromatch} for more details.
     */
    pattern: string;
    /**
     * Set to `true` to use `vite`'s plugins to transform the file.
     */
    transform?: boolean;
    /**
     * Set to a string to specify the server of output file.
     * Set to a {@link RenameOutputObject} to specify the output filename and server.
     * Set to a function to specify dynamically, the `file` param has no starting slash.
     * Set to or returns an array to specify multiple outputs.
     */
    location?: RenameOutput | ((file: string) => RenameOutput);
}

export declare class WatchManager {
    items: ResolvedWatchItem[];
    options: WatchOptions;
    watcher?: FSWatcher;
    initial: boolean;
    enabled: boolean;
    enabledTimeStamp: number;
    emitter: EventEmitter;
    constructor(items: ResolvedWatchItem[], options?: WatchOptions);
    get patterns(): string[];
    findItem(file: string): ResolvedWatchItem | undefined;
    init(): void;
    triggerHmr(file: string, event: string): void;
    setEnabled(value: boolean): void;
    fullReload(): Promise<void>;
    /** Get all possible filenames to upload */
    getUploadFilenames(filename: string): {
        filename: string;
        server: string;
    }[];
    /** Shoutcut of `getUploadFilenames(filename).find(server) */
    getUploadFilenamesByServer(filename: string, server: string): string | undefined;
    close(): void;
}

export declare function writeFile(file: string, content: string): Promise<void>;

export declare class WsAdapter {
    buffers: Map<string, HmrData>;
    manager: WsManager;
    server: ViteBurnerServer;
    constructor(manager: WsManager, server: ViteBurnerServer);
    getDts(): Promise<void>;
    checkDependencies(data: HmrData[]): Promise<HmrData[]>;
    handleHmrMessage(data?: HmrData | HmrData[]): Promise<void>;
    deleteCache(data: HmrData): void;
    dumpFile(data: HmrData, content: string, server: string): Promise<void>;
    fetchModule(data: HmrData): Promise<string>;
    fixImport(content: string, data: HmrData, serverName: string): string;
    uploadFile(data: HmrData): Promise<void>;
    fullDownload(): Promise<void>;
    getRamUsage(pattern?: string): Promise<void>;
    getRamUsageLocalData(file: string): {
        filename: string;
        server: string;
    }[];
    getRamUsageLocalRaw(file: string, resolvedData: ResolvedData): Promise<boolean>;
    getRamUsageLocal(file: string): Promise<boolean>;
    getRamUsageRemote(server: string, filename: string): Promise<void>;
    getFileNames(server: string): Promise<string[] | null>;
}

export declare class WsManager {
    options: Required<WsManagerOptions>;
    ws: WebSocket_2 | undefined;
    wss: WebSocketServer;
    trackers: PromiseHolder[];
    nextId: number;
    unregisters: Fn[];
    constructor(options: WsManagerOptions);
    get connected(): boolean;
    _registerHandler(): void;
    onConnected(cb: (ws: WebSocket_2) => Promisable_2<Fn | void>): void;
    checkIfWssReused(): void;
    handleMessage(response: RawData): void;
    sendMessage<P = undefined, R extends z.ZodTypeAny = z.ZodTypeAny>(options: MessageSchema<P, R>): Promise<z.TypeOf<R>>;
    pushFile(params: PushFileParams): Promise<"OK">;
    getFile(params: GetFileParams): Promise<string>;
    deleteFile(params: DeleteFileParams): Promise<"OK">;
    getFileNames(params: GetFileNamesParams): Promise<string[]>;
    getAllFiles(params: GetAllFilesParams): Promise<{
        filename: string;
        content: string;
    }[]>;
    calculateRam(params: CalculateRamParams): Promise<number>;
    getDefinitionFile(): Promise<string>;
    close(): void;
}

export declare interface WsManagerOptions {
    port: number;
    timeout?: number;
}

export declare interface WsRequest<P = any> extends WsRequestNoParam {
    params: P;
}

export declare interface WsRequestNoParam {
    jsonrpc: '2.0';
    id: number;
    method: string;
}

export declare interface WsResponse<R = any> {
    jsonrpc: '2.0';
    id: number;
    result: R;
    error: any;
}

export declare const wsResponseSchema: z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
    id: z.ZodNumber;
    result: z.ZodAny;
    error: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    jsonrpc: "2.0";
    id: number;
    result?: any;
    error?: any;
}, {
    jsonrpc: "2.0";
    id: number;
    result?: any;
    error?: any;
}>;

export { }
