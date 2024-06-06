import {describe, expect, test} from '@jest/globals';
import { Octokit } from '@octokit/rest';
import { credentials } from '../../secrets/credentials';



describe('Getting single gists ', () => {

    const octokit = new Octokit({
        auth: credentials.authUserToken
    });
    
    const octokitUnauthorized = new Octokit();
    
    let newIds: string[];
    
    beforeAll(async () => {
        //  remove all existing gists for the user and create new fresh gists
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
    
    
    afterAll(async () => {
        //  remove all existing gists for the user and create new fresh gists
        const ids = (await octokit.gists.list()).data.map((element) => element.id);
        for (const id of ids) {
            await octokit.gists.delete({ gist_id: id });
        }});


    test('should retrieve a single gist for the valid gist_id of the authorized user', async () => {
        const response = JSON.parse(JSON.stringify(await octokit.gists.get({
            gist_id: newIds[0]
        })));
        expect(response.status).toEqual(200);
        expect(response.data.id).toEqual(newIds[0]);
        expect(response.data.public).toEqual(false);
    });


    test('Should return error message Not Found for the invalid gist_id of the authorized user', async () => {
        try {
            const response = JSON.parse(JSON.stringify(await octokit.gists.get({
                gist_id: 'invalidId'
            })));

        } catch (error: any) {
            expect(error.name).toBe('HttpError');
            expect(error.status).toBe(404);
            expect(error.message).toMatch(/Not Found/);
        }
    });


    test('Should retrieve a single gist for the valid gist_id of the unauthorized user', async () => {
        const response = JSON.parse(JSON.stringify(await octokitUnauthorized.gists.get({
            gist_id: newIds[0]
        })));
        expect(response.status).toEqual(200);
        expect(response.data.id).toEqual(newIds[0]);
        expect(response.data.public).toEqual(false);
    });


    test('should retrieve a list of the gistst for authorized user', async () => {
        const response = JSON.parse(JSON.stringify(await octokit.gists.list()));
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(2);
    });


    test('should retrieve public list of the gistst for unauthorized user', async () => {
        const response = JSON.parse(JSON.stringify(await octokitUnauthorized.gists.list()));
        expect(response.status).toEqual(200);
        expect(response.data[0].public).toEqual(true);
        expect(response.data.length).toEqual(30);
    });

});









