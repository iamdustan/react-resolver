import assert from "assert";
import React, {Component} from "react/addons";
import { Resolver } from "../dist";
import csp, {chan, alts, take, put, go, timeout} from "../dist/js-csp/src/csp"; /*eslint no-unused-vars:0 */

import PropsFixtureContainer from "./support/PropsFixtureContainer";
import jsdom from "jsdom";
import cheerio from "cheerio";
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
            assert(!document.querySelector('span'));
            yield put(ch,"Ernie");
            yield timeout(0);
            assert.equal(document.querySelector('span').innerHTML, 'Ernie');
            yield put(ch,"Wise");
            yield timeout(0);
            assert.equal(document.querySelector('span').innerHTML, 'Wise');
            done();
         });     
    });
    it("should render a closed channel into dom", function(done) {
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
            assert(!document.querySelector('span'));
            yield put(ch,"Ernie");
            yield timeout(0);
            assert.equal(document.querySelector('span').innerHTML, 'Ernie');
            yield put(ch,"Wise");
            yield timeout(0);
            yield ch.close();
            yield timeout(0);
            assert.equal(document.querySelector('span').innerHTML, 'Wise');
            done();
         });     
    });
    it("should render two channels into dom", function(done) {
        const ch = chan();
        const ch1 = chan();
        
        @dataDependencies({
            user: ()=>ch,
            user1: ()=>ch1
        }) 
        @displayName("TestElement")
        class Element extends Component {
            render(){
                return <span className='result'>{this.props.user} and {this.props.user1}</span>;
            }
        };
        const resolver = new Resolver(); 
        Resolver.render(
            <Element/>
            , document.body, resolver);

         go(function* (){
            assert(!document.querySelector('.result'));
            yield put(ch,"Eric");
            yield timeout(0);
            assert(!document.querySelector('.result'));
            yield put(ch1,"Ernie");
            yield timeout(0);
            assert.equal(cheerio.load(document.body.outerHTML)('.result').text(), "Eric and Ernie");

            yield put(ch,"Morcombe");
            yield timeout(0);
            assert.equal(cheerio.load(document.body.outerHTML)('.result').text(), 'Morcombe and Ernie');
            
            yield put(ch1,"Wise");   
            yield timeout(0);
            assert.equal(cheerio.load(document.body.outerHTML)('.result').text(), 'Morcombe and Wise');
            
            done();
         });     
    });
  });
});
