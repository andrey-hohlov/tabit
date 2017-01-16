describe('Init', function() {
  beforeEach(function() {
    let test = document.getElementById('test');
    if (!test) {
      test = document.createElement('div');
      test.id = 'test';
      document.body.insertBefore(test, document.body.firstChild);
    }
    if (window.__html__) {
      test.innerHTML = window.__html__['test/fixtures/default.html'];
    }
  });

  it('initialized', function() {
    const instance = new Tabit(document.getElementById('tabs'), {});
    assert.equal(3, instance.tabs.length);
  });
});
