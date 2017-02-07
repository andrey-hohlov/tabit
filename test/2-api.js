describe('API', function () {
  let instance;

  before(function () {
    let test = document.getElementById('test');
    if (!test) {
      test = document.createElement('div');
      test.id = 'test';
      document.body.insertBefore(test, document.body.firstChild);

      if (window.__html__) {
        test.innerHTML = window.__html__['test/fixtures/tabs.html'];
      }
    }

    instance = new Tabit(document.getElementById('tabs'), {});
  });

  it('getActiveTabIndex() should return index 0', function () {
    const index = instance.getActiveTabIndex();
    assert(typeof index === 'number' && index >= 0);
  });

  it('next() should set new active tab - next after current', function () {
    instance.next();
    const index = instance.getActiveTabIndex();
    assert(index === 1);
  });

  it('prev() should set new active tab - next after current', function () {
    instance.prev();
    const index = instance.getActiveTabIndex();
    assert(index === 0);
  });

  it('setActiveTab(2) should set new active tab with index 2', function () {
    instance.setActiveTab(2);
    const index = instance.getActiveTabIndex();
    assert(index === 2);
  });

  it('getActiveTab() should return active tab nodes', function () {
    const tab = instance.getActiveTab();
    assert(tab.button === document.getElementById('tabs-button-3') && tab.content === document.getElementById('tabs-content-3'));
  });

  it('getTab(0) should return first tab nodes', function () {
    const tab = instance.getTab(0);
    assert(tab.button === document.getElementById('tabs-button-1') && tab.content === document.getElementById('tabs-content-1'));
  });

  it('destroy() should clear instance object and set _destroyed: true', function () {
    instance.destroy();
    assert.isOk(instance._destroyed);
    assert.throws(instance.next, Error);
  });
});
