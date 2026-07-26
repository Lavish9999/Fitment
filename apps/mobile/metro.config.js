const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.endsWith(".js")) {
    const sourcePath = moduleName.slice(0, -3);
    const TypeScriptCandidates = [`${sourcePath}.ts`, `${sourcePath}.tsx`];

    for (const candidate of TypeScriptCandidates) {
      try {
        return context.resolveRequest(context, candidate, platform);
      } catch {
        // Fall through to the next TypeScript candidate, then Metro's default resolution.
      }
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
