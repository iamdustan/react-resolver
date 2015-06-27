import PropsFixture from "./PropsFixture";
import { Resolver } from "../../dist";
import csp, {chan, alts, take, put, go, timeout} from "../../dist/js-csp/src/csp"; /*eslint no-unused-vars:0 */


export default Resolver.createContainer(PropsFixture, {
  resolve: {
    user: () => go(function*(){ 
        yield timeout(0);
        return "Eric";
    })
  },
});
