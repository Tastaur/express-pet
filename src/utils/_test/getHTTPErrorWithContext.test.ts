import { HTTPError } from "../../common/exceptionFIlter/http-error.class";
import { getHTTPErrorWithContext } from "../getHTTPErrorWithContext";


describe('getHTTPErrorWithContext tests', () => {
  it('should return new http error', () => {
    const error = new HTTPError(400, 'message');
    const context = 'context';
    const expected = new HTTPError(error.statusCode, error.message, context);
    expect(getHTTPErrorWithContext(error, context)).toEqual(expected);
  });
});
