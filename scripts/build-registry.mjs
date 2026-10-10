import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { shaderRegistry } from "shaders/registry";

// Installed 4.0.4 declarations are authoritative for accepted values and driver keys.
const root = path.resolve("node_modules/shaders/dist");
const files = shaderRegistry.map((s) =>
  path.join(root, "core/shaders", s.name, "index.d.ts"),
);
const program = ts.createProgram(files, {
  strict: true,
  skipLibCheck: true,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  module: ts.ModuleKind.ESNext,
});
const checker = program.getTypeChecker();
function describe(type, depth = 0) {
  if (
    type.flags & ts.TypeFlags.Any ||
    type.flags & ts.TypeFlags.Unknown ||
    depth > 6
  )
    return { kind: "json" };
  if (type.isUnion())
    return {
      kind: "union",
      options: type.types.map((t) => describe(t, depth + 1)),
    };
  if (
    type.flags & ts.TypeFlags.StringLiteral ||
    type.flags & ts.TypeFlags.NumberLiteral
  )
    return { kind: "literal", value: type.value };
  if (type.flags & ts.TypeFlags.BooleanLiteral)
    return { kind: "literal", value: type.intrinsicName === "true" };
  if (type.flags & ts.TypeFlags.String) return { kind: "string" };
  if (type.flags & ts.TypeFlags.Number) return { kind: "number" };
  if (type.flags & ts.TypeFlags.Boolean) return { kind: "boolean" };
  if (type.flags & ts.TypeFlags.Null) return { kind: "null" };
  if (type.flags & ts.TypeFlags.Undefined) return { kind: "undefined" };
  if (checker.isArrayType(type))
    return {
      kind: "array",
      item: describe(checker.getTypeArguments(type)[0], depth + 1),
    };
  if (checker.getIndexTypeOfType(type, ts.IndexKind.String))
    return {
      kind: "record",
      item: describe(
        checker.getIndexTypeOfType(type, ts.IndexKind.String),
        depth + 1,
      ),
    };
  const props = type.getProperties();
  if (props.length)
    return {
      kind: "object",
      props: Object.fromEntries(
        props.map((p) => [
          p.name,
          {
            optional: !!(p.flags & ts.SymbolFlags.Optional),
            type: describe(
              checker.getTypeOfSymbolAtLocation(
                p,
                p.valueDeclaration || p.declarations[0],
              ),
              depth + 1,
            ),
          },
        ]),
      ),
    };
  return { kind: "json" };
}
const data = shaderRegistry.map((s) => {
  const file = program.getSourceFile(
    path.join(root, "core/shaders", s.name, "index.d.ts"),
  );
  const module = checker.getSymbolAtLocation(file);
  const symbol = checker
    .getExportsOfModule(module)
    .find((e) => e.name === "ComponentProps");
  const actual = symbol
    ? checker.getDeclaredTypeOfSymbol(
        symbol.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(symbol)
          : symbol,
      )
    : undefined;
  const propTypes = Object.fromEntries(
    (actual?.getProperties() || []).map((p) => [
      p.name,
      describe(
        checker.getTypeOfSymbolAtLocation(
          p,
          p.valueDeclaration || p.declarations[0],
        ),
      ),
    ]),
  );
  const wrapper = fs.readFileSync(
    path.join(root, "react/components", s.name + ".d.ts"),
    "utf8",
  );
  const dynamic = [
    ...wrapper.matchAll(/(\w+)\?: ComponentProps\['[^']+'\] \| PropDriver;/g),
  ].map((m) => m[1]);
  const props = Object.fromEntries(
    Object.entries(s.definition.props).map(([key, p]) => [
      key,
      {
        ...p,
        type: propTypes[key] || { kind: "json" },
        dynamic: dynamic.includes(key),
        ui:
          p.ui ||
          (key === "shapeSdfUrl"
            ? { type: "text", label: "SDF file URL", group: "Advanced" }
            : { type: "readonly", label: key, group: "Advanced" }),
      },
    ]),
  );
  return {
    name: s.name,
    category: s.category,
    description: s.description,
    requiresChild: !!s.requiresChild,
    props,
  };
});
fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync(
  "src/data/verified-registry.json",
  JSON.stringify(data, null, 2) + "\n",
);
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync(
  "docs/verified-components.md",
  "# Verified Shaders 4.0.4 registry\n\nGenerated from the installed package registry and TypeScript declarations. All listed props are component-specific; shared layer modifiers are documented in README. Driver support follows each React wrapper declaration.\n\n" +
    data
      .map(
        (s) =>
          `## ${s.name} (${s.category})\n\n${s.description || ""}${s.requiresChild ? " Requires child content." : ""}\n\n` +
          Object.entries(s.props)
            .map(
              ([k, p]) =>
                `- \`${k}\`: default \`${JSON.stringify(p.default)}\`; ${p.ui.type === "readonly" ? "derived, read-only" : JSON.stringify(p.ui.type)}${p.dynamic ? "; Shaders PropDriver accepted" : ""}. ${p.description || ""}`,
            )
            .join("\n"),
      )
      .join("\n\n") +
    "\n",
);
console.log(
  `Verified ${data.length} components and ${data.reduce((n, s) => n + Object.keys(s.props).length, 0)} props from shaders@4.0.4.`,
);
