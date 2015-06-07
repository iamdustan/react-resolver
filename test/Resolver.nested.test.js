import assert from "assert";
import React, {Component} from "react/addons";
import { Resolver } from "../dist";
import csp, {chan, alts, take, put, go, timeout} from "../dist/js-csp/src/csp"; /*eslint no-unused-vars:0 */

import PropsFixtureContainer from "./support/PropsFixtureContainer";
import jsdom from "jsdom";

import {displayName, dataDependencies}  from "../dist/decorators";









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


    it("should render nested elements passing props", function(done) {
        @dataDependencies({
          friendship: (props)=>
            go(function* (){
              return `Ernie likes ${props.friend}`;
            })
        })
        @displayName("TestElement1")
        class Element1 extends Component {
            render(){
                return <span>{this.props.friendship}</span>;
            }
        };

        @dataDependencies({
          users: ()=>
            go(function* (){
              return ["Eric","Jim"];
            })
        })
        @displayName("TestElement")
        class Element extends Component {
            render(){
                return <span>{this.props.users.map(user=>
                    <span key={user}>
                        <Element1 friend={user}/>
                    </span>
                )}</span>;
            }
        };
        go(function*(){
            const string = yield Resolver.renderToStaticMarkup(<Element />);
            assert.equal("<span><span><span>Ernie likes Eric</span></span><span><span>Ernie likes Jim</span></span></span>",string.toString());
            done();
        });
    });
  });
});
