import { MomentPipe } from './moment.pipe';

describe('MomentPipe', () => {
  it('create an instance', () => {
    const pipe = new MomentPipe();
    expect(pipe.transform('2020-04-07T23:04:17.921Z')).toBeTruthy();
  });
});
