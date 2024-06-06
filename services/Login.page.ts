import { type Locator, type Page } from '@playwright/test';
import { credentials } from '../secrets/credentials';


export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
      }
  
  public async login() {
    
  await this.page.goto('https://github.com/login');

  // Fill in the username (or email) and password fields
  await this.page.fill('input[name="login"]', credentials.user);
  await this.page.fill('input[name="password"]', credentials.password);
  
  // Click the sign in button
  await this.page.click('input[type="submit"]');
  
  }
}