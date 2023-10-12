var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import cac from "cac";
import pc from "picocolors";
import readline from "readline";
import { createLogger as createLogger$1, createFilter, createServer } from "vite";
import MagicString from "magic-string";
import fs$j from "fs";
import require$$0 from "constants";
import require$$0$1 from "stream";
import require$$4 from "util";
import require$$0$2 from "assert";
import require$$1, { resolve, relative } from "path";
import { parse as parse$2, Parser } from "acorn";
import fs$k from "node:fs";
import path$d from "node:path";
import { createRequire } from "node:module";
import { loadConfig as loadConfig$1 } from "unconfig";
import "node:url";
import { resolve as resolve$1 } from "pathe";
import fg from "fast-glob";
import { isMatch, match } from "micromatch";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import chokidar from "chokidar";
import EventEmitter from "events";
import prompt from "prompts";
const prefix = "[viteburner]";
function formatNormal(first = "", second = "", third = "") {
  const parts = [];
  first && parts.push(pc.green(first));
  second && parts.push(pc.dim(second));
  third && parts.push(third);
  return parts.join(" ");
}
function formatWarn(msg) {
  return pc.yellow(`${msg}`);
}
function formatError(msg) {
  return pc.red(`${msg}`);
}
function createLogger() {
  const logger2 = {
    base: createLogger$1("info", { prefix, allowClearScreen: false }),
    info: (...msg) => logger2.base.info(formatNormal(...msg), { timestamp: true, clear: false }),
    warn: (...msg) => logger2.base.warn(formatWarn(msg.join(" ")), { timestamp: true, clear: false }),
    error: (...msg) => logger2.base.error(formatError(msg.join(" ")), { timestamp: true, clear: false })
  };
  return logger2;
}
const logger = createLogger();
function onKeypress(handler2) {
  if (!process.stdin.isTTY) {
    logger.warn("current stdin is not a TTY. Keypress events may not work.");
  }
  let running = false;
  async function callback(str, key) {
    if (str === "" || str === "\x1B" || key && key.ctrl && key.name === "c") {
      logger.info("sigterm");
      process.exit(1);
    }
    if (running) {
      return;
    }
    running = true;
    await handler2({ str, key, on, off });
    running = false;
  }
  let rl;
  function on() {
    off();
    rl = readline.createInterface({ input: process.stdin });
    readline.emitKeypressEvents(process.stdin, rl);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.on("keypress", callback);
  }
  function off() {
    rl == null ? void 0 : rl.close();
    rl = void 0;
    process.stdin.off("keypress", callback);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }
  on();
  return {
    on,
    off,
    running: () => running
  };
}
let handler;
function setHandler(value) {
  handler = value;
}
onKeypress((ctx) => {
  handler == null ? void 0 : handler(ctx);
});
const name = "viteburner";
const version = "0.5.3";
const description = "Daemon tools of bitburner using vite for script transform, file syncing, RAM monitoring and more!";
const bin = {
  viteburner: "bin/viteburner.js"
};
const main$1 = "./dist/entry.js";
const module = "./dist/entry.mjs";
const exports = {
  ".": {
    require: "./dist/index.js",
    "import": "./dist/index.mjs"
  }
};
const typings = "dist/typings/index.d.ts";
const scripts = {
  build: "vite build && copyfiles --flat node_modules/@vitejs/plugin-react/dist/refreshUtils.js dist",
  test: "npm run lint && npm run test:spec",
  "test:spec": "vitest run",
  "test:playground": "vite-node ./src/entry.ts -- --cwd ./playground",
  postversion: "npm run build",
  lint: "npm run lint:ts && npm run lint:eslint && npm run lint:prettier",
  "lint:ts": "tsc --noEmit",
  "lint:eslint": "eslint --ext .ts,.tsx,.js,.jsx .",
  "lint:prettier": 'prettier --check "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,json}"',
  format: 'prettier --write "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,json}"'
};
const repository = {
  type: "git",
  url: "git+https://github.com/Tanimodori/viteburner.git"
};
const keywords = [
  "bitburner",
  "vite"
];
const author = "Tanimodori";
const license = "MIT";
const bugs = {
  url: "https://github.com/Tanimodori/viteburner/issues"
};
const homepage = "https://github.com/Tanimodori/viteburner#readme";
const devDependencies = {
  "@babel/core": "^7.23.2",
  "@babel/preset-typescript": "^7.23.2",
  "@types/estree": "^1.0.0",
  "@types/micromatch": "^4.0.2",
  "@types/node": "^18.14.1",
  "@types/prompts": "^2.4.2",
  "@types/ws": "^8.5.4",
  "@typescript-eslint/eslint-plugin": "^5.53.0",
  "@typescript-eslint/parser": "^5.53.0",
  copyfiles: "^2.4.1",
  eslint: "^8.34.0",
  "eslint-config-prettier": "^8.6.0",
  "eslint-plugin-prettier": "^4.2.1",
  prettier: "^2.8.4",
  typescript: "^4.9.5",
  vite: "^4.1.4",
  "vite-node": "^0.28.5",
  "vite-plugin-dts": "^2.0.2",
  vitest: "^0.27.0"
};
const dependencies = {
  "@vitejs/plugin-react": "^4.1.0",
  acorn: "^8.8.2",
  cac: "^6.7.14",
  chokidar: "^3.5.3",
  "fast-glob": "^3.2.12",
  "magic-string": "^0.30.0",
  micromatch: "^4.0.5",
  pathe: "^1.1.0",
  picocolors: "^1.0.0",
  prompts: "^2.4.2",
  unconfig: "^0.3.7",
  "vite-plugin-externals": "^0.6.2",
  ws: "^8.12.1",
  zod: "^3.20.6"
};
const peerDependencies = {
  vite: "^3.0.0 || ^4.0.0"
};
const pkg = {
  name,
  version,
  description,
  bin,
  main: main$1,
  module,
  exports,
  typings,
  scripts,
  repository,
  keywords,
  author,
  license,
  bugs,
  homepage,
  devDependencies,
  dependencies,
  peerDependencies
};
function resolveWatchLocation(location) {
  return (filename) => {
    const defaultFilename = defaultUploadLocation(filename);
    let result = location ?? "home";
    if (typeof result === "function") {
      const resolved = result(filename);
      if (!resolved) {
        return [];
      }
      result = resolved;
    }
    if (!Array.isArray(result)) {
      result = [result];
    }
    return result.map((r) => {
      const itemResult = {
        filename: defaultFilename,
        server: "home",
        ...typeof r === "string" ? { server: r } : r
      };
      itemResult.filename = fixStartingSlash(itemResult.filename);
      return itemResult;
    });
  };
}
function resolveDts(dts) {
  if (typeof dts === "string") {
    return dts;
  } else if (dts === false) {
    return void 0;
  } else {
    return "NetscriptDefinitions.d.ts";
  }
}
function resolveDumpFile(dumpFiles) {
  if (typeof dumpFiles === "string") {
    return (file2) => dumpFiles + "/" + file2;
  } else if (typeof dumpFiles === "function") {
    return dumpFiles;
  } else {
    return void 0;
  }
}
function resolvePolling(usePolling) {
  if (typeof usePolling === "boolean") {
    return { usePolling, pollingOptions: {} };
  } else if (usePolling) {
    return { usePolling: true, pollingOptions: usePolling };
  } else {
    return { usePolling: false, pollingOptions: {} };
  }
}
function resolveConfig(config) {
  var _a, _b, _c, _d;
  const watch = config.watch ?? [];
  const server = ((_a = config.download) == null ? void 0 : _a.server) ?? "home";
  const resolvedConfig = {
    watch: watch.map((item) => ({
      pattern: item.pattern,
      transform: item.transform ?? false,
      location: resolveWatchLocation(item.location)
    })),
    ...resolvePolling(config.usePolling),
    sourcemap: config.sourcemap ?? false,
    port: config.port ?? 12525,
    timeout: config.timeout ?? 1e4,
    dts: resolveDts(config.dts),
    ignoreInitial: config.ignoreInitial ?? false,
    download: {
      server: Array.isArray(server) ? server : [server],
      location: ((_b = config == null ? void 0 : config.download) == null ? void 0 : _b.location) ?? ((file2) => "src/" + file2),
      ignoreTs: ((_c = config == null ? void 0 : config.download) == null ? void 0 : _c.ignoreTs) ?? true,
      ignoreSourcemap: ((_d = config == null ? void 0 : config.download) == null ? void 0 : _d.ignoreSourcemap) ?? true
    },
    dumpFiles: resolveDumpFile(config.dumpFiles),
    cwd: config.cwd ?? process.cwd()
  };
  return resolvedConfig;
}
function defineConfig(config) {
  return config;
}
async function loadConfig(inlineConfig) {
  const { config } = await loadConfig$1({
    sources: [
      // load from `viteburner.config.xx`
      {
        files: "viteburner.config",
        extensions: ["ts", "mts", "cts", "js", "mjs", "cjs", "json", ""]
      },
      // load inline config from `vite.config`
      {
        files: "vite.config",
        async rewrite(config2) {
          var _a;
          const resolvedConfig = await (typeof config2 === "function" ? config2() : config2);
          const sourcemap = (_a = resolvedConfig == null ? void 0 : resolvedConfig.build) == null ? void 0 : _a.sourcemap;
          return {
            ...sourcemap && { sourcemap },
            ...resolvedConfig == null ? void 0 : resolvedConfig.viteburner
          };
        }
      }
    ],
    cwd: inlineConfig.cwd ?? process.cwd(),
    merge: true
  });
  return resolveConfig({
    ...config,
    ...inlineConfig
  });
}
process.platform === "win32";
function slash(str) {
  return str.replace(/\\/g, "/");
}
function normalizeRequestId(id, base) {
  if (base && id.startsWith(base))
    id = `/${id.slice(base.length)}`;
  return id.replace(/^\/@id\/__x00__/, "\0").replace(/^\/@id\//, "").replace(/^__vite-browser-external:/, "").replace(/^file:/, "").replace(/^\/+/, "/").replace(/\?v=\w+/, "?").replace(/&v=\w+/, "").replace(/\?t=\w+/, "?").replace(/&t=\w+/, "").replace(/\?import/, "?").replace(/&import/, "").replace(/\?&/, "?").replace(/\?+$/, "");
}
class WatchManager {
  constructor(items, options = {}) {
    __publicField(this, "items");
    __publicField(this, "options");
    __publicField(this, "watcher");
    __publicField(this, "initial");
    __publicField(this, "enabled");
    __publicField(this, "enabledTimeStamp");
    __publicField(this, "emitter");
    this.items = items;
    this.options = options;
    this.initial = true;
    this.enabled = true;
    this.enabledTimeStamp = 0;
    this.emitter = new EventEmitter();
  }
  get patterns() {
    return this.items.map((item) => item.pattern);
  }
  findItem(file2) {
    return this.items.find((item) => isMatch(file2, item.pattern));
  }
  init() {
    this.watcher = chokidar.watch(this.patterns, this.options);
    this.watcher.on("ready", () => {
      this.initial = false;
    });
    const events = ["add", "unlink", "change"];
    for (const event of events) {
      this.watcher.on(event, (file2) => {
        this.triggerHmr(file2, event);
      });
    }
  }
  triggerHmr(file2, event) {
    if (!this.enabled) {
      return;
    }
    const root = this.options.cwd ?? process.cwd();
    if (event !== "unlink" && fs$j.statSync(resolve(root, file2)).mtimeMs <= this.enabledTimeStamp) {
      return;
    }
    const item = this.findItem(file2);
    if (item) {
      this.emitter.emit(hmrPluginName, {
        ...item,
        file: slash(file2),
        event,
        initial: this.initial,
        timestamp: Date.now()
      });
    } else {
      throw new Error(`File ${file2} does not match any patterns`);
    }
  }
  setEnabled(value) {
    this.enabled = value;
    if (value) {
      this.enabledTimeStamp = Date.now();
    }
  }
  async fullReload() {
    this.enabledTimeStamp = 0;
    const stream = fg.stream(this.patterns, { cwd: this.options.cwd ?? process.cwd() });
    for await (const file2 of stream) {
      this.triggerHmr(file2, "change");
    }
  }
  /** Get all possible filenames to upload */
  getUploadFilenames(filename) {
    filename = removeStartingSlash(slash(filename));
    const item = this.findItem(filename);
    if (!item) {
      return [];
    }
    return item.location(filename);
  }
  /** Shoutcut of `getUploadFilenames(filename).find(server) */
  getUploadFilenamesByServer(filename, server) {
    var _a;
    const filenames = this.getUploadFilenames(filename);
    return (_a = filenames.find((item) => item.server === server)) == null ? void 0 : _a.filename;
  }
  close() {
    var _a;
    (_a = this.watcher) == null ? void 0 : _a.close();
  }
}
function getSourceMapString(map) {
  if (!map)
    return "";
  const mapDataString = JSON.stringify(map);
  const resultA = `//# sourceMappingURL=data:`;
  const resultB = `application/json;base64,${Buffer.from(mapDataString).toString("base64")}`;
  return resultA + resultB;
}
async function writeFile$1(file2, content) {
  const dir = require$$1.dirname(file2);
  if (!fs$j.existsSync(dir)) {
    await fs$j.promises.mkdir(dir, { recursive: true });
  }
  return fs$j.promises.writeFile(file2, content, {
    flag: "w",
    encoding: "utf8"
  });
}
function isScriptFile(filename) {
  return filename.endsWith(".js") || filename.endsWith(".script");
}
const forceStartingSlash = (s) => {
  return s.startsWith("/") ? s : "/" + s;
};
const fixStartingSlash = (s) => {
  const index = s.lastIndexOf("/");
  if (index === 0) {
    return s.substring(1);
  } else if (index !== -1) {
    return forceStartingSlash(s);
  } else {
    return s;
  }
};
const removeStartingSlash = (s) => {
  return s.startsWith("/") ? s.substring(1) : s;
};
const defaultUploadLocation = (file2) => {
  return file2.replace(/^src\//, "").replace(/\.tsx?$/, ".js");
};
const externalRE = /^(https?:)?\/\//;
const isExternalUrl = (url) => externalRE.test(url);
function displayKeyHelpHint() {
  logger.info(
    "help",
    pc.dim("press ") + pc.reset(pc.bold("h")) + pc.dim(" to show help, press ") + pc.reset(pc.bold("q")) + pc.dim(" to exit")
  );
}
function displayWatchAndHelp() {
  logger.info("vite", pc.reset("watching for file changes..."));
  displayKeyHelpHint();
}
function handleKeyInput(wsAdapter) {
  const padding = 18;
  const printStatus = (tag, msg) => {
    logger.info("status", pc.reset(tag.padStart(padding)), msg);
  };
  const displayStatus = () => {
    logger.info("status");
    logger.info("status", " ".repeat(padding - 4) + pc.reset(pc.bold(pc.inverse(pc.green(" STATUS ")))));
    printStatus("connection:", wsAdapter.manager.connected ? pc.green("connected") : pc.yellow("disconnected"));
    printStatus("port:", pc.magenta(wsAdapter.server.config.viteburner.port));
    const pending = wsAdapter.buffers.size;
    const pendingStr = `${pending} file${pending === 1 ? "" : "s"}`;
    const pendingStrStyled = pending ? pc.yellow(pendingStr) : pc.dim(pendingStr);
    printStatus("pending:", pendingStrStyled);
    logger.info("status", pc.dim(""));
  };
  displayStatus();
  displayWatchAndHelp();
  const displayHelp = () => {
    logger.info("help");
    const commands = [
      ["u", "upload all files"],
      ["d", "download all files"],
      ["s", "show status"],
      ["r", "show RAM usage of scripts"],
      ["q", "quit"]
    ];
    logger.info("help", pc.reset(pc.bold("Watch Usage")));
    for (const [key, desc] of commands) {
      logger.info("help", `press ${pc.reset(pc.bold(key))}${pc.dim(" to ")}${desc}`);
    }
    logger.info("help", pc.dim(""));
  };
  const checkConnection = () => {
    if (!wsAdapter.manager.connected) {
      logger.error("conn", pc.red("no connection"));
      return false;
    }
    return true;
  };
  const fullUpload = () => {
    logger.info("upload", pc.reset("force full-upload triggered"));
    wsAdapter.server.watchManager.fullReload();
  };
  const fullDownload = () => {
    logger.info("download", pc.reset("force full-download triggered"));
    wsAdapter.fullDownload();
  };
  const showRamUsageAll = async () => {
    logger.info("ram", pc.reset("fetching ram usage of scripts..."));
    await wsAdapter.getRamUsage();
    return true;
  };
  const showRamUsageGlob = async () => {
    const { pattern } = await prompt({
      type: "text",
      name: "pattern",
      message: "Enter a glob pattern",
      initial: "src/**/*.{ts,tsx,js,jsx}"
    });
    if (!pattern) {
      return false;
    }
    logger.info("ram", pc.reset("fetching ram usage of scripts..."));
    await wsAdapter.getRamUsage(pattern);
    return true;
  };
  const showRamUsageLocal = async () => {
    const pattern = "**/*.{js,jsx,ts,tsx,script}";
    const files = await fg(pattern, { cwd: wsAdapter.server.config.root });
    files.sort();
    const fileMap = /* @__PURE__ */ new Map();
    for (const file22 of files) {
      if (file22.endsWith(".d.ts") || file22 === wsAdapter.server.config.viteburner.dts) {
        continue;
      }
      const resolvedData = wsAdapter.getRamUsageLocalData(file22);
      if (resolvedData.length === 0) {
        continue;
      }
      fileMap.set(file22, resolvedData);
    }
    const { file: file2 } = await prompt({
      type: "autocomplete",
      name: "file",
      message: "Enter a filename",
      choices: [...fileMap.keys()].map((title) => ({ title }))
    });
    if (!file2) {
      return false;
    }
    if (!fs$j.existsSync(resolve(wsAdapter.server.config.root, file2))) {
      logger.error("ram", `file ${file2} does not exist`);
      return false;
    }
    if (fileMap.has(file2)) {
      await wsAdapter.getRamUsageLocalRaw(file2, fileMap.get(file2));
    } else {
      await wsAdapter.getRamUsageLocal(file2);
    }
    return true;
  };
  const showRamUsageRemote = async () => {
    const { server } = await prompt({
      type: "text",
      name: "server",
      message: "Enter a server name",
      initial: "home"
    });
    if (!server) {
      return false;
    }
    const filenames = await wsAdapter.getFileNames(server);
    if (!filenames) {
      return false;
    }
    const { filename } = await prompt({
      type: "autocomplete",
      name: "filename",
      message: "Enter a filename",
      choices: filenames.filter(isScriptFile).map((title) => ({ title }))
    });
    if (!filename) {
      return false;
    }
    await wsAdapter.getRamUsageRemote(server, filename);
    return true;
  };
  const showRamUsageRaw = async () => {
    const { filter } = await prompt({
      type: "select",
      name: "filter",
      message: "Which script do you want to check?",
      initial: 0,
      choices: [
        { title: "All local scripts", value: "all" },
        { title: "Filter local scripts by glob pattern", value: "glob" },
        { title: "Find a local script", value: "local" },
        { title: "Find a remote script", value: "remote" }
      ]
    });
    if (!filter) {
      return false;
    }
    if (filter === "all") {
      return showRamUsageAll();
    } else if (filter === "glob") {
      return showRamUsageGlob();
    } else if (filter === "local") {
      return showRamUsageLocal();
    } else if (filter === "remote") {
      return showRamUsageRemote();
    }
    return false;
  };
  const showRamUsage = async (ctx) => {
    ctx.off();
    const result = await showRamUsageRaw();
    if (result) {
      logger.info("ram", "done");
    } else {
      logger.info("ram", "cancelled");
    }
    ctx.on();
  };
  return async (ctx) => {
    const { key } = ctx;
    let isKeyHandled = true;
    if (key.name === "q") {
      logger.info("bye");
      process.exit();
    } else if (key.name === "s") {
      displayStatus();
    } else if (key.name === "h") {
      displayHelp();
    } else if (key.name === "u") {
      checkConnection() && fullUpload();
    } else if (key.name === "d") {
      checkConnection() && fullDownload();
    } else if (key.name === "r") {
      checkConnection() && await showRamUsage(ctx);
    } else {
      isKeyHandled = false;
    }
    if (isKeyHandled) {
      displayWatchAndHelp();
    }
  };
}
function parse$1(code) {
  return parse$2(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    locations: true
  });
}
function getFilename(options, imports) {
  const realImports = normalizeRequestId(imports ?? options.filename);
  if (isExternalUrl(realImports)) {
    return realImports;
  }
  const importPath = options.manager.getUploadFilenamesByServer(realImports, options.server);
  if (!importPath) {
    const warnInfo = imports ? `Path "${imports}" imported by "${options.filename}" not found on server "${options.server}"` : `File "${imports}" not found on server "${options.server}"`;
    logger.warn(`import`, warnInfo);
    logger.warn(`import`, `This may be a problem when the script is running on the server.`);
    return realImports;
  } else {
    return forceStartingSlash(importPath);
  }
}
function fixImportPath(options) {
  const magicString = new MagicString(options.content);
  const estree = parse$1(options.content);
  for (const statement of estree.body) {
    if (statement.type === "ImportDeclaration") {
      const source = statement.source;
      const raw = source.raw;
      const value = source.value;
      const importPath = getFilename(options, value);
      const quote = raw[0];
      magicString.overwrite(source.start, source.end, quote + importPath + quote);
    }
  }
  return magicString.toString();
}
const formatUpload = (from, to, serverName) => {
  to = forceStartingSlash(to);
  const dest = `@${serverName}:${to}`;
  return {
    styled: `${pc.dim(from)} ${pc.reset("->")} ${pc.dim(dest)}`,
    raw: `${from} -> ${dest}`
  };
};
const formatDownload = (from, to, serverName) => {
  to = removeStartingSlash(to);
  const src = `@${serverName}:/${from}`;
  return {
    styled: `${pc.dim(src)} ${pc.reset("->")} ${pc.dim(to)}`,
    raw: `${src} -> ${to}`
  };
};
const defaultDownloadLocation = (file2) => {
  return "src/" + file2;
};
const defaultDts = "NetscriptDefinitions.d.ts";
class WsAdapter {
  constructor(manager, server) {
    __publicField(this, "buffers", /* @__PURE__ */ new Map());
    __publicField(this, "manager");
    __publicField(this, "server");
    this.manager = manager;
    this.server = server;
    this.manager.onConnected(async (ws) => {
      logger.info("conn", "", "connected");
      const handler2 = () => {
        logger.info("conn", "", pc.yellow("disconnected"));
      };
      ws.on("close", handler2);
      await this.getDts();
      await this.handleHmrMessage();
      return () => {
        ws.off("close", handler2);
      };
    });
    this.manager.checkIfWssReused();
  }
  async getDts() {
    const filename = this.server.config.viteburner.dts;
    if (!filename) {
      return;
    }
    try {
      const data = await this.manager.getDefinitionFile();
      const root = this.server.config.root;
      const fullpath = require$$1.resolve(root, filename);
      await writeFile$1(fullpath, data);
      logger.info("dts change", filename);
    } catch (e) {
      logger.error(`error getting dts file: ${e}`);
    }
  }
  async checkDependencies(data) {
    var _a;
    for (const item of data) {
      if (item.event === "change") {
        continue;
      }
      const resolvedFile = slash(resolve(this.server.config.root, item.file));
      (_a = this.server._importGlobMap) == null ? void 0 : _a.forEach((value, key) => {
        if (value.some((pattern) => match([resolvedFile], pattern).length > 0)) {
          const importer = slash(relative(this.server.config.root, key));
          if (data.some((item2) => item2.file === importer)) {
            return;
          }
          const importerData = this.server.watchManager.findItem(importer);
          if (importerData == null ? void 0 : importerData.transform) {
            data.push({
              file: importer,
              timestamp: item.timestamp,
              initial: item.initial,
              event: "change",
              ...importerData
            });
          }
        }
      });
    }
    return data;
  }
  async handleHmrMessage(data) {
    if (!data) {
      data = [];
    } else if (!Array.isArray(data)) {
      data = [data];
    }
    data = await this.checkDependencies(data);
    const connected = this.manager.connected;
    for (const item of data) {
      this.buffers.set(item.file, item);
      logger.info(`hmr ${item.event}`, item.file, pc.yellow("(pending)"));
    }
    if (!connected) {
      return;
    }
    if (this.buffers.size) {
      for (const item of this.buffers.values()) {
        await this.uploadFile(item);
      }
    }
  }
  deleteCache(data) {
    const currentData = this.buffers.get(data.file);
    if (currentData && data.timestamp === currentData.timestamp) {
      this.buffers.delete(data.file);
    }
  }
  async dumpFile(data, content, server) {
    var _a, _b;
    const relative2 = (_b = (_a = this.server.config.viteburner).dumpFiles) == null ? void 0 : _b.call(_a, data.file, server);
    if (!relative2) {
      return;
    }
    const fullpath = require$$1.resolve(this.server.config.root, relative2);
    await writeFile$1(fullpath, content);
    logger.info("dump", formatUpload(data.file, slash(relative2), server).styled);
  }
  async fetchModule(data) {
    let content = "";
    if (data.transform) {
      this.server.invalidateFile(data.file);
      const module2 = await this.server.fetchModule(data.file);
      if (!module2) {
        throw new Error("module not found: " + data.file);
      }
      content = module2.code;
      if (this.server.config.viteburner.sourcemap === "inline" && module2.map) {
        content += getSourceMapString(module2.map);
      }
    } else {
      const buffer = await fs$j.promises.readFile(require$$1.resolve(this.server.config.root, data.file));
      content = buffer.toString();
    }
    return content;
  }
  fixImport(content, data, serverName) {
    if (data.transform) {
      return fixImportPath({
        content,
        filename: data.file,
        server: serverName,
        manager: this.server.watchManager
      });
    } else {
      return content;
    }
  }
  async uploadFile(data) {
    this.deleteCache(data);
    const isAdd = data.event !== "unlink";
    let content = "";
    if (isAdd) {
      try {
        content = await this.fetchModule(data);
      } catch (e) {
        logger.error(String(e));
        return;
      }
    }
    const payloads = this.server.watchManager.getUploadFilenames(data.file);
    if (!payloads.length) {
      logger.info(`hmr ${data.event}`, data.file, pc.dim("(ignored)"));
      return;
    }
    for (const { filename, server: serverName } of payloads) {
      const fileChangeStrs = formatUpload(data.file, filename, serverName);
      try {
        if (isAdd) {
          if (data.transform) {
            content = this.fixImport(content, data, serverName);
          }
          this.dumpFile(data, content, serverName);
          await this.manager.pushFile({
            filename,
            content,
            server: serverName
          });
        } else {
          await this.manager.deleteFile({
            filename,
            server: serverName
          });
        }
        logger.info(`hmr ${data.event}`, fileChangeStrs.styled, pc.green("(done)"));
      } catch (e) {
        logger.error(`error ${data.event}: ${fileChangeStrs.raw} ${e}`);
        logger.error(`hmr ${data.event} ${data.file} (error)`);
        continue;
      }
    }
  }
  async fullDownload() {
    logger.info("vite", pc.reset("stop watching for file changes while downloading"));
    this.server.watchManager.setEnabled(false);
    const servers = this.server.config.viteburner.download.server;
    const filesMap = /* @__PURE__ */ new Map();
    for (const server of servers) {
      try {
        filesMap.set(server, await this.manager.getAllFiles({ server }));
      } catch (e) {
        logger.error(`error: connot get filelist from server ${server}: ${e}`);
        continue;
      }
    }
    for (const [server, files] of filesMap) {
      const { location: locationFn, ignoreTs, ignoreSourcemap } = this.server.config.viteburner.download;
      for (const file2 of files) {
        file2.filename = removeStartingSlash(file2.filename);
        const location = locationFn(file2.filename, server);
        if (!location) {
          logger.info(`download`, `@${server}:/${file2.filename}`, pc.dim("(ignored)"));
          continue;
        }
        const resolvedLocation = resolve(this.server.config.root, location);
        const fileChangeStrs = formatDownload(file2.filename, location, server);
        try {
          const isIgnoreTs = () => {
            return ignoreTs && resolvedLocation.endsWith(".js") && (fs$j.existsSync(resolvedLocation.substring(0, resolvedLocation.length - 3) + ".ts") || fs$j.existsSync(resolvedLocation.substring(0, resolvedLocation.length - 3) + ".tsx"));
          };
          const isIgnoreSourceMap = () => {
            return ignoreSourcemap && file2.content.match(/\/\/# sourceMappingURL=\S+\s*$/g);
          };
          if (isIgnoreTs() || isIgnoreSourceMap()) {
            logger.info(`download`, fileChangeStrs.styled, pc.dim("(ignored)"));
            continue;
          }
          await writeFile$1(resolvedLocation, file2.content);
          logger.info(`download`, fileChangeStrs.styled, pc.green("(done)"));
        } catch (e) {
          logger.error(`download`, fileChangeStrs.raw, `(${e})`);
        }
      }
    }
    logger.info("vite", pc.reset("download completed, watching for file changes..."));
    this.server.watchManager.setEnabled(true);
  }
  async getRamUsage(pattern) {
    const patterns = pattern ?? this.server.watchManager.patterns;
    if (!patterns) {
      logger.warn("ram", "no pattern found");
      return;
    }
    const files = await fg(patterns, { cwd: this.server.config.root });
    if (files.length === 0) {
      logger.warn("ram", "no file found");
      return;
    }
    files.sort();
    for (const file2 of files) {
      await this.getRamUsageLocal(file2);
    }
  }
  getRamUsageLocalData(file2) {
    return this.server.watchManager.getUploadFilenames(file2);
  }
  async getRamUsageLocalRaw(file2, resolvedData) {
    let isScript = false;
    let ramUsage = -1;
    if (resolvedData.length === 0) {
      logger.info("ram", `${file2} (ignored)`);
      return true;
    }
    for (const { filename, server } of resolvedData) {
      const formatUploadStrs = formatUpload(file2, filename, server);
      if (!isScriptFile(filename)) {
        continue;
      }
      isScript = true;
      try {
        ramUsage = await this.manager.calculateRam({ filename, server });
        logger.info("ram", pc.reset(`${file2}: ${ramUsage} GB`));
        break;
      } catch (e) {
        logger.warn(`ram`, formatUploadStrs.raw, `(${e})`);
      }
    }
    if (isScript) {
      if (ramUsage === -1) {
        logger.warn(`ram`, file2, `(no target found)`);
        return false;
      }
    } else {
      logger.info("ram", file2, pc.dim("(ignored)"));
    }
    return true;
  }
  async getRamUsageLocal(file2) {
    const resolvedData = this.getRamUsageLocalData(file2);
    return this.getRamUsageLocalRaw(file2, resolvedData);
  }
  async getRamUsageRemote(server, filename) {
    const resolvedFilename = fixStartingSlash(filename);
    logger.info("ram", pc.reset("fetching ram usage of scripts..."));
    try {
      const ramUsage = await this.manager.calculateRam({ filename: resolvedFilename, server });
      logger.info("ram", pc.reset(`@${server}/${filename}: ${ramUsage} GB`));
    } catch (e) {
      logger.error(`ram`, `@${server}/${filename}: ${e}`);
    }
  }
  async getFileNames(server) {
    try {
      const filenames = await this.manager.getFileNames({ server });
      return filenames.map(removeStartingSlash);
    } catch (e) {
      logger.error(`list`, `cannot fetch filenames from server ${server}: ${e}`);
      return null;
    }
  }
}
let reused = false;
let wss = null;
let wssPort = -1;
function getWss(port) {
  if (wss === null || wssPort !== port) {
    if (wss) {
      wss.clients.forEach((ws) => ws.close());
      wss.close();
    }
    wssPort = port;
    wss = new WebSocketServer({ port });
    reused = false;
  } else {
    reused = true;
  }
  return wss;
}
function isWssReused() {
  return reused;
}
const wsResponseSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.number(),
  result: z.any(),
  error: z.any()
});
const pushFileResponseSchema = z.literal("OK");
const getFileResponseSchema = z.string();
const deleteFileResponseSchema = z.literal("OK");
const getFileNamesResponseSchema = z.array(z.string());
const getAllFilesResponseSchema = z.array(
  z.object({
    filename: z.string(),
    content: z.string()
  })
);
const calculateRamResponseSchema = z.number();
const getDefinitionFileResponseSchema = z.string();
class WsManager {
  constructor(options) {
    __publicField(this, "options");
    __publicField(this, "ws");
    __publicField(this, "wss");
    __publicField(this, "trackers");
    __publicField(this, "nextId");
    __publicField(this, "unregisters");
    this.options = {
      timeout: 1e4,
      ...options
    };
    this.trackers = [];
    this.nextId = 0;
    this.ws = void 0;
    this.wss = getWss(this.options.port);
    this.unregisters = [];
    this._registerHandler();
  }
  get connected() {
    var _a;
    return ((_a = this.ws) == null ? void 0 : _a.readyState) === WebSocket.OPEN;
  }
  _registerHandler() {
    const _onConnected = (ws) => {
      this.ws = ws;
      ws.on("message", (response) => this.handleMessage(response));
    };
    const _onError = (e) => {
      const err = String(e);
      if (err.indexOf("EADDRINUSE") !== -1) {
        logger.error("ws", `fatal: port ${this.options.port} is already in use`);
        process.exit(1);
      } else {
        logger.error("ws", `${err}`);
      }
    };
    this.wss.on("connection", _onConnected);
    this.wss.on("error", _onError);
    this.unregisters.push(() => {
      this.wss.off("connection", _onConnected);
      this.wss.off("error", _onError);
    });
  }
  onConnected(cb) {
    const handler2 = async (ws) => {
      this.ws = ws;
      const unregister = await cb(ws);
      unregister && this.unregisters.push(unregister);
    };
    this.wss.on("connection", handler2);
    this.unregisters.push(() => {
      this.wss.off("connection", handler2);
    });
  }
  checkIfWssReused() {
    if (isWssReused() && this.wss.clients.size > 0) {
      for (const client of this.wss.clients) {
        this.ws = client;
      }
      this.wss.emit("connection", this.ws);
    }
  }
  handleMessage(response) {
    const parsed = wsResponseSchema.parse(JSON.parse(response.toString()));
    const { id, result, error } = parsed;
    if (!this.trackers[id]) {
      return;
    }
    const { resolve: resolve2, reject } = this.trackers[id];
    if (error) {
      reject(error);
    }
    resolve2(result);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendMessage(options) {
    const params = options.params;
    if (!this.ws || !this.connected) {
      throw new Error("No connection");
    }
    const id = ++this.nextId;
    this.ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id,
        method: options.method,
        ...params && { params }
      })
    );
    const result = new Promise((resolve2, reject) => {
      const onResolve = (data) => {
        var _a;
        try {
          resolve2(((_a = options.validator) == null ? void 0 : _a.parse(data)) ?? data);
        } catch (e) {
          reject(e);
        } finally {
          delete this.trackers[id];
        }
      };
      const onReject = (reason) => {
        delete this.trackers[id];
        reject(reason);
      };
      this.trackers[id] = {
        resolve: onResolve,
        reject: onReject
      };
    });
    if (this.options.timeout) {
      setTimeout(() => {
        if (this.trackers[id]) {
          this.trackers[id].reject(new Error(`Timeout after ${this.options.timeout}ms`));
        }
      }, this.options.timeout);
    }
    return result;
  }
  async pushFile(params) {
    return this.sendMessage({
      method: "pushFile",
      params,
      validator: pushFileResponseSchema
    });
  }
  async getFile(params) {
    return this.sendMessage({
      method: "getFile",
      params,
      validator: getFileResponseSchema
    });
  }
  async deleteFile(params) {
    return this.sendMessage({
      method: "deleteFile",
      params,
      validator: deleteFileResponseSchema
    });
  }
  async getFileNames(params) {
    return this.sendMessage({
      method: "getFileNames",
      params,
      validator: getFileNamesResponseSchema
    });
  }
  async getAllFiles(params) {
    return this.sendMessage({
      method: "getAllFiles",
      params,
      validator: getAllFilesResponseSchema
    });
  }
  async calculateRam(params) {
    return this.sendMessage({
      method: "calculateRam",
      params,
      validator: calculateRamResponseSchema
    });
  }
  async getDefinitionFile() {
    return this.sendMessage({
      method: "getDefinitionFile",
      validator: getDefinitionFileResponseSchema
    });
  }
  close() {
    this.unregisters.forEach((unregister) => unregister());
  }
}
const hmrPluginName = "viteburner:hmr";
const virtualModuleId = "virtual:viteburner-entry";
function getDefaultConfig() {
  return {
    mode: "development",
    optimizeDeps: { disabled: true },
    clearScreen: false,
    build: {
      lib: {
        /**
         * Meaningless for Vite<3.2.0
         * @see {@link https://github.com/vitejs/vite/discussions/1736}
         */
        entry: virtualModuleId,
        formats: ["es"]
      }
    },
    server: { middlewareMode: true }
  };
}
function viteburnerPlugin(inlineConfig) {
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  let server;
  let wsAdapter;
  return {
    name: "viteburner",
    apply: "serve",
    // Load viteburner.config.xx, merge with config, and resolve
    async config(config) {
      logger.info("config", "resolving user config...");
      config.viteburner = await loadConfig(inlineConfig);
      return getDefaultConfig();
    },
    configResolved() {
      logger.info("config", "config resolved");
    },
    // save server instance
    configureServer(_server) {
      server = {
        ..._server,
        pathToId(file2) {
          const id = `/@fs/${slash(resolve$1(server.config.root, file2))}`;
          return normalizeRequestId(id, server.config.base);
        },
        async invalidateFile(file2) {
          const id = server.pathToId(file2);
          const module2 = await server.moduleGraph.getModuleByUrl(id);
          if (module2) {
            server.moduleGraph.invalidateModule(module2);
          }
        },
        async fetchModule(file2) {
          const id = server.pathToId(file2);
          return server.transformRequest(id);
        },
        onHmrMessage(handler2) {
          server.watchManager.emitter.on(hmrPluginName, (data) => handler2(data, server));
        },
        async buildStart() {
          return server.pluginContainer.buildStart({});
        }
      };
    },
    // main entry
    buildStart() {
      logger.info("watch", "creating a watcher...");
      const { root, viteburner } = server.config;
      const { watch, ignoreInitial, port, timeout, usePolling, pollingOptions } = viteburner;
      server.watchManager = new WatchManager(watch, {
        cwd: root,
        persistent: true,
        ignoreInitial,
        usePolling: !!usePolling,
        ...pollingOptions
      });
      logger.info("ws", "creating ws server...");
      const wsManager = new WsManager({ port, timeout });
      wsAdapter = new WsAdapter(wsManager, server);
      server.onHmrMessage((data) => wsAdapter.handleHmrMessage(data));
      server.watchManager.init();
      setHandler(handleKeyInput(wsAdapter));
    },
    // virtual entry
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export {}`;
      }
    },
    // exit
    buildEnd() {
      server.watchManager.close();
      wsAdapter.manager.close();
      setHandler();
    }
  };
}
const A = 1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
function parse(g2, E = "@") {
  if (!C)
    return init.then(() => parse(g2));
  const I = g2.length + 1, w = (C.__heap_base.value || C.__heap_base) + 4 * I - C.memory.buffer.byteLength;
  w > 0 && C.memory.grow(Math.ceil(w / 65536));
  const D = C.sa(I - 1);
  if ((A ? B : Q)(g2, new Uint16Array(C.memory.buffer, D, I)), !C.parse())
    throw Object.assign(new Error(`Parse error ${E}:${g2.slice(0, C.e()).split("\n").length}:${C.e() - g2.lastIndexOf("\n", C.e() - 1)}`), { idx: C.e() });
  const L = [], k = [];
  for (; C.ri(); ) {
    const A2 = C.is(), Q2 = C.ie();
    let B2;
    C.ip() && (B2 = o(g2.slice(A2 - 1, Q2 + 1))), L.push({ n: B2, s: A2, e: Q2, ss: C.ss(), se: C.se(), d: C.id() });
  }
  for (; C.re(); )
    k.push(g2.slice(C.es(), C.ee()));
  function o(A2) {
    try {
      return (0, eval)(A2);
    } catch {
    }
  }
  return [L, k, !!C.f()];
}
function Q(A2, Q2) {
  const B2 = A2.length;
  let C2 = 0;
  for (; C2 < B2; ) {
    const B3 = A2.charCodeAt(C2);
    Q2[C2++] = (255 & B3) << 8 | B3 >>> 8;
  }
}
function B(A2, Q2) {
  const B2 = A2.length;
  let C2 = 0;
  for (; C2 < B2; )
    Q2[C2] = A2.charCodeAt(C2++);
}
let C;
const init = WebAssembly.compile((g = "AGFzbQEAAAABWAxgAX8Bf2AEf39/fwBgAn9/AGAAAX9gAABgBn9/f39/fwF/YAR/f39/AX9gA39/fwF/YAd/f39/f39/AX9gBX9/f39/AX9gAn9/AX9gCH9/f39/f39/AX8DMC8AAQIDAwMDAwMDAwMDAwMABAQABQQEAAAAAAQEBAQEAAUGBwgJCgsDAgAACgMICwQFAXABAQEFAwEAAQYPAn8BQfDwAAt/AEHw8AALB18QBm1lbW9yeQIAAnNhAAABZQADAmlzAAQCaWUABQJzcwAGAnNlAAcCaWQACAJpcAAJAmVzAAoCZWUACwJyaQAMAnJlAA0BZgAOBXBhcnNlAA8LX19oZWFwX2Jhc2UDAQrbNC9oAQF/QQAgADYCtAhBACgCkAgiASAAQQF0aiIAQQA7AQBBACAAQQJqIgA2ArgIQQAgADYCvAhBAEEANgKUCEEAQQA2AqQIQQBBADYCnAhBAEEANgKYCEEAQQA2AqwIQQBBADYCoAggAQurAQECf0EAKAKkCCIEQRhqQZQIIAQbQQAoArwIIgU2AgBBACAFNgKkCEEAIAQ2AqgIQQAgBUEcajYCvAggBSAANgIIAkACQEEAKAKICCADRw0AIAUgAjYCDAwBCwJAQQAoAoQIIANHDQAgBSACQQJqNgIMDAELIAVBACgCkAg2AgwLIAUgATYCACAFIAM2AhAgBSACNgIEIAVBADYCGCAFQQAoAoQIIANGOgAUC0gBAX9BACgCrAgiAkEIakGYCCACG0EAKAK8CCICNgIAQQAgAjYCrAhBACACQQxqNgK8CCACQQA2AgggAiABNgIEIAIgADYCAAsIAEEAKALACAsVAEEAKAKcCCgCAEEAKAKQCGtBAXULFQBBACgCnAgoAgRBACgCkAhrQQF1CxUAQQAoApwIKAIIQQAoApAIa0EBdQsVAEEAKAKcCCgCDEEAKAKQCGtBAXULOwEBfwJAQQAoApwIKAIQIgBBACgChAhHDQBBfw8LAkAgAEEAKAKICEcNAEF+DwsgAEEAKAKQCGtBAXULCwBBACgCnAgtABQLFQBBACgCoAgoAgBBACgCkAhrQQF1CxUAQQAoAqAIKAIEQQAoApAIa0EBdQslAQF/QQBBACgCnAgiAEEYakGUCCAAGygCACIANgKcCCAAQQBHCyUBAX9BAEEAKAKgCCIAQQhqQZgIIAAbKAIAIgA2AqAIIABBAEcLCABBAC0AxAgLhQwBBX8jAEGA8ABrIgEkAEEAQQE6AMQIQQBB//8DOwHKCEEAQQAoAowINgLMCEEAQQAoApAIQX5qIgI2AuAIQQAgAkEAKAK0CEEBdGoiAzYC5AhBAEEAOwHGCEEAQQA7AcgIQQBBADoA0AhBAEEANgLACEEAQQA6ALAIQQAgAUGA0ABqNgLUCEEAIAFBgBBqNgLYCEEAQQA6ANwIAkACQAJAA0BBACACQQJqIgQ2AuAIAkACQAJAAkAgAiADTw0AIAQvAQAiA0F3akEFSQ0DIANBm39qIgVBBE0NASADQSBGDQMCQCADQS9GDQAgA0E7Rg0DDAYLAkAgAi8BBCIEQSpGDQAgBEEvRw0GEBAMBAsQEQwDC0EAIQMgBCECQQAtALAIDQYMBQsCQAJAIAUOBQEFBQUAAQsgBBASRQ0BIAJBBGpB7QBB8ABB7wBB8gBB9AAQE0UNARAUDAELQQAvAcgIDQAgBBASRQ0AIAJBBGpB+ABB8ABB7wBB8gBB9AAQE0UNABAVQQAtAMQIDQBBAEEAKALgCCICNgLMCAwEC0EAQQAoAuAINgLMCAtBACgC5AghA0EAKALgCCECDAALC0EAIAI2AuAIQQBBADoAxAgLA0BBACACQQJqIgM2AuAIAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAJBACgC5AhPDQAgAy8BACIEQXdqQQVJDQ4gBEFgaiIFQQlNDQEgBEGgf2oiBUEJTQ0CAkACQAJAIARBhX9qIgNBAk0NACAEQS9HDRAgAi8BBCICQSpGDQEgAkEvRw0CEBAMEQsCQAJAIAMOAwARAQALAkBBACgCzAgiBC8BAEEpRw0AQQAoAqQIIgJFDQAgAigCBCAERw0AQQBBACgCqAgiAjYCpAgCQCACRQ0AIAJBADYCGAwBC0EAQQA2ApQICyABQQAvAcgIIgJqQQAtANwIOgAAQQAgAkEBajsByAhBACgC2AggAkECdGogBDYCAEEAQQA6ANwIDBALQQAvAcgIIgJFDQlBACACQX9qIgM7AcgIAkAgAkEALwHKCCIERw0AQQBBAC8BxghBf2oiAjsBxghBAEEAKALUCCACQf//A3FBAXRqLwEAOwHKCAwICyAEQf//A0YNDyADQf//A3EgBEkNCQwPCxARDA8LAkACQAJAAkBBACgCzAgiBC8BACICEBZFDQAgAkFVaiIDQQNLDQICQAJAAkAgAw4EAQUCAAELIARBfmovAQBBUGpB//8DcUEKSQ0DDAQLIARBfmovAQBBK0YNAgwDCyAEQX5qLwEAQS1GDQEMAgsCQCACQf0ARg0AIAJBKUcNAUEAKALYCEEALwHICEECdGooAgAQF0UNAQwCC0EAKALYCEEALwHICCIDQQJ0aigCABAYDQEgASADai0AAA0BCyAEEBkNACACRQ0AQQEhBCACQS9GQQAtANAIQQBHcUUNAQsQGkEAIQQLQQAgBDoA0AgMDQtBAC8ByghB//8DRkEALwHICEVxQQAtALAIRXEhAwwPCyAFDgoMCwELCwsLAgcEDAsgBQ4KAgoKBwoJCgoKCAILEBsMCQsQHAwICxAdDAcLQQAvAcgIIgINAQsQHkEAIQMMCAtBACACQX9qIgQ7AcgIQQAoAqQIIgJFDQQgAigCEEEAKALYCCAEQf//A3FBAnRqKAIARw0EIAIgAzYCBAwEC0EAQQAvAcgIIgJBAWo7AcgIQQAoAtgIIAJBAnRqQQAoAswINgIADAMLIAMQEkUNAiACLwEKQfMARw0CIAIvAQhB8wBHDQIgAi8BBkHhAEcNAiACLwEEQewARw0CAkACQCACLwEMIgRBd2oiAkEXSw0AQQEgAnRBn4CABHENAQsgBEGgAUcNAwtBAEEBOgDcCAwCCyADEBJFDQEgAkEEakHtAEHwAEHvAEHyAEH0ABATRQ0BEBQMAQtBAC8ByAgNACADEBJFDQAgAkEEakH4AEHwAEHvAEHyAEH0ABATRQ0AEBULQQBBACgC4Ag2AswIC0EAKALgCCECDAALCyABQYDwAGokACADC1ABBH9BACgC4AhBAmohAEEAKALkCCEBAkADQCAAIgJBfmogAU8NASACQQJqIQAgAi8BAEF2aiIDQQNLDQAgAw4EAQAAAQELC0EAIAI2AuAIC3cBAn9BAEEAKALgCCIAQQJqNgLgCCAAQQZqIQBBACgC5AghAQNAAkACQAJAIABBfGogAU8NACAAQX5qLwEAQSpHDQIgAC8BAEEvRw0CQQAgAEF+ajYC4AgMAQsgAEF+aiEAC0EAIAA2AuAIDwsgAEECaiEADAALCx0AAkBBACgCkAggAEcNAEEBDwsgAEF+ai8BABAfCz8BAX9BACEGAkAgAC8BCCAFRw0AIAAvAQYgBEcNACAALwEEIANHDQAgAC8BAiACRw0AIAAvAQAgAUYhBgsgBgv3AwEEf0EAQQAoAuAIIgBBDGoiATYC4AgCQAJAAkACQAJAECciAkFZaiIDQQdNDQAgAkEiRg0CIAJB+wBGDQIMAQsCQAJAIAMOCAMBAgMCAgIAAwtBAEEAKALgCEECajYC4AgQJ0HtAEcNA0EAKALgCCIDLwEGQeEARw0DIAMvAQRB9ABHDQMgAy8BAkHlAEcNA0EAKALMCC8BAEEuRg0DIAAgACADQQhqQQAoAogIEAEPC0EAKALYCEEALwHICCIDQQJ0aiAANgIAQQAgA0EBajsByAhBACgCzAgvAQBBLkYNAiAAQQAoAuAIQQJqQQAgABABQQBBACgC4AhBAmo2AuAIAkACQBAnIgNBIkYNAAJAIANBJ0cNABAcDAILQQBBACgC4AhBfmo2AuAIDwsQGwtBAEEAKALgCEECajYC4AgCQBAnQSlHDQBBACgCpAgiA0EBOgAUIANBACgC4Ag2AgRBAEEALwHICEF/ajsByAgPC0EAQQAoAuAIQX5qNgLgCA8LQQAoAuAIIAFGDQELQQAvAcgIDQFBACgC4AghA0EAKALkCCEBAkADQCADIAFPDQECQAJAIAMvAQAiAkEnRg0AIAJBIkcNAQsgACACECgPC0EAIANBAmoiAzYC4AgMAAsLEB4LDwtBAEEAKALgCEF+ajYC4AgLmAYBBH9BAEEAKALgCCIAQQxqIgE2AuAIECchAgJAAkACQAJAAkACQEEAKALgCCIDIAFHDQAgAhApRQ0BCwJAAkACQAJAIAJBn39qIgFBC00NAAJAAkAgAkEqRg0AIAJB9gBGDQUgAkH7AEcNA0EAIANBAmo2AuAIECchA0EAKALgCCEBA0AgA0H//wNxECoaQQAoAuAIIQIQJxoCQCABIAIQKyIDQSxHDQBBAEEAKALgCEECajYC4AgQJyEDC0EAKALgCCECAkAgA0H9AEYNACACIAFGDQwgAiEBIAJBACgC5AhNDQEMDAsLQQAgAkECajYC4AgMAQtBACADQQJqNgLgCBAnGkEAKALgCCICIAIQKxoLECchAgwBCyABDgwEAAEGAAUAAAAAAAIEC0EAKALgCCEDAkAgAkHmAEcNACADLwEGQe0ARw0AIAMvAQRB7wBHDQAgAy8BAkHyAEcNAEEAIANBCGo2AuAIIAAQJxAoDwtBACADQX5qNgLgCAwCCwJAIAMvAQhB8wBHDQAgAy8BBkHzAEcNACADLwEEQeEARw0AIAMvAQJB7ABHDQAgAy8BChAfRQ0AQQAgA0EKajYC4AgQJyECQQAoAuAIIQMgAhAqGiADQQAoAuAIEAJBAEEAKALgCEF+ajYC4AgPC0EAIANBBGoiAzYC4AgLQQAgA0EEaiICNgLgCEEAQQA6AMQIA0BBACACQQJqNgLgCBAnIQNBACgC4AghAgJAIAMQKkEgckH7AEcNAEEAQQAoAuAIQX5qNgLgCA8LQQAoAuAIIgMgAkYNASACIAMQAgJAECciAkEsRg0AAkAgAkE9Rw0AQQBBACgC4AhBfmo2AuAIDwtBAEEAKALgCEF+ajYC4AgPC0EAKALgCCECDAALCw8LQQAgA0EKajYC4AgQJxpBACgC4AghAwtBACADQRBqNgLgCAJAECciAkEqRw0AQQBBACgC4AhBAmo2AuAIECchAgtBACgC4AghAyACECoaIANBACgC4AgQAkEAQQAoAuAIQX5qNgLgCA8LIAMgA0EOahACDwsQHgt1AQF/AkACQCAAQV9qIgFBBUsNAEEBIAF0QTFxDQELIABBRmpB//8DcUEGSQ0AIABBWGpB//8DcUEHSSAAQSlHcQ0AAkAgAEGlf2oiAUEDSw0AIAEOBAEAAAEBCyAAQf0ARyAAQYV/akH//wNxQQRJcQ8LQQELPQEBf0EBIQECQCAAQfcAQegAQekAQewAQeUAECANACAAQeYAQe8AQfIAECENACAAQekAQeYAECIhAQsgAQutAQEDf0EBIQECQAJAAkACQAJAAkACQCAALwEAIgJBRWoiA0EDTQ0AIAJBm39qIgNBA00NASACQSlGDQMgAkH5AEcNAiAAQX5qQeYAQekAQe4AQeEAQewAQewAECMPCyADDgQCAQEFAgsgAw4EAgAAAwILQQAhAQsgAQ8LIABBfmpB5QBB7ABB8wAQIQ8LIABBfmpB4wBB4QBB9ABB4wAQJA8LIABBfmovAQBBPUYL7QMBAn9BACEBAkAgAC8BAEGcf2oiAkETSw0AAkACQAJAAkACQAJAAkACQCACDhQAAQIICAgICAgIAwQICAUIBggIBwALIABBfmovAQBBl39qIgJBA0sNBwJAAkAgAg4EAAkJAQALIABBfGpB9gBB7wAQIg8LIABBfGpB+QBB6QBB5QAQIQ8LIABBfmovAQBBjX9qIgJBAUsNBgJAAkAgAg4CAAEACwJAIABBfGovAQAiAkHhAEYNACACQewARw0IIABBempB5QAQJQ8LIABBempB4wAQJQ8LIABBfGpB5ABB5QBB7ABB5QAQJA8LIABBfmovAQBB7wBHDQUgAEF8ai8BAEHlAEcNBQJAIABBemovAQAiAkHwAEYNACACQeMARw0GIABBeGpB6QBB7gBB8wBB9ABB4QBB7gAQIw8LIABBeGpB9ABB+QAQIg8LQQEhASAAQX5qIgBB6QAQJQ0EIABB8gBB5QBB9ABB9QBB8gAQIA8LIABBfmpB5AAQJQ8LIABBfmpB5ABB5QBB4gBB9QBB5wBB5wBB5QAQJg8LIABBfmpB4QBB9wBB4QBB6QAQJA8LAkAgAEF+ai8BACICQe8ARg0AIAJB5QBHDQEgAEF8akHuABAlDwsgAEF8akH0AEHoAEHyABAhIQELIAELgwEBA38DQEEAQQAoAuAIIgBBAmoiATYC4AgCQAJAAkAgAEEAKALkCE8NACABLwEAIgFBpX9qIgJBAU0NAgJAIAFBdmoiAEEDTQ0AIAFBL0cNBAwCCyAADgQAAwMAAAsQHgsPCwJAAkAgAg4CAQABC0EAIABBBGo2AuAIDAELECwaDAALC5EBAQR/QQAoAuAIIQBBACgC5AghAQJAA0AgACICQQJqIQAgAiABTw0BAkAgAC8BACIDQdwARg0AAkAgA0F2aiICQQNNDQAgA0EiRw0CQQAgADYC4AgPCyACDgQCAQECAgsgAkEEaiEAIAIvAQRBDUcNACACQQZqIAAgAi8BBkEKRhshAAwACwtBACAANgLgCBAeC5EBAQR/QQAoAuAIIQBBACgC5AghAQJAA0AgACICQQJqIQAgAiABTw0BAkAgAC8BACIDQdwARg0AAkAgA0F2aiICQQNNDQAgA0EnRw0CQQAgADYC4AgPCyACDgQCAQECAgsgAkEEaiEAIAIvAQRBDUcNACACQQZqIAAgAi8BBkEKRhshAAwACwtBACAANgLgCBAeC8kBAQV/QQAoAuAIIQBBACgC5AghAQNAIAAiAkECaiEAAkACQCACIAFPDQAgAC8BACIDQaR/aiIEQQRNDQEgA0EkRw0CIAIvAQRB+wBHDQJBAEEALwHGCCIAQQFqOwHGCEEAKALUCCAAQQF0akEALwHKCDsBAEEAIAJBBGo2AuAIQQBBAC8ByAhBAWoiADsByghBACAAOwHICA8LQQAgADYC4AgQHg8LAkACQCAEDgUBAgICAAELQQAgADYC4AgPCyACQQRqIQAMAAsLNQEBf0EAQQE6ALAIQQAoAuAIIQBBAEEAKALkCEECajYC4AhBACAAQQAoApAIa0EBdTYCwAgLNAEBf0EBIQECQCAAQXdqQf//A3FBBUkNACAAQYABckGgAUYNACAAQS5HIAAQKXEhAQsgAQtJAQN/QQAhBgJAIABBeGoiB0EAKAKQCCIISQ0AIAcgASACIAMgBCAFEBNFDQACQCAHIAhHDQBBAQ8LIABBdmovAQAQHyEGCyAGC1kBA39BACEEAkAgAEF8aiIFQQAoApAIIgZJDQAgAC8BACADRw0AIABBfmovAQAgAkcNACAFLwEAIAFHDQACQCAFIAZHDQBBAQ8LIABBemovAQAQHyEECyAEC0wBA39BACEDAkAgAEF+aiIEQQAoApAIIgVJDQAgAC8BACACRw0AIAQvAQAgAUcNAAJAIAQgBUcNAEEBDwsgAEF8ai8BABAfIQMLIAMLSwEDf0EAIQcCQCAAQXZqIghBACgCkAgiCUkNACAIIAEgAiADIAQgBSAGEC1FDQACQCAIIAlHDQBBAQ8LIABBdGovAQAQHyEHCyAHC2YBA39BACEFAkAgAEF6aiIGQQAoApAIIgdJDQAgAC8BACAERw0AIABBfmovAQAgA0cNACAAQXxqLwEAIAJHDQAgBi8BACABRw0AAkAgBiAHRw0AQQEPCyAAQXhqLwEAEB8hBQsgBQs9AQJ/QQAhAgJAQQAoApAIIgMgAEsNACAALwEAIAFHDQACQCADIABHDQBBAQ8LIABBfmovAQAQHyECCyACC00BA39BACEIAkAgAEF0aiIJQQAoApAIIgpJDQAgCSABIAIgAyAEIAUgBiAHEC5FDQACQCAJIApHDQBBAQ8LIABBcmovAQAQHyEICyAIC3YBA39BACgC4AghAAJAA0ACQCAALwEAIgFBd2pBBUkNACABQSBGDQAgAUGgAUYNACABQS9HDQICQCAALwECIgBBKkYNACAAQS9HDQMQEAwBCxARC0EAQQAoAuAIIgJBAmoiADYC4AggAkEAKALkCEkNAAsLIAELWAACQAJAIAFBIkYNACABQSdHDQFBACgC4AghARAcIAAgAUECakEAKALgCEEAKAKECBABDwtBACgC4AghARAbIAAgAUECakEAKALgCEEAKAKECBABDwsQHgtoAQJ/QQEhAQJAAkAgAEFfaiICQQVLDQBBASACdEExcQ0BCyAAQfj/A3FBKEYNACAAQUZqQf//A3FBBkkNAAJAIABBpX9qIgJBA0sNACACQQFHDQELIABBhX9qQf//A3FBBEkhAQsgAQttAQJ/AkACQANAAkAgAEH//wNxIgFBd2oiAkEXSw0AQQEgAnRBn4CABHENAgsgAUGgAUYNASAAIQIgARApDQJBACECQQBBACgC4AgiAEECajYC4AggAC8BAiIADQAMAgsLIAAhAgsgAkH//wNxC1wBAn8CQEEAKALgCCICLwEAIgNB4QBHDQBBACACQQRqNgLgCBAnIQJBACgC4AghACACECoaQQAoAuAIIQEQJyEDQQAoAuAIIQILAkAgAiAARg0AIAAgARACCyADC4kBAQV/QQAoAuAIIQBBACgC5AghAQN/IABBAmohAgJAAkAgACABTw0AIAIvAQAiA0Gkf2oiBEEBTQ0BIAIhACADQXZqIgNBA0sNAiACIQAgAw4EAAICAAALQQAgAjYC4AgQHkEADwsCQAJAIAQOAgEAAQtBACACNgLgCEHdAA8LIABBBGohAAwACwtJAQF/QQAhBwJAIAAvAQogBkcNACAALwEIIAVHDQAgAC8BBiAERw0AIAAvAQQgA0cNACAALwECIAJHDQAgAC8BACABRiEHCyAHC1MBAX9BACEIAkAgAC8BDCAHRw0AIAAvAQogBkcNACAALwEIIAVHDQAgAC8BBiAERw0AIAAvAQQgA0cNACAALwECIAJHDQAgAC8BACABRiEICyAICwsfAgBBgAgLAgAAAEGECAsQAQAAAAIAAAAABAAAcDgAAA==", "undefined" != typeof window && "function" == typeof atob ? Uint8Array.from(atob(g), (A2) => A2.charCodeAt(0)) : Buffer.from(g, "base64"))).then(WebAssembly.instantiate).then(({ exports: A2 }) => {
  C = A2;
});
var g;
function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var fs$i = {};
var universalify$1 = {};
universalify$1.fromCallback = function(fn) {
  return Object.defineProperty(function(...args) {
    if (typeof args[args.length - 1] === "function")
      fn.apply(this, args);
    else {
      return new Promise((resolve2, reject) => {
        fn.call(
          this,
          ...args,
          (err, res) => err != null ? reject(err) : resolve2(res)
        );
      });
    }
  }, "name", { value: fn.name });
};
universalify$1.fromPromise = function(fn) {
  return Object.defineProperty(function(...args) {
    const cb = args[args.length - 1];
    if (typeof cb !== "function")
      return fn.apply(this, args);
    else
      fn.apply(this, args.slice(0, -1)).then((r) => cb(null, r), cb);
  }, "name", { value: fn.name });
};
var constants = require$$0;
var origCwd = process.cwd;
var cwd = null;
var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process);
  return cwd;
};
try {
  process.cwd();
} catch (er) {
}
if (typeof process.chdir === "function") {
  var chdir = process.chdir;
  process.chdir = function(d) {
    cwd = null;
    chdir.call(process, d);
  };
  if (Object.setPrototypeOf)
    Object.setPrototypeOf(process.chdir, chdir);
}
var polyfills$1 = patch$1;
function patch$1(fs2) {
  if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs2);
  }
  if (!fs2.lutimes) {
    patchLutimes(fs2);
  }
  fs2.chown = chownFix(fs2.chown);
  fs2.fchown = chownFix(fs2.fchown);
  fs2.lchown = chownFix(fs2.lchown);
  fs2.chmod = chmodFix(fs2.chmod);
  fs2.fchmod = chmodFix(fs2.fchmod);
  fs2.lchmod = chmodFix(fs2.lchmod);
  fs2.chownSync = chownFixSync(fs2.chownSync);
  fs2.fchownSync = chownFixSync(fs2.fchownSync);
  fs2.lchownSync = chownFixSync(fs2.lchownSync);
  fs2.chmodSync = chmodFixSync(fs2.chmodSync);
  fs2.fchmodSync = chmodFixSync(fs2.fchmodSync);
  fs2.lchmodSync = chmodFixSync(fs2.lchmodSync);
  fs2.stat = statFix(fs2.stat);
  fs2.fstat = statFix(fs2.fstat);
  fs2.lstat = statFix(fs2.lstat);
  fs2.statSync = statFixSync(fs2.statSync);
  fs2.fstatSync = statFixSync(fs2.fstatSync);
  fs2.lstatSync = statFixSync(fs2.lstatSync);
  if (fs2.chmod && !fs2.lchmod) {
    fs2.lchmod = function(path2, mode, cb) {
      if (cb)
        process.nextTick(cb);
    };
    fs2.lchmodSync = function() {
    };
  }
  if (fs2.chown && !fs2.lchown) {
    fs2.lchown = function(path2, uid, gid, cb) {
      if (cb)
        process.nextTick(cb);
    };
    fs2.lchownSync = function() {
    };
  }
  if (platform === "win32") {
    fs2.rename = typeof fs2.rename !== "function" ? fs2.rename : function(fs$rename) {
      function rename2(from, to, cb) {
        var start = Date.now();
        var backoff = 0;
        fs$rename(from, to, function CB(er) {
          if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
            setTimeout(function() {
              fs2.stat(to, function(stater, st) {
                if (stater && stater.code === "ENOENT")
                  fs$rename(from, to, CB);
                else
                  cb(er);
              });
            }, backoff);
            if (backoff < 100)
              backoff += 10;
            return;
          }
          if (cb)
            cb(er);
        });
      }
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(rename2, fs$rename);
      return rename2;
    }(fs2.rename);
  }
  fs2.read = typeof fs2.read !== "function" ? fs2.read : function(fs$read) {
    function read(fd, buffer, offset, length, position, callback_) {
      var callback;
      if (callback_ && typeof callback_ === "function") {
        var eagCounter = 0;
        callback = function(er, _, __) {
          if (er && er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
          }
          callback_.apply(this, arguments);
        };
      }
      return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
    }
    if (Object.setPrototypeOf)
      Object.setPrototypeOf(read, fs$read);
    return read;
  }(fs2.read);
  fs2.readSync = typeof fs2.readSync !== "function" ? fs2.readSync : function(fs$readSync) {
    return function(fd, buffer, offset, length, position) {
      var eagCounter = 0;
      while (true) {
        try {
          return fs$readSync.call(fs2, fd, buffer, offset, length, position);
        } catch (er) {
          if (er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            continue;
          }
          throw er;
        }
      }
    };
  }(fs2.readSync);
  function patchLchmod(fs3) {
    fs3.lchmod = function(path2, mode, callback) {
      fs3.open(
        path2,
        constants.O_WRONLY | constants.O_SYMLINK,
        mode,
        function(err, fd) {
          if (err) {
            if (callback)
              callback(err);
            return;
          }
          fs3.fchmod(fd, mode, function(err2) {
            fs3.close(fd, function(err22) {
              if (callback)
                callback(err2 || err22);
            });
          });
        }
      );
    };
    fs3.lchmodSync = function(path2, mode) {
      var fd = fs3.openSync(path2, constants.O_WRONLY | constants.O_SYMLINK, mode);
      var threw = true;
      var ret;
      try {
        ret = fs3.fchmodSync(fd, mode);
        threw = false;
      } finally {
        if (threw) {
          try {
            fs3.closeSync(fd);
          } catch (er) {
          }
        } else {
          fs3.closeSync(fd);
        }
      }
      return ret;
    };
  }
  function patchLutimes(fs3) {
    if (constants.hasOwnProperty("O_SYMLINK") && fs3.futimes) {
      fs3.lutimes = function(path2, at, mt, cb) {
        fs3.open(path2, constants.O_SYMLINK, function(er, fd) {
          if (er) {
            if (cb)
              cb(er);
            return;
          }
          fs3.futimes(fd, at, mt, function(er2) {
            fs3.close(fd, function(er22) {
              if (cb)
                cb(er2 || er22);
            });
          });
        });
      };
      fs3.lutimesSync = function(path2, at, mt) {
        var fd = fs3.openSync(path2, constants.O_SYMLINK);
        var ret;
        var threw = true;
        try {
          ret = fs3.futimesSync(fd, at, mt);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs3.closeSync(fd);
            } catch (er) {
            }
          } else {
            fs3.closeSync(fd);
          }
        }
        return ret;
      };
    } else if (fs3.futimes) {
      fs3.lutimes = function(_a, _b, _c, cb) {
        if (cb)
          process.nextTick(cb);
      };
      fs3.lutimesSync = function() {
      };
    }
  }
  function chmodFix(orig) {
    if (!orig)
      return orig;
    return function(target, mode, cb) {
      return orig.call(fs2, target, mode, function(er) {
        if (chownErOk(er))
          er = null;
        if (cb)
          cb.apply(this, arguments);
      });
    };
  }
  function chmodFixSync(orig) {
    if (!orig)
      return orig;
    return function(target, mode) {
      try {
        return orig.call(fs2, target, mode);
      } catch (er) {
        if (!chownErOk(er))
          throw er;
      }
    };
  }
  function chownFix(orig) {
    if (!orig)
      return orig;
    return function(target, uid, gid, cb) {
      return orig.call(fs2, target, uid, gid, function(er) {
        if (chownErOk(er))
          er = null;
        if (cb)
          cb.apply(this, arguments);
      });
    };
  }
  function chownFixSync(orig) {
    if (!orig)
      return orig;
    return function(target, uid, gid) {
      try {
        return orig.call(fs2, target, uid, gid);
      } catch (er) {
        if (!chownErOk(er))
          throw er;
      }
    };
  }
  function statFix(orig) {
    if (!orig)
      return orig;
    return function(target, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      function callback(er, stats) {
        if (stats) {
          if (stats.uid < 0)
            stats.uid += 4294967296;
          if (stats.gid < 0)
            stats.gid += 4294967296;
        }
        if (cb)
          cb.apply(this, arguments);
      }
      return options ? orig.call(fs2, target, options, callback) : orig.call(fs2, target, callback);
    };
  }
  function statFixSync(orig) {
    if (!orig)
      return orig;
    return function(target, options) {
      var stats = options ? orig.call(fs2, target, options) : orig.call(fs2, target);
      if (stats) {
        if (stats.uid < 0)
          stats.uid += 4294967296;
        if (stats.gid < 0)
          stats.gid += 4294967296;
      }
      return stats;
    };
  }
  function chownErOk(er) {
    if (!er)
      return true;
    if (er.code === "ENOSYS")
      return true;
    var nonroot = !process.getuid || process.getuid() !== 0;
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true;
    }
    return false;
  }
}
var Stream = require$$0$1.Stream;
var legacyStreams = legacy$1;
function legacy$1(fs2) {
  return {
    ReadStream,
    WriteStream
  };
  function ReadStream(path2, options) {
    if (!(this instanceof ReadStream))
      return new ReadStream(path2, options);
    Stream.call(this);
    var self2 = this;
    this.path = path2;
    this.fd = null;
    this.readable = true;
    this.paused = false;
    this.flags = "r";
    this.mode = 438;
    this.bufferSize = 64 * 1024;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.encoding)
      this.setEncoding(this.encoding);
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.end === void 0) {
        this.end = Infinity;
      } else if ("number" !== typeof this.end) {
        throw TypeError("end must be a Number");
      }
      if (this.start > this.end) {
        throw new Error("start must be <= end");
      }
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        self2._read();
      });
      return;
    }
    fs2.open(this.path, this.flags, this.mode, function(err, fd) {
      if (err) {
        self2.emit("error", err);
        self2.readable = false;
        return;
      }
      self2.fd = fd;
      self2.emit("open", fd);
      self2._read();
    });
  }
  function WriteStream(path2, options) {
    if (!(this instanceof WriteStream))
      return new WriteStream(path2, options);
    Stream.call(this);
    this.path = path2;
    this.fd = null;
    this.writable = true;
    this.flags = "w";
    this.encoding = "binary";
    this.mode = 438;
    this.bytesWritten = 0;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.start < 0) {
        throw new Error("start must be >= zero");
      }
      this.pos = this.start;
    }
    this.busy = false;
    this._queue = [];
    if (this.fd === null) {
      this._open = fs2.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
      this.flush();
    }
  }
}
var clone_1 = clone$1;
var getPrototypeOf = Object.getPrototypeOf || function(obj) {
  return obj.__proto__;
};
function clone$1(obj) {
  if (obj === null || typeof obj !== "object")
    return obj;
  if (obj instanceof Object)
    var copy2 = { __proto__: getPrototypeOf(obj) };
  else
    var copy2 = /* @__PURE__ */ Object.create(null);
  Object.getOwnPropertyNames(obj).forEach(function(key) {
    Object.defineProperty(copy2, key, Object.getOwnPropertyDescriptor(obj, key));
  });
  return copy2;
}
var fs$h = fs$j;
var polyfills = polyfills$1;
var legacy = legacyStreams;
var clone = clone_1;
var util$1 = require$$4;
var gracefulQueue;
var previousSymbol;
if (typeof Symbol === "function" && typeof Symbol.for === "function") {
  gracefulQueue = Symbol.for("graceful-fs.queue");
  previousSymbol = Symbol.for("graceful-fs.previous");
} else {
  gracefulQueue = "___graceful-fs.queue";
  previousSymbol = "___graceful-fs.previous";
}
function noop() {
}
function publishQueue(context, queue) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue;
    }
  });
}
var debug = noop;
if (util$1.debuglog)
  debug = util$1.debuglog("gfs4");
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
  debug = function() {
    var m = util$1.format.apply(util$1, arguments);
    m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
    console.error(m);
  };
if (!fs$h[gracefulQueue]) {
  var queue = commonjsGlobal[gracefulQueue] || [];
  publishQueue(fs$h, queue);
  fs$h.close = function(fs$close) {
    function close(fd, cb) {
      return fs$close.call(fs$h, fd, function(err) {
        if (!err) {
          resetQueue();
        }
        if (typeof cb === "function")
          cb.apply(this, arguments);
      });
    }
    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    });
    return close;
  }(fs$h.close);
  fs$h.closeSync = function(fs$closeSync) {
    function closeSync(fd) {
      fs$closeSync.apply(fs$h, arguments);
      resetQueue();
    }
    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    });
    return closeSync;
  }(fs$h.closeSync);
  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
    process.on("exit", function() {
      debug(fs$h[gracefulQueue]);
      require$$0$2.equal(fs$h[gracefulQueue].length, 0);
    });
  }
}
if (!commonjsGlobal[gracefulQueue]) {
  publishQueue(commonjsGlobal, fs$h[gracefulQueue]);
}
var gracefulFs = patch(clone(fs$h));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs$h.__patched) {
  gracefulFs = patch(fs$h);
  fs$h.__patched = true;
}
function patch(fs2) {
  polyfills(fs2);
  fs2.gracefulify = patch;
  fs2.createReadStream = createReadStream;
  fs2.createWriteStream = createWriteStream;
  var fs$readFile = fs2.readFile;
  fs2.readFile = readFile2;
  function readFile2(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$readFile(path2, options, cb);
    function go$readFile(path3, options2, cb2, startTime) {
      return fs$readFile(path3, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$readFile, [path3, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$writeFile = fs2.writeFile;
  fs2.writeFile = writeFile2;
  function writeFile2(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$writeFile(path2, data, options, cb);
    function go$writeFile(path3, data2, options2, cb2, startTime) {
      return fs$writeFile(path3, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$writeFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$appendFile = fs2.appendFile;
  if (fs$appendFile)
    fs2.appendFile = appendFile;
  function appendFile(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$appendFile(path2, data, options, cb);
    function go$appendFile(path3, data2, options2, cb2, startTime) {
      return fs$appendFile(path3, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$appendFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$copyFile = fs2.copyFile;
  if (fs$copyFile)
    fs2.copyFile = copyFile2;
  function copyFile2(src, dest, flags, cb) {
    if (typeof flags === "function") {
      cb = flags;
      flags = 0;
    }
    return go$copyFile(src, dest, flags, cb);
    function go$copyFile(src2, dest2, flags2, cb2, startTime) {
      return fs$copyFile(src2, dest2, flags2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$readdir = fs2.readdir;
  fs2.readdir = readdir;
  var noReaddirOptionVersions = /^v[0-5]\./;
  function readdir(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path3, options2, cb2, startTime) {
      return fs$readdir(path3, fs$readdirCallback(
        path3,
        options2,
        cb2,
        startTime
      ));
    } : function go$readdir2(path3, options2, cb2, startTime) {
      return fs$readdir(path3, options2, fs$readdirCallback(
        path3,
        options2,
        cb2,
        startTime
      ));
    };
    return go$readdir(path2, options, cb);
    function fs$readdirCallback(path3, options2, cb2, startTime) {
      return function(err, files) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([
            go$readdir,
            [path3, options2, cb2],
            err,
            startTime || Date.now(),
            Date.now()
          ]);
        else {
          if (files && files.sort)
            files.sort();
          if (typeof cb2 === "function")
            cb2.call(this, err, files);
        }
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var legStreams = legacy(fs2);
    ReadStream = legStreams.ReadStream;
    WriteStream = legStreams.WriteStream;
  }
  var fs$ReadStream = fs2.ReadStream;
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype);
    ReadStream.prototype.open = ReadStream$open;
  }
  var fs$WriteStream = fs2.WriteStream;
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype);
    WriteStream.prototype.open = WriteStream$open;
  }
  Object.defineProperty(fs2, "ReadStream", {
    get: function() {
      return ReadStream;
    },
    set: function(val) {
      ReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fs2, "WriteStream", {
    get: function() {
      return WriteStream;
    },
    set: function(val) {
      WriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileReadStream = ReadStream;
  Object.defineProperty(fs2, "FileReadStream", {
    get: function() {
      return FileReadStream;
    },
    set: function(val) {
      FileReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileWriteStream = WriteStream;
  Object.defineProperty(fs2, "FileWriteStream", {
    get: function() {
      return FileWriteStream;
    },
    set: function(val) {
      FileWriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  function ReadStream(path2, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this;
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
  }
  function ReadStream$open() {
    var that = this;
    open(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
        that.read();
      }
    });
  }
  function WriteStream(path2, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this;
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
  }
  function WriteStream$open() {
    var that = this;
    open(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
      }
    });
  }
  function createReadStream(path2, options) {
    return new fs2.ReadStream(path2, options);
  }
  function createWriteStream(path2, options) {
    return new fs2.WriteStream(path2, options);
  }
  var fs$open = fs2.open;
  fs2.open = open;
  function open(path2, flags, mode, cb) {
    if (typeof mode === "function")
      cb = mode, mode = null;
    return go$open(path2, flags, mode, cb);
    function go$open(path3, flags2, mode2, cb2, startTime) {
      return fs$open(path3, flags2, mode2, function(err, fd) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$open, [path3, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  return fs2;
}
function enqueue(elem) {
  debug("ENQUEUE", elem[0].name, elem[1]);
  fs$h[gracefulQueue].push(elem);
  retry();
}
var retryTimer;
function resetQueue() {
  var now = Date.now();
  for (var i = 0; i < fs$h[gracefulQueue].length; ++i) {
    if (fs$h[gracefulQueue][i].length > 2) {
      fs$h[gracefulQueue][i][3] = now;
      fs$h[gracefulQueue][i][4] = now;
    }
  }
  retry();
}
function retry() {
  clearTimeout(retryTimer);
  retryTimer = void 0;
  if (fs$h[gracefulQueue].length === 0)
    return;
  var elem = fs$h[gracefulQueue].shift();
  var fn = elem[0];
  var args = elem[1];
  var err = elem[2];
  var startTime = elem[3];
  var lastTime = elem[4];
  if (startTime === void 0) {
    debug("RETRY", fn.name, args);
    fn.apply(null, args);
  } else if (Date.now() - startTime >= 6e4) {
    debug("TIMEOUT", fn.name, args);
    var cb = args.pop();
    if (typeof cb === "function")
      cb.call(null, err);
  } else {
    var sinceAttempt = Date.now() - lastTime;
    var sinceStart = Math.max(lastTime - startTime, 1);
    var desiredDelay = Math.min(sinceStart * 1.2, 100);
    if (sinceAttempt >= desiredDelay) {
      debug("RETRY", fn.name, args);
      fn.apply(null, args.concat([startTime]));
    } else {
      fs$h[gracefulQueue].push(elem);
    }
  }
  if (retryTimer === void 0) {
    retryTimer = setTimeout(retry, 0);
  }
}
(function(exports2) {
  const u2 = universalify$1.fromCallback;
  const fs2 = gracefulFs;
  const api = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((key) => {
    return typeof fs2[key] === "function";
  });
  Object.assign(exports2, fs2);
  api.forEach((method) => {
    exports2[method] = u2(fs2[method]);
  });
  exports2.exists = function(filename, callback) {
    if (typeof callback === "function") {
      return fs2.exists(filename, callback);
    }
    return new Promise((resolve2) => {
      return fs2.exists(filename, resolve2);
    });
  };
  exports2.read = function(fd, buffer, offset, length, position, callback) {
    if (typeof callback === "function") {
      return fs2.read(fd, buffer, offset, length, position, callback);
    }
    return new Promise((resolve2, reject) => {
      fs2.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
        if (err)
          return reject(err);
        resolve2({ bytesRead, buffer: buffer2 });
      });
    });
  };
  exports2.write = function(fd, buffer, ...args) {
    if (typeof args[args.length - 1] === "function") {
      return fs2.write(fd, buffer, ...args);
    }
    return new Promise((resolve2, reject) => {
      fs2.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
        if (err)
          return reject(err);
        resolve2({ bytesWritten, buffer: buffer2 });
      });
    });
  };
  if (typeof fs2.writev === "function") {
    exports2.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs2.writev(fd, buffers, ...args);
      }
      return new Promise((resolve2, reject) => {
        fs2.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err)
            return reject(err);
          resolve2({ bytesWritten, buffers: buffers2 });
        });
      });
    };
  }
  if (typeof fs2.realpath.native === "function") {
    exports2.realpath.native = u2(fs2.realpath.native);
  } else {
    process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  }
})(fs$i);
var makeDir$1 = {};
var utils$1 = {};
const path$c = require$$1;
utils$1.checkPath = function checkPath(pth) {
  if (process.platform === "win32") {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path$c.parse(pth).root, ""));
    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`);
      error.code = "EINVAL";
      throw error;
    }
  }
};
const fs$g = fs$i;
const { checkPath: checkPath2 } = utils$1;
const getMode = (options) => {
  const defaults2 = { mode: 511 };
  if (typeof options === "number")
    return options;
  return { ...defaults2, ...options }.mode;
};
makeDir$1.makeDir = async (dir, options) => {
  checkPath2(dir);
  return fs$g.mkdir(dir, {
    mode: getMode(options),
    recursive: true
  });
};
makeDir$1.makeDirSync = (dir, options) => {
  checkPath2(dir);
  return fs$g.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true
  });
};
const u$a = universalify$1.fromPromise;
const { makeDir: _makeDir, makeDirSync } = makeDir$1;
const makeDir = u$a(_makeDir);
var mkdirs$2 = {
  mkdirs: makeDir,
  mkdirsSync: makeDirSync,
  // alias
  mkdirp: makeDir,
  mkdirpSync: makeDirSync,
  ensureDir: makeDir,
  ensureDirSync: makeDirSync
};
const u$9 = universalify$1.fromPromise;
const fs$f = fs$i;
function pathExists$6(path2) {
  return fs$f.access(path2).then(() => true).catch(() => false);
}
var pathExists_1 = {
  pathExists: u$9(pathExists$6),
  pathExistsSync: fs$f.existsSync
};
const fs$e = gracefulFs;
function utimesMillis$1(path2, atime, mtime, callback) {
  fs$e.open(path2, "r+", (err, fd) => {
    if (err)
      return callback(err);
    fs$e.futimes(fd, atime, mtime, (futimesErr) => {
      fs$e.close(fd, (closeErr) => {
        if (callback)
          callback(futimesErr || closeErr);
      });
    });
  });
}
function utimesMillisSync$1(path2, atime, mtime) {
  const fd = fs$e.openSync(path2, "r+");
  fs$e.futimesSync(fd, atime, mtime);
  return fs$e.closeSync(fd);
}
var utimes = {
  utimesMillis: utimesMillis$1,
  utimesMillisSync: utimesMillisSync$1
};
const fs$d = fs$i;
const path$b = require$$1;
const util = require$$4;
function getStats$2(src, dest, opts) {
  const statFunc = opts.dereference ? (file2) => fs$d.stat(file2, { bigint: true }) : (file2) => fs$d.lstat(file2, { bigint: true });
  return Promise.all([
    statFunc(src),
    statFunc(dest).catch((err) => {
      if (err.code === "ENOENT")
        return null;
      throw err;
    })
  ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
}
function getStatsSync(src, dest, opts) {
  let destStat;
  const statFunc = opts.dereference ? (file2) => fs$d.statSync(file2, { bigint: true }) : (file2) => fs$d.lstatSync(file2, { bigint: true });
  const srcStat = statFunc(src);
  try {
    destStat = statFunc(dest);
  } catch (err) {
    if (err.code === "ENOENT")
      return { srcStat, destStat: null };
    throw err;
  }
  return { srcStat, destStat };
}
function checkPaths(src, dest, funcName, opts, cb) {
  util.callbackify(getStats$2)(src, dest, opts, (err, stats) => {
    if (err)
      return cb(err);
    const { srcStat, destStat } = stats;
    if (destStat) {
      if (areIdentical$2(srcStat, destStat)) {
        const srcBaseName = path$b.basename(src);
        const destBaseName = path$b.basename(dest);
        if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
          return cb(null, { srcStat, destStat, isChangingCase: true });
        }
        return cb(new Error("Source and destination must not be the same."));
      }
      if (srcStat.isDirectory() && !destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
      }
      if (!srcStat.isDirectory() && destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
      }
    }
    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
      return cb(new Error(errMsg(src, dest, funcName)));
    }
    return cb(null, { srcStat, destStat });
  });
}
function checkPathsSync(src, dest, funcName, opts) {
  const { srcStat, destStat } = getStatsSync(src, dest, opts);
  if (destStat) {
    if (areIdentical$2(srcStat, destStat)) {
      const srcBaseName = path$b.basename(src);
      const destBaseName = path$b.basename(dest);
      if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
        return { srcStat, destStat, isChangingCase: true };
      }
      throw new Error("Source and destination must not be the same.");
    }
    if (srcStat.isDirectory() && !destStat.isDirectory()) {
      throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
    }
    if (!srcStat.isDirectory() && destStat.isDirectory()) {
      throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
    }
  }
  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return { srcStat, destStat };
}
function checkParentPaths(src, srcStat, dest, funcName, cb) {
  const srcParent = path$b.resolve(path$b.dirname(src));
  const destParent = path$b.resolve(path$b.dirname(dest));
  if (destParent === srcParent || destParent === path$b.parse(destParent).root)
    return cb();
  fs$d.stat(destParent, { bigint: true }, (err, destStat) => {
    if (err) {
      if (err.code === "ENOENT")
        return cb();
      return cb(err);
    }
    if (areIdentical$2(srcStat, destStat)) {
      return cb(new Error(errMsg(src, dest, funcName)));
    }
    return checkParentPaths(src, srcStat, destParent, funcName, cb);
  });
}
function checkParentPathsSync(src, srcStat, dest, funcName) {
  const srcParent = path$b.resolve(path$b.dirname(src));
  const destParent = path$b.resolve(path$b.dirname(dest));
  if (destParent === srcParent || destParent === path$b.parse(destParent).root)
    return;
  let destStat;
  try {
    destStat = fs$d.statSync(destParent, { bigint: true });
  } catch (err) {
    if (err.code === "ENOENT")
      return;
    throw err;
  }
  if (areIdentical$2(srcStat, destStat)) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return checkParentPathsSync(src, srcStat, destParent, funcName);
}
function areIdentical$2(srcStat, destStat) {
  return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
}
function isSrcSubdir(src, dest) {
  const srcArr = path$b.resolve(src).split(path$b.sep).filter((i) => i);
  const destArr = path$b.resolve(dest).split(path$b.sep).filter((i) => i);
  return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
}
function errMsg(src, dest, funcName) {
  return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
}
var stat$4 = {
  checkPaths,
  checkPathsSync,
  checkParentPaths,
  checkParentPathsSync,
  isSrcSubdir,
  areIdentical: areIdentical$2
};
const fs$c = gracefulFs;
const path$a = require$$1;
const mkdirs$1 = mkdirs$2.mkdirs;
const pathExists$5 = pathExists_1.pathExists;
const utimesMillis = utimes.utimesMillis;
const stat$3 = stat$4;
function copy$2(src, dest, opts, cb) {
  if (typeof opts === "function" && !cb) {
    cb = opts;
    opts = {};
  } else if (typeof opts === "function") {
    opts = { filter: opts };
  }
  cb = cb || function() {
  };
  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    process.emitWarning(
      "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
      "Warning",
      "fs-extra-WARN0001"
    );
  }
  stat$3.checkPaths(src, dest, "copy", opts, (err, stats) => {
    if (err)
      return cb(err);
    const { srcStat, destStat } = stats;
    stat$3.checkParentPaths(src, srcStat, dest, "copy", (err2) => {
      if (err2)
        return cb(err2);
      if (opts.filter)
        return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
      return checkParentDir(destStat, src, dest, opts, cb);
    });
  });
}
function checkParentDir(destStat, src, dest, opts, cb) {
  const destParent = path$a.dirname(dest);
  pathExists$5(destParent, (err, dirExists) => {
    if (err)
      return cb(err);
    if (dirExists)
      return getStats$1(destStat, src, dest, opts, cb);
    mkdirs$1(destParent, (err2) => {
      if (err2)
        return cb(err2);
      return getStats$1(destStat, src, dest, opts, cb);
    });
  });
}
function handleFilter(onInclude, destStat, src, dest, opts, cb) {
  Promise.resolve(opts.filter(src, dest)).then((include) => {
    if (include)
      return onInclude(destStat, src, dest, opts, cb);
    return cb();
  }, (error) => cb(error));
}
function startCopy$1(destStat, src, dest, opts, cb) {
  if (opts.filter)
    return handleFilter(getStats$1, destStat, src, dest, opts, cb);
  return getStats$1(destStat, src, dest, opts, cb);
}
function getStats$1(destStat, src, dest, opts, cb) {
  const stat2 = opts.dereference ? fs$c.stat : fs$c.lstat;
  stat2(src, (err, srcStat) => {
    if (err)
      return cb(err);
    if (srcStat.isDirectory())
      return onDir$1(srcStat, destStat, src, dest, opts, cb);
    else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
      return onFile$1(srcStat, destStat, src, dest, opts, cb);
    else if (srcStat.isSymbolicLink())
      return onLink$1(destStat, src, dest, opts, cb);
    else if (srcStat.isSocket())
      return cb(new Error(`Cannot copy a socket file: ${src}`));
    else if (srcStat.isFIFO())
      return cb(new Error(`Cannot copy a FIFO pipe: ${src}`));
    return cb(new Error(`Unknown file: ${src}`));
  });
}
function onFile$1(srcStat, destStat, src, dest, opts, cb) {
  if (!destStat)
    return copyFile$1(srcStat, src, dest, opts, cb);
  return mayCopyFile$1(srcStat, src, dest, opts, cb);
}
function mayCopyFile$1(srcStat, src, dest, opts, cb) {
  if (opts.overwrite) {
    fs$c.unlink(dest, (err) => {
      if (err)
        return cb(err);
      return copyFile$1(srcStat, src, dest, opts, cb);
    });
  } else if (opts.errorOnExist) {
    return cb(new Error(`'${dest}' already exists`));
  } else
    return cb();
}
function copyFile$1(srcStat, src, dest, opts, cb) {
  fs$c.copyFile(src, dest, (err) => {
    if (err)
      return cb(err);
    if (opts.preserveTimestamps)
      return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
    return setDestMode$1(dest, srcStat.mode, cb);
  });
}
function handleTimestampsAndMode(srcMode, src, dest, cb) {
  if (fileIsNotWritable$1(srcMode)) {
    return makeFileWritable$1(dest, srcMode, (err) => {
      if (err)
        return cb(err);
      return setDestTimestampsAndMode(srcMode, src, dest, cb);
    });
  }
  return setDestTimestampsAndMode(srcMode, src, dest, cb);
}
function fileIsNotWritable$1(srcMode) {
  return (srcMode & 128) === 0;
}
function makeFileWritable$1(dest, srcMode, cb) {
  return setDestMode$1(dest, srcMode | 128, cb);
}
function setDestTimestampsAndMode(srcMode, src, dest, cb) {
  setDestTimestamps$1(src, dest, (err) => {
    if (err)
      return cb(err);
    return setDestMode$1(dest, srcMode, cb);
  });
}
function setDestMode$1(dest, srcMode, cb) {
  return fs$c.chmod(dest, srcMode, cb);
}
function setDestTimestamps$1(src, dest, cb) {
  fs$c.stat(src, (err, updatedSrcStat) => {
    if (err)
      return cb(err);
    return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
  });
}
function onDir$1(srcStat, destStat, src, dest, opts, cb) {
  if (!destStat)
    return mkDirAndCopy$1(srcStat.mode, src, dest, opts, cb);
  return copyDir$1(src, dest, opts, cb);
}
function mkDirAndCopy$1(srcMode, src, dest, opts, cb) {
  fs$c.mkdir(dest, (err) => {
    if (err)
      return cb(err);
    copyDir$1(src, dest, opts, (err2) => {
      if (err2)
        return cb(err2);
      return setDestMode$1(dest, srcMode, cb);
    });
  });
}
function copyDir$1(src, dest, opts, cb) {
  fs$c.readdir(src, (err, items) => {
    if (err)
      return cb(err);
    return copyDirItems(items, src, dest, opts, cb);
  });
}
function copyDirItems(items, src, dest, opts, cb) {
  const item = items.pop();
  if (!item)
    return cb();
  return copyDirItem$1(items, item, src, dest, opts, cb);
}
function copyDirItem$1(items, item, src, dest, opts, cb) {
  const srcItem = path$a.join(src, item);
  const destItem = path$a.join(dest, item);
  stat$3.checkPaths(srcItem, destItem, "copy", opts, (err, stats) => {
    if (err)
      return cb(err);
    const { destStat } = stats;
    startCopy$1(destStat, srcItem, destItem, opts, (err2) => {
      if (err2)
        return cb(err2);
      return copyDirItems(items, src, dest, opts, cb);
    });
  });
}
function onLink$1(destStat, src, dest, opts, cb) {
  fs$c.readlink(src, (err, resolvedSrc) => {
    if (err)
      return cb(err);
    if (opts.dereference) {
      resolvedSrc = path$a.resolve(process.cwd(), resolvedSrc);
    }
    if (!destStat) {
      return fs$c.symlink(resolvedSrc, dest, cb);
    } else {
      fs$c.readlink(dest, (err2, resolvedDest) => {
        if (err2) {
          if (err2.code === "EINVAL" || err2.code === "UNKNOWN")
            return fs$c.symlink(resolvedSrc, dest, cb);
          return cb(err2);
        }
        if (opts.dereference) {
          resolvedDest = path$a.resolve(process.cwd(), resolvedDest);
        }
        if (stat$3.isSrcSubdir(resolvedSrc, resolvedDest)) {
          return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
        }
        if (destStat.isDirectory() && stat$3.isSrcSubdir(resolvedDest, resolvedSrc)) {
          return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
        }
        return copyLink$1(resolvedSrc, dest, cb);
      });
    }
  });
}
function copyLink$1(resolvedSrc, dest, cb) {
  fs$c.unlink(dest, (err) => {
    if (err)
      return cb(err);
    return fs$c.symlink(resolvedSrc, dest, cb);
  });
}
var copy_1 = copy$2;
const fs$b = gracefulFs;
const path$9 = require$$1;
const mkdirsSync$1 = mkdirs$2.mkdirsSync;
const utimesMillisSync = utimes.utimesMillisSync;
const stat$2 = stat$4;
function copySync$1(src, dest, opts) {
  if (typeof opts === "function") {
    opts = { filter: opts };
  }
  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    process.emitWarning(
      "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
      "Warning",
      "fs-extra-WARN0002"
    );
  }
  const { srcStat, destStat } = stat$2.checkPathsSync(src, dest, "copy", opts);
  stat$2.checkParentPathsSync(src, srcStat, dest, "copy");
  return handleFilterAndCopy(destStat, src, dest, opts);
}
function handleFilterAndCopy(destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest))
    return;
  const destParent = path$9.dirname(dest);
  if (!fs$b.existsSync(destParent))
    mkdirsSync$1(destParent);
  return getStats(destStat, src, dest, opts);
}
function startCopy(destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest))
    return;
  return getStats(destStat, src, dest, opts);
}
function getStats(destStat, src, dest, opts) {
  const statSync = opts.dereference ? fs$b.statSync : fs$b.lstatSync;
  const srcStat = statSync(src);
  if (srcStat.isDirectory())
    return onDir(srcStat, destStat, src, dest, opts);
  else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
    return onFile(srcStat, destStat, src, dest, opts);
  else if (srcStat.isSymbolicLink())
    return onLink(destStat, src, dest, opts);
  else if (srcStat.isSocket())
    throw new Error(`Cannot copy a socket file: ${src}`);
  else if (srcStat.isFIFO())
    throw new Error(`Cannot copy a FIFO pipe: ${src}`);
  throw new Error(`Unknown file: ${src}`);
}
function onFile(srcStat, destStat, src, dest, opts) {
  if (!destStat)
    return copyFile(srcStat, src, dest, opts);
  return mayCopyFile(srcStat, src, dest, opts);
}
function mayCopyFile(srcStat, src, dest, opts) {
  if (opts.overwrite) {
    fs$b.unlinkSync(dest);
    return copyFile(srcStat, src, dest, opts);
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`);
  }
}
function copyFile(srcStat, src, dest, opts) {
  fs$b.copyFileSync(src, dest);
  if (opts.preserveTimestamps)
    handleTimestamps(srcStat.mode, src, dest);
  return setDestMode(dest, srcStat.mode);
}
function handleTimestamps(srcMode, src, dest) {
  if (fileIsNotWritable(srcMode))
    makeFileWritable(dest, srcMode);
  return setDestTimestamps(src, dest);
}
function fileIsNotWritable(srcMode) {
  return (srcMode & 128) === 0;
}
function makeFileWritable(dest, srcMode) {
  return setDestMode(dest, srcMode | 128);
}
function setDestMode(dest, srcMode) {
  return fs$b.chmodSync(dest, srcMode);
}
function setDestTimestamps(src, dest) {
  const updatedSrcStat = fs$b.statSync(src);
  return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
}
function onDir(srcStat, destStat, src, dest, opts) {
  if (!destStat)
    return mkDirAndCopy(srcStat.mode, src, dest, opts);
  return copyDir(src, dest, opts);
}
function mkDirAndCopy(srcMode, src, dest, opts) {
  fs$b.mkdirSync(dest);
  copyDir(src, dest, opts);
  return setDestMode(dest, srcMode);
}
function copyDir(src, dest, opts) {
  fs$b.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
}
function copyDirItem(item, src, dest, opts) {
  const srcItem = path$9.join(src, item);
  const destItem = path$9.join(dest, item);
  const { destStat } = stat$2.checkPathsSync(srcItem, destItem, "copy", opts);
  return startCopy(destStat, srcItem, destItem, opts);
}
function onLink(destStat, src, dest, opts) {
  let resolvedSrc = fs$b.readlinkSync(src);
  if (opts.dereference) {
    resolvedSrc = path$9.resolve(process.cwd(), resolvedSrc);
  }
  if (!destStat) {
    return fs$b.symlinkSync(resolvedSrc, dest);
  } else {
    let resolvedDest;
    try {
      resolvedDest = fs$b.readlinkSync(dest);
    } catch (err) {
      if (err.code === "EINVAL" || err.code === "UNKNOWN")
        return fs$b.symlinkSync(resolvedSrc, dest);
      throw err;
    }
    if (opts.dereference) {
      resolvedDest = path$9.resolve(process.cwd(), resolvedDest);
    }
    if (stat$2.isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
    }
    if (fs$b.statSync(dest).isDirectory() && stat$2.isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
    }
    return copyLink(resolvedSrc, dest);
  }
}
function copyLink(resolvedSrc, dest) {
  fs$b.unlinkSync(dest);
  return fs$b.symlinkSync(resolvedSrc, dest);
}
var copySync_1 = copySync$1;
const u$8 = universalify$1.fromCallback;
var copy$1 = {
  copy: u$8(copy_1),
  copySync: copySync_1
};
const fs$a = gracefulFs;
const path$8 = require$$1;
const assert = require$$0$2;
const isWindows = process.platform === "win32";
function defaults(options) {
  const methods = [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ];
  methods.forEach((m) => {
    options[m] = options[m] || fs$a[m];
    m = m + "Sync";
    options[m] = options[m] || fs$a[m];
  });
  options.maxBusyTries = options.maxBusyTries || 3;
}
function rimraf$1(p, options, cb) {
  let busyTries = 0;
  if (typeof options === "function") {
    cb = options;
    options = {};
  }
  assert(p, "rimraf: missing path");
  assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
  assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
  assert(options, "rimraf: invalid options argument provided");
  assert.strictEqual(typeof options, "object", "rimraf: options should be object");
  defaults(options);
  rimraf_(p, options, function CB(er) {
    if (er) {
      if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
        busyTries++;
        const time = busyTries * 100;
        return setTimeout(() => rimraf_(p, options, CB), time);
      }
      if (er.code === "ENOENT")
        er = null;
    }
    cb(er);
  });
}
function rimraf_(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.lstat(p, (er, st) => {
    if (er && er.code === "ENOENT") {
      return cb(null);
    }
    if (er && er.code === "EPERM" && isWindows) {
      return fixWinEPERM(p, options, er, cb);
    }
    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb);
    }
    options.unlink(p, (er2) => {
      if (er2) {
        if (er2.code === "ENOENT") {
          return cb(null);
        }
        if (er2.code === "EPERM") {
          return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
        }
        if (er2.code === "EISDIR") {
          return rmdir(p, options, er2, cb);
        }
      }
      return cb(er2);
    });
  });
}
function fixWinEPERM(p, options, er, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.chmod(p, 438, (er2) => {
    if (er2) {
      cb(er2.code === "ENOENT" ? null : er);
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === "ENOENT" ? null : er);
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb);
        } else {
          options.unlink(p, cb);
        }
      });
    }
  });
}
function fixWinEPERMSync(p, options, er) {
  let stats;
  assert(p);
  assert(options);
  try {
    options.chmodSync(p, 438);
  } catch (er2) {
    if (er2.code === "ENOENT") {
      return;
    } else {
      throw er;
    }
  }
  try {
    stats = options.statSync(p);
  } catch (er3) {
    if (er3.code === "ENOENT") {
      return;
    } else {
      throw er;
    }
  }
  if (stats.isDirectory()) {
    rmdirSync(p, options, er);
  } else {
    options.unlinkSync(p);
  }
}
function rmdir(p, options, originalEr, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.rmdir(p, (er) => {
    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
      rmkids(p, options, cb);
    } else if (er && er.code === "ENOTDIR") {
      cb(originalEr);
    } else {
      cb(er);
    }
  });
}
function rmkids(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.readdir(p, (er, files) => {
    if (er)
      return cb(er);
    let n = files.length;
    let errState;
    if (n === 0)
      return options.rmdir(p, cb);
    files.forEach((f) => {
      rimraf$1(path$8.join(p, f), options, (er2) => {
        if (errState) {
          return;
        }
        if (er2)
          return cb(errState = er2);
        if (--n === 0) {
          options.rmdir(p, cb);
        }
      });
    });
  });
}
function rimrafSync(p, options) {
  let st;
  options = options || {};
  defaults(options);
  assert(p, "rimraf: missing path");
  assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
  assert(options, "rimraf: missing options");
  assert.strictEqual(typeof options, "object", "rimraf: options should be object");
  try {
    st = options.lstatSync(p);
  } catch (er) {
    if (er.code === "ENOENT") {
      return;
    }
    if (er.code === "EPERM" && isWindows) {
      fixWinEPERMSync(p, options, er);
    }
  }
  try {
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null);
    } else {
      options.unlinkSync(p);
    }
  } catch (er) {
    if (er.code === "ENOENT") {
      return;
    } else if (er.code === "EPERM") {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
    } else if (er.code !== "EISDIR") {
      throw er;
    }
    rmdirSync(p, options, er);
  }
}
function rmdirSync(p, options, originalEr) {
  assert(p);
  assert(options);
  try {
    options.rmdirSync(p);
  } catch (er) {
    if (er.code === "ENOTDIR") {
      throw originalEr;
    } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
      rmkidsSync(p, options);
    } else if (er.code !== "ENOENT") {
      throw er;
    }
  }
}
function rmkidsSync(p, options) {
  assert(p);
  assert(options);
  options.readdirSync(p).forEach((f) => rimrafSync(path$8.join(p, f), options));
  if (isWindows) {
    const startTime = Date.now();
    do {
      try {
        const ret = options.rmdirSync(p, options);
        return ret;
      } catch {
      }
    } while (Date.now() - startTime < 500);
  } else {
    const ret = options.rmdirSync(p, options);
    return ret;
  }
}
var rimraf_1 = rimraf$1;
rimraf$1.sync = rimrafSync;
const fs$9 = gracefulFs;
const u$7 = universalify$1.fromCallback;
const rimraf = rimraf_1;
function remove$2(path2, callback) {
  if (fs$9.rm)
    return fs$9.rm(path2, { recursive: true, force: true }, callback);
  rimraf(path2, callback);
}
function removeSync$1(path2) {
  if (fs$9.rmSync)
    return fs$9.rmSync(path2, { recursive: true, force: true });
  rimraf.sync(path2);
}
var remove_1 = {
  remove: u$7(remove$2),
  removeSync: removeSync$1
};
const u$6 = universalify$1.fromPromise;
const fs$8 = fs$i;
const path$7 = require$$1;
const mkdir$3 = mkdirs$2;
const remove$1 = remove_1;
const emptyDir = u$6(async function emptyDir2(dir) {
  let items;
  try {
    items = await fs$8.readdir(dir);
  } catch {
    return mkdir$3.mkdirs(dir);
  }
  return Promise.all(items.map((item) => remove$1.remove(path$7.join(dir, item))));
});
function emptyDirSync(dir) {
  let items;
  try {
    items = fs$8.readdirSync(dir);
  } catch {
    return mkdir$3.mkdirsSync(dir);
  }
  items.forEach((item) => {
    item = path$7.join(dir, item);
    remove$1.removeSync(item);
  });
}
var empty = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
};
const u$5 = universalify$1.fromCallback;
const path$6 = require$$1;
const fs$7 = gracefulFs;
const mkdir$2 = mkdirs$2;
function createFile$1(file2, callback) {
  function makeFile() {
    fs$7.writeFile(file2, "", (err) => {
      if (err)
        return callback(err);
      callback();
    });
  }
  fs$7.stat(file2, (err, stats) => {
    if (!err && stats.isFile())
      return callback();
    const dir = path$6.dirname(file2);
    fs$7.stat(dir, (err2, stats2) => {
      if (err2) {
        if (err2.code === "ENOENT") {
          return mkdir$2.mkdirs(dir, (err3) => {
            if (err3)
              return callback(err3);
            makeFile();
          });
        }
        return callback(err2);
      }
      if (stats2.isDirectory())
        makeFile();
      else {
        fs$7.readdir(dir, (err3) => {
          if (err3)
            return callback(err3);
        });
      }
    });
  });
}
function createFileSync$1(file2) {
  let stats;
  try {
    stats = fs$7.statSync(file2);
  } catch {
  }
  if (stats && stats.isFile())
    return;
  const dir = path$6.dirname(file2);
  try {
    if (!fs$7.statSync(dir).isDirectory()) {
      fs$7.readdirSync(dir);
    }
  } catch (err) {
    if (err && err.code === "ENOENT")
      mkdir$2.mkdirsSync(dir);
    else
      throw err;
  }
  fs$7.writeFileSync(file2, "");
}
var file = {
  createFile: u$5(createFile$1),
  createFileSync: createFileSync$1
};
const u$4 = universalify$1.fromCallback;
const path$5 = require$$1;
const fs$6 = gracefulFs;
const mkdir$1 = mkdirs$2;
const pathExists$4 = pathExists_1.pathExists;
const { areIdentical: areIdentical$1 } = stat$4;
function createLink$1(srcpath, dstpath, callback) {
  function makeLink(srcpath2, dstpath2) {
    fs$6.link(srcpath2, dstpath2, (err) => {
      if (err)
        return callback(err);
      callback(null);
    });
  }
  fs$6.lstat(dstpath, (_, dstStat) => {
    fs$6.lstat(srcpath, (err, srcStat) => {
      if (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        return callback(err);
      }
      if (dstStat && areIdentical$1(srcStat, dstStat))
        return callback(null);
      const dir = path$5.dirname(dstpath);
      pathExists$4(dir, (err2, dirExists) => {
        if (err2)
          return callback(err2);
        if (dirExists)
          return makeLink(srcpath, dstpath);
        mkdir$1.mkdirs(dir, (err3) => {
          if (err3)
            return callback(err3);
          makeLink(srcpath, dstpath);
        });
      });
    });
  });
}
function createLinkSync$1(srcpath, dstpath) {
  let dstStat;
  try {
    dstStat = fs$6.lstatSync(dstpath);
  } catch {
  }
  try {
    const srcStat = fs$6.lstatSync(srcpath);
    if (dstStat && areIdentical$1(srcStat, dstStat))
      return;
  } catch (err) {
    err.message = err.message.replace("lstat", "ensureLink");
    throw err;
  }
  const dir = path$5.dirname(dstpath);
  const dirExists = fs$6.existsSync(dir);
  if (dirExists)
    return fs$6.linkSync(srcpath, dstpath);
  mkdir$1.mkdirsSync(dir);
  return fs$6.linkSync(srcpath, dstpath);
}
var link = {
  createLink: u$4(createLink$1),
  createLinkSync: createLinkSync$1
};
const path$4 = require$$1;
const fs$5 = gracefulFs;
const pathExists$3 = pathExists_1.pathExists;
function symlinkPaths$1(srcpath, dstpath, callback) {
  if (path$4.isAbsolute(srcpath)) {
    return fs$5.lstat(srcpath, (err) => {
      if (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        return callback(err);
      }
      return callback(null, {
        toCwd: srcpath,
        toDst: srcpath
      });
    });
  } else {
    const dstdir = path$4.dirname(dstpath);
    const relativeToDst = path$4.join(dstdir, srcpath);
    return pathExists$3(relativeToDst, (err, exists) => {
      if (err)
        return callback(err);
      if (exists) {
        return callback(null, {
          toCwd: relativeToDst,
          toDst: srcpath
        });
      } else {
        return fs$5.lstat(srcpath, (err2) => {
          if (err2) {
            err2.message = err2.message.replace("lstat", "ensureSymlink");
            return callback(err2);
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: path$4.relative(dstdir, srcpath)
          });
        });
      }
    });
  }
}
function symlinkPathsSync$1(srcpath, dstpath) {
  let exists;
  if (path$4.isAbsolute(srcpath)) {
    exists = fs$5.existsSync(srcpath);
    if (!exists)
      throw new Error("absolute srcpath does not exist");
    return {
      toCwd: srcpath,
      toDst: srcpath
    };
  } else {
    const dstdir = path$4.dirname(dstpath);
    const relativeToDst = path$4.join(dstdir, srcpath);
    exists = fs$5.existsSync(relativeToDst);
    if (exists) {
      return {
        toCwd: relativeToDst,
        toDst: srcpath
      };
    } else {
      exists = fs$5.existsSync(srcpath);
      if (!exists)
        throw new Error("relative srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: path$4.relative(dstdir, srcpath)
      };
    }
  }
}
var symlinkPaths_1 = {
  symlinkPaths: symlinkPaths$1,
  symlinkPathsSync: symlinkPathsSync$1
};
const fs$4 = gracefulFs;
function symlinkType$1(srcpath, type, callback) {
  callback = typeof type === "function" ? type : callback;
  type = typeof type === "function" ? false : type;
  if (type)
    return callback(null, type);
  fs$4.lstat(srcpath, (err, stats) => {
    if (err)
      return callback(null, "file");
    type = stats && stats.isDirectory() ? "dir" : "file";
    callback(null, type);
  });
}
function symlinkTypeSync$1(srcpath, type) {
  let stats;
  if (type)
    return type;
  try {
    stats = fs$4.lstatSync(srcpath);
  } catch {
    return "file";
  }
  return stats && stats.isDirectory() ? "dir" : "file";
}
var symlinkType_1 = {
  symlinkType: symlinkType$1,
  symlinkTypeSync: symlinkTypeSync$1
};
const u$3 = universalify$1.fromCallback;
const path$3 = require$$1;
const fs$3 = fs$i;
const _mkdirs = mkdirs$2;
const mkdirs = _mkdirs.mkdirs;
const mkdirsSync = _mkdirs.mkdirsSync;
const _symlinkPaths = symlinkPaths_1;
const symlinkPaths = _symlinkPaths.symlinkPaths;
const symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
const _symlinkType = symlinkType_1;
const symlinkType = _symlinkType.symlinkType;
const symlinkTypeSync = _symlinkType.symlinkTypeSync;
const pathExists$2 = pathExists_1.pathExists;
const { areIdentical } = stat$4;
function createSymlink$1(srcpath, dstpath, type, callback) {
  callback = typeof type === "function" ? type : callback;
  type = typeof type === "function" ? false : type;
  fs$3.lstat(dstpath, (err, stats) => {
    if (!err && stats.isSymbolicLink()) {
      Promise.all([
        fs$3.stat(srcpath),
        fs$3.stat(dstpath)
      ]).then(([srcStat, dstStat]) => {
        if (areIdentical(srcStat, dstStat))
          return callback(null);
        _createSymlink(srcpath, dstpath, type, callback);
      });
    } else
      _createSymlink(srcpath, dstpath, type, callback);
  });
}
function _createSymlink(srcpath, dstpath, type, callback) {
  symlinkPaths(srcpath, dstpath, (err, relative2) => {
    if (err)
      return callback(err);
    srcpath = relative2.toDst;
    symlinkType(relative2.toCwd, type, (err2, type2) => {
      if (err2)
        return callback(err2);
      const dir = path$3.dirname(dstpath);
      pathExists$2(dir, (err3, dirExists) => {
        if (err3)
          return callback(err3);
        if (dirExists)
          return fs$3.symlink(srcpath, dstpath, type2, callback);
        mkdirs(dir, (err4) => {
          if (err4)
            return callback(err4);
          fs$3.symlink(srcpath, dstpath, type2, callback);
        });
      });
    });
  });
}
function createSymlinkSync$1(srcpath, dstpath, type) {
  let stats;
  try {
    stats = fs$3.lstatSync(dstpath);
  } catch {
  }
  if (stats && stats.isSymbolicLink()) {
    const srcStat = fs$3.statSync(srcpath);
    const dstStat = fs$3.statSync(dstpath);
    if (areIdentical(srcStat, dstStat))
      return;
  }
  const relative2 = symlinkPathsSync(srcpath, dstpath);
  srcpath = relative2.toDst;
  type = symlinkTypeSync(relative2.toCwd, type);
  const dir = path$3.dirname(dstpath);
  const exists = fs$3.existsSync(dir);
  if (exists)
    return fs$3.symlinkSync(srcpath, dstpath, type);
  mkdirsSync(dir);
  return fs$3.symlinkSync(srcpath, dstpath, type);
}
var symlink = {
  createSymlink: u$3(createSymlink$1),
  createSymlinkSync: createSymlinkSync$1
};
const { createFile, createFileSync } = file;
const { createLink, createLinkSync } = link;
const { createSymlink, createSymlinkSync } = symlink;
var ensure = {
  // file
  createFile,
  createFileSync,
  ensureFile: createFile,
  ensureFileSync: createFileSync,
  // link
  createLink,
  createLinkSync,
  ensureLink: createLink,
  ensureLinkSync: createLinkSync,
  // symlink
  createSymlink,
  createSymlinkSync,
  ensureSymlink: createSymlink,
  ensureSymlinkSync: createSymlinkSync
};
function stringify$3(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
  const EOF = finalEOL ? EOL : "";
  const str = JSON.stringify(obj, replacer, spaces);
  return str.replace(/\n/g, EOL) + EOF;
}
function stripBom$1(content) {
  if (Buffer.isBuffer(content))
    content = content.toString("utf8");
  return content.replace(/^\uFEFF/, "");
}
var utils = { stringify: stringify$3, stripBom: stripBom$1 };
let _fs;
try {
  _fs = gracefulFs;
} catch (_) {
  _fs = fs$j;
}
const universalify = universalify$1;
const { stringify: stringify$2, stripBom } = utils;
async function _readFile(file2, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  const fs2 = options.fs || _fs;
  const shouldThrow = "throws" in options ? options.throws : true;
  let data = await universalify.fromCallback(fs2.readFile)(file2, options);
  data = stripBom(data);
  let obj;
  try {
    obj = JSON.parse(data, options ? options.reviver : null);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file2}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
  return obj;
}
const readFile = universalify.fromPromise(_readFile);
function readFileSync(file2, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  const fs2 = options.fs || _fs;
  const shouldThrow = "throws" in options ? options.throws : true;
  try {
    let content = fs2.readFileSync(file2, options);
    content = stripBom(content);
    return JSON.parse(content, options.reviver);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file2}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
}
async function _writeFile(file2, obj, options = {}) {
  const fs2 = options.fs || _fs;
  const str = stringify$2(obj, options);
  await universalify.fromCallback(fs2.writeFile)(file2, str, options);
}
const writeFile = universalify.fromPromise(_writeFile);
function writeFileSync(file2, obj, options = {}) {
  const fs2 = options.fs || _fs;
  const str = stringify$2(obj, options);
  return fs2.writeFileSync(file2, str, options);
}
const jsonfile$1 = {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync
};
var jsonfile_1 = jsonfile$1;
const jsonFile$1 = jsonfile_1;
var jsonfile = {
  // jsonfile exports
  readJson: jsonFile$1.readFile,
  readJsonSync: jsonFile$1.readFileSync,
  writeJson: jsonFile$1.writeFile,
  writeJsonSync: jsonFile$1.writeFileSync
};
const u$2 = universalify$1.fromCallback;
const fs$2 = gracefulFs;
const path$2 = require$$1;
const mkdir = mkdirs$2;
const pathExists$1 = pathExists_1.pathExists;
function outputFile$1(file2, data, encoding, callback) {
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = "utf8";
  }
  const dir = path$2.dirname(file2);
  pathExists$1(dir, (err, itDoes) => {
    if (err)
      return callback(err);
    if (itDoes)
      return fs$2.writeFile(file2, data, encoding, callback);
    mkdir.mkdirs(dir, (err2) => {
      if (err2)
        return callback(err2);
      fs$2.writeFile(file2, data, encoding, callback);
    });
  });
}
function outputFileSync$1(file2, ...args) {
  const dir = path$2.dirname(file2);
  if (fs$2.existsSync(dir)) {
    return fs$2.writeFileSync(file2, ...args);
  }
  mkdir.mkdirsSync(dir);
  fs$2.writeFileSync(file2, ...args);
}
var outputFile_1 = {
  outputFile: u$2(outputFile$1),
  outputFileSync: outputFileSync$1
};
const { stringify: stringify$1 } = utils;
const { outputFile } = outputFile_1;
async function outputJson(file2, data, options = {}) {
  const str = stringify$1(data, options);
  await outputFile(file2, str, options);
}
var outputJson_1 = outputJson;
const { stringify } = utils;
const { outputFileSync } = outputFile_1;
function outputJsonSync(file2, data, options) {
  const str = stringify(data, options);
  outputFileSync(file2, str, options);
}
var outputJsonSync_1 = outputJsonSync;
const u$1 = universalify$1.fromPromise;
const jsonFile = jsonfile;
jsonFile.outputJson = u$1(outputJson_1);
jsonFile.outputJsonSync = outputJsonSync_1;
jsonFile.outputJSON = jsonFile.outputJson;
jsonFile.outputJSONSync = jsonFile.outputJsonSync;
jsonFile.writeJSON = jsonFile.writeJson;
jsonFile.writeJSONSync = jsonFile.writeJsonSync;
jsonFile.readJSON = jsonFile.readJson;
jsonFile.readJSONSync = jsonFile.readJsonSync;
var json = jsonFile;
const fs$1 = gracefulFs;
const path$1 = require$$1;
const copy = copy$1.copy;
const remove = remove_1.remove;
const mkdirp = mkdirs$2.mkdirp;
const pathExists = pathExists_1.pathExists;
const stat$1 = stat$4;
function move$1(src, dest, opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;
  stat$1.checkPaths(src, dest, "move", opts, (err, stats) => {
    if (err)
      return cb(err);
    const { srcStat, isChangingCase = false } = stats;
    stat$1.checkParentPaths(src, srcStat, dest, "move", (err2) => {
      if (err2)
        return cb(err2);
      if (isParentRoot$1(dest))
        return doRename$1(src, dest, overwrite, isChangingCase, cb);
      mkdirp(path$1.dirname(dest), (err3) => {
        if (err3)
          return cb(err3);
        return doRename$1(src, dest, overwrite, isChangingCase, cb);
      });
    });
  });
}
function isParentRoot$1(dest) {
  const parent = path$1.dirname(dest);
  const parsedPath = path$1.parse(parent);
  return parsedPath.root === parent;
}
function doRename$1(src, dest, overwrite, isChangingCase, cb) {
  if (isChangingCase)
    return rename$1(src, dest, overwrite, cb);
  if (overwrite) {
    return remove(dest, (err) => {
      if (err)
        return cb(err);
      return rename$1(src, dest, overwrite, cb);
    });
  }
  pathExists(dest, (err, destExists) => {
    if (err)
      return cb(err);
    if (destExists)
      return cb(new Error("dest already exists."));
    return rename$1(src, dest, overwrite, cb);
  });
}
function rename$1(src, dest, overwrite, cb) {
  fs$1.rename(src, dest, (err) => {
    if (!err)
      return cb();
    if (err.code !== "EXDEV")
      return cb(err);
    return moveAcrossDevice$1(src, dest, overwrite, cb);
  });
}
function moveAcrossDevice$1(src, dest, overwrite, cb) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copy(src, dest, opts, (err) => {
    if (err)
      return cb(err);
    return remove(src, cb);
  });
}
var move_1 = move$1;
const fs = gracefulFs;
const path = require$$1;
const copySync = copy$1.copySync;
const removeSync = remove_1.removeSync;
const mkdirpSync = mkdirs$2.mkdirpSync;
const stat = stat$4;
function moveSync(src, dest, opts) {
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;
  const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
  stat.checkParentPathsSync(src, srcStat, dest, "move");
  if (!isParentRoot(dest))
    mkdirpSync(path.dirname(dest));
  return doRename(src, dest, overwrite, isChangingCase);
}
function isParentRoot(dest) {
  const parent = path.dirname(dest);
  const parsedPath = path.parse(parent);
  return parsedPath.root === parent;
}
function doRename(src, dest, overwrite, isChangingCase) {
  if (isChangingCase)
    return rename(src, dest, overwrite);
  if (overwrite) {
    removeSync(dest);
    return rename(src, dest, overwrite);
  }
  if (fs.existsSync(dest))
    throw new Error("dest already exists.");
  return rename(src, dest, overwrite);
}
function rename(src, dest, overwrite) {
  try {
    fs.renameSync(src, dest);
  } catch (err) {
    if (err.code !== "EXDEV")
      throw err;
    return moveAcrossDevice(src, dest, overwrite);
  }
}
function moveAcrossDevice(src, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copySync(src, dest, opts);
  return removeSync(src);
}
var moveSync_1 = moveSync;
const u = universalify$1.fromCallback;
var move = {
  move: u(move_1),
  moveSync: moveSync_1
};
var lib = {
  // Export promiseified graceful-fs:
  ...fs$i,
  // Export extra methods:
  ...copy$1,
  ...empty,
  ...ensure,
  ...json,
  ...mkdirs$2,
  ...move,
  ...outputFile_1,
  ...pathExists_1,
  ...remove_1
};
const ID_FILTER_REG = /\.(mjs|js|ts|vue|jsx|tsx)(\?.*|)$/;
const NODE_MODULES_FLAG = "node_modules";
const CACHE_DIR = ".vite-plugin-externals";
const defaultOptions = {
  disableInServe: false,
  disableSsr: true,
  filter(_, id, __, isBuild) {
    if (!ID_FILTER_REG.test(id) || id.includes(NODE_MODULES_FLAG) && !isBuild) {
      return false;
    }
    return true;
  },
  useWindow: true,
  sourceMapOptions: {},
  debug: false
};
function resolveOptions(userOptions) {
  return Object.assign({}, defaultOptions, userOptions);
}
const transformImports = (raw, externalValue, transformModuleName) => {
  var _a;
  const ast = Parser.parse(raw, {
    ecmaVersion: "latest",
    sourceType: "module"
  });
  const specifiers = (_a = ast.body[0]) === null || _a === void 0 ? void 0 : _a.specifiers;
  if (!specifiers) {
    return "";
  }
  return specifiers.reduce((s, specifier) => {
    const { local } = specifier;
    if (specifier.type === "ImportDefaultSpecifier") {
      s += `const ${local.name} = ${transformModuleName(externalValue)}
`;
    } else if (specifier.type === "ImportSpecifier") {
      const { imported } = specifier;
      s += `const ${local.name} = ${transformModuleName(externalValue)}.${imported.name}
`;
    } else if (specifier.type === "ImportNamespaceSpecifier") {
      s += `const ${local.name} = ${transformModuleName(externalValue)}
`;
    } else if (specifier.type === "ExportSpecifier") {
      const { exported } = specifier;
      const value = `${transformModuleName(externalValue)}${local.name !== "default" ? `.${local.name}` : ""}`;
      if (exported.name === "default") {
        s += `export default ${value}
`;
      } else {
        s += `export const ${exported.name} = ${value}
`;
      }
    }
    return s;
  }, "");
};
function transformRequires(code, externals, transformModuleName) {
  return Object.keys(externals).reduce((code2, externalKey) => {
    const r = new RegExp(`require\\((["'\`])\\s*${externalKey}\\s*(\\1)\\)`, "g");
    return code2.replace(r, transformModuleName(externals[externalKey]));
  }, code);
}
var __asyncValues = globalThis && globalThis.__asyncValues || function(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve2, reject) {
        v = o[n](v), settle(resolve2, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve2, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve2({ value: v2, done: d });
    }, reject);
  }
};
const createTransformModuleName = (options) => {
  const transformModuleName = (externalValue) => {
    const { useWindow } = options;
    if (useWindow === false) {
      return typeof externalValue === "string" ? externalValue : externalValue.join(".");
    }
    if (typeof externalValue === "string") {
      return `window['${externalValue}']`;
    }
    const values = externalValue.map((val) => `['${val}']`).join("");
    return `window${values}`;
  };
  return transformModuleName;
};
function viteExternalsPlugin(externals = {}, userOptions = {}) {
  let isBuild = false;
  let isServe = false;
  const options = resolveOptions(userOptions);
  const externalsKeys = Object.keys(externals);
  const isExternalEmpty = externalsKeys.length === 0;
  const transformModuleName = createTransformModuleName(options);
  return Object.assign(Object.assign({ name: "vite-plugin-externals" }, userOptions.enforce ? { enforce: userOptions.enforce } : {}), {
    async config(config, { command }) {
      var e_1, _a;
      var _b, _c;
      isBuild = command === "build";
      isServe = command === "serve";
      if (!isServe) {
        return;
      }
      if (options.disableInServe) {
        return;
      }
      if (isExternalEmpty) {
        return;
      }
      const newAlias = [];
      const alias = (_c = (_b = config.resolve) === null || _b === void 0 ? void 0 : _b.alias) !== null && _c !== void 0 ? _c : {};
      if (isObject(alias)) {
        Object.keys(alias).forEach((aliasKey) => {
          newAlias.push({ find: aliasKey, replacement: alias[aliasKey] });
        });
      } else if (Array.isArray(alias)) {
        newAlias.push(...alias);
      }
      const cachePath = require$$1.join(process.cwd(), NODE_MODULES_FLAG, CACHE_DIR);
      await lib.ensureDir(cachePath);
      await lib.emptyDirSync(cachePath);
      try {
        for (var externalsKeys_1 = __asyncValues(externalsKeys), externalsKeys_1_1; externalsKeys_1_1 = await externalsKeys_1.next(), !externalsKeys_1_1.done; ) {
          const externalKey = externalsKeys_1_1.value;
          const externalCachePath = require$$1.join(cachePath, `${externalKey}.js`);
          newAlias.push({ find: new RegExp(`^${externalKey}$`), replacement: externalCachePath });
          await lib.ensureFile(externalCachePath);
          await lib.writeFile(externalCachePath, `module.exports = ${transformModuleName(externals[externalKey])};`);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (externalsKeys_1_1 && !externalsKeys_1_1.done && (_a = externalsKeys_1.return))
            await _a.call(externalsKeys_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      return {
        resolve: {
          alias: newAlias
        }
      };
    },
    async transform(code, id, _options) {
      const ssr = compatSsrInOptions(_options);
      if (isServe && options.disableInServe) {
        return;
      }
      if (!isNeedExternal.call(this, options, code, id, isBuild, ssr)) {
        return;
      }
      let s;
      let hasError = false;
      try {
        if (isBuild && id.includes(NODE_MODULES_FLAG)) {
          code = transformRequires(code, externals, transformModuleName);
        }
        await init;
        const [imports] = parse(code);
        imports.forEach(({ d: dynamic, n: dependence, ss: statementStart, se: statementEnd }) => {
          if (dynamic !== -1) {
            return;
          }
          if (!dependence) {
            return;
          }
          const externalValue = externals[dependence];
          if (!externalValue) {
            return;
          }
          s = s || (s = new MagicString(code));
          const raw = code.substring(statementStart, statementEnd);
          const newImportStr = transformImports(raw, externalValue, transformModuleName);
          s.overwrite(statementStart, statementEnd, newImportStr);
        });
      } catch (error) {
        hasError = true;
        if (userOptions.debug) {
          console.error(error);
        }
      }
      if (hasError || !s) {
        return { code, map: null };
      }
      return {
        code: s.toString(),
        map: s.generateMap(Object.assign({}, {
          source: id,
          includeContent: true,
          hires: true
        }, userOptions.sourceMapOptions))
      };
    }
  });
}
function isNeedExternal(options, code, id, isBuild, ssr) {
  const { disableSsr = true, filter } = options;
  if (disableSsr && ssr) {
    return false;
  }
  return filter.call(this, code, id, ssr !== null && ssr !== void 0 ? ssr : false, isBuild);
}
function compatSsrInOptions(options) {
  var _a;
  if (typeof options === "boolean") {
    return options;
  }
  return (_a = options === null || options === void 0 ? void 0 : options.ssr) !== null && _a !== void 0 ? _a : false;
}
const runtimePublicPath = "/@react-refresh";
const _require = createRequire(import.meta.url);
const reactRefreshDir = path$d.dirname(
  _require.resolve("react-refresh/package.json")
);
const runtimeFilePath = path$d.join(
  reactRefreshDir,
  "cjs/react-refresh-runtime.development.js"
);
const runtimeCode = `
const exports = {}
${fs$k.readFileSync(runtimeFilePath, "utf-8")}
${fs$k.readFileSync(_require.resolve("./refreshUtils.js"), "utf-8")}
export default exports
`;
const preambleCode = `
import RefreshRuntime from "__BASE__${runtimePublicPath.slice(1)}"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`;
const header = `
import RefreshRuntime from "${runtimePublicPath}";

const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;

if (undefined && !inWebWorker) {
  if (!window.__vite_plugin_react_preamble_installed__) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong. " +
      "See https://github.com/vitejs/vite-plugin-react/pull/11#discussion_r430879201"
    );
  }

  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    RefreshRuntime.register(type, __SOURCE__ + " " + id)
  };
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}`.replace(/\n+/g, "");
const footer = `
if (undefined && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;

  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh(__SOURCE__, currentExports);
    undefined.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(currentExports, nextExports);
      if (invalidateMessage) undefined.invalidate(invalidateMessage);
    });
  });
}`;
function addRefreshWrapper(code, id) {
  return header.replace("__SOURCE__", JSON.stringify(id)) + code + footer.replace("__SOURCE__", JSON.stringify(id));
}
let babel;
async function loadBabel() {
  if (!babel) {
    babel = await import("./index-df755a14.mjs").then((n) => n.i);
  }
  return babel;
}
const refreshContentRE = /\$Refresh(?:Reg|Sig)\$\(/;
const defaultIncludeRE = /\.[tj]sx?$/;
const tsRE = /\.tsx?$/;
function viteReact(opts = {}) {
  let devBase = "/";
  const filter = createFilter(opts.include ?? defaultIncludeRE, opts.exclude);
  const jsxImportSource = opts.jsxImportSource ?? "react";
  const jsxImportRuntime = `${jsxImportSource}/jsx-runtime`;
  const jsxImportDevRuntime = `${jsxImportSource}/jsx-dev-runtime`;
  let isProduction = true;
  let projectRoot = process.cwd();
  let skipFastRefresh = false;
  let runPluginOverrides;
  let staticBabelOptions;
  const importReactRE = /(?:^|\s)import\s+(?:\*\s+as\s+)?React(?:,|\s+)/;
  const viteBabel = {
    name: "vite:react-babel",
    enforce: "pre",
    config() {
      if (opts.jsxRuntime === "classic") {
        return {
          esbuild: {
            jsx: "transform"
          }
        };
      } else {
        return {
          esbuild: {
            jsx: "automatic",
            jsxImportSource: opts.jsxImportSource
          }
        };
      }
    },
    configResolved(config) {
      devBase = config.base;
      projectRoot = config.root;
      isProduction = config.isProduction;
      skipFastRefresh = isProduction || config.command === "build" || config.server.hmr === false;
      if ("jsxPure" in opts) {
        config.logger.warnOnce(
          "[@vitejs/plugin-react] jsxPure was removed. You can configure esbuild.jsxSideEffects directly."
        );
      }
      const hooks = config.plugins.map((plugin) => {
        var _a;
        return (_a = plugin.api) == null ? void 0 : _a.reactBabel;
      }).filter(defined);
      if (hooks.length > 0) {
        runPluginOverrides = (babelOptions, context) => {
          hooks.forEach((hook) => hook(babelOptions, context, config));
        };
      } else if (typeof opts.babel !== "function") {
        staticBabelOptions = createBabelOptions(opts.babel);
      }
    },
    async transform(code, id, options) {
      if (id.includes("/node_modules/"))
        return;
      const [filepath] = id.split("?");
      if (!filter(filepath))
        return;
      const ssr = (options == null ? void 0 : options.ssr) === true;
      const babelOptions = (() => {
        if (staticBabelOptions)
          return staticBabelOptions;
        const newBabelOptions = createBabelOptions(
          typeof opts.babel === "function" ? opts.babel(id, { ssr }) : opts.babel
        );
        runPluginOverrides == null ? void 0 : runPluginOverrides(newBabelOptions, { id, ssr });
        return newBabelOptions;
      })();
      const plugins = [...babelOptions.plugins];
      const isJSX = filepath.endsWith("x");
      const useFastRefresh = !skipFastRefresh && !ssr && (isJSX || (opts.jsxRuntime === "classic" ? importReactRE.test(code) : code.includes(jsxImportDevRuntime) || code.includes(jsxImportRuntime)));
      if (useFastRefresh) {
        plugins.push([
          await loadPlugin("react-refresh/babel"),
          { skipEnvCheck: true }
        ]);
      }
      if (opts.jsxRuntime === "classic" && isJSX) {
        if (!isProduction) {
          plugins.push(
            await loadPlugin("@babel/plugin-transform-react-jsx-self"),
            await loadPlugin("@babel/plugin-transform-react-jsx-source")
          );
        }
      }
      if (!plugins.length && !babelOptions.presets.length && !babelOptions.configFile && !babelOptions.babelrc) {
        return;
      }
      const parserPlugins = [...babelOptions.parserOpts.plugins];
      if (!filepath.endsWith(".ts")) {
        parserPlugins.push("jsx");
      }
      if (tsRE.test(filepath)) {
        parserPlugins.push("typescript");
      }
      const babel2 = await loadBabel();
      const result = await babel2.transformAsync(code, {
        ...babelOptions,
        root: projectRoot,
        filename: id,
        sourceFileName: filepath,
        parserOpts: {
          ...babelOptions.parserOpts,
          sourceType: "module",
          allowAwaitOutsideFunction: true,
          plugins: parserPlugins
        },
        generatorOpts: {
          ...babelOptions.generatorOpts,
          decoratorsBeforeExport: true
        },
        plugins,
        sourceMaps: true
      });
      if (result) {
        let code2 = result.code;
        if (useFastRefresh && refreshContentRE.test(code2)) {
          code2 = addRefreshWrapper(code2, id);
        }
        return { code: code2, map: result.map };
      }
    }
  };
  const viteReactRefresh = {
    name: "vite:react-refresh",
    enforce: "pre",
    config: (userConfig) => ({
      build: silenceUseClientWarning(userConfig),
      optimizeDeps: {
        // We can't add `react-dom` because the dependency is `react-dom/client`
        // for React 18 while it's `react-dom` for React 17. We'd need to detect
        // what React version the user has installed.
        include: ["react", jsxImportDevRuntime, jsxImportRuntime]
      },
      resolve: {
        dedupe: ["react", "react-dom"]
      }
    }),
    resolveId(id) {
      if (id === runtimePublicPath) {
        return id;
      }
    },
    load(id) {
      if (id === runtimePublicPath) {
        return runtimeCode;
      }
    },
    transformIndexHtml() {
      if (!skipFastRefresh)
        return [
          {
            tag: "script",
            attrs: { type: "module" },
            children: preambleCode.replace(`__BASE__`, devBase)
          }
        ];
    }
  };
  return [viteBabel, viteReactRefresh];
}
viteReact.preambleCode = preambleCode;
const silenceUseClientWarning = (userConfig) => ({
  rollupOptions: {
    onwarn(warning, defaultHandler) {
      var _a, _b;
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) {
        return;
      }
      if ((_b = (_a = userConfig.build) == null ? void 0 : _a.rollupOptions) == null ? void 0 : _b.onwarn) {
        userConfig.build.rollupOptions.onwarn(warning, defaultHandler);
      } else {
        defaultHandler(warning);
      }
    }
  }
});
const loadedPlugin = /* @__PURE__ */ new Map();
function loadPlugin(path2) {
  const cached = loadedPlugin.get(path2);
  if (cached)
    return cached;
  const promise = import(path2).then((module2) => {
    const value = module2.default || module2;
    loadedPlugin.set(path2, value);
    return value;
  });
  loadedPlugin.set(path2, promise);
  return promise;
}
function createBabelOptions(rawOptions) {
  var _a;
  const babelOptions = {
    babelrc: false,
    configFile: false,
    ...rawOptions
  };
  babelOptions.plugins || (babelOptions.plugins = []);
  babelOptions.presets || (babelOptions.presets = []);
  babelOptions.overrides || (babelOptions.overrides = []);
  babelOptions.parserOpts || (babelOptions.parserOpts = {});
  (_a = babelOptions.parserOpts).plugins || (_a.plugins = []);
  return babelOptions;
}
function defined(value) {
  return value !== void 0;
}
const cli = cac("viteburner");
cli.command("", "start dev server").alias("serve").alias("dev").option("--cwd <cwd>", "Working directory").option("--port <port>", "Port to listen on").action(startDev);
cli.help();
cli.version(pkg.version);
async function startDev(options) {
  const cwd2 = options.cwd;
  const port = options.port;
  const resolveInlineConfig = {
    ...cwd2 && { cwd: cwd2 },
    ...port && { port }
  };
  logger.info("version", pkg.version);
  logger.info("vite", "creating dev server...");
  createServer({
    ...cwd2 && { root: cwd2 },
    viteburner: resolveInlineConfig,
    plugins: [
      viteReact({ jsxRuntime: "classic" }),
      viteExternalsPlugin({
        react: "React",
        "react-dom": "ReactDOM"
      }),
      viteburnerPlugin(resolveInlineConfig)
    ]
  });
}
async function main() {
  cli.parse();
}
export {
  WatchManager,
  WsAdapter,
  WsManager,
  getDefaultExportFromCjs as a,
  commonjsGlobal as c,
  calculateRamResponseSchema,
  createLogger,
  defaultDownloadLocation,
  defaultDts,
  defaultUploadLocation,
  defineConfig,
  deleteFileResponseSchema,
  displayKeyHelpHint,
  displayWatchAndHelp,
  externalRE,
  fixImportPath,
  fixStartingSlash,
  forceStartingSlash,
  formatDownload,
  formatError,
  formatNormal,
  formatUpload,
  formatWarn,
  getAugmentedNamespace as g,
  getAllFilesResponseSchema,
  getDefaultConfig,
  getDefinitionFileResponseSchema,
  getFileNamesResponseSchema,
  getFileResponseSchema,
  getSourceMapString,
  getWss,
  handleKeyInput,
  hmrPluginName,
  isExternalUrl,
  isScriptFile,
  isWssReused,
  loadConfig,
  logger,
  main,
  onKeypress,
  prefix,
  pushFileResponseSchema,
  removeStartingSlash,
  resolveConfig,
  resolveDts,
  resolveDumpFile,
  resolvePolling,
  resolveWatchLocation,
  setHandler,
  startDev,
  virtualModuleId,
  viteburnerPlugin,
  writeFile$1 as writeFile,
  wsResponseSchema
};
