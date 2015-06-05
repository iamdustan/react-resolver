import assert from "assert";
import { Resolver } from "../src";
import React from "react";

import PropsFixture from "./support/PropsFixture";
import PropsFixtureContainer from "./support/PropsFixtureContainer";
import csp, {chan, alts, take, put, go, timeout} from "../src/js-csp/src/csp"; /*eslint no-unused-vars:0 */

describe("Resolver", function() {
  describe(".renderToStaticMarkup", function() {
    context("when given a `React.Component`", function() {
      it("matches React.renderToStaticMarkup", function(done) {
        const expected = React.renderToStaticMarkup(<PropsFixture user="Eric" />);
        go(function* (){
            const markup = yield Resolver.renderToStaticMarkup(<PropsFixture user="Eric" />);
            assert.equal(markup, expected); 
            
            done();
        });
      });
    });

    context("when given a <Container />", function() {
      it("matches React.renderToStaticMarkup", function(done) {
        const expected = React.renderToStaticMarkup(
          <PropsFixture user="Eric" />
        );

        const render = function() {
          return Resolver.renderToStaticMarkup(<PropsFixtureContainer />);
        };
        go(function* (){
            const markup = yield render();
            assert.equal(markup.toString(), expected);
            const markup2 = yield render();
            assert.equal(markup2.toString(), expected);
            done();
        });
      });
    });
  });
});
