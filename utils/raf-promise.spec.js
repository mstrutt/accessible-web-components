import rafPromise from './raf-promise.js';

describe('rafPromise', () => {
  it('returns a promise', () => {
    expect(rafPromise()).to.be.a('promise');
  });

  it('resolves', (done) => {
    rafPromise()
      .then(() => done());
  });
});
