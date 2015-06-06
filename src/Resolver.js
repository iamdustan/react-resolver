import React from "react";

import Container from "./Container";
import ResolverError from "./ResolverError";
import csp, {chan, alts, take, put, go, timeout} from "./js-csp/src/csp"; /*eslint no-unused-vars:0 */

const myRenderTo = (element, renderFunc) =>
  {
      Resolver.server = true;
      const resolver = new Resolver(); /*eslint no-use-before-define:0*/
      const context = <Container resolver={resolver}>{element}</Container>;
      return go(function* (){
        const html = yield resolver.finish(()=>renderFunc(context));
        resolver.freeze();
        return {
            data: resolver.states,
            toString() { return html; }
          };
      });
   };

export default class Resolver {
  constructor(states = {}) {
    this.states = states;
  }
  channels=[];
  frozen=false;
  awaitChan=chan();
  refreshChan=chan();

  //channel that completes with result of renderer when all channels resolved
  finish(renderer) {
    return go(function* process(total){
      const rendered = renderer();
      if(this.channels.length === total)
      {
        return rendered;
      }
      yield this.awaitChan;
      return yield go(process.bind(this), [this.channels.length]);
    }.bind(this), [this.channels.length]);
  }

  freeze() {
    this.frozen = true;
  }

  fulfillState(state, callback) {
    state.error = undefined;
    state.fulfilled = true;
    state.rejected = false;
    return callback ? callback(state) : state;
  }

  getContainerState(container) {

    const { id } = container;

    if (!id) {
      throw new ReferenceError(`${container.constructor.displayName} should have an ID`);
    }

    const state = this.states[id] || this.rehydrate(id) || {
      fulfilled: false,
      rejected: false,
      values: {}
    };

    if (!this.states[id]) {
      this.states[id] = state;
    }

    return state;
  }

  clearContainerState(container) {
    const { id } = container;

    Object.keys(this.states)
      .filter(key => key.indexOf(id) === 0)
      .forEach(key => this.states[key] = undefined)
    ;
    const self = this;
    go(function*(){
      yield self.refreshChan.close();
    });
  }

  rejectState(error, state, callback) {
    state.error = error;
    state.fulfilled = false;
    state.rejected = true;

    if (callback) {
      callback(state);
    }
    throw new Error(`${this.constructor.displayName} was rejected: ${error}`);
  }

  rehydrate(id) {
    if (typeof __resolver__ === "undefined") {
      return null;
    }
    return __resolver__[id]; /*eslint no-undef:0*/
  }

  resolve(container, callback) {
    const self = this;
    const asyncProps = container.props.resolve || {};
    const state = this.getContainerState(container);
    const asyncKeys = Object.keys(asyncProps)
      // Assign existing prop values
      .filter((asyncProp) => {
        if (container.props.hasOwnProperty(asyncProp)) {
          state.values[asyncProp] = container.props[asyncProp];

          return false;
        }

        return true;
      })
      // Filter out pre-loaded values
      .filter((asyncProp) => {
        return !state.values.hasOwnProperty(asyncProp);
      });

    if (!asyncKeys.length) {
      this.fulfillState(state, callback);
      go(function* (){
        yield put(self.awaitChan, []);
      });
    }

    if (this.frozen) {
      throw new ResolverError([
        "Resolver is frozen for server rendering.",
        `${container.constructor.displayName} (#${container.id}) should have already resolved`//,
        //i've only commented this out because it scuppers my sublime text colouring
        //`"${asyncKeys.join("\", \"")}". (http://git.io/vvvkr)`,
      ].join(" "));
    }

    const channels = asyncKeys.map((prop) => {
      const valueOf = container.props.resolve[prop];
      const value = container.props.hasOwnProperty(prop)
        ? container.props[prop]
        : valueOf(container.props.props, container.props.context)
      ;
      return {prop, value};
    });
    const {rejectState, fulfillState} = this;
    this.channels = this.channels.concat(channels);
    go(function* (){
      try{
        //replace with alts
        for(const channel of channels)
        {
          const result = channel.result = yield channel.value;
          if(Object.prototype.toString.call(result) === "[object Error]")
          {
            throw result;
          }
          state.values[channel.prop] = channel.result;// = result;
        }
        fulfillState.bind(self)(state, callback);
        if(Resolver.server)
        {
          yield put(self.awaitChan, channels.filter(p=>p.result).map(p=>p.result));
        }
      }
      catch(error){
         rejectState.bind(self)(error, state, callback);
      }
      if(!Resolver.server)
      {
        //keep getting data from channels until the refreshchan gets closed
        //keep getting data from channels until the refreshchan gets closed
        go(function* process(cs){
          const channelResult = yield alts(cs);
          if(channelResult.channel !== self.refreshChan)
          {
            if(!channelResult.channel.closed)
            {
                  const channel = channels[channels.map(c=>c.value).indexOf(channelResult.channel)]; /*eslint no-loop-func:0*/
                  if(channel)
                  {
                      state.values[channel.prop] = channel.result = channelResult.value;
                      fulfillState.bind(self)(state, callback);
                  }
                  yield go(process, [cs]);
            }
            else
            {
              //if channel is closed remove it from the list of channels we are monitoring
              yield go(process, [cs.filter(c=>c !== channelResult.channel)]);
            }
          }
        }, [channels.map(c=>c.value).concat([self.refreshChan])]);
      }
    });
  }

  static createContainer(Component, props = {}) {
    if (!Component.hasOwnProperty("displayName")) {
      throw new ReferenceError("Resolver.createContainer requires wrapped component to have `displayName`");
    }

    class ComponentContainer extends React.Component {
      render() {
        return (
          <Container
            component={Component}
            context={this.context}
            props={this.props}
            {...props}/>
        );
      }
    }

    ComponentContainer.childContextTypes = props.childContextTypes;
    ComponentContainer.contextTypes = props.contextTypes;
    ComponentContainer.displayName = `${Component.displayName}Container`;

    return ComponentContainer;
  }

  static render(element, node, instance = new Resolver()) {
    Resolver.server = false;
    React.render((
      <Container resolver={instance}>
        {element}
      </Container>
    ), node);

    return instance;
  }

  static renderToString(element) {
    return myRenderTo(element, React.renderToString);
  }

  static renderToStaticMarkup(element) {
    return myRenderTo(element, React.renderToStaticMarkup);
  }

}
