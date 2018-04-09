import { AppPage } from './app.po';

describe('App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should display "Contact Picker"', () => {
    expect(page.getTitleText()).toContain('Contact Picker');
  });
});
