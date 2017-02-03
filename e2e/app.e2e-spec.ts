import { QaPage } from './app.po';

describe('qa App', function() {
  let page: QaPage;

  beforeEach(() => {
    page = new QaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
