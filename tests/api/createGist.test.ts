import {describe, expect, test} from '@jest/globals';
import { Octokit } from '@octokit/rest';
import { createFileContent } from '../../helpers/helperFunctions'
import { credentials } from '../../secrets/credentials';


const octokit = new Octokit({
    auth: credentials.authUserToken
});

const octokitUnauthorized = new Octokit();


describe('Create gists ', () => {

    beforeAll(async () => {
        // remove all existing gists for the authorized user
        const ids = (await octokit.gists.list()).data.map((element) => element.id);
        for (const id of ids) {
            await octokit.gists.delete({ gist_id: id });
        }
    });
    
    
    afterAll(async () => {
        //  remove all existing gists for the user and create new fresh gists
        const ids = (await octokit.gists.list()).data.map((element) => element.id);
        for (const id of ids) {
            await octokit.gists.delete({ gist_id: id });
        }});
    

        
    test('should not be able to create gist as an unauthorized user', async () => {

        try {
            const response = await octokitUnauthorized.gists.create({
                files: { "README.md": { "content": "Hello World" } }
            });

        } catch (error: any) {
            // Assert that the error is an HttpError and has the expected message and status
            expect(error.name).toBe('HttpError');
            expect(error.status).toBe(401);
            expect(error.message).toMatch(/Requires authentication/);
        }
    });

    test('should not be able to create gist without file as an authorized user', async () => {

        try {
            const response = await octokit.gists.create({
                files: {}
            }
        )
        } catch (error: any) {
            expect(error.name).toBe('HttpError');
            expect(error.status).toEqual(422);
            expect(error.message).toMatch(/Validation Failed: {"resource":"Gist","code":"missing_field","field":"files"}/);
        }
    });


    test('should be able to create gist with file without description as an authorized user', async () => {
        const response = JSON.parse(JSON.stringify(await octokit.gists.create({
            files: { "README.md": { "content": "Hello World" } }

        })));

        expect(response.status).toEqual(201);
        expect(response.data.id).toBeTruthy;
        expect(response.data.public).toEqual(false);
        expect(response.data.description).toEqual(null);
    });


    test('should be able to create gist with file, description and public description as an authorized user', async () => {
        const response = JSON.parse(JSON.stringify(await octokit.gists.create({
            description: "this is test gist",
            public: true,
            files: { "README.md": { "content": "Hello World" } }

        })));

        expect(response.status).toEqual(201);
        expect(response.data.id).toBeTruthy;
        expect(response.data.public).toEqual(true);
        expect(response.data.description).toEqual("this is test gist");
    });


    test('should not truncate the file smaller than 1MB', async () => {
        let gistId: string;
        const response = JSON.parse(JSON.stringify(await octokit.gists.create({
            files: { "smallFile": {content: createFileContent('small_file')} }

        })))

        gistId = response.data.id;
        const getGistResponse = JSON.parse(JSON.stringify(await octokit.gists.get({
            gist_id: gistId
        })))

        expect(response.status).toEqual(201);
        expect(response.data.id).toBeTruthy;
        expect(getGistResponse.data.files.smallFile.truncated).toEqual(false);
    });


    test('should truncate the file larger than 1MB', async () => {    
        let gistId: string;
        const response = JSON.parse(JSON.stringify(await octokit.gists.create({
            files: { "moreThan1MB": {content: createFileContent('5MiB')} }

        })))
        gistId = response.data.id;
        const getGistResponse = JSON.parse(JSON.stringify(await octokit.gists.get({
            gist_id: gistId
        })))

        expect(response.status).toEqual(201);
        expect(response.data.id).toBeTruthy;
        expect(getGistResponse.data.files.moreThan1MB.truncated).toEqual(true);
    });

})







