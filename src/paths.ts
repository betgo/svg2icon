const path = require("path");
const fs = require("fs");
const { reduce, keys, pipe } = require("ramda");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const root = resolveApp(".");

const makeSafe = (loader) => (p) => {
  try {
    return loader(p);
  } catch (e) {
    return null;
  }
};
const load = makeSafe((p) => require(p));
const loadRaw = makeSafe((p) => {
  const raw = fs.readFileSync(p);
  return JSON.parse(raw);
});
const createFromLoader = (loader, prefix) =>
  pipe((m) => path.join(prefix, m), loader);

const loadFromRoot = createFromLoader(load, root);
const loadRawFromRoot = createFromLoader(loadRaw, root);
export { resolveApp, loadFromRoot, loadRawFromRoot };
