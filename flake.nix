{
  description = "HackatonWeek";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      with import nixpkgs { inherit system; }; {
        devShell = mkShell {
          packages = [
            mysql
            php
            symfony-cli
          ];
        };
      });
}
