import { AppPage } from './app.po';

describe('App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should display "Contact Picker Smart Widget"', () => {
    expect(page.getTitleText()).toContain('Contact Picker Smart Widget');
  });
});
