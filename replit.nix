# Replit Nix environment — pin Node.js 20.x
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.typescript
    pkgs.nodePackages.ts-node
  ];
}
