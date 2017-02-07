describe('Init', function () {
  let instance;

  before(function () {
    let test = document.getElementById('test');
    if (!test) {
      test = document.createElement('div');
      test.id = 'test';
      document.body.insertBefore(test, document.body.firstChild);
    }
    if (window.__html__) {
      test.innerHTML = window.__html__['test/fixtures/tabs.html'];
    }
  });

  it('initialized', function () {
    instance = new Tabit(document.getElementById('tabs'), {});
    assert.equal(3, instance.tabs.length);
  });

  it('cached', function () {
    instance = new Tabit(document.getElementById('tabs'), {});
    const instance2 = new Tabit(document.getElementById('tabs'), {});
    assert(instance === instance2, 'Instance not cached!');
  });

  it('returns instance from element', function () {
    const element = document.getElementById('tabs');
    instance = new Tabit(element, {});
    assert(Tabit.getInstance(element) === instance, 'Instance for element not cached!');
  });

  afterEach(function () {
    instance.destroy();
  })
});
