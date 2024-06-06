import { test, expect } from '@playwright/test';
import { LoginPage } from '../../services/Login.page';
import { Octokit } from '@octokit/rest';
import { credentials } from '../../secrets/credentials';
import { text } from 'stream/consumers';






test.describe('Check gists web', () => {

  const octokit = new Octokit({
    auth: credentials.authUserToken
  });
  let newIds: string[];

  test.beforeAll(async () => {

    const ids = (await octokit.gists.list()).data.map((element) => element.id);
    for (const id of ids) {
      await octokit.gists.delete({ gist_id: id });
    }

    const response1 = await octokit.gists.create({
      files: { "file1.txt": { "content": `Hello World, I'm the file nr 1}` } }
    })

    const response2 = await octokit.gists.create({
      files: { "file2.txt": { "content": `Hello World, I'm the file nr 2}` } }
    })

    newIds = (await octokit.gists.list()).data.map((element) => element.id);
  });



  test('Should display gist on the web', async ({ page }) => {

    // Navigate to GitHub login page
    await new LoginPage(page).login();


    await page.goto(`https://gists.github.com`);

    await expect(page.getByText("file1.txt")).toBeVisible;
    await expect(page.getByText("file2.txt")).toBeVisible;

  });

});

