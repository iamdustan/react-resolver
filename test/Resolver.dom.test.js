import assert from "assert";
import React, {Component} from "react/addons";
import { Resolver } from "../src";
import csp, {chan, alts, take, put, go, timeout} from "../src/js-csp/src/csp"; /*eslint no-unused-vars:0 */

import PropsFixtureContainer from "./support/PropsFixtureContainer";
import jsdom from "jsdom";

import displayName from "./decorators/displayName";
import dataDependencies from "./decorators/dataDependencies";








describe("Resolver", function() {
  describe(".dom", function() {
    afterEach(function(done) {
        React.unmountComponentAtNode(document.body) 
        document.body.innerHTML = ""                
        setTimeout(done)
    });

    it("should render into dom", function(done) {
         class Element extends Component {
            render(){
                return <span>hey</span>;
            }
         };     
         React.render(<Element/>, document.body);
         assert.equal(document.querySelector('span').innerHTML, 'hey');
         done();
    });
    it("should render a channel into dom", function(done) {
        const ch = chan();
        @dataDependencies({
            user: ()=>ch
        }) 
        @displayName("TestElement")
        class Element extends Component {
            render(){
                return <span>{this.props.user}</span>;
            }
        };
        const resolver = new Resolver(); 
        Resolver.render(
            <Element/>
            , document.body, resolver);

         go(function* (){
            yield put(ch,"Ernie");
            yield timeout(0);
            assert.equal(document.querySelector('span').innerHTML, 'Ernie');
            yield put(ch,"Wise");
            yield timeout(0);
            assert.equal(document.querySelector('span').innerHTML, 'Wise');
            done();
         });
         
    });
  });
});
