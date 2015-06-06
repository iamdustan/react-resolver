import assert from "assert";
import React, {Component} from "react";
import { Resolver } from "../src";
import csp, {chan, alts, take, put, go, timeout} from "../src/js-csp/src/csp"; /*eslint no-unused-vars:0 */

import PropsFixtureContainer from "./support/PropsFixtureContainer";

import displayName from "./decorators/displayName";
import dataDependencies from "./decorators/dataDependencies";







describe("Resolver", function() {
  describe(".nested", function() {
    it("should render nested elements", function(done) {
        @dataDependencies({
          user: ()=>
            go(function* (){
              return "Ernie";
            })
        })
        @displayName("TestElement1")
        class Element1 extends Component {
            render(){
                return <span>{this.props.user}</span>;
            }
        };

        @dataDependencies({
          user: ()=>
            go(function* (){
              return "Eric";
            })
        })
        @displayName("TestElement")
        class Element extends Component {
            render(){
                return <span>{this.props.user}<Element1/></span>;
            }
        };
        go(function*(){
            const string = yield Resolver.renderToStaticMarkup(<Element />);
            assert.equal("<span>Eric<span>Ernie</span></span>",string.toString());
            done();
        });
    });
  });
});
