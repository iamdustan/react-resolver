import assert from "assert";
import React from "react";
import { Resolver } from "../dist";
import csp, {chan, alts, take, put, go, timeout} from "../dist/js-csp"; /*eslint no-unused-vars:0 */

import PropsFixtureContainer from "./support/PropsFixtureContainer";

describe("Resolver", function() {
  describe(".renderToString", function() {
    it("should not fail", function(done) {
        go(function*(){
            const string = yield Resolver.renderToString(<PropsFixtureContainer />);
            assert(string);
            done();
        });
    });
  });
});
