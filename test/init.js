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

  it('cached', function() {
    const instance1 = new Tabit(document.getElementById('tabs'), {});
    const instance2 = new Tabit(document.getElementById('tabs'), {});
    assert(instance1 === instance2, 'Instance not cached!');
  });

  it('returns instance from element', function() {
    const element = document.getElementById('tabs');
    const instance = new Tabit(element, {});
    assert(Tabit.getInstance(element) === instance, 'Instance for element not cached!');
  });
});
