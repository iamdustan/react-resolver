# React Resolver Csp

[![Build Status](https://travis-ci.org/gilesbradshaw/react-resolver-csp.svg?branch=csp)](https://travis-ci.org/gilesbradshaw/react-resolver-csp)

[![Coverage Status](https://coveralls.io/repos/gilesbradshaw/react-resolver-csp/badge.svg?branch=csp)](https://coveralls.io/r/gilesbradshaw/react-resolver-csp)

## Isomorphic library to lazy-load data for React components

Forked and nodified to use CSP channels rather than promises

I've manually included js-csp so the whole lot gets transpiled to ES5

````
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

describe("Resolver", function() {
  describe(".dom", function() {
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

````
## Development

If you'd like to contribute to this project, all you need to do is clone
this project and run:

```shell
$ npm install
$ npm test
```

## Credits

[Based on ericclemmons/react-resolver](https://github.com/ericclemmons/react-resolver)  and [iamdustan/react-resolver](https://github.com/iamdustan/react-resolver)
