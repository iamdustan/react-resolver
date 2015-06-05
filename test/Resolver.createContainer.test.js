import assert from "assert";
import React from "react";
import { Resolver } from "../src";

import Fixture from "./support/Fixture";
import FixtureContainer from "./support/FixtureContainer";

import csp, {chan, alts, take, put, go, timeout} from "../src/js-csp/src/csp"; /*eslint no-unused-vars:0 */

describe("Resolver", function() {
  describe(".createContainer", function() {
    describe(".displayName", function() {
      it("should be `${ComponentName}Container`", function() {
        assert.equal(FixtureContainer.displayName, "FixtureContainer");
      });
    });

    describe(".childContextTypes", function() {
      it("should not have any", function() {
        assert.equal(FixtureContainer.childContextTypes, undefined);
      });
    });

    describe(".contextTypes", function() {
      it("should not have any", function() {
        assert.equal(FixtureContainer.contextTypes, undefined);
      });
    });

    describe(".propTypes", function() {
      it("should not have any", function() {
        assert.equal(FixtureContainer.propTypes, undefined);
      });
    });

    context("when resolving values", function() {
      describe("props", function() {
        beforeEach(function() {
          this.Spy = Resolver.createContainer(Fixture, {
            resolve: { 
              test: (props) => {
                this.actual = props;               
                return go(function*(){
                  yield timeout(0);
                  return true;
                });
              }
            },
          });
        });

        it("should not include internal props", function(done) {
          const self=this;
          go(function* () {
            yield Resolver.renderToStaticMarkup(<self.Spy />);
            assert.deepEqual(self.actual, []);
            done();
          });        
        });

        it("should include external props", function(done) {
          const self=this;
          go(function* () {
            yield Resolver.renderToStaticMarkup(<self.Spy foo="bar" />);
            assert.deepEqual(self.actual,{ foo: "bar" });
            done();
          });
        });
      });

      describe("context", function() {
        beforeEach(function() {
          this.Spy = Resolver.createContainer(Fixture, {
            contextTypes: { foo: React.PropTypes.any },
            resolve: { 
              test: (props, context) => {
                this.actual = context;
                return go(function*(){
                  yield timeout(0);
                  return true;
                });
              }
            },
          });
        });

        it("should not include internal context", function(done) {
          const self=this;
          go(function* () {
            yield Resolver.renderToStaticMarkup(<self.Spy/>);
            assert.deepEqual(self.actual,{ foo: undefined });
            done();
          });
        });

        it("should include external context", function(done) {
          class Context extends React.Component {
            getChildContext() {
              return { foo: "bar" };
            }

            render() {
              return <this.props.component />;
            }
          }

          Context.childContextTypes = { foo: React.PropTypes.any };
          Context.displayName = "Context";
          const self=this;
          go(function* () {
            yield Resolver.renderToStaticMarkup(<Context component={self.Spy} />);
            assert.deepEqual(self.actual, { foo: "bar" });
            done();
          });
        });
      });
    });
  });
});
