import { getNotFoundInstanceMessage } from "../getNotFoundInstanceMessage";


describe('getNotFoundInstanceMessage test', () => {
  it('user example', () => {
    const expected = 'User with id 1 was not found';
    expect(expected).toEqual(getNotFoundInstanceMessage('User', 1));
  });
});
