import assert from "assert";
import exported from "../src";

import Container from "../src/Container";
import Resolver from "../src/Resolver";
import ResolverError from "../src/ResolverError";

describe("exports", function() {
  it("should only specify `Container`, `Error`, & `Resolver`", function() {
    const keys = Object.keys(exported);

    assert.deepEqual(keys, ["Container", "Error", "Resolver"]);
  });

  describe(".Container", function() {
    it("should be Container", function() {
      assert(exported.Container);
      assert.equal(exported.Container, Container);
    });
  });

  describe(".Error", function() {
    it("should be ResolverError", function() {
      assert(exported.Error);
      assert.equal(exported.Error, ResolverError);
    });
  });

  describe(".Resolver", function() {
    it("should be Resolver", function() {
      assert(exported.Resolver);
      assert.equal(exported.Resolver, Resolver);
    });
  });
});
