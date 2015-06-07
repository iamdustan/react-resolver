import assert from "assert";
import exported from "../dist";

import Container from "../dist/Container";
import Resolver from "../dist/Resolver";
import ResolverError from "../dist/ResolverError";
import decorators from "../dist/decorators";
import csp from "../dist/js-csp";

describe("exports", function() {
  it("should only specify `Container`, `Error`, `Resolver`, `csp` & `decorators`", function() {
    const keys = Object.keys(exported);

    assert.deepEqual(keys, ["Container", "Error", "Resolver", "csp", "decorators"]);
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

  describe(".csp", function() {
    it("should be csp", function() {
      assert(exported.csp);
      assert.equal(exported.csp, csp);
    });
  });

  describe(".decorators", function() {
    it("should be decorators", function() {
      assert(exported.decorators);
      assert.equal(exported.decorators, decorators);
    });
  });
});
