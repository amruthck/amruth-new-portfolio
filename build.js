const fs = require("fs");
const path = require("path");

const root = __dirname;
const out = path.join(root, ".amplify-hosting");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const item of fs.readdirSync(src, { withFileTypes: true })) {
    const source = path.join(src, item.name);
    const target = path.join(dest, item.name);

    if (item.isDirectory()) {
      copyDir(source, target);
    } else {
      fs.copyFileSync(source, target);
    }
  }
}

if (fs.existsSync(out)) {
  fs.rmSync(out, { recursive: true, force: true });
}

const staticDir = path.join(out, "static");
const computeDir = path.join(out, "compute", "default");

copyDir(path.join(root, "public"), staticDir);

fs.mkdirSync(computeDir, { recursive: true });

fs.copyFileSync(
  path.join(root, "server.js"),
  path.join(computeDir, "server.js")
);

fs.copyFileSync(
  path.join(root, "package.json"),
  path.join(computeDir, "package.json")
);

fs.cpSync(
  path.join(root, "data"),
  path.join(computeDir, "data"),
  { recursive: true }
);

const manifest = {
  version: 1,
  routes: [
    {
      path: "/api/<*>",
      target: {
        kind: "Compute",
        computeKey: "default"
      }
    },
    {
      path: "/<*>",
      target: {
        kind: "Static"
      }
    }
  ],
  computeResources: {
    default: {
      runtime: "nodejs22.x",
      entrypoint: "server.js"
    }
  }
};

fs.writeFileSync(
  path.join(out, "deploy-manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log("Amplify deployment bundle created successfully.");
